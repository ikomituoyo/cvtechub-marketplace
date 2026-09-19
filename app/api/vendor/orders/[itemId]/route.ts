import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession, getStoreForVendor } from '@/lib/auth';

const schema = z.object({ status: z.enum(['unpaid', 'processing', 'shipped', 'delivered']) });

export async function PATCH(req: NextRequest, { params }: { params: { itemId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const store = getStoreForVendor(session.id);
  if (!store) return NextResponse.json({ error: 'No store found.' }, { status: 400 });

  const itemId = Number(params.itemId);
  const item = db.prepare('SELECT * FROM order_items WHERE id = ? AND store_id = ?').get(itemId, store.id) as any;
  if (!item) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });

  db.prepare('UPDATE order_items SET fulfillment_status = ? WHERE id = ?').run(parsed.data.status, itemId);
  return NextResponse.json({ ok: true });
}
