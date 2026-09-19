export const dynamic = 'force-dynamic';

import { getSession, getStoreForVendor } from '@/lib/auth';
import StoreForm from '@/components/StoreForm';

export default async function VendorStorePage() {
  const session = (await getSession())!;
  const store = getStoreForVendor(session.id);

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-display font-medium mb-6">Edit store</h1>
      <StoreForm initial={store ? { name: store.name, description: store.description, location: store.location } : undefined} />
    </div>
  );
}
