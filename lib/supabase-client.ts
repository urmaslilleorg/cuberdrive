import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
