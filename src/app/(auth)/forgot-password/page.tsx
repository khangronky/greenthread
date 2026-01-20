import type { Metadata } from 'next';
import { ForgotPasswordForm } from './form';

export const metadata: Metadata = {
  title: 'Forgot Password | GreenThread',
  description: 'Reset your GreenThread password',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
