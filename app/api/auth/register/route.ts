import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { hashPassword, signSession, SESSION_COOKIE, getUserByEmail } from '@/lib/auth';
import { slugify } from '@/lib/format';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['buyer', 'vendor']),
  storeName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the details you entered.' }, { status: 400 });
  }
  const { name, email, password, role, storeName } = parsed.data;

  if (getUserByEmail(email)) {
    return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });
  }
  if (role === 'vendor' && !storeName?.trim()) {
    return NextResponse.json({ error: 'Store name is required for a vendor account.' }, { status: 400 });
  }

  const insertUser = db.prepare(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`
  );
  const userId = insertUser.run(name, email, hashPassword(password), role).lastInsertRowid as number;
  db.prepare(`INSERT INTO carts (user_id) VALUES (?)`).run(userId);

  if (role === 'vendor' && storeName) {
    let slug = slugify(storeName);
    const exists = (n: string) => db.prepare('SELECT 1 FROM stores WHERE slug = ?').get(n);
    let candidate = slug;
    let i = 1;
    while (exists(candidate)) { candidate = `${slug}-${++i}`; }
    db.prepare(
      `INSERT INTO stores (vendor_user_id, name, slug, description, location, verified, logo_emoji) VALUES (?, ?, ?, '', '', 0, '🛍️')`
    ).run(userId, storeName, candidate);
  }

  const sessionUser = { id: userId, name, email, role };
  const token = await signSession(sessionUser as any);
  const res = NextResponse.json({ user: sessionUser });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
