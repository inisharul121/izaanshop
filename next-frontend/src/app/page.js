import React, { Suspense } from 'react';
import ShopClient from '@/components/ShopClient';
import { getShopInitData } from '@/lib/shopData';

// Option A: Cache for 5 minutes, then regenerate in background
// Let Next.js handle cache automatically for cPanel
export const revalidate = 300; // 5 minutes

export const metadata = {
  title: 'Izaan Shop - Home',
  description: 'Fast loading educational shop',
};

/**
 * Server-side data fetching — calls Drizzle DIRECTLY.
 *
 * WHY: On cPanel/Passenger, Next.js SSR cannot make HTTP requests back to itself.
 * Passenger uses Unix sockets, so 127.0.0.1:5001 is always ECONNREFUSED.
 * Since this is a monolith, we skip HTTP entirely and query the DB directly.
 *
 * CACHING: unstable_cache in shopData.js caches results for 60s. The `revalidate = 60`
 * export above tells Next.js to serve cached HTML for 60s before re-running this server fn.
 */
async function getInitialData(searchParams) {
  try {
    const data = await getShopInitData({
      category:  searchParams.category  || '',
      sort:      searchParams.sort      || 'newest',
      minPrice:  searchParams.minPrice  || '',
      maxPrice:  searchParams.maxPrice  || '',
      keyword:   searchParams.keyword   || '',
    });

    return {
      ...data,
      query: {
        category:  searchParams.category  || '',
        sort:      searchParams.sort      || 'newest',
        minPrice:  searchParams.minPrice  || '',
        maxPrice:  searchParams.maxPrice  || '',
        keyword:   searchParams.keyword   || '',
      },
    };
  } catch (error) {
    console.error('SSR DB Error:', error);
    // Graceful fallback — page still renders, client-side fetch can hydrate
    return { products: [], categories: [], banners: [], storeMaxPrice: 5000 };
  }
}

const ShopPage = async ({ searchParams }) => {
  const params = await searchParams;
  const initialData = await getInitialData(params);

  return (
    <Suspense>
      <ShopClient initialData={initialData} />
    </Suspense>
  );
};

export default ShopPage;
