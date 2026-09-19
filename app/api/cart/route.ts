import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, getOrCreateCart } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ items: [], total_kobo: 0 });
  const cartId = getOrCreateCart(session.id);
  const items = db.prepare(`
    SELECT ci.id as item_id, ci.quantity, p.id as product_id, p.name, p.slug, p.price_kobo, p.image_url, p.stock_qty,
           s.name as store_name, s.slug as store_slug
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    JOIN stores s ON s.id = p.store_id
    WHERE ci.cart_id = ?
    ORDER BY ci.id DESC
  `).all(cartId) as any[];
  const total_kobo = items.reduce((sum, i) => sum + i.price_kobo * i.quantity, 0);
  return NextResponse.json({ items, total_kobo });
}

const addSchema = z.object({ productId: z.number(), quantity: z.number().min(1).default(1) });

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Please log in to add items to your cart.' }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = addSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

  const product = db.prepare('SELECT * FROM products WHERE id = ? AND status = ?').get(parsed.data.productId, 'active') as any;
  if (!product) return NextResponse.json({ error: 'Product not found.' }, { status: 404 });

  const cartId = getOrCreateCart(session.id);
  const existing = db.prepare('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?').get(cartId, product.id) as any;
  if (existing) {
    const newQty = Math.min(existing.quantity + parsed.data.quantity, product.stock_qty || 99);
    db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
  } else {
    db.prepare('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)')
      .run(cartId, product.id, Math.min(parsed.data.quantity, product.stock_qty || 99));
  }
  return NextResponse.json({ ok: true });
}
