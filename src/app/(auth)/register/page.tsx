import type { Metadata } from 'next';
import { RegisterForm } from './form';

export const metadata: Metadata = {
  title: 'Register | GreenThread',
  description: 'Create your GreenThread account',
};

export default function RegisterPage() {
  return <RegisterForm />;
}
