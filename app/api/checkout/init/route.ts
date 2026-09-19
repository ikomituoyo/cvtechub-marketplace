import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { nanoid } from 'nanoid';
import { db, getOrCreateCart } from '@/lib/db';
import { getSession } from '@/lib/auth';

const schema = z.object({
  shippingName: z.string().min(2),
  shippingPhone: z.string().min(7),
  shippingAddress: z.string().min(5),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please log in to check out.' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Please complete all shipping fields.' }, { status: 400 });

  const cartId = getOrCreateCart(session.id);
  const items = db.prepare(`
    SELECT ci.quantity, p.id as product_id, p.name, p.price_kobo, p.store_id, p.stock_qty
    FROM cart_items ci JOIN products p ON p.id = ci.product_id
    WHERE ci.cart_id = ?
  `).all(cartId) as any[];

  if (items.length === 0) {
    return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
  }
  for (const item of items) {
    if (item.quantity > item.stock_qty) {
      return NextResponse.json({ error: `Only ${item.stock_qty} left of "${item.name}".` }, { status: 400 });
    }
  }

  const total_kobo = items.reduce((sum, i) => sum + i.price_kobo * i.quantity, 0);
  const reference = 'cvt_' + nanoid(20);

  const orderId = db.prepare(`
    INSERT INTO orders (user_id, total_kobo, status, paystack_reference, shipping_name, shipping_phone, shipping_address)
    VALUES (?, ?, 'pending', ?, ?, ?, ?)
  `).run(session.id, total_kobo, reference, parsed.data.shippingName, parsed.data.shippingPhone, parsed.data.shippingAddress)
    .lastInsertRowid as number;

  const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, store_id, name_snapshot, price_kobo_snapshot, quantity)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const item of items) {
    insertItem.run(orderId, item.product_id, item.store_id, item.name, item.price_kobo, item.quantity);
  }

  return NextResponse.json({
    orderId,
    reference,
    amountKobo: total_kobo,
    email: session.email,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
  });
}
