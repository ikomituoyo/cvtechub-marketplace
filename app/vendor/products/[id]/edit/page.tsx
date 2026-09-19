export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { getSession, getStoreForVendor } from '@/lib/auth';
import { notFound } from 'next/navigation';
import ProductForm from '@/components/ProductForm';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const session = (await getSession())!;
  const store = getStoreForVendor(session.id);
  if (!store) notFound();

  const product = db.prepare('SELECT p.*, c.slug as category_slug FROM products p LEFT JOIN categories c ON c.id = p.category_id WHERE p.id = ? AND p.store_id = ?')
    .get(Number(params.id), store.id) as any;
  if (!product) notFound();

  const categories = (db.prepare('SELECT name, slug FROM categories ORDER BY name').all() as any[])
    .map((c) => ({ name: c.name as string, slug: c.slug as string }));

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-display font-medium mb-6">Edit product</h1>
      <ProductForm
        categories={categories}
        initial={{
          id: product.id, name: product.name, categorySlug: product.category_slug || categories[0]?.slug,
          description: product.description, priceNaira: product.price_kobo / 100, condition: product.condition,
          imageUrl: product.image_url, stockQty: product.stock_qty, status: product.status,
        }}
      />
    </div>
  );
}
