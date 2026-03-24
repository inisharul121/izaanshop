'use client';

import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardOverview from '@/components/admin/DashboardOverview';
import ProductSection from '@/components/admin/ProductSection';
import OrderSection from '@/components/admin/OrderSection';
import { CategorySection, CouponSection } from '@/components/admin/OtherManagement';
import { AnalyticsCharts, FinancialReport, ProductReport } from '@/components/admin/AnalyticsReports';
import { UserSection, AdminApprovalsSection } from '@/components/admin/UserManagement';
import { OrderModal, ProductModal, CategoryModal, CouponModal } from '@/components/admin/Modals';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { Loader2, RefreshCw, ShieldCheck } from 'lucide-react';
import api, { getImageUrl } from '@/utils/api';

const AdminDashboard = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    products,
    categories,
    orders,
    coupons,
    analytics,
    settings,
    setSettings,
    pendingAdmins,
    users,
    loading,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    editingItem,
    setEditingItem,
    showOrderModal,
    setShowOrderModal,
    selectedOrder,
    setSelectedOrder,
    handleLogout,
    handleDelete,
    handleDeliver,
    handleApproveAdmin,
    fetchData
  } = useAdminDashboard();

  // Local state for complex modals
  const [productType, setProductType] = useState('SIMPLE');
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [slug, setSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (type === 'product') {
      setProductType(item?.type || 'SIMPLE');
      setAttributes(item?.attributes || []);
      setVariants(item?.variants || []);
      setSlug(item?.slug || '');
    } else if (type === 'category') {
      setSlug(item?.slug || '');
    }
    setShowModal(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      let endpoint = `/${modalType}s`;
      if (editingItem?.id) endpoint += `/${editingItem.id}`;

      if (modalType === 'product') {
        data.type = productType;
        data.attributes = JSON.stringify(attributes);
        data.variants = JSON.stringify(variants);
        data.slug = slug;
      } else if (modalType === 'category') {
        data.slug = slug;
      }

      const method = editingItem?.id ? 'put' : 'post';
      await api[method](endpoint, data);
      
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Failed to save item. Check console for details.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.put('/settings', settings);
      alert('Settings saved successfully!');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-bold text-sm uppercase tracking-widest">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <div className="flex-1 ml-64 min-h-screen flex flex-col">
        <AdminHeader user={user} />
        
        <main className="p-8 flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-dark capitalize">{activeTab.replace('_', ' ')}</h1>
            <p className="text-gray-400 font-medium mt-1">Manage your shop operations and analytics.</p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'dashboard' && <DashboardOverview analytics={analytics} />}
            
            {activeTab === 'products' && (
              <ProductSection 
                products={products} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm} 
                onAdd={() => handleOpenModal('product')}
                onEdit={(item) => handleOpenModal('product', item)}
                onDelete={(id) => handleDelete('product', id)}
                getImageUrl={getImageUrl}
              />
            )}

            {activeTab === 'categories' && (
              <CategorySection 
                categories={categories} 
                onAdd={() => handleOpenModal('category')}
                onEdit={(item) => handleOpenModal('category', item)}
                onDelete={(id) => handleDelete('category', id)}
              />
            )}

            {activeTab === 'orders' && (
              <OrderSection 
                orders={orders} 
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                onViewOrder={(o) => { setSelectedOrder(o); setShowOrderModal(true); }}
                onDeliver={handleDeliver}
              />
            )}

            {activeTab === 'coupons' && (
              <CouponSection 
                coupons={coupons}
                onAdd={() => handleOpenModal('coupon')}
                onEdit={(item) => handleOpenModal('coupon', item)}
                onDelete={(id) => handleDelete('coupon', id)}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsCharts analytics={analytics} />}

            {activeTab === 'financial_report' && <FinancialReport analytics={analytics} orders={orders} />}

            {activeTab === 'product_report' && (
              <ProductReport 
                analytics={analytics} 
                onEditProduct={(p) => handleOpenModal('product', p)} 
              />
            )}

            {activeTab === 'payment_settings' && (
              <div className="max-w-2xl bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <p className="text-gray-400 mb-8 text-sm font-medium">Configure mobile numbers for manual payments.</p>
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">bKash Number</label>
                      <input 
                        type="text" 
                        value={settings.bkash_number} 
                        onChange={(e) => setSettings({ ...settings, bkash_number: e.target.value })}
                        className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nagad Number</label>
                       <input 
                         type="text" 
                         value={settings.nagad_number} 
                         onChange={(e) => setSettings({ ...settings, nagad_number: e.target.value })}
                         className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                       />
                    </div>
                  </div>
                  <button type="submit" disabled={savingSettings} className="btn-primary flex items-center gap-3 px-8 py-4 shadow-xl shadow-primary/20">
                    {savingSettings ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    Save Payment Configuration
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'users' && <UserSection users={users} />}
            
            {activeTab === 'admin_approvals' && (
              <AdminApprovalsSection 
                pendingAdmins={pendingAdmins} 
                onApprove={handleApproveAdmin} 
              />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <OrderModal 
        order={selectedOrder} 
        isOpen={showOrderModal} 
        onClose={() => setShowOrderModal(false)} 
        onDeliver={handleDeliver} 
      />

      <ProductModal 
        isOpen={showModal && modalType === 'product'}
        onClose={() => setShowModal(false)}
        editingItem={editingItem}
        categories={categories}
        onSave={handleSaveItem}
        uploading={uploading}
        productType={productType}
        setProductType={setProductType}
        attributes={attributes}
        setAttributes={setAttributes}
        variants={variants}
        setVariants={setVariants}
        slug={slug}
        setSlug={setSlug}
      />

      <CategoryModal 
        isOpen={showModal && modalType === 'category'}
        onClose={() => setShowModal(false)}
        editingItem={editingItem}
        slug={slug}
        setSlug={setSlug}
        onSave={handleSaveItem}
        uploading={uploading}
      />

      <CouponModal 
        isOpen={showModal && modalType === 'coupon'}
        onClose={() => setShowModal(false)}
        editingItem={editingItem}
        onSave={handleSaveItem}
        uploading={uploading}
      />
    </div>
  );
};

export default AdminDashboard;
