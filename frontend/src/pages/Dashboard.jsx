import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import api from '../utils/api';
import { Package, User as UserIcon, MapPin, ChevronRight, Clock, CheckCircle2, Save, Loader2, Phone, Globe, Home } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user, setUser } = useStore();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'profile', 'addresses'
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form states
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [addressData, setAddressData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'Bangladesh',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 space-y-6">
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
        <main className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-10 shadow-sm"
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
                    <div className="overflow-x-auto -mx-8 lg:-mx-10 px-8 lg:px-10">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-50">
                            <th className="pb-4 font-black">Order ID</th>
                            <th className="pb-4 font-black">Date</th>
                            <th className="pb-4 font-black">Total</th>
                            <th className="pb-4 font-black">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {orders.map((order) => (
                            <tr key={order.id || order._id} className="group">
                              <td className="py-6">
                                <span className="font-bold text-dark group-hover:text-primary transition-colors">#{String(order.id || order._id).slice(-6).toUpperCase()}</span>
                              </td>
                              <td className="py-6 text-gray-400 text-sm font-medium">
                                {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                              </td>
                              <td className="py-6 font-black text-dark">{order.totalPrice}৳</td>
                              <td className="py-6">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.isDelivered ? 'bg-green-100/50 text-green-700' : 'bg-orange-100/50 text-orange-700'}`}>
                                  {order.isDelivered ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                          value={user?.email}
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
                      <div className="space-y-2">
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
                      className="w-full md:w-auto px-10 py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-sm transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:bg-gray-200 disabled:shadow-none"
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

export default Dashboard;
