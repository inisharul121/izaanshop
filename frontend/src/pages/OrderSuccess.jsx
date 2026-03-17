import React from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Truck, Clock, MapPin, ChevronLeft, Phone } from 'lucide-react';
import api from '../utils/api';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  // orderId may come from route param or from navigation state (guest)
  const orderId = id || location.state?.orderId;
  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (error) {
        console.error('Order fetch failed', error);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
    else setLoading(false);
  }, [orderId]);

  if (loading) return <div className="p-20 text-center">Loading order details...</div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold text-dark mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 text-lg">Thank you for your purchase. Your order <span className="text-primary font-bold">#{String(orderId).slice(-6).padStart(6,'0')}</span> has been placed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" /> Order Items
            </h3>
            <div className="divide-y divide-gray-50">
              {order.orderItems.map((item, i) => (
                <div key={i} className="py-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.quantity} x {item.price}৳</p>
                  </div>
                  <span className="font-bold">{item.price * item.quantity}৳</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Delivery Details
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p className="font-extrabold text-dark text-lg mb-1">{order.user?.name || order.guestName}</p>
              <p className="text-gray-500 leading-relaxed font-medium">{order.street}</p>
              {order.city && order.city !== 'N/A' && <p className="text-gray-500 font-medium">{order.city}{order.zipCode ? `, ${order.zipCode}` : ''}</p>}
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-primary font-bold">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                   <Phone className="w-4 h-4" />
                </div>
                {order.phone || order.guestPhone || 'N/A'}
              </div>
            </div>
          </div>

          <div className="bg-dark text-white p-8 rounded-2xl shadow-lg">
            <h3 className="font-bold text-lg mb-6">Order Summary</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between opacity-70">
                <span>Payment Method</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between opacity-70">
                <span>Shipping</span>
                <span>{order.shippingPrice}৳</span>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between text-xl font-bold">
                <span>Total Amount</span>
                <span className="text-primary">{order.totalPrice}৳</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
