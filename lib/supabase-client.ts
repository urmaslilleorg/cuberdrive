import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy singleton — only created when first called, not at module evaluation time.
// This prevents build-time crashes when env vars are not available during prerendering.
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a no-op client during build/SSR when env vars are absent
    // The concept page is force-dynamic so this path is only hit in broken envs
    throw new Error('Supabase env vars not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }

  _supabase = createClient(url, key);
  return _supabase;
}

// Convenience export — use getSupabase() in components that run client-side
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export type Cofounder = {
  id: string;
  name: string;
  email: string;
  approved: boolean;
  approved_at: string | null;
  created_at: string;
};

export type Comment = {
  id: string;
  section_id: string;
  cofounder_id: string;
  content: string;
  created_at: string;
  cofounders?: { name: string; email: string };
};

export type ApprovalAction = {
  id: string;
  cofounder_id: string;
  action: 'approved' | 'changes_requested';
  note: string | null;
  created_at: string;
  cofounders?: { name: string; email: string };
};

export type Conversation = {
  id: string;
  session_id: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  brief_generated: boolean;
  brief_data: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};
