export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import ProductCard, { ProductCardData } from '@/components/ProductCard';
import { Ledger, LedgerRow, Split, EyebrowTag } from '@/components/marketing';

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
            Buy, verify and service technology you can trust.
          </h1>
          <p className="max-w-lg text-inktext/70 mb-6">
            CVTECHUB connects buyers with verified vendors across Nigeria&rsquo;s largest tech market &mdash;
            backed by Veridon&rsquo;s AI-driven trust and intelligence infrastructure.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">Shop the marketplace</Link>
            <Link href="/verify" className="btn-outline-ink">Verify a device</Link>
          </div>
          <div className="flex flex-wrap gap-5 mt-4">
            <Link href="/services" className="text-sm font-semibold border-b border-current">Find a technician</Link>
            <Link href="/sell" className="text-sm font-semibold border-b border-current">Become a vendor</Link>
          </div>
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-xl mb-8">
            <h2 className="text-2xl font-display font-semibold mb-2">Buy with confidence, not guesswork.</h2>
            <p className="text-paper/70">Every purchase carries verification, transparent history and a place to turn if something goes wrong.</p>
          </div>
          <Ledger>
            <LedgerRow title="Verified vendors">Every vendor moves through identity and business checks before the badge appears on their storefront.</LedgerRow>
            <LedgerRow title="TrustID on products">A trust certificate attached to a device or vendor — showing what was checked, and by whom.</LedgerRow>
            <LedgerRow title="Reviews tied to real transactions">Ratings only count once an order is complete, so they reflect what actually happened.</LedgerRow>
            <LedgerRow title="Secure payments">Checkout runs on Paystack, so every payment is processed and confirmed securely.</LedgerRow>
          </Ledger>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
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

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-semibold">Newest listings</h2>
          <Link href="/products" className="text-sm font-semibold border-b border-current">View all</Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-inktext/60">No products listed yet — check back soon.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Split>
            <div>
              <EyebrowTag>Services</EyebrowTag>
              <h2 className="text-2xl font-display font-semibold mb-3">Need a repair or technical service?</h2>
              <p className="text-paper/70 mb-4">
                Verified technicians, transparent quotes, and a clear path from problem to a completed job.
              </p>
              <Link href="/services" className="btn-primary">Explore services</Link>
            </div>
            <div className="relative border border-linedark p-2">
              <div className="relative h-[260px]">
                <Image src="https://images.unsplash.com/photo-1588515603068-adb330f26e92?w=1200&q=80&auto=format&fit=crop" alt="Repair tools beside a smartphone" fill className="object-cover" />
              </div>
            </div>
          </Split>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <Split reverse>
          <div>
            <EyebrowTag color="#1C8FC2">Vendors</EyebrowTag>
            <h2 className="text-2xl font-display font-semibold mb-3">Take your technology business digital.</h2>
            <p className="text-inktext/70 mb-4">
              A verified storefront, live listings, order management &mdash; set up in one step when you register.
            </p>
            <Link href="/sell" className="btn-brand">Become a CVTECHUB vendor</Link>
          </div>
          <div className="relative border border-line p-2">
            <div className="relative h-[260px]">
              <Image src="https://images.unsplash.com/photo-1687293233211-6b0cc3beba70?w=1200&q=80&auto=format&fit=crop" alt="A vendor at her shop counter" fill className="object-cover" />
            </div>
          </div>
        </Split>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Split>
            <div>
              <EyebrowTag>Veridon</EyebrowTag>
              <h2 className="text-2xl font-display font-semibold mb-3">Powered by intelligence. Built for trust.</h2>
              <p className="text-paper/70 mb-4">
                Veridon supplies the intelligence and trust infrastructure behind CVTECHUB &mdash; verification,
                risk assessment, fraud detection, TrustID and automation.
              </p>
              <Link href="/about#veridon" className="text-sm font-semibold border-b border-current">Learn about Veridon</Link>
            </div>
            <div className="relative border border-linedark p-2">
              <div className="relative h-[260px]">
                <Image src="https://images.unsplash.com/photo-1675602488453-c3897a475af5?w=1200&q=80&auto=format&fit=crop" alt="Macro photograph of a circuit board" fill className="object-cover" />
              </div>
            </div>
          </Split>
        </div>
      </section>

      <section className="bg-paper2">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-display font-semibold mb-4">Your next technology purchase should start with trust.</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-primary">Shop now</Link>
            <Link href="/verify" className="btn-outline-ink">Verify a device</Link>
            <Link href="/sell" className="btn-outline-ink">Become a vendor</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
