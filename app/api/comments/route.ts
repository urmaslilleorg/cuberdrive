import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// GET — all comments (admin use)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get('section_id');

  const supabase = createServerClient();
  let query = supabase
    .from('comments')
    .select('*, cofounders(name, email)')
    .order('created_at', { ascending: false });

  if (sectionId) {
    query = query.eq('section_id', sectionId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST — insert comment (validates cofounder)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { section_id, cofounder_id, content } = body;

  if (!section_id || !cofounder_id || !content?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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
    .from('comments')
    .insert({ section_id, cofounder_id, content: content.trim() })
    .select('*, cofounders(name, email)')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
