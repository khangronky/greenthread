import { AuthNavbar } from '@/components/auth/auth-navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-white">
      <AuthNavbar />
      <main className="flex min-h-screen items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
