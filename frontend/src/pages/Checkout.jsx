import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import api from '../utils/api';
import { CreditCard, Truck, CheckCircle, Loader2, User, MapPin, Phone } from 'lucide-react';
import { getImageUrl } from '../utils/helpers';

const checkoutSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  address: z.string().min(10, 'Full address is required'),
  phone: z.string().min(11, 'Valid phone number is required'),
  paymentMethod: z.enum(['Cash on Delivery', 'bKash', 'Card']),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, user } = useStore();
  const [loading, setLoading] = React.useState(false);
  const isOrderPlaced = React.useRef(false);
  const isGuest = !user;

  const [useSavedAddress, setUseSavedAddress] = React.useState(!!user?.address?.street);
  const [couponCode, setCouponCode] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState(null);
  const [couponLoading, setCouponLoading] = React.useState(false);
  const [couponError, setCouponError] = React.useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address?.street ? `${user.address.street}, ${user.address.city}` : '',
      paymentMethod: 'Cash on Delivery',
    }
  });

  const [paymentSettings, setPaymentSettings] = React.useState({ bkash_number: '', nagad_number: '' });
  const selectedPaymentMethod = watch('paymentMethod');
  const [transactionId, setTransactionId] = React.useState('');

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setPaymentSettings(data);
      } catch (error) {
        console.error('Failed to fetch payment settings');
      }
    };
    fetchSettings();
  }, []);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const { data } = await api.post('/coupons/validate', { code: couponCode });
      setAppliedCoupon(data);
      setCouponCode('');
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon');
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  React.useEffect(() => {
    if (useSavedAddress && user?.address?.street) {
      setValue('address', `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zipCode}`);
      setValue('phone', user.phone || '');
    } else if (!isGuest && !useSavedAddress) {
       // Optional: leave empty or keep previous if needed
    }
  }, [useSavedAddress, user, setValue, isGuest]);

  const subtotal = cart.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const shipping = subtotal > 2000 ? 0 : 60;
  const total = Math.max(0, subtotal - discount + shipping);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart,
        shippingAddress: (useSavedAddress && user?.address) ? {
          street: user.address.street,
          city: user.address.city,
          state: user.address.state,
          zipCode: user.address.zipCode,
          country: user.address.country,
          phone: data.phone,
        } : {
          street: data.address,
          city: 'N/A',
          zipCode: 'N/A',
          country: 'Bangladesh',
          phone: data.phone,
        },
        paymentMethod: data.paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
        transactionId: transactionId,
        ...(appliedCoupon ? { couponCode: appliedCoupon.code } : {}),
        ...(isGuest ? {
          guestName: data.name,
          guestPhone: data.phone,
        } : {}),
      };

      const response = await api.post('/orders', orderData);
      isOrderPlaced.current = true;
      clearCart();
      navigate(`/order-success`, { state: { orderId: response.data.id, isGuest } });
    } catch (error) {
      console.error('Checkout failed', error);
      alert(error.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (cart.length === 0 && !loading && !isOrderPlaced.current) {
      navigate('/cart');
    }
  }, [cart, loading, navigate]);

  const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all duration-200';
  const labelClass = 'block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1';
  const errorClass = 'text-red-500 text-xs mt-2 ml-1 animate-pulse';

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-black text-dark mb-3 tracking-tight">Checkout</h1>
        <p className="text-gray-400 font-medium">
          {isGuest ? (
            <>Ordering as <span className="text-primary font-bold italic underline decoration-primary/30">Guest</span> · <Link to="/login" className="text-dark hover:text-primary transition-colors">Sign in</Link></>
          ) : (
            <>Logged in as <span className="text-primary font-bold">{user.name}</span></>
          )}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main Info Section */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-dark">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              Shipping Details
            </h2>
            
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className={labelClass}>
                  <User className="w-3 h-3 inline mr-1 mb-0.5" /> Full Name
                </label>
                <input 
                  {...register('name')} 
                  className={`${inputClass} ${errors.name ? 'border-red-300 bg-red-50/10' : ''}`} 
                  placeholder="Enter your name" 
                />
                {errors.name && <p className={errorClass}>{errors.name.message}</p>}
              </div>

              {/* Saved Address Selection */}
              {!isGuest && user?.address?.street && (
                <div className="p-1 bg-gray-50 rounded-2xl flex gap-1">
                  <button
                    type="button"
                    onClick={() => setUseSavedAddress(true)}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all ${useSavedAddress ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    Saved Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseSavedAddress(false)}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all ${!useSavedAddress ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    New Address
                  </button>
                </div>
              )}

              {/* Address Display/Input */}
              {useSavedAddress && user?.address?.street ? (
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-2xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Delivery Destination</span>
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-dark leading-relaxed">
                    {user.address.street}<br />
                    {user.address.city}, {user.address.state} {user.address.zipCode}<br />
                    <span className="text-gray-400">{user.address.country}</span>
                  </p>
                </div>
              ) : (
                <div>
                  <label className={labelClass}>
                    <MapPin className="w-3 h-3 inline mr-1 mb-0.5" /> Full Address
                  </label>
                  <textarea
                    {...register('address')}
                    className={`${inputClass} min-h-[120px] resize-none ${errors.address ? 'border-red-300 bg-red-50/10' : ''}`}
                    placeholder="House #, Road #, Area, City..."
                  />
                  {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                </div>
              )}

              {/* Phone */}
              <div>
                <label className={labelClass}>
                  <Phone className="w-3 h-3 inline mr-1 mb-0.5" /> Phone Number
                </label>
                <input 
                  {...register('phone')} 
                  className={`${inputClass} ${errors.phone ? 'border-red-300 bg-red-50/10' : ''}`} 
                  placeholder="017XXXXXXXX" 
                />
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-dark">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-orange-500" />
              </div>
              Payment Method
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Cash on Delivery', 'bKash', 'Nagad', 'Card'].map((item) => (
                <label 
                  key={item} 
                  className={`relative flex items-center p-5 border rounded-2xl cursor-pointer transition-all group ${watch('paymentMethod') === item ? 'bg-primary/5 border-primary shadow-sm' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  <input
                    type="radio"
                    value={item}
                    {...register('paymentMethod')}
                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300"
                  />
                  <span className={`ml-4 font-bold transition-colors text-sm ${watch('paymentMethod') === item ? 'text-primary' : 'text-dark group-hover:text-primary'}`}>{item}</span>
                </label>
              ))}
            </div>

            {/* Manual Payment Instructions */}
            {(selectedPaymentMethod === 'bKash' || selectedPaymentMethod === 'Nagad') && (
              <div className="mt-8 p-8 bg-gray-50 rounded-[2rem] border border-gray-200 space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedPaymentMethod === 'bKash' ? 'bg-pink-100 text-pink-600' : 'bg-orange-100 text-orange-600'}`}>
                     <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-dark uppercase tracking-tight">Manual {selectedPaymentMethod} Payment</h4>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Follow these steps to complete order</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex bg-white p-5 rounded-2xl border border-gray-100 items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Send Money to</p>
                      <p className="text-lg font-black text-dark tracking-tight">
                        {selectedPaymentMethod === 'bKash' ? (paymentSettings.bkash_number || 'Not Configured') : (paymentSettings.nagad_number || 'Not Configured')}
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase tracking-widest">Personal</div>
                  </div>

                  <div className="space-y-2">
                    <label className={labelClass}>Enter Transaction ID (TxID)</label>
                    <input
                      type="text"
                      placeholder="8X7Y6Z..."
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      className={`${inputClass} font-mono uppercase tracking-widest`}
                      required
                    />
                    <p className="text-[10px] text-gray-400 font-medium ml-1">Paste the transaction ID from your SMS confirmation.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-dark text-white p-10 rounded-[2.5rem] shadow-2xl sticky top-12 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full -mr-16 -mt-16 pointer-events-none" />
            
            <h2 className="text-2xl font-black mb-8 relative z-10">Order Summary</h2>
            
            <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
              {cart.map((item) => (
                <div key={`${item.id}-${JSON.stringify(item.selectedOptions || {})}`} className="flex justify-between items-center gap-4 group">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/5">
                    <img src={getImageUrl(item.images?.[0])} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-base group-hover:text-primary transition-colors">{item.name}</h4>
                    <div className="flex items-center gap-3 mt-1.5 opacity-40 text-[10px] font-black uppercase tracking-widest">
                       <span>{item.quantity} units</span>
                       {item.selectedOptions && Object.entries(item.selectedOptions).map(([k, v]) => (
                         <span key={k}>{k}: {v}</span>
                       ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">{(item.salePrice || item.price) * item.quantity}৳</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Section */}
            <div className="relative z-10 mb-8 p-6 bg-white/5 border border-white/10 rounded-3xl">
              <label className="block text-[10px] font-black uppercase text-white/40 tracking-[0.2em] mb-3 ml-1">Have a Coupon?</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="CODE123"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-white/10 border-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={couponLoading || !couponCode}
                  className="px-6 py-3 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                </button>
              </div>
              {couponError && <p className="text-red-400 text-[10px] mt-2 ml-1 font-bold italic">{couponError}</p>}
              {appliedCoupon && (
                <div className="mt-4 flex items-center justify-between bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <div>
                      <p className="text-xs font-black text-white">{appliedCoupon.code}</p>
                      <p className="text-[10px] text-green-400 font-bold uppercase tracking-tight">
                        {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% Off` : `${appliedCoupon.discountValue}৳ Off`}
                      </p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAppliedCoupon(null)}
                    className="text-[10px] font-black text-white/20 hover:text-red-400 transition-colors uppercase tracking-widest"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="border-t border-white/10 pt-8 space-y-4 relative z-10">
              <div className="flex justify-between text-sm font-bold opacity-40 uppercase tracking-widest">
                <span>Subtotal</span>
                <span>{subtotal}৳</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm font-bold text-green-400 uppercase tracking-widest">
                  <span>Discount</span>
                  <span>-{Math.round(discount)}৳</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold opacity-40 uppercase tracking-widest">
                <span>Delivery</span>
                <span>{shipping === 0 ? <span className="text-green-400">Free</span> : `${shipping}৳`}</span>
              </div>
              
              <div className="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-40 tracking-[0.2em] mb-1">Grand Total</p>
                  <span className="text-4xl font-black text-white">{total}৳</span>
                </div>
                <div className="text-right pb-1">
                  <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">{shipping === 0 ? 'Free Shipping' : 'Standard Rate'}</p>
                </div>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full mt-10 py-6 rounded-[1.5rem] font-black text-dark bg-white hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-3 text-lg shadow-[0_15px_30px_rgba(255,255,255,0.1)] group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>
                  {isGuest ? 'Finish as Guest' : 'Secure Checkout'} 
                  <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-[10px] text-center mt-8 opacity-30 font-bold uppercase tracking-widest">
              Secure 256-bit SSL Encrypted Payment
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
