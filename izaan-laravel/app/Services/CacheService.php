<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Manages cache invalidation for shop operations
 * Use this to clear caches when products/categories/banners change
 */
class CacheService
{
    // Cache key definitions
    const CACHE_BANNERS = 'shop_banners';
    const CACHE_CATEGORIES = 'shop_categories';
    const CACHE_STORE_MAX_PRICE = 'shop_store_max_price';
    const CACHE_PRODUCTS_PREFIX = 'shop_products_';
    
    // Cache TTL (in seconds)
    const TTL_STATIC = 86400;      // 24 hours for categories, banners
    const TTL_DYNAMIC = 3600;      // 1 hour for products, prices
    const TTL_TEMP = 300;          // 5 minutes for temporary data

    /**
     * Invalidate product-related caches
     * Call this when a product is created/updated/deleted
     */
    public static function invalidateProducts()
    {
        // Clear all product pagination caches
        foreach (range(1, 100) as $page) {
            Cache::forget(self::CACHE_PRODUCTS_PREFIX . $page);
        }
        
        // Clear price range cache
        Cache::forget(self::CACHE_STORE_MAX_PRICE);
        
        // Log this for debugging
        \Log::info('Product cache invalidated');
    }

    /**
     * Invalidate category-related caches
     * Call this when a category is created/updated/deleted
     */
    public static function invalidateCategories()
    {
        Cache::forget(self::CACHE_CATEGORIES);
        self::invalidateProducts(); // Also clear product cache
        
        \Log::info('Category cache invalidated');
    }

    /**
     * Invalidate banner-related caches
     * Call this when a banner is created/updated/deleted
     */
    public static function invalidateBanners()
    {
        Cache::forget(self::CACHE_BANNERS);
        
        \Log::info('Banner cache invalidated');
    }

    /**
     * Invalidate all caches (use sparingly)
     */
    public static function invalidateAll()
    {
        Cache::flush();
        \Log::info('All caches flushed');
    }

    /**
     * Remember helper with standard TTL
     * Usage: CacheService::remember('key', fn() => Model::get());
     */
    public static function remember($key, $callback, $ttl = self::TTL_DYNAMIC)
    {
        return Cache::remember($key, $ttl, $callback);
    }

    /**
     * Check cache hit rate (for monitoring)
     * Returns percentage of requests served from cache
     */
    public static function getCacheStats()
    {
        return [
            'banners_cached' => Cache::has(self::CACHE_BANNERS),
            'categories_cached' => Cache::has(self::CACHE_CATEGORIES),
            'max_price_cached' => Cache::has(self::CACHE_STORE_MAX_PRICE),
        ];
    }
}
