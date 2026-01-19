'use client';

import {
  Check,
  Copy,
  Database,
  Eye,
  EyeOff,
  Loader2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  useChangePasswordMutation,
  useCurrentUser,
  useUpdateProfileMutation,
} from '@/lib/api/auth';
import { cn } from '@/lib/utils';
import {
  type SettingsTab,
  useSettingsDialogStore,
} from '@/stores/settings-dialog.store';

const NAV_ITEMS: { id: SettingsTab; label: string; icon: React.ElementType }[] =
  [
    { id: 'user', label: 'User Settings', icon: User },
    { id: 'data-ingestion', label: 'Data Ingestion', icon: Database },
  ];

const TAB_LABELS: Record<SettingsTab, string> = {
  user: 'User Settings',
  'data-ingestion': 'Data Ingestion',
};

function UserSettingsContent() {
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateProfileMutation();
  const changePassword = useChangePasswordMutation();
  const [displayName, setDisplayName] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user?.full_name !== undefined) {
      setDisplayName(user.full_name ?? '');
    }
  }, [user?.full_name]);

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value);
    setHasChanges(value !== (user?.full_name ?? ''));
  };

  const handleSave = () => {
    updateProfile.mutate(
      { full_name: displayName },
      {
        onSuccess: () => {
          setHasChanges(false);
          toast.success('Profile updated successfully');
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : 'Failed to update profile'
          );
        },
      }
    );
  };

  const handlePasswordChange = () => {
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).+$/;
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
      return;
    }

    // Check that new password is different from current
    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          toast.success('Password changed successfully');
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : 'Failed to change password'
          );
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg">User Settings</h3>
        <p className="text-muted-foreground text-sm">
          Manage your account information.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="display-name">Display Name</Label>
          <Input
            id="display-name"
            type="text"
            value={displayName}
            onChange={(e) => handleDisplayNameChange(e.target.value)}
            placeholder="Enter your display name"
          />
          <p className="text-muted-foreground text-xs">
            This is the name that will be displayed to others.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user?.email ?? ''}
            disabled
            className="bg-muted"
          />
          <p className="text-muted-foreground text-xs">
            Your email address cannot be changed.
          </p>
        </div>
        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="w-full"
          >
            {updateProfile.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Save Changes
          </Button>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="font-medium text-lg">Change Password</h3>
        <p className="text-muted-foreground text-sm">
          Update your password to keep your account secure.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-password">Current Password</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrentPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full px-3 text-neutral-500 hover:text-neutral-700"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">New Password</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full px-3 text-neutral-500 hover:text-neutral-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 h-full px-3 text-neutral-500 hover:text-neutral-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Password must be at least 8 characters with uppercase, lowercase,
            number, and special character.
          </p>
        </div>
        <Button
          onClick={handlePasswordChange}
          disabled={
            changePassword.isPending ||
            !currentPassword ||
            !newPassword ||
            !confirmPassword
          }
          className="w-full"
        >
          {changePassword.isPending && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}
          Change Password
        </Button>
      </div>
    </div>
  );
}

function DataIngestionContent() {
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const webhookUrl = `${appUrl}/api/webhooks/data`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium text-lg">Data Ingestion</h3>
        <p className="text-muted-foreground text-sm">
          Configure how external data sources connect to your application.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <p className="text-muted-foreground text-sm">
            Use this URL to receive data from external sources such as MQTT
            brokers, IoT devices, or other applications. Send POST requests to
            this endpoint to ingest data into the system.
          </p>
          <div className="flex gap-2">
            <Input
              id="webhook-url"
              type="text"
              value={webhookUrl}
              disabled
              className="flex-1 bg-muted font-mono text-sm"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
              <span className="sr-only">Copy webhook URL</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SettingsDialog() {
  const { isOpen, activeTab, closeDialog, setActiveTab } =
    useSettingsDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent
        className="h-[90vh] overflow-hidden p-0 md:max-w-2xl lg:max-w-6xl"
        showCloseButton={true}
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Manage your application settings
        </DialogDescription>
        <div className="flex h-full overflow-hidden">
          {/* Left Sidebar Navigation */}
          <div className="flex w-1/5 flex-col border-r bg-muted/30">
            <div className="p-4">
              <h2 className="font-semibold">Settings</h2>
            </div>
            <ScrollArea className="flex-1">
              <nav className="flex flex-col gap-1 p-2">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors',
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            </ScrollArea>
          </div>

          {/* Right Content Area */}
          <div className="flex flex-1 flex-col">
            {/* Breadcrumb */}
            <div className="border-b px-6 py-4">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      className="cursor-pointer"
                      onClick={() => setActiveTab('user')}
                    >
                      Settings
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{TAB_LABELS[activeTab]}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 overflow-auto">
              <div className="p-6">
                {activeTab === 'user' && <UserSettingsContent />}
                {activeTab === 'data-ingestion' && <DataIngestionContent />}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
