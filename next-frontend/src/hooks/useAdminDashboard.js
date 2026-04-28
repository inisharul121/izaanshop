'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import api from '@/utils/api';
import { useRouter, useSearchParams } from 'next/navigation';

export const useAdminDashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, _hasHydrated } = useStore();
  
  const currentTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTabState] = useState(currentTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    router.push(`?tab=${tab}`, { scroll: false });
  };

  // Sync state with URL if it changes (e.g. Back button)
  useEffect(() => {
    if (currentTab !== activeTab) {
      setActiveTabState(currentTab);
    }
  }, [currentTab, activeTab]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState({ bkash_number: '', nagad_number: '' });
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('product');
  const [editingItem, setEditingItem] = useState(null);
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [pRes, cRes, oRes, cpRes, sRes, aRes, paRes, uRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
        api.get('/orders'),
        api.get('/coupons'),
        api.get('/settings'),
        api.get('/analytics/admin/kpis'),
        api.get('/auth/admin/pending'),
        api.get('/auth/users')
      ]);
      setProducts(pRes.data.products || pRes.data);
      setCategories(cRes.data);
      setOrders(oRes.data.orders || oRes.data);
      setCoupons(cpRes.data);
      setSettings(sRes.data || { bkash_number: '', nagad_number: '' });
      setAnalytics(aRes.data);
      setPendingAdmins(paRes.data);
      setUsers(uRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!_hasHydrated) return; // Wait for hydration before checking auth

    if (!user || user.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    fetchData();
  }, [user, router, fetchData, _hasHydrated]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const endpoint = type === 'category' ? '/categories' : `/${type}s`;
      await api.delete(`${endpoint}/${id}`);
      fetchData();
    } catch (err) {
      const errorMessage = err.response?.data?.message || `Failed to delete ${type}`;
      alert(errorMessage);
    }
  };

  const handleDeliver = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      fetchData();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleApproveAdmin = async (id) => {
    try {
      await api.put(`/auth/admin/${id}/approve`);
      fetchData();
    } catch (err) {
      alert('Failed to approve admin');
    }
  };

  return {
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
  };
};
