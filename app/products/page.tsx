export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import SearchFilterBar from '@/components/SearchFilterBar';

export default function ProductsPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = searchParams.q?.trim() || '';
  const category = searchParams.category || '';
  const condition = searchParams.condition || '';
  const sort = searchParams.sort || 'newest';

  let sql = `
    SELECT p.id, p.name, p.slug, p.price_kobo, p.condition, p.image_url, p.stock_qty, s.name as store_name, s.slug as store_slug
    FROM products p JOIN stores s ON s.id = p.store_id
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'active'
  `;
  const args: any[] = [];
  if (q) {
    sql += ` AND (p.name LIKE ? OR p.description LIKE ? OR s.name LIKE ?)`;
    args.push(`%${q}%`, `%${q}%`, `%${q}%`);
  }
  if (category) {
    sql += ` AND c.slug = ?`;
    args.push(category);
  }
  if (condition) {
    sql += ` AND p.condition = ?`;
    args.push(condition);
  }
  sql += sort === 'price_asc' ? ' ORDER BY p.price_kobo ASC'
    : sort === 'price_desc' ? ' ORDER BY p.price_kobo DESC'
    : ' ORDER BY p.created_at DESC';

  const products = db.prepare(sql).all(...args) as ProductCardData[];
  const categories = (db.prepare('SELECT name, slug FROM categories ORDER BY name').all() as any[])
    .map((c) => ({ name: c.name as string, slug: c.slug as string }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display font-medium mb-2">Products</h1>
      <p className="text-inktext/70 mb-8">{products.length} results{q ? ` for "${q}"` : ''}</p>

      <SearchFilterBar categories={categories} />

      {products.length === 0 ? (
        <p className="text-inktext/60 mt-8">No products match these filters yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
