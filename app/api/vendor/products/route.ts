import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/db';
import { getSession, getStoreForVendor } from '@/lib/auth';
import { slugify } from '@/lib/format';

const schema = z.object({
  name: z.string().min(2),
  categorySlug: z.string(),
  description: z.string().optional().default(''),
  priceNaira: z.number().min(1),
  condition: z.string(),
  imageUrl: z.string().optional().default(''),
  stockQty: z.number().min(0),
  status: z.enum(['active', 'draft']).default('active'),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session || (session.role !== 'vendor' && session.role !== 'admin')) {
    return NextResponse.json({ error: 'Vendor account required.' }, { status: 403 });
  }
  const store = getStoreForVendor(session.id);
  if (!store) return NextResponse.json({ error: 'Create your store first.' }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Please check the product details.' }, { status: 400 });

  const category = db.prepare('SELECT id FROM categories WHERE slug = ?').get(parsed.data.categorySlug) as any;

  let slug = slugify(parsed.data.name);
  let candidate = slug, i = 1;
  while (db.prepare('SELECT 1 FROM products WHERE slug = ?').get(candidate)) candidate = `${slug}-${++i}`;

  const id = db.prepare(`
    INSERT INTO products (store_id, category_id, name, slug, description, price_kobo, condition, image_url, stock_qty, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    store.id, category?.id || null, parsed.data.name, candidate, parsed.data.description,
    Math.round(parsed.data.priceNaira * 100), parsed.data.condition, parsed.data.imageUrl,
    parsed.data.stockQty, parsed.data.status
  ).lastInsertRowid;

  return NextResponse.json({ ok: true, productId: id, slug: candidate });
}
