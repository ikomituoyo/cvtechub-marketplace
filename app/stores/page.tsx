export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { db } from '@/lib/db';

export default function StoresPage() {
  const stores = db.prepare(`
    SELECT s.*, COUNT(p.id) as product_count
    FROM stores s LEFT JOIN products p ON p.store_id = s.id AND p.status = 'active'
    GROUP BY s.id ORDER BY s.verified DESC, s.name ASC
  `).all() as any[];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display font-medium mb-2">Verified stores</h1>
      <p className="text-inktext/70 mb-8">Every store here has been through CVTECHUB's vendor verification.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {stores.map((s) => (
          <Link key={s.id} href={`/stores/${s.slug}`} className="panel bg-white hover:border-verified transition-colors flex gap-4">
            <div className="text-4xl">{s.logo_emoji}</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-display text-lg font-semibold">{s.name}</h2>
                {s.verified ? (
                  <span className="chip !py-0.5 text-verified border-verified">Verified</span>
                ) : (
                  <span className="chip !py-0.5">Unverified</span>
                )}
              </div>
              <p className="text-sm text-inktext/70 mb-2">{s.description || 'No description yet.'}</p>
              <p className="text-xs font-mono text-inktext/50">{s.location || 'Location not set'} &middot; {s.product_count} products</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
