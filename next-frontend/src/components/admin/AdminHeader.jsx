'use client';

import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import Image from 'next/image';
import logo from '@/assets/logo.png';

const AdminHeader = ({ user }) => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search products, orders..."
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 px-4 pl-10 text-sm focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
          <Search className="absolute left-3.5 top-3 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-dark transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-100 mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-dark leading-none">{user?.name}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Super Admin</p>
          </div>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black uppercase">
            {user?.name?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
