'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import api from '@/utils/api';
import Link from 'next/link';
import { Package, User as UserIcon, MapPin, ChevronRight, Clock, CheckCircle2, Save, Loader2, Phone, Globe, Home, ChevronUp, ChevronDown, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '@/utils/helpers';

const ProfilePage = () => {
  const [mounted, setMounted] = useState(false);
  const { user, setUser } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [profileData, setProfileData] = useState({ name: '', phone: '' });
  const [addressData, setAddressData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Bangladesh',
  });

  // Sync form state when user data changes
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        phone: user.phone || '',
      });
      setAddressData({
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || 'Bangladesh',
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, profileRes] = await Promise.all([
          api.get('/orders/myorders'),
          // Only fetch profile if address is missing
          (!user?.address?.street) ? api.get('/auth/profile') : Promise.resolve({ data: null })
        ]);
        
        setOrders(ordersRes.data);
        if (profileRes.data) {
          setUser({ ...user, ...profileRes.data });
        }
      } catch (error) {
        console.error('Failed to fetch profile data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]); // Only refetch when user ID changes (or initial load)

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await api.put('/auth/profile', {
        ...profileData,
        ...addressData
      });
      setUser({ ...user, ...data });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'profile', label: 'Profile Settings', icon: UserIcon },
    { id: 'addresses', label: 'Shipping Address', icon: MapPin },
  ];

  const getStatusSteps = (status) => {
    const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
    const currentIdx = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;
    return steps.map((s, i) => ({
      name: s,
      isDone: i <= currentIdx,
      isCurrent: i === currentIdx
    }));
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-32 text-center flex flex-col items-center gap-4 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-sm uppercase tracking-widest">Loading Your Profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 space-y-6">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 w-full py-4 bg-gray-900 text-white rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-gray-900/10 group"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-2xl flex items-center justify-center font-black text-3xl mb-4">
              {user?.name?.charAt(0)}
            </div>
            <h2 className="text-xl font-black text-dark">{user?.name}</h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Regular Customer</p>
          </div>
          
          <nav className="bg-white rounded-3xl border border-gray-100 p-3 shadow-sm space-y-1">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm transition-all ${activeTab === item.id ? 'bg-primary text-white font-black shadow-lg shadow-primary/20' : 'text-gray-500 hover:bg-gray-50 font-bold'}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-gray-400'}`} />
                  {item.label}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'translate-x-1' : 'opacity-30'}`} />
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full text-dark">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-gray-100 p-5 lg:p-10 shadow-sm"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-dark">
                  {navItems.find(i => i.id === activeTab)?.label}
                </h3>
                {message.text && (
                  <div className={`px-4 py-2 rounded-xl text-xs font-bold border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                    {message.text}
                  </div>
                )}
              </div>

              {activeTab === 'orders' && (
                <div className="space-y-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-50 rounded-2xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-100 rounded-3xl overflow-hidden shadow-sm transition-all hover:border-primary/20">
                          <div 
                            onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                            className="p-6 flex flex-wrap items-center justify-between gap-6 cursor-pointer bg-white group"
                          >
                            <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                                <Package className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-dark">Order #{String(order.id).padStart(6, '0')}</p>
                                <p className="text-xs font-bold text-gray-400">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-8">
                              <div className="hidden sm:block text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Price</p>
                                <p className="text-sm font-black text-dark">{order.totalPrice.toLocaleString()}৳</p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                  {order.status}
                                </span>
                                {expandedOrderId === order.id ? <ChevronUp className="w-5 h-5 text-gray-300" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
                              </div>
                            </div>
                          </div>

                          <AnimatePresence>
                            {expandedOrderId === order.id && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-gray-50 bg-gray-50/30 overflow-hidden"
                              >
                                <div className="p-8 space-y-10">
                                  <div className="relative pt-4 md:pt-8 px-4">
                                     <div className="hidden md:block absolute top-1/2 left-4 right-4 h-0.5 bg-gray-200 -translate-y-1/2" />
                                     <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-0">
                                        {getStatusSteps(order.status).map((step, i) => (
                                          <div key={i} className="flex md:flex-col items-center gap-4 md:gap-3 bg-white md:bg-transparent px-2 z-10 transition-all">
                                             <div className={`w-8 h-8 md:w-6 md:h-6 rounded-full border-4 flex items-center justify-center transition-all ${step.isDone ? 'bg-primary border-primary/20 text-white' : 'bg-white border-gray-100 text-gray-200'}`}>
                                                {step.isDone && <CheckCircle2 className="w-3 h-3 md:w-3 md:h-3" />}
                                             </div>
                                             <span className={`text-[10px] font-black uppercase tracking-widest ${step.isCurrent ? 'text-primary font-bold' : step.isDone ? 'text-dark' : 'text-gray-300'}`}>
                                               {step.name}
                                             </span>
                                          </div>
                                        ))}
                                     </div>
                                  </div>

                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
                              <div className="space-y-4">
                                       <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items Ordered</h4>
                                       <div className="space-y-3">
                                         {order.orderItems?.map((item, i) => (
                                           <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                              <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center p-1 relative">
                                                 <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-contain" />
                                              </div>
                                              <div className="flex-1">
                                                <p className="text-sm font-bold text-dark">{item.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">{item.quantity} x {item.price}৳</p>
                                              </div>
                                              <p className="text-sm font-black text-dark">{(item.quantity * item.price).toLocaleString()}৳</p>
                                           </div>
                                         ))}
                                       </div>
                                    </div>

                                    <div className="space-y-8">
                                       <div className="grid grid-cols-2 gap-6">
                                          <div className="space-y-2">
                                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <MapPin className="w-3 h-3" /> Shipping Address
                                             </h4>
                                             <div className="text-sm font-bold text-dark leading-relaxed">
                                               {order.street}, {order.city}<br />
                                               {order.state} {order.zipCode}, {order.country}
                                             </div>
                                          </div>
                                          <div className="space-y-2">
                                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                <CreditCard className="w-3 h-3" /> Payment Method
                                             </h4>
                                             <p className="text-sm font-bold text-dark">{order.paymentMethod}</p>
                                             <p className={`text-[10px] font-black uppercase ${order.isPaid ? 'text-green-500' : 'text-red-500'}`}>
                                               {order.isPaid ? 'Payment Successful' : 'Payment Pending'}
                                             </p>
                                          </div>
                                       </div>
                                       <div className="pt-6 border-t border-gray-100 space-y-3">
                                          <div className="flex justify-between text-xs font-bold text-gray-400">
                                             <span>Subtotal</span>
                                             <span>{order.itemsPrice.toLocaleString()}৳</span>
                                          </div>
                                          <div className="flex justify-between text-xs font-bold text-gray-400">
                                             <span>Shipping</span>
                                             <span>{order.shippingPrice.toLocaleString()}৳</span>
                                          </div>
                                          <div className="flex justify-between text-base font-black text-dark pt-2">
                                             <span>Total</span>
                                             <span>{order.totalPrice.toLocaleString()}৳</span>
                                          </div>
                                       </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Package className="w-8 h-8 text-gray-200" />
                      </div>
                      <p className="text-gray-400 font-bold">You haven't placed any orders yet.</p>
                    </div>
                  )}
                </div>
              )}

              {(activeTab === 'profile' || activeTab === 'addresses') && (
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  {activeTab === 'profile' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <UserIcon className="w-3 h-3" /> Full Name
                        </label>
                        <input
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          required
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none"
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Phone className="w-3 h-3" /> Phone Number
                        </label>
                        <input
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none"
                          placeholder="+880 1XXX-XXXXXX"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                        <input
                          value={user?.email || ''}
                          disabled
                          className="w-full bg-gray-100 border-2 border-transparent rounded-2xl p-4 text-sm font-bold text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-gray-400 font-bold ml-1 italic">Email cannot be changed.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Home className="w-3 h-3" /> Street Address
                        </label>
                        <input
                          value={addressData.street}
                          onChange={(e) => setAddressData({ ...addressData, street: e.target.value })}
                          required
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none"
                          placeholder="123 Shopping Lane"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                          <input
                            value={addressData.city}
                            onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                            required
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none"
                            placeholder="Dhaka"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">State / Region</label>
                          <input
                            value={addressData.state}
                            onChange={(e) => setAddressData({ ...addressData, state: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none"
                            placeholder="Dhaka Division"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                          <input
                            value={addressData.zipCode}
                            onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none"
                            placeholder="1212"
                          />
                        </div>
                      </div>
                      <div className="space-y-2 relative">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Globe className="w-3 h-3" /> Country
                        </label>
                        <select
                          value={addressData.country}
                          onChange={(e) => setAddressData({ ...addressData, country: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white rounded-2xl p-4 text-sm font-bold transition-all outline-none appearance-none"
                        >
                          <option value="Bangladesh">Bangladesh</option>
                          <option value="USA">USA</option>
                          <option value="UK">UK</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full md:w-auto px-10 py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Profile
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
