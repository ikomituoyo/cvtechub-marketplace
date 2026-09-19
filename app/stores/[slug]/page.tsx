export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductCard, { ProductCardData } from '@/components/ProductCard';

export default function StorePage({ params }: { params: { slug: string } }) {
  const store = db.prepare('SELECT * FROM stores WHERE slug = ?').get(params.slug) as any;
  if (!store) notFound();

  const products = db.prepare(`
    SELECT p.id, p.name, p.slug, p.price_kobo, p.condition, p.image_url, p.stock_qty, s.name as store_name, s.slug as store_slug
    FROM products p JOIN stores s ON s.id = p.store_id
    WHERE p.store_id = ? AND p.status = 'active'
    ORDER BY p.created_at DESC
  `).all(store.id) as ProductCardData[];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-start gap-4 mb-10 pb-8 border-b border-line">
        <div className="text-5xl">{store.logo_emoji}</div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-display font-medium">{store.name}</h1>
            {store.verified ? (
              <span className="chip !py-0.5 text-verified border-verified">Verified vendor</span>
            ) : (
              <span className="chip !py-0.5">Unverified</span>
            )}
          </div>
          <p className="text-inktext/70 max-w-xl mb-1">{store.description || 'No description yet.'}</p>
          <p className="text-xs font-mono text-inktext/50">{store.location}</p>
        </div>
      </div>

      <h2 className="text-lg font-display font-semibold mb-4">{products.length} products</h2>
      {products.length === 0 ? (
        <p className="text-inktext/60">This store hasn't listed any products yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
