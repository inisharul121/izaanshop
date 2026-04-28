'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import api, { getImageUrl } from '@/utils/api';

// Import all dashboard sections
import DashboardOverview from './DashboardOverview';
import ProductSection from './ProductSection';
import OrderSection from './OrderSection';
import { CategorySection, CouponSection } from './OtherManagement';
import { AnalyticsCharts, FinancialReport, ProductReport } from './AnalyticsReports';
import MediaSection from './MediaSection';
import BannerSection from './BannerSection';
import { UserSection, AdminApprovalsSection } from './UserManagement';
import ShippingSection from './ShippingSection';
import { OrderModal, ProductModal, CategoryModal, CouponModal, InvoiceModal } from './Modals';

/**
 * ✨ ULTRA-SIMPLE DASHBOARD ARCHITECTURE ✨
 * 
 * 3 Simple Rules:
 * 1. Load categories ONCE on mount (all modals use this)
 * 2. Load analytics ONCE on mount (dashboard uses this)
 * 3. Load current tab data when tab changes (simple!)
 * 
 * THAT'S IT! No complex hooks, no async timing issues, no 3-layer rendering
 */

const AdminDashboardClient = ({ activeTab, setActiveTab, user }) => {
  // ===== STATE =====
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); // Loaded once on mount
  const [analytics, setAnalytics] = useState(null); // Loaded once on mount
  const [tabData, setTabData] = useState([]);       // Changes with tab
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('product');
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Other state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Product form state
  const [productType, setProductType] = useState('SIMPLE');
  const [attributes, setAttributes] = useState([]);
  const [variants, setVariants] = useState([]);
  const [slug, setSlug] = useState('');

  // ✨ LOAD CATEGORIES ONCE ON MOUNT ✨
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories');
        setCategories(data || []);
        console.log('✅ Categories loaded:', data?.length || 0);
      } catch (err) {
        console.error('❌ Failed to load categories:', err.message);
      }
    };
    fetchCategories();
  }, []); // Only once on mount!

  // ✨ LOAD ANALYTICS ONCE ON MOUNT ✨
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/analytics/admin/kpis');
        setAnalytics(data);
        console.log('✅ Analytics loaded');
      } catch (err) {
        console.error('❌ Failed to load analytics:', err.message);
      }
    };
    fetchAnalytics();
  }, []); // Only once on mount!

  // ✨ LOAD TAB DATA WHEN TAB CHANGES ✨
  useEffect(() => {
    if (activeTab === 'dashboard') return; // Dashboard uses analytics

    const loadTabData = async () => {
      setLoading(true);
      try {
        let endpoint = '';
        
        if (activeTab === 'products') {
          endpoint = '/products?pageSize=50&pageNumber=1';
        } else if (activeTab === 'categories') {
          endpoint = '/categories';
        } else if (activeTab === 'orders') {
          endpoint = '/orders?pageSize=30&pageNumber=1';
        } else if (activeTab === 'coupons') {
          endpoint = '/coupons';
        } else if (activeTab === 'banners') {
          endpoint = '/banners';
        } else if (activeTab === 'shipping') {
          endpoint = '/shipping';
        } else if (activeTab === 'users') {
          endpoint = '/auth/users?pageSize=25&pageNumber=1';
        } else if (activeTab === 'admin_approvals') {
          endpoint = '/auth/admin/pending';
        } else if (activeTab === 'analytics') {
          endpoint = '/analytics/admin/kpis';
        }

        if (endpoint) {
          const response = await api.get(endpoint);
          const data = response.data?.products || response.data?.orders || response.data || [];
          setTabData(Array.isArray(data) ? data : []);
          console.log(`✅ ${activeTab} loaded`);
        }
      } catch (err) {
        console.error(`❌ Failed to load ${activeTab}:`, err.message);
        setTabData([]);
      } finally {
        setLoading(false);
      }
    };

    loadTabData();
  }, [activeTab]); // When tab changes

  // ✨ HANDLERS ✨
  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    // Pre-fill form
    if (type === 'product' && item) {
      setProductType(item.type || 'SIMPLE');
      setAttributes(item.attributes || []);
      setVariants(item.variants || []);
      setSlug(item.slug || '');
    } else if (type === 'category' && item) {
      setSlug(item.slug || '');
    } else {
      setProductType('SIMPLE');
      setAttributes([]);
      setVariants([]);
      setSlug('');
    }
    
    setShowModal(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      if (modalType === 'product') {
        data.type = productType;
        data.attributes = attributes;
        data.variants = variants;
        data.slug = slug;
        data.mainImage = data.mainImage || '';
        data.gallery = data.gallery ? JSON.parse(data.gallery) : [];
      } else if (modalType === 'category') {
        data.slug = slug;
      }

      const endpoint = editingItem?.id
        ? `/${modalType === 'category' ? 'categories' : modalType + 's'}/${editingItem.id}`
        : `/${modalType === 'category' ? 'categories' : modalType + 's'}`;

      const method = editingItem?.id ? 'put' : 'post';
      await api[method](endpoint, data);

      console.log(`✅ ${modalType} ${editingItem ? 'updated' : 'created'}`);
      setShowModal(false);
      setTabData([...tabData]); // Refresh
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Delete this ${type}?`)) return;

    try {
      const endpoint = `/${type === 'category' ? 'categories' : type + 's'}/${id}`;
      await api.delete(endpoint);
      setTabData(tabData.filter(item => item.id !== id));
      console.log(`✅ ${type} deleted`);
    } catch (err) {
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}`, { status: 'Delivered' });
      const updated = tabData.map(o => o.id === orderId ? { ...o, status: 'Delivered' } : o);
      setTabData(updated);
    } catch (err) {
      alert('Failed to update order');
    }
  };

  const handleApproveAdmin = async (adminId) => {
    try {
      await api.post(`/auth/admin/${adminId}/approve`);
      const updated = tabData.filter(a => a.id !== adminId);
      setTabData(updated);
    } catch (err) {
      alert('Failed to approve admin');
    }
  };

  // ===== RENDER =====
  return (
    <div>
      {loading && activeTab !== 'dashboard' && (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Loading...
        </div>
      )}

      {!loading && (
        <>
          {activeTab === 'dashboard' && <DashboardOverview analytics={analytics} />}
          
          {activeTab === 'products' && (
            <ProductSection
              products={tabData}
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
              categories={tabData}
              onAdd={() => handleOpenModal('category')}
              onEdit={(item) => handleOpenModal('category', item)}
              onDelete={(id) => handleDelete('category', id)}
            />
          )}

          {activeTab === 'orders' && (
            <OrderSection
              orders={tabData}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              onViewOrder={(order) => {
                setSelectedOrder(order);
                setShowOrderModal(true);
              }}
              onPrintInvoice={(order) => {
                setSelectedOrder(order);
                setShowInvoiceModal(true);
              }}
              onDeliver={handleMarkDelivered}
            />
          )}

          {activeTab === 'coupons' && (
            <CouponSection
              coupons={tabData}
              onAdd={() => handleOpenModal('coupon')}
              onEdit={(item) => handleOpenModal('coupon', item)}
              onDelete={(id) => handleDelete('coupon', id)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsCharts analytics={analytics} />}
          {activeTab === 'financial_report' && <FinancialReport analytics={analytics} orders={tabData} />}
          {activeTab === 'product_report' && <ProductReport orders={tabData} analytics={analytics} />}
          
          {activeTab === 'banners' && <BannerSection />}
          {activeTab === 'shipping' && <ShippingSection />}
          {activeTab === 'media' && <MediaSection />}
          {activeTab === 'users' && <UserSection users={tabData} />}
          {activeTab === 'admin_approvals' && (
            <AdminApprovalsSection
              pendingAdmins={tabData}
              onApprove={handleApproveAdmin}
            />
          )}
        </>
      )}

      {/* MODALS - ProductModal always gets categories */}
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
        onSave={handleSaveItem}
        slug={slug}
        setSlug={setSlug}
      />

      <CouponModal
        isOpen={showModal && modalType === 'coupon'}
        onClose={() => setShowModal(false)}
        editingItem={editingItem}
        onSave={handleSaveItem}
      />

      <OrderModal
        isOpen={showOrderModal}
        onClose={() => setShowOrderModal(false)}
        order={selectedOrder}
        onDeliver={handleMarkDelivered}
      />

      <InvoiceModal
        order={selectedOrder}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
};

export default AdminDashboardClient;
