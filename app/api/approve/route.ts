import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// GET — all approval actions (admin use)
export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('approval_actions')
    .select('*, cofounders(name, email)')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST — insert approval action (validates cofounder)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { cofounder_id, action, note } = body;

  if (!cofounder_id || !action) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!['approved', 'changes_requested'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  const supabase = createServerClient();

  // Verify cofounder exists
  const { data: cofounder, error: cfError } = await supabase
    .from('cofounders')
    .select('id')
    .eq('id', cofounder_id)
    .single();

  if (cfError || !cofounder) {
    return NextResponse.json({ error: 'Cofounder not found' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('approval_actions')
    .insert({ cofounder_id, action, note: note || null })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
