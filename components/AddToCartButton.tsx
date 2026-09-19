'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({
  productId, inStock, loggedIn,
}: { productId: number; inStock: boolean; loggedIn: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');

  if (!loggedIn) {
    return (
      <button
        className="btn-primary"
        onClick={() => router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`)}
      >
        Log in to buy
      </button>
    );
  }

  async function handleClick() {
    setStatus('loading');
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    if (res.ok) {
      setStatus('done');
      router.refresh();
    } else {
      setStatus('error');
    }
  }

  return (
    <div>
      <button className="btn-primary disabled:opacity-40" disabled={!inStock || status === 'loading'} onClick={handleClick}>
        {inStock ? (status === 'loading' ? 'Adding…' : 'Add to cart') : 'Out of stock'}
      </button>
      {status === 'done' && <p className="text-verified text-sm mt-2">Added to your cart.</p>}
      {status === 'error' && <p className="text-alert text-sm mt-2">Couldn't add that — try again.</p>}
    </div>
  );
}
