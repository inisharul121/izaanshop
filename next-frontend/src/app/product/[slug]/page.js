import React from 'react';
import { notFound } from 'next/navigation';
import ProductDetailClient from '@/components/ProductDetailClient';
import { getImageUrl } from '@/utils/helpers';

// Server-side data fetching
async function getProduct(slug) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001/api' : '');
  
  try {
    const res = await fetch(`${baseUrl}/products/${slug}`, {
      next: { revalidate: 60 } // Revalidate every minute
    });
    
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch product');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    return {
      title: 'Product Not Found | Izaan Shop',
    };
  }
  
  const title = `${product.name} | Izaan Shop`;
  const description = product.description?.substring(0, 160) || `Buy ${product.name} at Izaan Shop.`;
  const image = getImageUrl(product.images?.main || product.images?.[0]);
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailClient initialProduct={product} />;
}
