import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/70 border-t border-linedark mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h5 className="text-paper font-semibold mb-3">Marketplace</h5>
          <ul className="space-y-2">
            <li><Link href="/products" className="hover:text-paper">Shop products</Link></li>
            <li><Link href="/stores" className="hover:text-paper">Browse stores</Link></li>
            <li><Link href="/verify" className="hover:text-paper">Verify a device</Link></li>
            <li><Link href="/cart" className="hover:text-paper">Your cart</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-paper font-semibold mb-3">Ecosystem</h5>
          <ul className="space-y-2">
            <li><Link href="/services" className="hover:text-paper">Services</Link></li>
            <li><Link href="/sell" className="hover:text-paper">Become a vendor</Link></li>
            <li><Link href="/about" className="hover:text-paper">About CVTECHUB</Link></li>
            <li><Link href="/about#veridon" className="hover:text-paper">Powered by Veridon</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-paper font-semibold mb-3">Account</h5>
          <ul className="space-y-2">
            <li><Link href="/login" className="hover:text-paper">Log in</Link></li>
            <li><Link href="/register" className="hover:text-paper">Create account</Link></li>
            <li><Link href="/orders" className="hover:text-paper">My orders</Link></li>
            <li><Link href="/vendor" className="hover:text-paper">Vendor dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-paper font-semibold mb-3">Support</h5>
          <ul className="space-y-2">
            <li><Link href="/contact" className="hover:text-paper">Contact us</Link></li>
            <li><Link href="/contact" className="hover:text-paper">Report a stolen device</Link></li>
            <li><Link href="/contact" className="hover:text-paper">Investor inquiries</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-8 pt-4 border-t border-linedark text-xs flex flex-wrap justify-between gap-2">
        <span>&copy; 2026 CVTECHUB. Powered by Veridon.</span>
        <span>Computer Village, Otigba Street, Lagos, Nigeria</span>
      </div>
    </footer>
  );
}
