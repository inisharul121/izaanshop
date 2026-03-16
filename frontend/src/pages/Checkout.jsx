import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import api from '../utils/api';
import { CreditCard, Truck, CheckCircle, Loader2, User, LogIn } from 'lucide-react';

const checkoutSchema = z.object({
  guestName: z.string().optional(),
  guestEmail: z.string().optional(),
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  phone: z.string().min(11, 'Valid phone number is required'),
  paymentMethod: z.enum(['Cash on Delivery', 'bKash', 'Card']),
}).superRefine((data, ctx) => {
  // Only required when guest (not logged in) — handled at submit time
  return data;
});

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, user } = useStore();
  const [loading, setLoading] = React.useState(false);
  const isGuest = !user;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'Cash on Delivery',
      phone: user?.phone || '',
    }
  });

  const subtotal = cart.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 60;
  const total = subtotal + shipping;

  const onSubmit = async (data) => {
    // Validate guest fields manually
    if (isGuest) {
      if (!data.guestName?.trim()) { alert('Please enter your name.'); return; }
      if (!data.guestEmail?.trim() || !/\S+@\S+\.\S+/.test(data.guestEmail)) {
        alert('Please enter a valid email address.'); return;
      }
    }

    setLoading(true);
    try {
      const orderData = {
        orderItems: cart,
        shippingAddress: {
          street: data.address,
          city: data.city,
          zipCode: data.postalCode,
          country: 'Bangladesh',
          phone: data.phone,
        },
        paymentMethod: data.paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
        ...(isGuest && {
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.phone,
        }),
      };

      const response = await api.post('/orders', orderData);
      clearCart();
      navigate(`/order-success`, { state: { orderId: response.data.id, isGuest } });
    } catch (error) {
      console.error('Checkout failed', error);
      alert(error.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all';
  const errorClass = 'text-red-500 text-xs mt-1';
  const labelClass = 'block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5';

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-gray-400 text-sm mb-10">
        {isGuest ? 'Ordering as guest · ' : `Logged in as ${user.name} · `}
        {isGuest
          ? <Link to="/login" className="text-primary hover:underline font-medium">Sign in for faster checkout</Link>
          : <Link to="/profile" className="text-primary hover:underline font-medium">View my orders</Link>
        }
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">

          {/* Guest Info — only shown when not logged in */}
          {isGuest && (
            <div className="bg-white p-8 rounded-2xl border border-primary/20 shadow-sm">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Your Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name *</label>
                  <input {...register('guestName')} className={inputClass} placeholder="e.g. Nisharul Islam" />
                </div>
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <input {...register('guestEmail')} type="email" className={inputClass} placeholder="you@example.com" />
                  <p className="text-[10px] text-gray-400 mt-1">Order confirmation will be sent here</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary/5 border border-primary/10 rounded-xl flex items-center gap-3">
                <LogIn className="w-4 h-4 text-primary flex-shrink-0" />
                <p className="text-xs text-gray-500">
                  Have an account? <Link to={`/login?redirect=/checkout`} className="text-primary font-bold hover:underline">Sign in</Link> to track orders and save your info.
                </p>
              </div>
            </div>
          )}

          {/* Shipping Info */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Shipping Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Full Address *</label>
                <textarea
                  {...register('address')}
                  className={`${inputClass} min-h-[90px] resize-none ${errors.address ? 'border-red-300' : ''}`}
                  placeholder="House #, Road #, Area..."
                />
                {errors.address && <p className={errorClass}>{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City *</label>
                  <input {...register('city')} className={`${inputClass} ${errors.city ? 'border-red-300' : ''}`} placeholder="e.g. Dhaka" />
                  {errors.city && <p className={errorClass}>{errors.city.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Postal Code *</label>
                  <input {...register('postalCode')} className={`${inputClass} ${errors.postalCode ? 'border-red-300' : ''}`} placeholder="1212" />
                  {errors.postalCode && <p className={errorClass}>{errors.postalCode.message}</p>}
                </div>
              </div>
              <div>
                <label className={labelClass}>Phone Number *</label>
                <input {...register('phone')} className={`${inputClass} ${errors.phone ? 'border-red-300' : ''}`} placeholder="017XXXXXXXX" />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Method
            </h2>
            <div className="space-y-3">
              {['Cash on Delivery', 'bKash', 'Card'].map((item) => (
                <label key={item} className="flex items-center p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all">
                  <input
                    type="radio"
                    value={item}
                    {...register('paymentMethod')}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className="ml-3 font-medium text-dark text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              {cart.map((item) => (
                <div key={`${item.id}-${JSON.stringify(item.selectedOptions || {})}`} className="flex justify-between text-sm">
                  <div className="flex-1 pr-4">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <p className="text-[10px] text-gray-400">
                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                      </p>
                    )}
                    <span className="text-gray-400 text-xs"> × {item.quantity}</span>
                  </div>
                  <span className="font-bold text-dark">{(item.salePrice || item.price) * item.quantity}৳</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-3 text-sm mb-6">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{subtotal}৳</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-500 font-bold">Free</span> : `${shipping}৳`}</span>
              </div>
              {shipping > 0 && <p className="text-[10px] text-gray-400">Free shipping on orders over 2000৳</p>}
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold text-dark">
                <span>Total</span>
                <span className="text-primary text-xl">{total}৳</span>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 text-base shadow-lg ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-primary/20'}`}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>{isGuest ? 'Place Order as Guest' : 'Complete Order'} <CheckCircle className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
