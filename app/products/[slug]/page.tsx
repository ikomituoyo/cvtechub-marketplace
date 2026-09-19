export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { formatNaira, CONDITION_LABELS } from '@/lib/format';
import { getSession } from '@/lib/auth';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = db.prepare(`
    SELECT p.*, s.name as store_name, s.slug as store_slug, s.verified as store_verified, s.logo_emoji
    FROM products p JOIN stores s ON s.id = p.store_id
    WHERE p.slug = ? AND p.status = 'active'
  `).get(params.slug) as any;
  if (!product) notFound();

  const session = await getSession();

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
      <div className="relative aspect-square bg-paper2 border border-line">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill sizes="50vw" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-inktext/50">no image</div>
        )}
      </div>

      <div>
        <Link href={`/stores/${product.store_slug}`} className="inline-flex items-center gap-2 text-sm font-semibold mb-3 hover:underline">
          <span>{product.logo_emoji}</span> {product.store_name}
          {product.store_verified ? <span className="chip !py-0.5 text-verified border-verified">Verified</span> : null}
        </Link>
        <h1 className="text-2xl md:text-3xl font-display font-medium mb-3">{product.name}</h1>
        <p className="font-display text-3xl font-semibold mb-4">{formatNaira(product.price_kobo)}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="chip">{CONDITION_LABELS[product.condition] || product.condition}</span>
          <span className={`chip ${product.stock_qty > 0 ? 'text-verified border-verified' : 'text-alert border-alert'}`}>
            {product.stock_qty > 0 ? `${product.stock_qty} in stock` : 'Out of stock'}
          </span>
        </div>

        <p className="text-inktext/80 mb-8 whitespace-pre-line">{product.description || 'No description provided.'}</p>

        <AddToCartButton productId={product.id} inStock={product.stock_qty > 0} loggedIn={!!session} />
      </div>
    </div>
  );
}
