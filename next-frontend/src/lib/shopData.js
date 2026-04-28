/**
 * shopData.js — Server-Side Direct Data Access
 *
 * WHY THIS EXISTS:
 * On cPanel/Passenger, Next.js SSR cannot make HTTP requests back to the same
 * server (ECONNREFUSED). Passenger runs via Unix socket, not a TCP port.
 *
 * SOLUTION: Since this is a monolith, we call Drizzle directly from SSR.
 */

import { db } from '@/db';
import { banners, categories, products, productAttributes, productVariants } from '@/db/schema';
import { eq, and, sql, desc, asc, like, gte, lte, inArray } from 'drizzle-orm';

// Server-side cache removed to ensure live data updates


// JSON safe date conversion (REQUIRED for Next.js RSC)
function makeJsonSafe(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(makeJsonSafe);
  if (obj instanceof Date) {
    // 🛡️ Guard against "Invalid Date" objects from MySQL (e.g. 0000-00-00)
    if (isNaN(obj.getTime())) {
      console.warn('⚠️ Invalid Date detected, returning null');
      return null;
    }
    return obj.toISOString();
  }
  if (typeof obj === 'object') {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      newObj[key] = makeJsonSafe(value);
    }
    return newObj;
  }
  return obj;
}

// Mirrors backend/utils/formatProduct.js (ESM version)
function formatProduct(product) {
  if (!product) return null;
  const p = { ...product };
  const defaultPlaceholder = '/placeholder.png';

  if (p.images) {
    try {
      p.images = typeof p.images === 'object' ? p.images : JSON.parse(p.images);
      if (!p.images.main || p.images.main === '' || p.images.main === '/placeholder.png') {
        p.images.main = defaultPlaceholder;
      }
      if (!Array.isArray(p.images.gallery)) p.images.gallery = [];
    } catch (e) {
      p.images = { main: defaultPlaceholder, gallery: [] };
    }
  } else {
    p.images = { main: defaultPlaceholder, gallery: [] };
  }
  
  // Ensure we provide a consistent rating structure even if table has flat 'rating'
  if (p.rating !== undefined) {
    p.ratings = { average: Number(p.rating || 0), count: Number(p.numReviews || 0) };
  }

  // Handle attributes and variants parsing (Critical for VARIABLE products)
  if (p.attributes) {
    p.attributes = p.attributes.map(attr => ({
      ...attr,
      options: typeof attr.options === 'string' ? JSON.parse(attr.options) : attr.options
    }));
  }
  if (p.variants) {
    p.variants = p.variants.map(variant => ({
      ...variant,
      options: typeof variant.options === 'string' ? JSON.parse(variant.options) : variant.options
    }));
  }

  return makeJsonSafe(p);
}

import { unstable_cache } from 'next/cache';

async function _fetchShopInitData({ category, sort, minPrice, maxPrice, keyword, pageSize = 12, page = 1 } = {}) {
  try {
    const filters = [eq(products.isDeleted, false)];
    
    if (keyword) filters.push(like(products.name, `%${keyword}%`));
    if (minPrice) filters.push(gte(products.price, Number(minPrice)));
    if (maxPrice) filters.push(lte(products.price, Number(maxPrice)));

    // Fetch meta data
    const metaPromises = [
      db.select({ count: sql`count(*)`, maxPrice: sql`max(${products.price})` }).from(products).where(and(...filters)),
      // 🚀 Don't cache banner base64 images either—load on client
      // This keeps cache under 2MB limit
      db.select({
        id: banners.id,
        title: banners.title,
        subtitle: banners.subtitle,
        // ❌ REMOVED: image: banners.image, // Heavy base64 removed
        link: banners.link
      }).from(banners).where(eq(banners.isActive, true)).orderBy(asc(banners.order)),
      db.select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        image: categories.image
      }).from(categories),
      db.select({ max: sql`max(${products.price})` }).from(products).where(eq(products.isDeleted, false))
    ];
    
    if (category) {
      metaPromises.push(
        db.select().from(categories).where(eq(categories.slug, category)).limit(1)
      );
    }

    const resolvedMeta = await Promise.all(metaPromises);
    const statsResult = resolvedMeta[0];
    const activeBanners = resolvedMeta[1];
    const allCategories = resolvedMeta[2];
    const storeMaxPrice = Number(resolvedMeta[3]?.[0]?.max || 5000);
    let foundCategory = null;

    if (category) {
      foundCategory = resolvedMeta[4]?.[0];
    }

    if (foundCategory) {
      filters.push(eq(products.categoryId, foundCategory.id));
    }

    const whereClause = and(...filters);

    let orderBy = [desc(products.createdAt)];
    switch (sort) {
      case 'price-low': orderBy = [asc(products.price)]; break;
      case 'price-high': orderBy = [desc(products.price)]; break;
      default: orderBy = [desc(products.createdAt)]; break;
    }

    // 🚀 CRITICAL CACHE FIX: Exclude heavy 'images' field (base64 longtext ~1MB per product)
    // cPanel Next.js has 2MB cache limit—including images causes cache failures (17.9MB response!)
    // Images load lazily on client-side via ShopClient component
    const rawProducts = await db.select({
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        salePrice: products.salePrice,
        // ❌ REMOVED: images: products.images, // Base64 images killed cache (17.9MB!)
        stock: products.stock,
        rating: products.rating,
        numReviews: products.numReviews,
        createdAt: products.createdAt,
        categoryId: products.categoryId
      },
      category: {
        name: categories.name,
        slug: categories.slug
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .limit(Number(pageSize))
    .offset(Number(pageSize) * (Number(page) - 1))
    .orderBy(...orderBy);

    const count = Number(statsResult[0]?.count || 0);

    const result = {
      banners: makeJsonSafe(activeBanners),
      categories: makeJsonSafe(allCategories),
      products: rawProducts.map(rp => formatProduct({ ...rp.product, category: rp.category })),
      pagination: {
        page: Number(page),
        pages: Math.ceil(count / Number(pageSize)),
        total: count,
      },
      maxPrice: Number(statsResult[0]?.maxPrice || 5000),
      storeMaxPrice: storeMaxPrice,
    };

    return result;
  } catch (error) {
    console.error('SSR getShopInitData Database Error:', error.message);
    return { 
      banners: [], categories: [], products: [], 
      pagination: { page: 1, pages: 1, total: 0 },
      maxPrice: 5000, storeMaxPrice: 5000 
    };
  }
}

/**
 * Fetch consolidated shop data (Targeted Speed Optimization via Next.js Data Cache)
 */
export const getShopInitData = async (params = {}) => {
  const { category, sort, minPrice, maxPrice, keyword, pageSize = 12, page = 1 } = params;
  
  // Create a predictable key generator so search combinations hit their respective disk stubs efficiently
  const cachedDataFetcher = unstable_cache(
    async () => _fetchShopInitData(params),
    ['shop-init-data', category || '', sort || '', minPrice || '', maxPrice || '', keyword || '', String(pageSize), String(page)],
    { revalidate: 60, tags: ['shop-init'] } // Revalidate dynamically every 60 seconds
  );

  return cachedDataFetcher();
};

/**
 * Fetch single product (Optimized for Detail View)
 */
export async function getProductBySlug(slug) {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const isNumeric = /^\d+$/.test(decodedSlug);
    const whereCondition = isNumeric ? eq(products.id, Number(decodedSlug)) : eq(products.slug, decodedSlug);

    const result = await db.select({
      product: products,
      category: categories
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isDeleted, false), whereCondition))
    .limit(1);

    if (result.length === 0) return null;

    const productId = result[0].product.id;
    const [attr, vars] = await Promise.all([
      db.select().from(productAttributes).where(eq(productAttributes.productId, productId)),
      db.select().from(productVariants).where(eq(productVariants.productId, productId))
    ]);

    const product = {
      ...result[0].product,
      category: result[0].category,
      attributes: attr,
      variants: vars
    };

    return formatProduct(product);
  } catch (error) {
    console.error('getProductBySlug error:', error);
    return null;
  }
}
