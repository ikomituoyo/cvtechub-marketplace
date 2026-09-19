export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import ProductForm from '@/components/ProductForm';

export default function NewProductPage() {
  const categories = (db.prepare('SELECT name, slug FROM categories ORDER BY name').all() as any[])
    .map((c) => ({ name: c.name as string, slug: c.slug as string }));
  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-display font-medium mb-6">Add product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
