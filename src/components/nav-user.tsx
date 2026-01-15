'use client';

import { ChevronsUpDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCurrentUser } from '@/lib/api/auth';
import { createClient } from '@/lib/supabase/client';
import { getDisplayNameFromEmail } from '@/utils/email-helper';

export function NavUser({ sidebarOpen }: { sidebarOpen: boolean }) {
  const isMobile = useIsMobile();

  const router = useRouter();
  const supabase = createClient();

  const { data, isLoading } = useCurrentUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const user = data?.user;

  if (isLoading || !user) {
    return <Skeleton className="h-12" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          className="bg-background text-accent-foreground hover:bg-accent"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarFallback className="rounded-lg bg-sidebar-primary! text-sidebar-primary-foreground">
              {user.email
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {sidebarOpen && (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {getDisplayNameFromEmail(user.email)}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">
                {user.email
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">
                {getDisplayNameFromEmail(user.email)}
              </span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
