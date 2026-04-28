import React from 'react';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getImageUrl } from '@/utils/helpers';
import { getProductBySlug } from '@/lib/shopData';

// Cache product pages for 1 hour — products rarely change, this is safe and very fast.
// Revalidation happens in the background; visitors always get near-instant HTML.
export const revalidate = 3600;

/**
 * Server-side data fetching — calls Drizzle DIRECTLY.
 * Same reason as page.js: HTTP loopback is broken on cPanel/Passenger.
 */
async function getProduct(slug) {
  try {
    const product = await getProductBySlug(slug);
    return product;
  } catch (error) {
    console.error('❌ Error in getProduct:', error.message);
    return null;
  }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return { title: 'Product Not Found | Izaan Shop' };
  }
  
  const title = `${product.name} | Izaan Shop`;
  const plainDescription = product.description?.replace(/<[^>]*>/g, '') || '';
  const description = plainDescription.substring(0, 160) || `Buy ${product.name} at Izaan Shop.`;
  const image = getImageUrl(product.images?.main || product.images?.[0]);
  
  return {
    title,
    description,
    openGraph: { title, description, images: [image], type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) notFound();

  return <ProductDetailClient initialProduct={product} />;
}
