export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { db, getOrCreateCart } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatNaira } from '@/lib/format';
import CartQuantityControl from '@/components/CartQuantityControl';

export default async function CartPage() {
  const session = await getSession();
  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-display font-medium mb-3">Your cart</h1>
        <p className="text-inktext/70 mb-6">Log in to see items you've added to your cart.</p>
        <Link href="/login?next=/cart" className="btn-primary">Log in</Link>
      </div>
    );
  }

  const cartId = getOrCreateCart(session.id);
  const items = db.prepare(`
    SELECT ci.id as item_id, ci.quantity, p.id as product_id, p.name, p.slug, p.price_kobo, p.image_url, p.stock_qty,
           s.name as store_name
    FROM cart_items ci JOIN products p ON p.id = ci.product_id JOIN stores s ON s.id = p.store_id
    WHERE ci.cart_id = ? ORDER BY ci.id DESC
  `).all(cartId) as any[];

  const total = items.reduce((sum, i) => sum + i.price_kobo * i.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display font-medium mb-8">Your cart</h1>
      {items.length === 0 ? (
        <div className="panel bg-white text-center py-16">
          <p className="text-inktext/70 mb-4">Your cart is empty.</p>
          <Link href="/products" className="btn-primary">Browse products</Link>
        </div>
      ) : (
        <>
          <div className="border border-line divide-y divide-line bg-white">
            {items.map((i) => (
              <div key={i.item_id} className="flex items-center gap-4 p-4">
                <div className="w-16 h-16 bg-paper2 flex-none overflow-hidden">
                  {i.image_url && <img src={i.image_url} alt={i.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${i.slug}`} className="font-semibold hover:underline block truncate">{i.name}</Link>
                  <p className="text-xs text-inktext/60">{i.store_name} &middot; {formatNaira(i.price_kobo)} each</p>
                </div>
                <CartQuantityControl itemId={i.item_id} quantity={i.quantity} max={i.stock_qty} />
                <p className="font-display font-semibold w-28 text-right">{formatNaira(i.price_kobo * i.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <p className="text-inktext/70">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            <div className="text-right">
              <p className="text-sm text-inktext/70 mb-1">Total</p>
              <p className="font-display text-2xl font-semibold mb-4">{formatNaira(total)}</p>
              <Link href="/checkout" className="btn-primary">Proceed to checkout</Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
