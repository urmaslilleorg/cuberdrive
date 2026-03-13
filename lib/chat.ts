export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export async function sendMessage(
  messages: Message[],
  conversationId: string | null,
  onChunk: (chunk: string) => void,
  onDone: (conversationId: string) => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, conversation_id: conversationId }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      onError(data.error || 'Failed to send message');
      return;
    }

    const newConversationId = response.headers.get('X-Conversation-Id') || '';
    const reader = response.body?.getReader();
    if (!reader) {
      onError('No response stream');
      return;
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onDone(newConversationId);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              onChunk(parsed.text);
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    }

    onDone(newConversationId);
  } catch (err) {
    onError(err instanceof Error ? err.message : 'Unknown error');
  }
}

export function detectBriefInContent(content: string): boolean {
  return content.includes('## 📋 CUBER BRIEF') || content.includes('## CUBER BRIEF');
}
