'use client';

import {
  Brain,
  Droplets,
  History as HistoryIcon,
  LayoutDashboard,
  Lightbulb,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import AIExplain from '@/components/pages/AIExplain';
import AIPlan from '@/components/pages/AIPlan';
import Dashboard from '@/components/pages/Dashboard';
import History from '@/components/pages/History';
import { Button } from '@/components/ui/button';

type Page = 'dashboard' | 'ai-explain' | 'ai-plan' | 'history';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    {
      id: 'dashboard' as Page,
      name: 'Dashboard',
      nameVi: 'Bảng Điều Khiển',
      icon: LayoutDashboard,
    },
    {
      id: 'ai-explain' as Page,
      name: 'AI Explain',
      nameVi: 'Giải Thích AI',
      icon: Brain,
    },
    {
      id: 'ai-plan' as Page,
      name: 'AI Plan',
      nameVi: 'Kế Hoạch AI',
      icon: Lightbulb,
    },
    {
      id: 'history' as Page,
      name: 'History',
      nameVi: 'Lịch Sử',
      icon: HistoryIcon,
    },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'ai-explain':
        return <AIExplain />;
      case 'ai-plan':
        return <AIPlan />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
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
            <div className="text-muted-foreground text-xs">
              Monitoring System
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex w-full items-center ${
                  sidebarOpen ? 'px-3' : 'justify-center px-2'
                } rounded-lg py-3 transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''} flex-shrink-0`}
                />
                {sidebarOpen && (
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs opacity-80">{item.nameVi}</div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="border-t p-4 text-center text-muted-foreground text-xs">
            <div>GreenThread MVP</div>
            <div>RMITHAV 2025</div>
            <div className="mt-2 text-xs">
              🤖 AI • ⛓️ Blockchain • 🛡️ CyberSecurity
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-muted-foreground text-sm">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                <span className="font-medium text-sm">System Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{renderPage()}</div>
      </main>
    </div>
  );
}
