import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

function ownsItem(itemId: number, userId: number) {
  return db.prepare(`
    SELECT ci.id FROM cart_items ci JOIN carts c ON c.id = ci.cart_id
    WHERE ci.id = ? AND c.user_id = ?
  `).get(itemId, userId);
}

const patchSchema = z.object({ quantity: z.number().min(1) });

export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const itemId = Number(params.itemId);
  if (!ownsItem(itemId, session.id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid quantity.' }, { status: 400 });

  db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(parsed.data.quantity, itemId);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const itemId = Number(params.itemId);
  if (!ownsItem(itemId, session.id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);
  return NextResponse.json({ ok: true });
}
