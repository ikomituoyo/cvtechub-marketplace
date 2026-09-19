import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession, getStoreForVendor } from '@/lib/auth';
import { slugify } from '@/lib/format';

const schema = z.object({
  name: z.string().min(2),
  description: z.string().optional().default(''),
  location: z.string().optional().default(''),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== 'vendor' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Vendor account required.' }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Please fill in a store name.' }, { status: 400 });

  const existing = getStoreForVendor(session.id);
  if (existing) {
    db.prepare('UPDATE stores SET name = ?, description = ?, location = ? WHERE id = ?')
      .run(parsed.data.name, parsed.data.description, parsed.data.location, existing.id);
    return NextResponse.json({ ok: true, storeId: existing.id });
  }

  let slug = slugify(parsed.data.name);
  let candidate = slug, i = 1;
  while (db.prepare('SELECT 1 FROM stores WHERE slug = ?').get(candidate)) candidate = `${slug}-${++i}`;

  const id = db.prepare(
    `INSERT INTO stores (vendor_user_id, name, slug, description, location, verified, logo_emoji) VALUES (?, ?, ?, ?, ?, 0, '🛍️')`
  ).run(session.id, parsed.data.name, candidate, parsed.data.description, parsed.data.location).lastInsertRowid;

  return NextResponse.json({ ok: true, storeId: id });
}
