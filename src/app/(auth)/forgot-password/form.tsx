'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyRecoveryOtpMutation,
} from '@/lib/api/auth';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordSchema,
  type ResetPasswordSchema,
} from '@/lib/schema/auth';

type Stage = 'email' | 'otp' | 'password';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const forgotPasswordMutation = useForgotPasswordMutation();
  const verifyRecoveryOtpMutation = useVerifyRecoveryOtpMutation();
  const resetPasswordMutation = useResetPasswordMutation();

  const emailForm = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  async function handleEmailSubmit(data: ForgotPasswordSchema) {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      setEmail(data.email);
      setStage('otp');
      setCooldown(60);
      toast.success('Recovery code sent to your email');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send recovery code'
      );
    }
  }

  async function handleVerifyOtp() {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    try {
      await verifyRecoveryOtpMutation.mutateAsync({ email, otp });
      setStage('password');
      toast.success('Code verified! Enter your new password');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Invalid recovery code'
      );
    }
  }

  async function handleResendOtp() {
    try {
      await forgotPasswordMutation.mutateAsync({ email });
      setCooldown(60);
      toast.success('Recovery code resent');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to resend code'
      );
    }
  }

  async function handlePasswordSubmit(data: ResetPasswordSchema) {
    try {
      await resetPasswordMutation.mutateAsync({ password: data.password });
      toast.success('Password reset successfully!');
      router.push('/login');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to reset password'
      );
    }
  }

  // Stage 1: Email
  if (stage === 'email') {
    return (
      <Card className="border-neutral-200 bg-white shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-neutral-900">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-neutral-600">
            Enter your email and we&apos;ll send you a recovery code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(handleEmailSubmit)}
              className="space-y-4"
            >
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="border-neutral-300 bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
                disabled={forgotPasswordMutation.isPending}
              >
                {forgotPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Recovery Code'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-neutral-100 border-t pt-6">
          <Link
            href="/login"
            className="text-neutral-600 text-sm hover:text-neutral-900 hover:underline"
          >
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  // Stage 2: OTP
  if (stage === 'otp') {
    return (
      <Card className="border-neutral-200 bg-white shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-neutral-900">
            Enter Recovery Code
          </CardTitle>
          <CardDescription className="text-neutral-600">
            We sent a code to{' '}
            <span className="font-medium text-neutral-900">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
              className="gap-2"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <Button
            className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
            onClick={handleVerifyOtp}
            disabled={verifyRecoveryOtpMutation.isPending || otp.length !== 6}
          >
            {verifyRecoveryOtpMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>
          <div className="text-center">
            <p className="text-neutral-600 text-sm">
              Didn&apos;t receive the code?{' '}
              {cooldown > 0 ? (
                <span className="text-neutral-500">Resend in {cooldown}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={forgotPasswordMutation.isPending}
                  className="font-medium text-neutral-900 hover:underline disabled:opacity-50"
                >
                  {forgotPasswordMutation.isPending ? 'Sending...' : 'Resend'}
                </button>
              )}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-neutral-100 border-t pt-6">
          <button
            type="button"
            onClick={() => setStage('email')}
            className="text-neutral-600 text-sm hover:text-neutral-900 hover:underline"
          >
            Use a different email
          </button>
        </CardFooter>
      </Card>
    );
  }

  // Stage 3: New Password
  return (
    <Card className="border-neutral-200 bg-white shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-neutral-900">
          Set New Password
        </CardTitle>
        <CardDescription className="text-neutral-600">
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...passwordForm}>
          <form
            onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
            className="space-y-4"
          >
            <FormField
              control={passwordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter new password"
                        className="border-neutral-300 bg-white pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-full px-3 text-neutral-500 hover:text-neutral-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-neutral-700">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        className="border-neutral-300 bg-white pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-full px-3 text-neutral-500 hover:text-neutral-700"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-neutral-500 text-xs">
              Password must be at least 8 characters with uppercase, lowercase,
              number, and special character.
            </p>
            <Button
              type="submit"
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
              disabled={resetPasswordMutation.isPending}
            >
              {resetPasswordMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-neutral-100 border-t pt-6">
        <Link
          href="/login"
          className="text-neutral-600 text-sm hover:text-neutral-900 hover:underline"
        >
          Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
}
