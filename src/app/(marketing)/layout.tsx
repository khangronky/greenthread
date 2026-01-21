import { Leaf } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-green-50 to-green-100">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-green-100 border-b bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-bold text-2xl text-green-dark">
            <div className="relative h-8 w-8">
              <Image
                src="/logo.png"
                alt="GreenThread Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <span>GreenThread</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <Button className="rounded-full bg-green-dark px-6 py-2 text-white transition hover:bg-green-primary">
              Contact Us
            </Button>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-green-dark px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Leaf size={32} />
                <span className="font-bold text-2xl">GreenThread</span>
              </div>
              <p className="text-green-light text-sm">
                Transforming textile wastewater management with AI and
                blockchain technology.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Product</h4>
              <ul className="space-y-2 text-green-light text-sm">
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Case Studies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Company</h4>
              <ul className="space-y-2 text-green-light text-sm">
                <li>
                  <Link href="#" className="transition hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-bold">Resources</h4>
              <ul className="space-y-2 text-green-light text-sm">
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition hover:text-white">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-green-primary border-t pt-8 text-center text-green-light text-sm">
            <p>&copy; 2026 GreenThread. Built with sustainability in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
