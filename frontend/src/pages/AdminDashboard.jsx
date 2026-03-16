import React from 'react';
import api from '../utils/api';
import { LayoutDashboard, ShoppingBag, Users, BarChart3, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('orders');
  const [orders, setOrders] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderRes, prodRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products')
        ]);
        setOrders(orderRes.data);
        setProducts(prodRes.data.products);
      } catch (error) {
        console.error('Admin fetch error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleDeliver = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      setOrders(orders.map(o => o._id === id ? { ...o, isDelivered: true, status: 'Delivered' } : o));
    } catch (error) {
      alert('Action failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-2">
          <h2 className="text-xl font-bold mb-6 px-4">Admin Panel</h2>
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'orders', label: 'Manage Orders', icon: ShoppingBag },
            { id: 'products', label: 'Manage Products', icon: LayoutDashboard },
            { id: 'users', label: 'Shop Customers', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-bold capitalize">{activeTab.replace('-', ' ')}</h3>
            {activeTab === 'products' && (
              <button className="btn-primary flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl"></div>)}
            </div>
          ) : activeTab === 'orders' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4 font-bold">Customer</th>
                    <th className="pb-4 font-bold">Total</th>
                    <th className="pb-4 font-bold">Paid</th>
                    <th className="pb-4 font-bold">Delivered</th>
                    <th className="pb-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order._id} className="text-sm">
                      <td className="py-5">
                        <p className="font-bold text-dark">{order.user?.name || 'Guest'}</p>
                        <p className="text-[10px] text-gray-400">{order._id.slice(-6)}</p>
                      </td>
                      <td className="py-5 font-bold">{order.totalPrice}৳</td>
                      <td className="py-5 text-gray-400">
                        {order.isPaid ? (
                          <span className="text-green-500 flex items-center gap-1 font-bold text-xs"><Check className="w-3 h-3" /> YES</span>
                        ) : 'NO'}
                      </td>
                      <td className="py-5">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.isDelivered ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-5">
                        {!order.isDelivered && (
                          <button onClick={() => handleDeliver(order._id)} className="text-primary hover:underline text-xs font-bold">Mark Delivered</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'products' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product._id} className="p-4 border border-gray-100 rounded-2xl flex items-center gap-4">
                  <img src={product.images[0]} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-bold text-sm line-clamp-1">{product.name}</p>
                    <p className="text-xs text-primary font-bold">{product.price}৳</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-primary"><Edit className="w-4 h-4" /></button>
                    <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center opacity-30">
               <BarChart3 className="w-20 h-20 mx-auto mb-4" />
               <p>Detailed analytics module is coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
