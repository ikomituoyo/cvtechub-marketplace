import Link from 'next/link';
import { SessionUser } from '@/lib/auth';
import { db, getOrCreateCart } from '@/lib/db';
import LogoutButton from './LogoutButton';
import MobileNav from './MobileNav';

const NAV_LINKS = [
  { href: '/products', label: 'Marketplace' },
  { href: '/stores', label: 'Stores' },
  { href: '/services', label: 'Services' },
  { href: '/verify', label: 'Verify' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

function cartCount(userId: number | undefined) {
  if (!userId) return 0;
  const cartId = getOrCreateCart(userId);
  const row = db.prepare('SELECT COALESCE(SUM(quantity),0) as c FROM cart_items WHERE cart_id = ?').get(cartId) as any;
  return row.c as number;
}

export default function Header({ session }: { session: SessionUser | null }) {
  const count = session ? cartCount(session.id) : 0;
  return (
    <header className="sticky top-0 z-40 bg-ink text-paper border-b border-linedark overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-6 relative">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <svg width="26" height="26" viewBox="0 0 40 40" aria-hidden="true">
            <defs>
              <linearGradient id="ringGradApp" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#3DE08A" />
                <stop offset="1" stopColor="#1FB6D8" />
              </linearGradient>
            </defs>
            <ellipse cx="21" cy="21" rx="14.5" ry="17" fill="none" stroke="url(#ringGradApp)" strokeWidth="2.6" />
            <g fill="none" stroke="#2FB673" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 9 L9 15 L5.5 19 L9 23 L9 29" />
            </g>
            <circle cx="9" cy="9" r="1.6" fill="#2FB673" />
            <circle cx="5.5" cy="19" r="1.6" fill="#2FB673" />
            <circle cx="9" cy="29" r="1.6" fill="#2FB673" />
            <g fill="none" stroke="#2FB673" strokeWidth="2" strokeLinecap="round">
              <path d="M14.5 18.5 Q22 8 29.5 18.5" />
              <path d="M18 19.5 Q22 13.5 26 19.5" />
            </g>
            <circle cx="22" cy="23" r="1.5" fill="#2FB673" />
            <g fill="none" stroke="#1C8FC2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 25.5 L17.5 25.5 L20.5 34.5 L30 34.5 L32 27.5 L18.3 27.5" />
            </g>
            <circle cx="21.5" cy="37.5" r="1.7" fill="#1C8FC2" />
            <circle cx="27.5" cy="37.5" r="1.7" fill="#1C8FC2" />
          </svg>
          CVTECHUB
          <span className="text-xs font-mono font-normal border border-linedark px-2 py-0.5 ml-1 opacity-75">by Veridon</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="opacity-90 hover:opacity-100">{l.label}</Link>
          ))}
          {session && (session.role === 'vendor' || session.role === 'admin') && (
            <Link href="/vendor" className="opacity-90 hover:opacity-100">Vendor dashboard</Link>
          )}
          {session && <Link href="/orders" className="opacity-90 hover:opacity-100">My orders</Link>}
        </nav>

        <div className="flex items-center gap-4 text-sm">
          <MobileNav
            links={NAV_LINKS}
            showVendor={!!session && (session.role === 'vendor' || session.role === 'admin')}
            showOrders={!!session}
          />
          <Link href="/cart" className="relative opacity-90 hover:opacity-100">            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-3 bg-brand text-white text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          {session ? (
            <LogoutButton />
          ) : (
            <>
              <Link href="/login" className="opacity-90 hover:opacity-100 hidden sm:inline">Log in</Link>
              <Link href="/sell" className="btn-brand !px-4 !py-2">Sell on CVTECHUB</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
