import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password } = body;

  if (password === process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
}
