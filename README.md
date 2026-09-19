# CVTECHUB Marketplace — live storefront application

This is the functioning marketplace behind the CVTECHUB marketing site: real stores,
real product listings backed by a database, search/filtering, cart, checkout with
Paystack, buyer order history, and a vendor dashboard for managing products and orders.

It's a separate application from the static marketing site delivered earlier — that
site is the front door (investor/enterprise pitch); this is the product itself.

## Stack

- **Next.js 14** (App Router, TypeScript) — pages are server components that query
  the database directly; interactive bits (forms, cart, checkout) are client components
  calling a small set of API routes.
- **SQLite via Node's built-in `node:sqlite`** — no native module to compile, no
  external database server needed to try this out. Requires Node 22.5+.
- **Hand-rolled auth** — bcrypt password hashing, JWT session in an httpOnly cookie.
  Buyer and vendor accounts share one `users` table with a `role` column.
- **Paystack** — inline checkout on the client, server-side verification against
  Paystack's API before an order is marked paid.
- Styled with Tailwind, using the same ink/paper/verified-green/brand-blue palette
  and logo as the marketing site.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in JWT_SECRET and (optionally) Paystack keys
npm run dev
```

Open http://localhost:3000. The database is created and **seeded automatically** on
first run (file at `data/cvtechub.db`) with two demo stores and nine products, so
there's something to browse immediately.

**Demo accounts** (password for all: `password123`):

| Email | Role |
|---|---|
| buyer@example.com | buyer |
| vendor1@example.com | vendor — owns "Tunde Electronics" |
| vendor2@example.com | vendor — owns "Chioma Gadgets" |
| admin@example.com | admin |

Delete `data/cvtechub.db` at any time to reset to a fresh seeded state.

## Enabling real payments

1. Create a Paystack account and grab your **test** keys from
   Settings → API Keys & Webhooks.
2. Put them in `.env.local`:
   ```
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
   PAYSTACK_SECRET_KEY=sk_test_xxxxx
   ```
3. Restart the dev server. Checkout will now open the real Paystack popup, and
   `/api/checkout/verify` will confirm the transaction server-side (amount and
   status) before marking the order paid, decrementing stock, and clearing the cart.
4. For production, add a webhook endpoint in the Paystack dashboard as a safety
   net for payments that complete but whose client-side callback never fires
   (e.g. the buyer closes the tab right after paying) — the current code verifies
   on the client callback only; see "What's not included" below.
5. Switch to live keys (`pk_live_` / `sk_live_`) when you're ready to accept real
   money, and go through Paystack's business verification.

## How the pieces fit together

- `lib/db.ts` — opens the SQLite file, creates tables if they don't exist, and
  seeds sample data on a first run. All queries elsewhere go through `db.prepare(...)`.
- `lib/auth.ts` — password hashing, JWT signing, and `getSession()` for server
  components/API routes (Node runtime).
- `middleware.ts` — protects `/vendor/*`, `/checkout/*`, `/orders/*`. Uses `jose`
  rather than `jsonwebtoken` here specifically because Next.js middleware runs on
  the Edge runtime, which doesn't support Node's `crypto` module.
- `app/api/**` — the only routes that exist are the ones that need to *do*
  something server-side on a button click: auth, cart mutations, checkout,
  vendor CRUD. Everything read-only (product pages, store pages, search) is a
  server component querying the database directly — no API layer needed for that
  in the App Router.
- Money is stored in **kobo** (integer) everywhere in the database and only
  formatted to Naira for display, to avoid floating-point rounding issues.

## What's genuinely functional right now

- Registration/login for both buyers and vendors (a vendor account gets a store
  created at signup).
- Store directory and individual store pages, pulling live products from the DB.
- Product search, category filter, condition filter, and sort — real SQL queries,
  not client-side filtering of a static list.
- Cart tied to the logged-in user, persisted server-side.
- Checkout: creates a real `orders` + `order_items` row, generates a payment
  reference, opens Paystack, and verifies the transaction server-side before
  marking anything paid.
- Vendor dashboard: create/edit/delete products, see paid orders for their store
  specifically (not other vendors'), update fulfillment status per line item.
- Stock decrements on successful payment; out-of-stock products can't be added
  to cart or oversold at checkout.

This was built and smoke-tested end to end in a sandboxed container (register →
browse → filter → add to cart → checkout form → vendor product CRUD → vendor
orders) before being handed off — see the `/shots` folder removed before
packaging, or just run it yourself following "Getting started" above.

## What's intentionally out of scope for this pass

This is a working MVP, not a production-hardened platform. Before real users and
real money touch it:

- **Move off SQLite for production**, especially if deploying to a serverless
  platform (Vercel, etc.) — their filesystems are ephemeral/read-only at runtime,
  so a SQLite file won't persist between requests there. The query patterns here
  are plain SQL, so moving to hosted Postgres (Neon, Supabase, Railway) mainly
  means swapping `lib/db.ts` for a Postgres client (e.g. `pg` or `postgres.js`)
  and adjusting the handful of SQLite-specific bits (`datetime('now')`,
  `AUTOINCREMENT`).
- **Paystack webhook endpoint** — right now payment confirmation relies on the
  client-side callback reaching `/api/checkout/verify`. Add a signed webhook
  handler as a fallback so payments still get recorded if the buyer's browser
  closes before the callback fires.
- **Email** — no order confirmation emails, no password reset flow.
- **Multi-vendor shipping/split payouts** — checkout currently charges the buyer
  one total via a single Paystack transaction; splitting that total out to each
  vendor's own bank account (Paystack Subaccounts/Split Payments) isn't wired up.
- **Vendor verification workflow** — the marketing site describes a document
  review process; here, `stores.verified` is just a boolean, set by seed data or
  directly in the database. No admin UI to review and approve vendors yet.
- **Rate limiting / abuse protection** on auth and checkout endpoints.
- **Image uploads** — product images are pasted-in URLs, not an upload pipeline.
- **Service marketplace booking flow** (from the marketing site) — this build
  covers the product marketplace (stores, products, cart, checkout) specifically,
  since that's what was asked for. The verified-technician booking flow shown on
  the marketing site would follow a similar pattern but isn't built here.

## Connecting it to the marketing site

The marketing site's "Shop the marketplace" / "Become a vendor" links point at
relative paths like `marketplace.html`. Once both are deployed, either point
those links at this app's deployed URL, or fold the marketing pages into this
Next.js app as static routes so it's one deployment.
