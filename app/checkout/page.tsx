export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { db, getOrCreateCart } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatNaira } from '@/lib/format';
import CheckoutForm from '@/components/CheckoutForm';

export default async function CheckoutPage() {
  const session = (await getSession())!; // middleware guarantees this
  const cartId = getOrCreateCart(session.id);
  const items = db.prepare(`
    SELECT ci.quantity, p.name, p.price_kobo
    FROM cart_items ci JOIN products p ON p.id = ci.product_id
    WHERE ci.cart_id = ?
  `).all(cartId) as any[];
  const total = items.reduce((sum, i) => sum + i.price_kobo * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-display font-medium mb-3">Nothing to check out</h1>
        <p className="text-inktext/70 mb-6">Your cart is empty.</p>
        <Link href="/products" className="btn-primary">Browse products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
      <div>
        <h1 className="text-2xl font-display font-medium mb-6">Checkout</h1>
        <CheckoutForm email={session.email} publicKeyMissing={!process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY} />
      </div>
      <div>
        <h2 className="font-display text-lg font-semibold mb-4">Order summary</h2>
        <div className="border border-line divide-y divide-line bg-white mb-4">
          {items.map((i, idx) => (
            <div key={idx} className="flex justify-between p-3 text-sm">
              <span>{i.name} &times; {i.quantity}</span>
              <span className="font-mono">{formatNaira(i.price_kobo * i.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between font-display text-xl font-semibold">
          <span>Total</span><span>{formatNaira(total)}</span>
        </div>
      </div>
    </div>
  );
}
