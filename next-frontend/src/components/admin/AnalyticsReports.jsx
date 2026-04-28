'use client';

import React from 'react';
import { ShoppingBag, Package, Tag, RefreshCw, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { getImageUrl } from '@/utils/api';

export const AnalyticsCharts = ({ analytics }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {/* Order Status Breakdown */}
    <div className="p-4 md:p-8 bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm">
      <h4 className="font-bold text-lg mb-6">Order Status Breakdown</h4>
      <div className="space-y-6">
        {[
          { label: 'Pending', count: analytics?.kpis?.pendingOrders, color: 'bg-orange-500', total: analytics?.kpis?.totalOrders },
          { label: 'Processing', count: analytics?.kpis?.processingOrders, color: 'bg-blue-500', total: analytics?.kpis?.totalOrders },
          { label: 'Shipped', count: analytics?.kpis?.shippedOrders, color: 'bg-purple-500', total: analytics?.kpis?.totalOrders },
          { label: 'Delivered', count: analytics?.kpis?.deliveredOrders, color: 'bg-green-500', total: analytics?.kpis?.totalOrders },
        ].map((stat, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between text-xs font-black uppercase tracking-widest">
              <span className="text-gray-400">{stat.label}</span>
              <span className="text-dark">{stat.count}</span>
            </div>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(stat.count / (stat.total || 1)) * 100}%` }}
                className={`h-full ${stat.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Payment Breakdown */}
    <div className="p-4 md:p-8 bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm">
      <h4 className="font-bold text-lg mb-6">Payment Methods</h4>
      <div className="space-y-4">
        {analytics?.paymentBreakdown?.map((pay, i) => (
          <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${pay.method === 'bKash' ? 'bg-pink-500' : pay.method === 'Nagad' ? 'bg-orange-500' : 'bg-blue-500'}`} />
              <span className="text-sm font-bold">{pay.method}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-dark">{(pay.revenue || 0).toLocaleString()}৳</p>
              <p className="text-[10px] font-bold text-gray-400">{pay.orders || 0} Orders</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const FinancialReport = ({ analytics, orders }) => {
  const exportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Product', 'Total', 'Payment', 'Status'];
    const rows = orders.map(o => [
      String(o.id).padStart(6, '0'),
      format(new Date(o.createdAt), 'dd MMM yyyy'),
      o.user?.name || o.guestName || 'Guest',
      o.orderItems?.[0]?.name || 'N/A',
      o.totalPrice,
      o.paymentMethod,
      o.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(',')).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `izaan_shop_financial_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h4 className="font-bold text-lg">Financial Summary</h4>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Monthly metrics & exports</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-xl text-xs font-bold hover:scale-[0.98] transition-all focus:ring-4 focus:ring-dark/10">
          <RefreshCw className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-4 md:p-8 bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <th className="pb-4 font-black">Month / Year</th>
                <th className="pb-4 font-black text-center">Orders</th>
                <th className="pb-4 font-black text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {analytics?.revenueByMonth?.map((m, i) => (
                <tr key={i}>
                  <td className="py-4 font-bold text-dark">{m.month} {m.year}</td>
                  <td className="py-4 text-center font-medium text-gray-500">{m.orders}</td>
                  <td className="py-4 text-right font-black text-dark">{(m.revenue || 0).toLocaleString()}৳</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 md:p-8 bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm space-y-6">
          <h4 className="font-bold text-base">Payment Share</h4>
          <div className="flex justify-center py-4">
             <div className="w-32 h-32 rounded-full border-8 border-primary/10 flex items-center justify-center">
                <p className="text-sm font-black text-dark">{(analytics?.kpis?.totalRevenue / 1000).toFixed(1)}K</p>
             </div>
          </div>
          <div className="space-y-3">
            {analytics?.paymentBreakdown?.map((pay, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-500">{pay.method}</span>
                <span className="font-black text-dark">{((pay.revenue / (analytics.kpis.totalRevenue || 1)) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductReport = ({ analytics, onEditProduct }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="p-4 md:p-8 bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm">
        <h4 className="font-bold text-base mb-6 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" /> Top Selling Products
        </h4>
        <div className="space-y-4">
          {analytics?.topProducts?.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-white transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-1">
                  <img src={getImageUrl(p.images?.main || '/placeholder.png')} alt={p.name} className="w-full h-full object-contain" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark line-clamp-1">{p.name}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">{p.unitsSold} Sold</p>
                </div>
              </div>
              <p className="text-sm font-black text-dark">{(p.revenue || 0).toLocaleString()}৳</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-8 bg-white border border-gray-100 rounded-2xl md:rounded-3xl shadow-sm">
        <h4 className="font-bold text-base mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-orange-500" /> Low Stock Alerts
        </h4>
        <div className="space-y-4">
          {analytics?.lowStockProducts?.map((p, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-orange-50/30 rounded-2xl border border-orange-100">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-bold text-dark">{p.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${p.stock <= 2 ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}`}>
                    {p.stock} Left
                  </span>
                </div>
              </div>
              <button onClick={() => onEditProduct(p)} className="p-2 hover:bg-orange-100 rounded-xl text-orange-600">
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
