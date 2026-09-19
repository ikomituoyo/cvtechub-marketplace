export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { db } from '@/lib/db';
import { getSession, getStoreForVendor } from '@/lib/auth';
import { formatNaira, CONDITION_LABELS } from '@/lib/format';

export default async function VendorProductsPage() {
  const session = (await getSession())!;
  const store = getStoreForVendor(session.id);
  if (!store) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <p className="text-inktext/70 mb-4">Set up your store first.</p>
        <Link href="/vendor" className="btn-primary">Go to dashboard</Link>
      </div>
    );
  }

  const products = db.prepare('SELECT * FROM products WHERE store_id = ? ORDER BY created_at DESC').all(store.id) as any[];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-medium">Products</h1>
        <Link href="/vendor/products/new" className="btn-brand">Add product</Link>
      </div>

      {products.length === 0 ? (
        <p className="text-inktext/60">You haven't listed any products yet.</p>
      ) : (
        <div className="border border-line bg-white divide-y divide-line">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 p-4">
              <div className="w-14 h-14 bg-paper2 flex-none overflow-hidden">
                {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{p.name}</p>
                <p className="text-xs text-inktext/60 font-mono">
                  {CONDITION_LABELS[p.condition]} &middot; {p.stock_qty} in stock &middot; {p.status}
                </p>
              </div>
              <p className="font-display font-semibold w-28 text-right">{formatNaira(p.price_kobo)}</p>
              <Link href={`/vendor/products/${p.id}/edit`} className="btn-outline-ink !px-4 !py-2">Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
