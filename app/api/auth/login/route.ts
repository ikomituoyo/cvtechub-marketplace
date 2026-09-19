import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserByEmail, verifyPassword, signSession, SESSION_COOKIE } from '@/lib/auth';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please enter a valid email and password.' }, { status: 400 });
  }
  const user = getUserByEmail(parsed.data.email);
  if (!user || !verifyPassword(parsed.data.password, user.password_hash)) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 });
  }
  const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role };
  const token = await signSession(sessionUser as any);
  const res = NextResponse.json({ user: sessionUser });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
