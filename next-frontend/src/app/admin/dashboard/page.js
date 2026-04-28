'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import { useStore } from '@/store/useStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';

const AdminDashboard = () => {
  const { user, _hasHydrated, logout } = useStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize tab from URL only after hydration
  const [activeTab, setActiveTabState] = useState('dashboard');

  // Check auth and hydration
  useEffect(() => {
    if (!_hasHydrated) return;
    
    if (!user || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    
    // Mark as mounted to trigger tab sync from URL
    setMounted(true);
    setIsReady(true);
  }, [user, _hasHydrated, router]);

  // Sync with URL after hydration is complete (ONLY ONCE)
  useEffect(() => {
    if (!mounted) return;
    
    const tabFromUrl = searchParams.get('tab') || 'dashboard';
    console.log(`🔗 Initializing tab from URL: ${tabFromUrl}`);
    setActiveTabState(tabFromUrl);
  }, [mounted]); // Only run when mounted changes to true

  const setActiveTab = (tab) => {
    console.log(`🖱️ User clicked tab: ${tab}`);
    setActiveTabState(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  // Show loading while checking auth
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-sm uppercase tracking-widest">Verifying Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Shell (no data needed) */}
      <div className="print:hidden">
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false);
          }} 
          onLogout={handleLogout} 
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col print:ml-0 print:bg-white w-full">
        {/* Header Shell (no data needed) */}
        <div className="print:hidden">
          <AdminHeader user={user} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
        
        {/* Content - Loaded on-demand per tab */}
        <main className="p-8 flex-1 print:p-0">
          <AdminDashboardClient 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
          />
        </main>
      </div>
    </div>
  );
};

import { Suspense } from 'react';

const AdminDashboardWrapper = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-sm uppercase tracking-widest">Initialising Admin Dashboard...</p>
      </div>
    }>
      <AdminDashboard />
    </Suspense>
  );
};

export default AdminDashboardWrapper;
