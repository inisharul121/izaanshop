'use client';

import React from 'react';
import { Package, Eye, Truck, CheckCircle2, Clock, Search, Filter, Printer } from 'lucide-react';
import { format } from 'date-fns';

const OrderSection = ({ 
  orders, 
  onViewOrder, 
  onPrintInvoice,
  onDeliver, 
  filterStatus, 
  setFilterStatus 
}) => {
  const filteredOrders = orders.filter(o => 
    filterStatus === 'All' || o.status === filterStatus
  );

  const statuses = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${
                filterStatus === status 
                  ? 'bg-dark text-white shadow-lg shadow-dark/20' 
                  : 'bg-white text-gray-400 hover:text-dark border border-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-dark">#{String(order.id).padStart(6, '0')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-dark truncate max-w-[120px]">{order.user?.name || order.guestName || 'Guest'}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{order.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-gray-500 whitespace-nowrap">{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
                    <p className="text-[10px] text-gray-400">{format(new Date(order.createdAt), 'hh:mm a')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-dark">{(order.totalPrice || 0).toLocaleString()}৳</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase whitespace-nowrap">{order.paymentMethod || 'N/A'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                      order.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 md:gap-2">
                      <button 
                        onClick={() => onPrintInvoice(order)}
                        className="p-2 md:p-2 bg-white md:bg-transparent rounded-xl text-gray-400 hover:text-blue-500 transition-all shadow-sm md:shadow-none border border-gray-100 md:border-transparent hover:border-gray-100"
                        title="Print Invoice"
                      >
                        <Printer className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                      <button 
                        onClick={() => onViewOrder(order)}
                        className="p-2 md:p-2 bg-white md:bg-transparent rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm md:shadow-none border border-gray-100 md:border-transparent hover:border-gray-100"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="py-20 text-center text-gray-400 italic">No orders found for this status.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderSection;
