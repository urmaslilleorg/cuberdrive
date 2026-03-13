import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// GET — public list of cofounders (name, email, id only)
export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('cofounders')
    .select('id, name, email, approved, approved_at, created_at')
    .order('created_at');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST — add cofounder (admin only)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, admin_password } = body;

  if (admin_password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('cofounders')
    .insert({ name: name.trim(), email: email.trim().toLowerCase() })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// DELETE — remove cofounder (admin only)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id, admin_password } = body;

  if (admin_password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!id) {
    return NextResponse.json({ error: 'ID required' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.from('cofounders').delete().eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
