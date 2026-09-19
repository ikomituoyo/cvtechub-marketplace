export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { db } from '@/lib/db';
import ProductCard, { ProductCardData } from '@/components/ProductCard';

export default function HomePage() {
  const featured = db.prepare(`
    SELECT p.id, p.name, p.slug, p.price_kobo, p.condition, p.image_url, p.stock_qty, s.name as store_name, s.slug as store_slug
    FROM products p JOIN stores s ON s.id = p.store_id
    WHERE p.status = 'active'
    ORDER BY p.created_at DESC LIMIT 8
  `).all() as ProductCardData[];

  const storeCount = (db.prepare("SELECT COUNT(*) c FROM stores").get() as any).c;
  const productCount = (db.prepare("SELECT COUNT(*) c FROM products WHERE status='active'").get() as any).c;

  const categories = db.prepare('SELECT name, slug FROM categories ORDER BY name').all() as any[];

  return (
    <div>
      <section className="bg-paper border-b border-line">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <span className="chip mb-4">{storeCount} verified stores &middot; {productCount} live products</span>
          <h1 className="text-4xl md:text-5xl font-display font-medium max-w-xl mb-4">
            Shop the CVTECHUB marketplace.
          </h1>
          <p className="max-w-lg text-inktext/70 mb-6">
            Browse real stores, compare products from verified vendors, and pay securely with Paystack.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">Browse products</Link>
            <Link href="/stores" className="btn-outline-ink">Browse stores</Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-xl font-display font-semibold mb-4">Shop by category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 border border-line">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/products?category=${c.slug}`}
              className="p-4 border-r border-b border-line text-sm font-semibold hover:bg-verified hover:text-white transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">Newest listings</h2>
          <Link href="/products" className="text-sm font-semibold border-b border-current">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>
    </div>
  );
}
