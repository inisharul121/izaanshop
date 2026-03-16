import React from 'react';
import { useStore } from '../store/useStore';
import api from '../utils/api';
import { Package, User as UserIcon, MapPin, ChevronRight, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useStore();
  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xl">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-dark">{user?.name}</p>
              <p className="text-xs text-gray-400">Regular Customer</p>
            </div>
          </div>
          
          <nav className="space-y-2">
            {[
              { label: 'My Orders', icon: Package, active: true },
              { label: 'Profile Settings', icon: UserIcon },
              { label: 'My Addresses', icon: MapPin },
            ].map((item, i) => (
              <button key={i} className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${item.active ? 'bg-primary/5 text-primary font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
            
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-4 font-medium">Order ID</th>
                      <th className="pb-4 font-medium">Date</th>
                      <th className="pb-4 font-medium">Total</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="text-sm">
                        <td className="py-4 font-bold text-dark">#{order._id.slice(-6)}</td>
                        <td className="py-4 text-gray-500">{order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}</td>
                        <td className="py-4 font-bold">{order.totalPrice}৳</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${order.isDelivered ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                            {order.isDelivered ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
