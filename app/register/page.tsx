import RegisterForm from '@/components/RegisterForm';

export default function RegisterPage({ searchParams }: { searchParams: { role?: string } }) {
  const initialRole = searchParams.role === 'vendor' ? 'vendor' : 'buyer';
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-display font-medium mb-6">Create an account</h1>
      <RegisterForm initialRole={initialRole} />
    </div>
  );
}
