'use client';

import {
  Brain,
  Droplets,
  History as HistoryIcon,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

const navigation = [
  {
    href: '/',
    name: 'Dashboard',
    nameVi: 'Bang Dieu Khien',
    icon: LayoutDashboard,
  },
  {
    href: '/ai-explain',
    name: 'AI Explain',
    nameVi: 'Giai Thich AI',
    icon: Brain,
  },
  {
    href: '/ai-plan',
    name: 'AI Plan',
    nameVi: 'Ke Hoach AI',
    icon: Lightbulb,
  },
  {
    href: '/history',
    name: 'History',
    nameVi: 'Lich Su',
    icon: HistoryIcon,
  },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to log out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } sticky top-0 flex h-screen flex-col border-r bg-card transition-all duration-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        {sidebarOpen && (
          <div className="flex items-center space-x-2">
            <Droplets className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">GreenThread</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={!sidebarOpen ? 'mx-auto' : ''}
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Company Info */}
      {sidebarOpen && (
        <div className="border-b p-4">
          <div className="font-medium text-sm">Textile Wastewater</div>
          <div className="text-muted-foreground text-xs">Monitoring System</div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex w-full items-center ${
                sidebarOpen ? 'px-3' : 'justify-center px-2'
              } rounded-lg py-3 transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <Icon
                className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''} shrink-0`}
              />
              {sidebarOpen && (
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs opacity-80">{item.nameVi}</div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`w-full justify-start text-muted-foreground hover:text-foreground ${
            sidebarOpen ? 'px-3' : 'justify-center px-2'
          }`}
        >
          <LogOut className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''} shrink-0`} />
          {sidebarOpen && (
            <span className="text-sm">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </Button>
      </div>

      {/* Footer */}
      {sidebarOpen && (
        <div className="border-t p-4 text-center text-muted-foreground text-xs">
          <div>GreenThread MVP</div>
          <div>RMITHAV 2025</div>
        </div>
      )}
    </aside>
  );
}
