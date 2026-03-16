import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import api from '../utils/api';
import { Mail, Lock, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', data);
      setUser(response.data);
      navigate('/');
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
                className={`input pl-10 ${errors.email ? 'border-red-500 focus:ring-red-200' : ''}`}
                placeholder="you@example.com"
              />
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type="password"
                className={`input pl-10 ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button disabled={loading} type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
