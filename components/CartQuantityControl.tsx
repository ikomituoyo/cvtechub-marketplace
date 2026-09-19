'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartQuantityControl({
  itemId, quantity, max,
}: { itemId: number; quantity: number; max: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setQty(qty: number) {
    setBusy(true);
    if (qty <= 0) {
      await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
    } else {
      await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: qty }),
      });
    }
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex items-center border border-line">
      <button disabled={busy} className="w-8 h-8 hover:bg-paper2" onClick={() => setQty(quantity - 1)}>&minus;</button>
      <span className="w-8 text-center font-mono text-sm">{quantity}</span>
      <button disabled={busy || quantity >= max} className="w-8 h-8 hover:bg-paper2 disabled:opacity-30" onClick={() => setQty(quantity + 1)}>+</button>
    </div>
  );
}
