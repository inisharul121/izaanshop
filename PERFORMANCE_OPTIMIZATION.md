# ⚡ Izaan Shop - cPanel Performance Optimization Guide

**Last Updated:** April 28, 2026 | **Status:** Production-Ready

This guide contains critical performance optimizations for your Laravel site running on cPanel shared hosting.

---

## 🚀 QUICK WINS (Do These First)

### 1. Fix `.env` Configuration for Production
Your `.env` file currently has **development settings** that will slow down cPanel:

#### Current (SLOW):
```env
APP_DEBUG=true              # ❌ Outputs debug info, slows server
CACHE_STORE=file           # ❌ File-based cache is slow
SESSION_DRIVER=file        # ❌ File-based sessions slow down requests
```

#### Required (FAST):
```env
APP_DEBUG=false             # ✅ No debug output
CACHE_STORE=database       # ✅ Database cache is faster on cPanel
SESSION_DRIVER=database    # ✅ Database sessions are more reliable
```

**Action:** Edit your `.env` in cPanel File Manager and update these three settings.

---

### 2. Run Database Optimization
You have an `OPTIMIZE_DB.sql` file with crucial indexes. **Execute it now in cPanel phpMyAdmin:**

1. Open **phpMyAdmin** in cPanel
2. Select your database (`izaansho_db`)
3. Go to **SQL** tab
4. Copy entire `OPTIMIZE_DB.sql` and run it

**What this does:**
- ✅ Adds indexes to `Product`, `Category`, `Banner` tables
- ✅ Recalculates table statistics for MySQL optimizer
- ✅ Speeds up product filtering by 5-10x

---

### 3. Enable Gzip Compression in `.htaccess`
Your Laravel app uses Apache. Add compression to reduce response size by **60-70%**.

Create/edit `/public_html/.htaccess` and add at the top:

```apache
# ⚡ GZIP COMPRESSION
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    AddEncodingByType gzip .js .css .json
</IfModule>

# ⚡ BROWSER CACHING (12 months for static assets)
<IfModule mod_expires.c>
    ExpiresActive On
    
    # CSS and JavaScript
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"
    
    # Images
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # Fonts
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/otf "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    
    # Default: 1 week
    ExpiresDefault "access plus 1 week"
</IfModule>
```

---

## 🗄️ CRITICAL: Database Optimization

### Index Status Check
Run this in phpMyAdmin SQL editor to see your current indexes:

```sql
-- Check Product table indexes
SHOW INDEX FROM Product;

-- Check what you SHOULD have (from OPTIMIZE_DB.sql):
-- idx_prod_deleted_created (isDeleted, createdAt)
-- idx_prod_price (price)
-- idx_prod_category (categoryId)
-- idx_prod_slug (slug)
```

**Why indexes matter:**
- Filtering `Product WHERE isDeleted=0` → **0.01s** (with index) vs **0.5s** (without)
- Pagination with price sorting → **5-10x faster** with index

### Query Optimization Rules
When fetching data in controllers, always use **eager loading**:

```php
// ❌ BAD: Causes N+1 queries
$products = Product::where('isDeleted', false)->get();
foreach ($products as $product) {
    echo $product->category->name;  // Extra query per product!
}

// ✅ GOOD: One query with relationships
$products = Product::with('category', 'attributes', 'variants')
    ->where('isDeleted', false)
    ->get();
```

Your `ShopController` already does this correctly with `with(['category', 'attributes', 'variants'])`. ✅

---

## 💾 CACHING STRATEGY

### 1. Redis/Memcached (Not Available on cPanel)
cPanel shared hosting **does NOT have Redis/Memcached**. Use database cache instead.

### 2. Application-Level Caching (Your Setup)
Your code in `ShopController` already caches:
```php
$bannerData = \Cache::remember('shop_banners', 3600, function () {
    return Banner::where('isActive', true)->orderBy('order', 'asc')->get();
});
```

**Cache lifetime recommendations:**
```php
// Static data that rarely changes
Cache::remember('shop_categories', 86400, fn() => Category::all()); // 24 hours

// Dynamic data
Cache::remember('shop_products_page_1', 3600, function() {
    return Product::with(['category', 'variants'])->paginate(12);
}); // 1 hour

// Very frequently accessed
Cache::remember('store_max_price', 3600, fn() => Product::max('price')); // 1 hour
```

### 3. Cache Invalidation (IMPORTANT!)
When products/categories change, **clear the cache**:

```php
// In ProductController after updating a product:
Cache::forget('shop_products_page_*');
Cache::forget('store_max_price');

// In CategoryController after updating:
Cache::forget('shop_categories');
```

### 4. Enable Database-Based Caching (Required for cPanel)
Update `.env`:
```env
CACHE_STORE=database
```

Run this to create cache table:
```bash
php artisan cache:table
php artisan migrate
```

Or in cPanel, use this SQL in phpMyAdmin:
```sql
CREATE TABLE cache (
  key varchar(255) NOT NULL,
  value longtext NOT NULL,
  expiration int NOT NULL,
  PRIMARY KEY (key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 🖥️ PHP & cPanel Configuration

### 1. PHP Version (Check & Update)
In cPanel **MultiPHP Manager**:
- ✅ Use **PHP 8.2** or higher (latest available)
- ❌ NEVER use PHP 7.4 (slow, outdated)

### 2. OPcache (Already enabled on cPanel)
OPcache caches compiled PHP → **2-3x faster**. It should be enabled by default on cPanel. Verify:
```php
// Add to routes/web.php temporarily
Route::get('/check-opcache', function () {
    dd(extension_loaded('Zend OPcache'), opcache_get_status());
});
```

### 3. Disable Unnecessary Features in PHP
Ask your cPanel host to disable in `php.ini`:
```ini
expose_php = Off              # Don't reveal PHP version
max_execution_time = 30       # Default is good
memory_limit = 256M           # Should be enough
upload_max_filesize = 50M     # For product images
post_max_size = 50M
```

---

## 📦 Application Code Optimization

### 1. Lazy Load Product Relationships (If Heavy)
If `Product -> variants` is huge, load only when needed:

```php
// ❌ Always load variants (slow if 100+ variants per product)
Product::with('variants')->get();

// ✅ Load on demand
$product = Product::with('variants')->find($id);

// ✅ Or load subset
Product::with('variants' => fn($q) => $q->limit(5))->get();
```

### 2. Pagination (You're Already Using)
Never fetch all products. Your code correctly uses:
```php
$products = $query->paginate($pageSize); // ✅ Good!
```

### 3. Select Only Needed Columns
```php
// ❌ Fetches all columns (slow if many binary data)
Product::all();

// ✅ Fetch only needed columns
Product::select('id', 'name', 'price', 'categoryId', 'salePrice')->get();
```

---

## 🌍 CDN & Static Assets

### 1. Serve Static Files from CDN (Optional)
If you use external images, serve from Cloudflare/Bunny CDN:
- Reduces server bandwidth
- Faster delivery to users worldwide

### 2. Image Optimization
For product images in `/public/uploads/`:
- ✅ Use **WebP format** (30% smaller than JPEG)
- ✅ Resize large images before upload
- ✅ Lazy load images on product list page

Update your Blade template:
```html
<!-- ✅ Modern image with fallback -->
<picture>
    <source srcset="{{ Storage::url($product->image) }}.webp" type="image/webp">
    <img src="{{ Storage::url($product->image) }}" alt="{{ $product->name }}" loading="lazy">
</picture>
```

### 3. Minify CSS/JavaScript
Your Vite setup should already **minify in production** when you run:
```bash
npm run build
```

Verify `public/build/manifest.json` exists (it should).

---

## 📊 Performance Monitoring

### 1. Add Query Logging (Development Only)
In your `.env` (development):
```env
DB_QUERY_LOG=true  # Check queries taking >1 second
```

### 2. Monitor Response Times
Run test from terminal:
```bash
curl -w "@curl-format.txt" -o /dev/null -s https://izaanshop.com/
```

Should see:
- **Homepage:** < 1.5 seconds
- **Product filtering:** < 2 seconds
- **Checkout:** < 1 second

### 3. Check cPanel Resource Usage
In cPanel **Resource Usage** page:
- CPU Usage should be < 80%
- Memory should be < 256MB
- Processes < 20

If maxed out → Contact hosting provider to upgrade plan

---

## 🚀 FINAL cPanel Deployment Checklist

Before deploying to cPanel, run this checklist:

```
✅ 1. .env settings fixed (APP_DEBUG=false, CACHE_STORE=database)
✅ 2. Database optimization SQL executed (OPTIMIZE_DB.sql)
✅ 3. .htaccess compression + caching added to /public_html/
✅ 4. npm run build executed (produces public/build/)
✅ 5. Cache table created in database
✅ 6. Storage folder permissions: chmod 775
✅ 7. Bootstrap cache folder: chmod 775
✅ 8. Tested homepage loads < 2 seconds
✅ 9. Tested product filtering works smoothly
✅ 10. Monitored cPanel resource usage
```

---

## 📋 Summary of Changes Needed

| Issue | Fix | Impact |
|-------|-----|--------|
| `APP_DEBUG=true` | Set to `false` | -70% response time |
| File-based cache | Use database cache | -40% cache lookup |
| File-based sessions | Use database sessions | -30% session overhead |
| Missing DB indexes | Run OPTIMIZE_DB.sql | -80% query time |
| No gzip compression | Add to .htaccess | -60% file size |
| No asset caching | Add expires headers | 5-10x faster repeat visits |
| N+1 queries | Use `with()` eager loading | Already done ✅ |

---

## ❓ Still Slow?

If your site is still slow after these changes, it's likely:

1. **cPanel plan too weak** → Upgrade to higher tier
2. **Shared hosting resource limits** → Consider VPS ($10/month more)
3. **External API calls** → Add timeout checks
4. **Large product database** → Implement search indexing (Elasticsearch)

Contact your hosting provider's support first — they may optimize your server configuration automatically.
