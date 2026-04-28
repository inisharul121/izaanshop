'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import api from '@/utils/api';

/**
 * Hook for managing a single admin dashboard tab
 * Fetches data only when tab is active (on-demand loading)
 * Supports optimistic updates for CRUD operations
 */
export const useAdminTab = (tabName) => {
  const [data, setData] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef(false);

  // Reset fetch flag when tab changes
  useEffect(() => {
    console.log(`📋 Tab hook initialized for: ${tabName}`);
    fetchedRef.current = false; // Reset flag when tabName changes
  }, [tabName]);

  const fetchTabData = useCallback(async () => {
    if (fetchedRef.current) {
      console.log(`⏭️ Skipping fetch for ${tabName} (already fetched)`);
      return; // Prevent duplicate fetches
    }
    
    setLoading(true);
    try {
      // Validate tab name
      const validTabs = ['products', 'categories', 'orders', 'coupons', 'banners', 'shipping', 'users', 'admin_approvals', 'analytics', 'payment_settings', 'dashboard'];
      if (!validTabs.includes(tabName)) {
        console.warn(`⚠️ Invalid tab name: ${tabName}`);
        setLoading(false);
        return;
      }
      let response;
      
      switch (tabName) {
        case 'products':
          // PERF: Paginate products for faster loading (50 per page)
          response = await api.get('/products?pageSize=50&pageNumber=1');
          setData(response.data.products || response.data);
          console.log(`✅ Loaded ${(response.data.products || response.data)?.length || 0} products (paginated)`);
          break;
          
        case 'orders':
          // PERF: Paginate orders (30 per page - large responses)
          response = await api.get('/orders?pageSize=30&pageNumber=1');
          setData(response.data.orders || response.data);
          console.log(`✅ Loaded ${(response.data.orders || response.data)?.length || 0} orders (paginated)`);
          break;
          
        case 'users':
          // PERF: Paginate users (25 per page)
          response = await api.get('/auth/users?pageSize=25&pageNumber=1');
          setData(response.data);
          console.log(`✅ Loaded ${response.data?.length || 0} users (paginated)`);
          break;
          
        case 'admin_approvals':
          response = await api.get('/auth/admin/pending');
          setData(response.data);
          console.log(`✅ Loaded ${response.data?.length || 0} pending approvals`);
          break;
          
        case 'analytics':
          response = await api.get('/analytics/admin/kpis');
          setAnalytics(response.data);
          console.log(`✅ Loaded analytics data`);
          break;
          
        case 'payment_settings':
          response = await api.get('/settings');
          setSettings(response.data || { bkash_number: '', nagad_number: '' });
          console.log(`✅ Loaded settings`);
          break;
          
        default:
          break;
      }
      
      fetchedRef.current = true;
    } catch (err) {
      console.error(`❌ Failed to load ${tabName}:`, {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        url: err.config?.url
      });
      // Don't mark as fetched on error, allow retry
      fetchedRef.current = false;
    } finally {
      setLoading(false);
    }
  }, [tabName]);

  // Refetch data (used after CRUD operations)
  const refetch = useCallback(async () => {
    fetchedRef.current = false;
    await fetchTabData();
  }, [fetchTabData]);

  // Optimistic update for data array
  const optimisticUpdate = useCallback((updateFn) => {
    setData(prev => updateFn(prev));
  }, []);

  return {
    data,
    setData,
    analytics,
    settings,
    setSettings,
    loading,
    fetchTabData,
    refetch,
    optimisticUpdate
  };
};
