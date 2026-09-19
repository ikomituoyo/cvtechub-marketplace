import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession, getStoreForVendor } from '@/lib/auth';

const schema = z.object({
  name: z.string().min(2),
  categorySlug: z.string(),
  description: z.string().optional().default(''),
  priceNaira: z.number().min(1),
  condition: z.string(),
  imageUrl: z.string().optional().default(''),
  stockQty: z.number().min(0),
  status: z.enum(['active', 'draft']),
});

function ownsProduct(productId: number, storeId: number) {
  return db.prepare('SELECT id FROM products WHERE id = ? AND store_id = ?').get(productId, storeId);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const store = getStoreForVendor(session.id);
  if (!store) return NextResponse.json({ error: 'No store found.' }, { status: 400 });

  const productId = Number(params.id);
  if (!ownsProduct(productId, store.id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Please check the product details.' }, { status: 400 });

  const category = db.prepare('SELECT id FROM categories WHERE slug = ?').get(parsed.data.categorySlug) as any;

  db.prepare(`
    UPDATE products SET name=?, category_id=?, description=?, price_kobo=?, condition=?, image_url=?, stock_qty=?, status=?
    WHERE id = ?
  `).run(
    parsed.data.name, category?.id || null, parsed.data.description, Math.round(parsed.data.priceNaira * 100),
    parsed.data.condition, parsed.data.imageUrl, parsed.data.stockQty, parsed.data.status, productId
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
  const store = getStoreForVendor(session.id);
  if (!store) return NextResponse.json({ error: 'No store found.' }, { status: 400 });

  const productId = Number(params.id);
  if (!ownsProduct(productId, store.id)) return NextResponse.json({ error: 'Not found.' }, { status: 404 });

  db.prepare('DELETE FROM products WHERE id = ?').run(productId);
  return NextResponse.json({ ok: true });
}
