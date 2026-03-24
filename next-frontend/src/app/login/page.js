'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import api from '@/utils/api';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Suspense } from 'react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useStore((state) => state.setUser);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const redirect = searchParams.get('redirect') || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', data);
      setUser(response.data);
      router.push(redirect);
    } catch (err) {
      setError(err.response?.data?.message || 'Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-dark">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Login to your IzaanShop account</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                {...register('email')}
                className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl pl-10 focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.email ? 'border-red-500' : ''}`}
                placeholder="you@example.com"
              />
              <Mail className="w-4 h-4 absolute left-3 top-4 text-gray-400" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type="password"
                className={`w-full p-3 bg-gray-50 border border-gray-200 rounded-xl pl-10 focus:ring-2 focus:ring-primary/20 outline-none transition-all ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 absolute left-3 top-4 text-gray-400" />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button disabled={loading} type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

const Login = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
};

export default Login;
