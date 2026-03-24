'use client';

import React from 'react';
import { CreditCard, ShoppingBag, Users, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const DashboardOverview = ({ analytics }) => {
  const kpis = [
    { label: 'Total Revenue', value: `${analytics?.kpis?.totalRevenue?.toLocaleString()}৳`, icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Total Orders', value: analytics?.kpis?.totalOrders, icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Total Customers', value: analytics?.kpis?.totalCustomers, icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Total Products', value: analytics?.kpis?.totalProducts, icon: Package, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <div key={i} className="p-6 bg-white border border-gray-100 rounded-3xl space-y-3 shadow-sm">
            <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center`}>
              <kpi.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-black text-dark">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart (SVG) */}
      <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <h4 className="font-bold text-lg">Revenue Trend (Last 30 Days)</h4>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-xs font-bold text-gray-400">Daily Revenue</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 w-full relative group">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {analytics?.revenueByDay?.length > 1 && (() => {
              const data = analytics.revenueByDay;
              const max = Math.max(...data.map(d => d.revenue)) || 1000;
              const points = data.map((d, i) => ({
                x: (i / (data.length - 1)) * 100,
                y: 100 - (d.revenue / max) * 100
              }));
              const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`).join(' ');
              const areaData = `${pathData} L 100% 100% L 0% 100% Z`;
              
              return (
                <>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={areaData} fill="url(#chartGradient)" className="transition-all duration-1000" />
                  <path d={pathData} fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {points.map((p, i) => (
                    <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r="4" className="fill-white stroke-[#f43f5e] stroke-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  ))}
                </>
              );
            })()}
          </svg>
        </div>
        <div className="flex justify-between mt-4">
          <span className="text-[10px] font-black text-gray-300 uppercase">{analytics?.revenueByDay?.[0]?.date}</span>
          <span className="text-[10px] font-black text-gray-300 uppercase">Today</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
