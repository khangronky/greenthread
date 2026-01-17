'use client';

import {
  Blocks,
  Brain,
  Droplets,
  History as HistoryIcon,
  LayoutDashboard,
  Lightbulb,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { NavUser } from './nav-user';

const navigation = [
  {
    href: '/dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/ai-explain',
    name: 'AI Explain',
    icon: Brain,
  },
  {
    href: '/ai-plan',
    name: 'AI Plan',
    icon: Lightbulb,
  },
  {
    href: '/history',
    name: 'History',
    icon: HistoryIcon,
  },
  {
    href: '/audit-trail',
    name: 'Audit Trail',
    icon: Blocks,
  },
];

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } sticky top-0 flex h-screen flex-col overflow-hidden border-r bg-card transition-all duration-300`}
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
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <NavUser sidebarOpen={sidebarOpen} />

      {/* Footer */}
      {sidebarOpen && (
        <div className="border-t p-4 text-center text-muted-foreground text-xs">
          <div>GreenThread MVP</div>
          <div>RMIT Hack-A-Venture 2025</div>
        </div>
      )}
    </aside>
  );
}
