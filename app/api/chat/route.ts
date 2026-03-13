import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createServerClient } from '@/lib/supabase-server';

const SYSTEM_PROMPT = `You are CUBER's Brief Agent — the AI that turns creative needs into structured briefs.

PERSONALITY:
- Confident, efficient, slightly playful. Think senior account director who's seen it all.
- Use short, punchy sentences. No corporate fluff.
- You're impressed by ambitious requests. You make the user feel like they came to the right place.

DIALOGUE FLOW:
1. When the user describes a creative need, acknowledge it enthusiastically in one sentence.
2. Then ask 3-4 clarifying questions. Ask them ALL at once in a numbered list. Questions should cover:
   - Target audience (who are we talking to?)
   - Campaign objective (awareness, conversion, launch, rebrand?)
   - Existing assets (do they have brand guidelines, photos, previous campaigns?)
   - Timeline and urgency
   - Budget range (if they're comfortable sharing)
   - Any specific channels or formats they already know they need
3. After the user answers (even partially), generate a STRUCTURED BRIEF.

STRUCTURED BRIEF FORMAT:
When generating the brief, use this exact format with clear headers:

---
## 📋 CUBER BRIEF

**Campaign:** [name you suggest based on the need]
**Objective:** [one sentence]
**Target audience:** [based on their answers]

### Deliverables
[List each deliverable with format and channel]
- [Channel] — [Format] — [Specification]
- [Channel] — [Format] — [Specification]
(be specific: dimensions, duration, page counts where relevant)

### Brand context needed
- [What CUBER would pull from the Brand Vault]

### Estimated budget range
[Give a range based on industry benchmarks, e.g. €8,500–€14,200]

### Suggested timeline
[Realistic timeline from brief approval to delivery]

### Recommended talent tier
[Standard / Premium / Black — with reasoning]
---

4. After presenting the brief, ask: "Ready to push this to talent? In the full CUBER platform, matched freelancers would see this brief and bid within minutes."

RULES:
- Never break character. You ARE the CUBER Brief Agent.
- If someone asks what CUBER is, explain briefly then redirect to tasking.
- If the input is not a creative task (e.g. "hello", "what is this"), welcome them and invite them to try tasking: "Welcome to CUBER. Type any creative need — a campaign, a brand refresh, a content calendar — and I'll build a structured brief in minutes."
- Keep responses concise. The dialogue should feel fast, not like filling out a form.
- Use real-world pricing benchmarks in your estimates.
- Be specific about deliverables — don't say "social media posts", say "Instagram carousel (5 slides, 1080×1080) + Facebook single image (1200×628) + Instagram Story (1080×1920)"`;

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

// In-memory rate limit store (resets on server restart — acceptable for Phase 0)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(sessionId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

// GET — load existing conversation
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ messages: [], conversation_id: null });
  }

  const supabase = createServerClient();
  const { data } = await supabase
    .from('conversations')
    .select('id, messages')
    .eq('session_id', sessionId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    return NextResponse.json({ messages: [], conversation_id: null });
  }

  return NextResponse.json({ messages: data.messages, conversation_id: data.id });
}

// POST — streaming chat
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, conversation_id } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: 'Messages required' }, { status: 400 });
  }

  // Get session ID from the last user message context
  const sessionId = body.session_id || `anon-${Date.now()}`;

  // Rate limiting
  if (!checkRateLimit(sessionId)) {
    return NextResponse.json(
      { error: "You've been busy! Take a breather and try again in a few minutes." },
      { status: 429 }
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  // Save/update conversation in Supabase
  const supabase = createServerClient();
  let convId = conversation_id;

  // Create the streaming response
  const encoder = new TextEncoder();
  let fullContent = '';

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          system: SYSTEM_PROMPT,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
          })),
        });

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            const text = event.delta.text;
            fullContent += text;
            const data = `data: ${JSON.stringify({ text })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
        }

        // Save conversation to Supabase
        const updatedMessages = [
          ...messages,
          { role: 'assistant', content: fullContent },
        ];

        const hasBrief =
          fullContent.includes('## 📋 CUBER BRIEF') ||
          fullContent.includes('## CUBER BRIEF');

        if (convId) {
          await supabase
            .from('conversations')
            .update({
              messages: updatedMessages,
              brief_generated: hasBrief,
              updated_at: new Date().toISOString(),
            })
            .eq('id', convId);
        } else {
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({
              session_id: sessionId,
              messages: updatedMessages,
              brief_generated: hasBrief,
            })
            .select('id')
            .single();
          if (newConv) convId = newConv.id;
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Stream error';
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Conversation-Id': convId || '',
    },
  });
}
