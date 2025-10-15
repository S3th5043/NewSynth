"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { setSession } from '@/utils/session';

interface FormValues { email: string; code?: string }

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormValues>({ defaultValues: { email: '' } });

  const onSendCode = async ({ email }: FormValues) => {
    setError(null); setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setStep(2);
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async ({ code }: FormValues) => {
    setError(null); setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const ok = (code ?? '').trim().length === 4; // mock 4-digit code
      if (!ok) throw new Error('Invalid code');
      setSession({ email: getValues('email'), verified: true });
      router.push('/dashboard');
    } catch (e) {
      setError('Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center px-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="rounded-2xl p-px animated-border">
          <div className="rounded-2xl glass p-6">
            <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
            <p className="mt-1 text-sm text-gray-600">We’ll email you a 4-digit code.</p>

            {step === 1 && (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSendCode)} aria-label="Send code form">
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                <input id="email" type="email" aria-invalid={!!errors.email} {...register('email', { required: true })} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com"/>
                {errors.email && <span className="text-sm text-red-600">Email is required</span>}
                <button disabled={loading} className="w-full rounded-md bg-primary text-white py-2 btn-glow" aria-busy={loading}>
                  {loading ? 'Sending…' : 'Send Code'}
                </button>
              </form>
            )}

            {step === 2 && (
              <form className="mt-6 space-y-4" onSubmit={handleSubmit(onVerify)} aria-label="Verify code form">
                <label className="block text-sm font-medium text-gray-700" htmlFor="code">Verification code</label>
                <input id="code" inputMode="numeric" aria-invalid={!!errors.code} {...register('code', { required: true, minLength: 4, maxLength: 4 })} className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary" placeholder="1234"/>
                {error && <span className="text-sm text-red-600">{error}</span>}
                <button disabled={loading} className="w-full rounded-md bg-primary text-white py-2 btn-glow" aria-busy={loading}>
                  {loading ? 'Verifying…' : 'Verify'}
                </button>
              </form>
            )}

            <div className="mt-6 flex items-center justify-between text-sm">
              <a href="#" className="text-gray-600 hover:text-primary">Need help? Contact support</a>
              <span className="text-gray-400">Synthesise AI</span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
