# ⚡ Izaan Shop - Performance Quick Reference

**For Emergency Performance Issues - Use This Card**

---

## 🔴 SITE IS SLOW - QUICK FIXES

### Step 1: Check What's Slow (2 min)
```bash
# From Mac Terminal:
curl -w "
  Time to establish connection: %{time_connect}s
  Time to first byte: %{time_starttransfer}s
  Total time: %{time_total}s
" -o /dev/null -s https://izaanshop.com
```

**Interpretation:**
- `time_total` > 3s → Backend issue
- `time_connect` > 1s → Network/DNS issue
- `time_starttransfer` > 2s → Database/processing issue

---

### Step 2: Check cPanel Resources (2 min)

1. Go to cPanel → **Resource Usage**
2. Check:
   - **CPU** - if > 80%, contact hosting about upgrade
   - **Memory** - if > 256MB, optimize code or upgrade
   - **Processes** - if > 20, something is looping infinitely

### Step 3: Clear Cache (1 min)

**In cPanel phpMyAdmin**, run:
```sql
-- Clear all cached data
TRUNCATE TABLE cache;
TRUNCATE TABLE cache_locks;

-- OR use Laravel (SSH if available):
php artisan cache:clear
```

### Step 4: Check Database Performance (2 min)

Run in phpMyAdmin:
```sql
-- Check for slow queries
SELECT * FROM mysql.slow_log LIMIT 10;

-- Check table sizes (bloated tables slow down queries)
SELECT table_name, round(((data_length + index_length) / 1024 / 1024), 2) as size_mb
FROM information_schema.tables
WHERE table_schema = 'izaansho_db'
ORDER BY size_mb DESC;
```

**If Product table > 50MB:**
- Optimize: `OPTIMIZE TABLE Product;`
- Check for deleted records: `SELECT COUNT(*) FROM Product WHERE isDeleted=1;`
- Consider archiving old data

---

## 📊 PERFORMANCE TARGETS

| Metric | Target | Red Flag |
|--------|--------|----------|
| Homepage load time | < 2s | > 3s |
| Product filter response | < 1s | > 2s |
| API response time | < 500ms | > 1s |
| First Contentful Paint (FCP) | < 2s | > 3s |
| Largest Contentful Paint (LCP) | < 2.5s | > 4s |
| PHP memory usage | < 50MB | > 100MB |
| Database query time | < 100ms | > 500ms |
| Cache hit rate | > 90% | < 70% |

---

## 🛠️ COMMON PERFORMANCE ISSUES & FIXES

### Issue 1: Homepage taking 3+ seconds

**Diagnosis:**
```bash
# Add to routes/web.php temporarily
Route::get('/debug-homepage', function () {
    $start = microtime(true);
    
    $banners = \Cache::remember('shop_banners', 3600, fn() => 
        \App\Models\Banner::where('isActive', true)->get()
    );
    echo "Banners: " . (microtime(true) - $start) . "s\n";

    $categories = \Cache::remember('shop_categories', 3600, fn() => 
        \App\Models\Category::all()
    );
    echo "Categories: " . (microtime(true) - $start) . "s\n";

    $products = \App\Models\Product::with(['category', 'variants'])
        ->where('isDeleted', false)
        ->limit(12)
        ->get();
    echo "Products: " . (microtime(true) - $start) . "s\n";
});
```

**Fixes:**
- ✅ Check if `$banners` and `$categories` are being cached (check `cache` table for rows)
- ✅ If not cached, cache is disabled: verify `.env` has `CACHE_STORE=database`
- ✅ Check if database is slow: run indexes again (OPTIMIZE_DB.sql)

### Issue 2: Product filtering slow even with cache

**Diagnosis:**
```sql
-- Check if filter indexes exist
SHOW INDEX FROM Product WHERE Column_name IN ('isDeleted', 'createdAt', 'price', 'categoryId');

-- Should see 4 indexes: idx_prod_deleted_created, idx_prod_price, idx_prod_category, idx_prod_slug
```

**Fix:**
- If indexes missing, run OPTIMIZE_DB.sql again
- If query still slow, add to ShopController:

```php
->select('id', 'name', 'price', 'salePrice', 'categoryId', 'images')  // Only needed columns
->limit(12)
->get();
```

### Issue 3: Database connection timeout

**Cause:** cPanel MySQL server under load

**Fix:**
1. In `.env`: `DB_HOST=localhost` (never use IP)
2. Increase timeout: Add to `.env`
   ```env
   DB_TIMEOUT=10
   ```
3. Use connection pooling (ask hosting provider)

### Issue 4: Memory limit exceeded

**Error in logs:** `Allowed memory size of X bytes exhausted`

**Fixes:**
1. In cPanel, PHP Configuration: Increase to 256MB or 512MB
2. In Controller, reduce data loaded:

```php
// ❌ Bad: Loads all product variants (memory spike)
$product = Product::with('variants', 'attributes', 'reviews')->find($id);

// ✅ Good: Load relationships on demand
$product = Product::find($id);
$variants = $product->variants; // Load only when needed
```

### Issue 5: cPanel CPU maxed out

**Cause:** Long-running task (import, processing, etc.)

**Fix:**
1. Check cPanel Resource Usage → find what process is using CPU
2. In `.env`, add: `QUEUE_CONNECTION=sync` → `QUEUE_CONNECTION=database` (deferred processing)
3. Implement background jobs:

```php
// Don't do this in controller:
foreach ($products as $product) {
    // Process each product (might take minutes)
}

// Do this instead:
foreach ($products as $product) {
    ProcessProductJob::dispatch($product);
}
```

---

## 📈 MONITORING COMMANDS

### Check PHP Status
```bash
# SSH into cPanel
php -v                    # PHP version
php -i | grep "memory_limit"  # Memory limit
php -i | grep "opcache"   # OPcache status
```

### Check MySQL Performance
```sql
-- MySQL running slow?
SHOW PROCESSLIST;          -- Current queries
SHOW STATUS LIKE 'Slow_queries';  -- Count of slow queries

-- Check table fragmentation (causes slow queries)
SELECT TABLE_NAME, ROUND(((DATA_LENGTH+INDEX_LENGTH)/1024/1024),2) as size
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA='izaansho_db' 
ORDER BY size DESC;
```

### Monitor Cache Effectiveness
```sql
-- Check if cache is being used
SELECT COUNT(*) as cached_items FROM cache;

-- Check cache expiry
SELECT * FROM cache WHERE expiration < UNIX_TIMESTAMP() LIMIT 5;  -- Expired items
```

---

## 🚨 EMERGENCY ACTION PLAN

**If site completely down:**

1. **Check cPanel status:** Is the server recovering? Wait 5 minutes.
2. **Restart services:**
   - cPanel → Apache Restart
   - cPanel → MySQL Restart
3. **Clear sessions:**
   ```sql
   DELETE FROM sessions;
   ```
4. **Flush all caches:**
   ```php
   php artisan cache:clear
   php artisan view:clear
   php artisan route:clear
   ```
5. **Force HTTPS redirect:**
   - Edit `.htaccess` in `/public_html/`
   - Temporarily disable auto-redirect if causing infinite loops

---

## 📞 WHEN TO ESCALATE TO HOSTING PROVIDER

Contact your hosting provider's support if:
- ✋ CPU/Memory constantly maxed out (not your code's fault)
- ✋ MySQL server responding slowly (> 1s for simple queries)
- ✋ Can't write to `/storage` folder
- ✋ Need to install PHP extensions (pecl packages)
- ✋ Need higher limits (file upload size, processes, memory)

**What to tell them:**
```
"My Laravel 11 PHP app is slow. Can you:
1. Verify OPcache is enabled?
2. Check MySQL has proper indexes?
3. Increase PHP memory_limit to 256MB?
4. Check if server is under load?"
```

---

## ✅ FINAL CHECKLIST

Print this and verify monthly:

```
[ ] .env has APP_DEBUG=false on production
[ ] CACHE_STORE=database (not file)
[ ] SESSION_DRIVER=database (not file)
[ ] Database indexes exist (run OPTIMIZE_DB.sql monthly)
[ ] .htaccess has gzip compression enabled
[ ] Static assets have long cache expiry (1 year)
[ ] Product cache is being populated (check cache table)
[ ] Homepage loads < 2 seconds
[ ] Product filtering works smoothly
[ ] Product admin can create/edit without slowdown
[ ] cPanel Resource Usage < 50%
[ ] No errors in cPanel Error Log
```

Good luck! 🚀
