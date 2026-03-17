import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import api from '../utils/api';
import { Mail, Lock, Loader2, ShieldCheck } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminLogin = () => {
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
      
      if (response.data.role !== 'admin') {
        setError('Unauthorized. This portal is for administrators only.');
        return;
      }
      
      setUser(response.data);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Check your credentials and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        
        <div className="text-center mb-10 relative">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-dark">Admin Portal</h1>
          <p className="text-gray-500 mt-2 font-medium">Secure access for IzaanShop management</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-8 border border-red-100 font-medium flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Admin Email</label>
            <div className="relative">
              <input
                {...register('email')}
                className={`w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none ${errors.email ? 'border-red-500/20 bg-red-50/30' : ''}`}
                placeholder="admin@izaanshop.com"
              />
              <Mail className="w-5 h-5 absolute left-4 top-4 text-gray-400" />
            </div>
            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type="password"
                className={`w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none ${errors.password ? 'border-red-500/20 bg-red-50/30' : ''}`}
                placeholder="••••••••"
              />
              <Lock className="w-5 h-5 absolute left-4 top-4 text-gray-400" />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1">{errors.password.message}</p>}
          </div>

          <button 
            disabled={loading} 
            type="submit" 
            className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enter Dashboard'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-400 font-bold">New Administrator?</p>
            <Link to="/admin/register" className="text-primary hover:underline font-black mt-1 inline-block">Apply for Access</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
