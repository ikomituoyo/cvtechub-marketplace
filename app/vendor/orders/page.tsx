export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { getSession, getStoreForVendor } from '@/lib/auth';
import { formatNaira } from '@/lib/format';
import Link from 'next/link';
import OrderStatusSelect from '@/components/OrderStatusSelect';

export default async function VendorOrdersPage() {
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

  const items = db.prepare(`
    SELECT oi.*, o.created_at, o.shipping_name, o.shipping_phone, o.shipping_address, o.status as order_status
    FROM order_items oi JOIN orders o ON o.id = oi.order_id
    WHERE oi.store_id = ? AND o.status = 'paid'
    ORDER BY o.created_at DESC
  `).all(store.id) as any[];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display font-medium mb-8">Orders</h1>
      {items.length === 0 ? (
        <p className="text-inktext/60">No paid orders yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((i) => (
            <div key={i.id} className="panel bg-white flex items-center gap-4">
              <div className="flex-1">
                <p className="font-semibold">{i.name_snapshot} &times; {i.quantity}</p>
                <p className="text-xs text-inktext/60 font-mono">{i.created_at}</p>
                <p className="text-xs text-inktext/60 mt-1">{i.shipping_name} &middot; {i.shipping_phone}</p>
                <p className="text-xs text-inktext/60">{i.shipping_address}</p>
              </div>
              <p className="font-display font-semibold">{formatNaira(i.price_kobo_snapshot * i.quantity)}</p>
              <OrderStatusSelect itemId={i.id} status={i.fulfillment_status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
