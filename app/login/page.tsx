import LoginForm from '@/components/LoginForm';

export default function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-2xl font-display font-medium mb-2">Log in</h1>
      <p className="text-inktext/70 mb-6 text-sm">
        Demo accounts: <span className="font-mono">buyer@example.com</span>, <span className="font-mono">vendor1@example.com</span> — password <span className="font-mono">password123</span>
      </p>
      <LoginForm next={searchParams.next || '/'} />
    </div>
  );
}
