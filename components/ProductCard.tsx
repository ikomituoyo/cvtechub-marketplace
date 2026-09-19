import Link from 'next/link';
import Image from 'next/image';
import { formatNaira, CONDITION_LABELS } from '@/lib/format';

export interface ProductCardData {
  id: number;
  name: string;
  slug: string;
  price_kobo: number;
  condition: string;
  image_url: string;
  store_name: string;
  store_slug: string;
  stock_qty: number;
}

export default function ProductCard({ p }: { p: ProductCardData }) {
  return (
    <Link href={`/products/${p.slug}`} className="group border border-line bg-white block">
      <div className="relative aspect-[4/3] bg-paper2 overflow-hidden">
        {p.image_url ? (
          <Image
            src={p.image_url}
            alt={p.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-inktext/50">no image</div>
        )}
        {p.stock_qty === 0 && (
          <span className="absolute top-2 left-2 bg-alert text-white text-[10px] font-mono px-2 py-1">Out of stock</span>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-mono text-brand mb-1">{CONDITION_LABELS[p.condition] || p.condition}</p>
        <h3 className="text-sm font-semibold leading-snug mb-1 line-clamp-2">{p.name}</h3>
        <p className="text-xs text-inktext/60 mb-2">{p.store_name}</p>
        <p className="font-display text-lg font-semibold">{formatNaira(p.price_kobo)}</p>
      </div>
    </Link>
  );
}
