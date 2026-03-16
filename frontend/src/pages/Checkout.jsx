import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import api from '../utils/api';
import { CreditCard, Truck, CheckCircle, Loader2, MapPin } from 'lucide-react';

const checkoutSchema = z.object({
  address: z.string().min(10, 'Full address is required'),
  city: z.string().min(2, 'City is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  phone: z.string().min(11, 'Valid phone number is required'),
  paymentMethod: z.enum(['Cash on Delivery', 'bKash', 'Card']),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, user } = useStore();
  const [loading, setLoading] = React.useState(false);

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
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart,
        shippingAddress: {
          street: data.address,
          city: data.city,
          zipCode: data.postalCode,
          country: 'Bangladesh'
        },
        paymentMethod: data.paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const response = await api.post('/orders', orderData);
      clearCart();
      navigate(`/order/${response.data._id}`);
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Info */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" /> Shipping Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
                <textarea 
                  {...register('address')}
                  className={`input min-h-[100px] ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="House #, Road #, Area..."
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input {...register('city')} className="input" placeholder="e.g. Dhaka" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input {...register('postalCode')} className="input" placeholder="1212" />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input {...register('phone')} className="input" placeholder="017XXXXXXXX" />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" /> Payment Method
            </h2>
            <div className="space-y-3">
              {['Cash on Delivery', 'bKash', 'Card'].map((item) => (
                <label key={item} className="flex items-center p-4 border border-gray-100 rounded-xl cursor-pointer hover:bg-orange-50/50 transition-colors">
                  <input 
                    type="radio" 
                    value={item} 
                    {...register('paymentMethod')}
                    className="w-4 h-4 text-primary focus:ring-primary border-gray-300" 
                  />
                  <span className="ml-3 font-medium text-dark">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="font-medium">{(item.salePrice || item.price) * item.quantity}৳</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-4 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{subtotal}৳</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping}৳</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-dark">
                <span>Total</span>
                <span className="text-primary text-2xl">{total}৳</span>
              </div>
            </div>
            
            <button 
              disabled={loading}
              type="submit" 
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Complete Order <CheckCircle className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
