import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Mail, Lock, User, Loader2, ShieldPlus, CheckCircle2 } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const AdminRegister = () => {
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/admin/register', data);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-dark mb-4">Application Sent!</h2>
          <p className="text-gray-500 font-medium mb-8 leading-relaxed">
            Your admin account request has been submitted. Please contact your system administrator to approve your access.
          </p>
          <Link to="/admin/login" className="btn-primary w-full py-4 rounded-2xl font-black block">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mt-16 blur-2xl"></div>
        
        <div className="text-center mb-10 relative">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldPlus className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-dark">Admin Access</h1>
          <p className="text-gray-500 mt-2 font-medium">Request administrative privileges</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-8 border border-red-100 font-medium flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
            <div className="relative">
              <input
                {...register('name')}
                className={`w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none ${errors.name ? 'border-red-500/20 bg-red-50/30' : ''}`}
                placeholder="Manager Name"
              />
              <User className="w-5 h-5 absolute left-4 top-4 text-gray-400" />
            </div>
            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Work Email</label>
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
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
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
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-400 font-bold">Already have access?</p>
            <Link to="/admin/login" className="text-primary hover:underline font-black mt-1 inline-block">Login to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
