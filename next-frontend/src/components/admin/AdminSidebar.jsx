'use client';
import Link from 'next/link';
import React from 'react';
import { 
  BarChart3, 
  ShoppingBag, 
  Users, 
  Package, 
  Settings, 
  LogOut, 
  Tag, 
  CreditCard, 
  PieChart, 
  FileText, 
  ShieldCheck,
  ImageIcon 
} from 'lucide-react';
import Image from 'next/image';
import logo from '@/assets/logo.png';

const AdminSidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'coupons', label: 'Coupons', icon: CreditCard },
    { id: 'users', label: 'Customers', icon: Users },
    { id: 'admin_approvals', label: 'Admin Approvals', icon: ShieldCheck },
    { id: 'banners', label: 'Banners', icon: ImageIcon },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'financial_report', label: 'Financials', icon: FileText },
    { id: 'product_report', label: 'Stock Reports', icon: FileText },
    { id: 'payment_settings', label: 'Payment Config', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-dark text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300">
      <div className="p-8 flex flex-col items-center">
        <Link href="/" className="relative group block">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-primary to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-dark border border-white/10 p-3 rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <Image 
              src={logo} 
              alt="IzaanShop Logo" 
              width={56} 
              height={56} 
              className="object-contain"
            />
          </div>
        </Link>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-6 opacity-80">Control Center</p>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all ${
              activeTab === item.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-400/10 rounded-2xl text-sm font-bold transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
