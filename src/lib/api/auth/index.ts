import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/api';

export const authKeys = {
  me: ['auth', 'me'] as const,
};

// Types
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

interface VerifyOtpRequest {
  email: string;
  otp: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface VerifyRecoveryOtpRequest {
  email: string;
  otp: string;
}

interface ResetPasswordRequest {
  password: string;
}

interface AuthResponse {
  message: string;
  requiresVerification?: boolean;
  user?: {
    id: string;
    email: string;
  };
}

interface CurrentUser {
  id: string;
  email: string;
  full_name: string | null;
}

// Mutations
export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: LoginRequest) =>
      fetcher<AuthResponse>('/auth/login', { method: 'POST', body: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: (data: RegisterRequest) =>
      fetcher<AuthResponse>('/auth/register', { method: 'POST', body: data }),
  });
}

export function useVerifyOtpMutation() {
  return useMutation({
    mutationFn: (data: VerifyOtpRequest) =>
      fetcher<AuthResponse>('/auth/otp/verify', { method: 'POST', body: data }),
  });
}

export function useResendOtpMutation() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      fetcher<AuthResponse>('/auth/otp/resend', { method: 'POST', body: data }),
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (data: ForgotPasswordRequest) =>
      fetcher<AuthResponse>('/auth/password-reset', {
        method: 'POST',
        body: data,
      }),
  });
}

export function useVerifyRecoveryOtpMutation() {
  return useMutation({
    mutationFn: (data: VerifyRecoveryOtpRequest) =>
      fetcher<AuthResponse>('/auth/password-reset/verify', {
        method: 'POST',
        body: data,
      }),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) =>
      fetcher<AuthResponse>('/auth/password-reset/update', {
        method: 'POST',
        body: data,
      }),
  });
}

// Queries
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: () => fetcher<{ user: CurrentUser }>('/auth/me'),
  });
}
