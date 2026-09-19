'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { CONDITION_LABELS } from '@/lib/format';

export default function SearchFilterBar({ categories }: { categories: { name: string; slug: string }[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value); else next.delete(key);
    router.push(`/products?${next.toString()}`);
  }

  return (
    <div className="border border-line p-4 flex flex-wrap gap-3 items-center bg-white">
      <form
        className="flex-1 min-w-[200px] flex"
        onSubmit={(e) => { e.preventDefault(); update('q', q); }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, stores..."
          className="w-full px-3 py-2 border border-line focus:outline-none focus:ring-2 focus:ring-verified"
        />
      </form>
      <select
        className="px-3 py-2 border border-line font-mono text-sm"
        value={params.get('category') || ''}
        onChange={(e) => update('category', e.target.value)}
      >
        <option value="">All categories</option>
        {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
      </select>
      <select
        className="px-3 py-2 border border-line font-mono text-sm"
        value={params.get('condition') || ''}
        onChange={(e) => update('condition', e.target.value)}
      >
        <option value="">Any condition</option>
        {Object.entries(CONDITION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <select
        className="px-3 py-2 border border-line font-mono text-sm"
        value={params.get('sort') || 'newest'}
        onChange={(e) => update('sort', e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: low to high</option>
        <option value="price_desc">Price: high to low</option>
      </select>
    </div>
  );
}
