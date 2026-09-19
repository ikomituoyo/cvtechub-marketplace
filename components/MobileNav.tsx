'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function MobileNav({
  links, showVendor, showOrders,
}: { links: { href: string; label: string }[]; showVendor: boolean; showOrders: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="border border-linedark px-3 py-1.5 text-sm"
      >
        Menu
      </button>
      {open && (
        <nav className="absolute left-0 right-0 top-full bg-ink border-b border-linedark flex flex-col">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-6 py-3 border-b border-linedark text-sm font-medium">
              {l.label}
            </Link>
          ))}
          {showVendor && (
            <Link href="/vendor" onClick={() => setOpen(false)} className="px-6 py-3 border-b border-linedark text-sm font-medium">
              Vendor dashboard
            </Link>
          )}
          {showOrders && (
            <Link href="/orders" onClick={() => setOpen(false)} className="px-6 py-3 border-b border-linedark text-sm font-medium">
              My orders
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
