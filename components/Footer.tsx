import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/70 border-t border-linedark mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm">
        <span>&copy; 2026 CVTECHUB Marketplace. Powered by Veridon.</span>
        <div className="flex gap-5">
          <Link href="/stores" className="hover:text-paper">Stores</Link>
          <Link href="/products" className="hover:text-paper">Products</Link>
          <Link href="/vendor" className="hover:text-paper">Sell on CVTECHUB</Link>
        </div>
      </div>
    </footer>
  );
}
