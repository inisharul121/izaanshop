# 🚀 cPanel Performance Optimization - Implementation Guide

## Step 1: Update Environment Variables ✅

### On your Mac (for local development):
No changes needed yet (debug can stay on).

### On cPanel Server:
1. Open **File Manager** in cPanel
2. Navigate to `/home/izaansho/izaan_laravel/`
3. Right-click `.env` → Edit
4. Replace contents with your `.env.production` file from this folder
5. Update these fields with YOUR values:
   ```env
   APP_URL=https://izaanshop.com
   DB_DATABASE=izaansho_db
   DB_USERNAME=izaansho_user
   DB_PASSWORD=YourActualPassword
   ```

---

## Step 2: Run Database Optimization SQL ✅

1. Open **phpMyAdmin** from cPanel
2. Select your database
3. Go to **SQL** tab
4. Copy paste and run:

```sql
-- 🚀 Izaan Shop Database Speed Optimization Script

-- 1. Add Index to Products for faster filtering and sorting
ALTER TABLE Product ADD INDEX IF NOT EXISTS idx_prod_deleted_created (isDeleted, createdAt);
ALTER TABLE Product ADD INDEX IF NOT EXISTS idx_prod_price (price);
ALTER TABLE Product ADD INDEX IF NOT EXISTS idx_prod_category (categoryId);
ALTER TABLE Product ADD INDEX IF NOT EXISTS idx_prod_slug (slug);

-- 2. Add Index to Categories
ALTER TABLE Category ADD INDEX IF NOT EXISTS idx_cat_slug (slug);

-- 3. Add Index to Banners for ordering search
ALTER TABLE Banner ADD INDEX IF NOT EXISTS idx_banner_active_order (isActive, `order`);

-- 4. Re-calculate statistics for the optimizer
OPTIMIZE TABLE Product;
OPTIMIZE TABLE Category;
OPTIMIZE TABLE Banner;
OPTIMIZE TABLE ProductVariant;
OPTIMIZE TABLE ProductAttribute;

SELECT '✅ Database Optimization Complete!' as Result;
```

**Verify it worked:**
```sql
SHOW INDEX FROM Product;
-- Should see: idx_prod_deleted_created, idx_prod_price, idx_prod_category, idx_prod_slug
```

---

## Step 3: Add Compression to .htaccess ✅

1. In cPanel **File Manager**, go to `/public_html/`
2. Right-click `.htaccess` → Edit (or create if missing)
3. Copy the entire content from `PUBLIC_HTACCESS.txt` in your Laravel folder
4. Save and wait 1 minute for Apache to reload

**Test it worked:**
```bash
curl -I https://izaanshop.com/ | grep -i "content-encoding"
# Should output: content-encoding: gzip
```

---

## Step 4: Create Cache Table ✅

On cPanel, create cache storage in your database:

1. In phpMyAdmin, go to **SQL** tab
2. Run:

```sql
CREATE TABLE cache (
  `key` varchar(255) NOT NULL,
  `value` longtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cache_locks (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Step 5: Update Controllers to Use Cache Service ✅

### Example: ProductController.php

When creating or updating a product, **invalidate cache**:

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Models\Product;
use App\Services\CacheService;  // ← Add this
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Update an existing product
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string',
            'price' => 'required|numeric',
            // ... other validation
        ]);

        $product->update($validated);
        
        // ✅ Clear product caches
        CacheService::invalidateProducts();

        return redirect()->route('admin.products.index')
                       ->with('success', 'Product updated successfully');
    }

    /**
     * Delete a product
     */
    public function destroy($id)
    {
        Product::findOrFail($id)->delete();
        
        // ✅ Clear product caches
        CacheService::invalidateProducts();

        return redirect()->route('admin.products.index')
                       ->with('success', 'Product deleted successfully');
    }
}
```

### Example: CategoryController.php

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Models\Category;
use App\Services\CacheService;  // ← Add this
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:Category,slug',
        ]);

        Category::create($validated);
        
        // ✅ Clear category caches
        CacheService::invalidateCategories();

        return back()->with('success', 'Category created');
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        $category->update($request->validate([
            'name' => 'required|string',
            'slug' => 'required|string|unique:Category,slug,' . $id,
        ]));
        
        // ✅ Clear category caches
        CacheService::invalidateCategories();

        return back()->with('success', 'Category updated');
    }

    public function destroy($id)
    {
        Category::findOrFail($id)->delete();
        
        // ✅ Clear category caches
        CacheService::invalidateCategories();

        return back()->with('success', 'Category deleted');
    }
}
```

### Example: BannerController.php

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Models\Banner;
use App\Services\CacheService;  // ← Add this
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function store(Request $request)
    {
        Banner::create($request->validate([
            'image' => 'required|string',
            'isActive' => 'boolean',
            'order' => 'numeric',
        ]));
        
        // ✅ Clear banner caches
        CacheService::invalidateBanners();

        return back();
    }

    public function update(Request $request, $id)
    {
        Banner::findOrFail($id)->update($request->all());
        
        // ✅ Clear banner caches
        CacheService::invalidateBanners();

        return back();
    }

    public function destroy($id)
    {
        Banner::findOrFail($id)->delete();
        
        // ✅ Clear banner caches
        CacheService::invalidateBanners();

        return back();
    }
}
```

---

## Step 6: Test Performance ✅

### Test 1: Check Response Time

```bash
# Test from terminal
curl -w "@curl-format.txt" -o /dev/null -s https://izaanshop.com/

# Or manually:
time curl -s https://izaanshop.com/ > /dev/null
```

**Target times:**
- Homepage: < 1.5 seconds
- Product filtering: < 2 seconds
- API responses: < 0.5 seconds

### Test 2: Check Compression

```bash
curl -I https://izaanshop.com/ | grep -i "content-encoding"
# Should see: content-encoding: gzip
```

### Test 3: Check Cache Headers

```bash
curl -I https://izaanshop.com/assets/app.css | grep -i "cache-control"
# Should see: max-age=31536000 (1 year)
```

### Test 4: Monitor cPanel Resource Usage

In cPanel:
1. Go to **Resource Usage**
2. Check: CPU, Memory, I/O
3. Should all be < 50% during low traffic
4. Should stay < 80% during peak traffic

---

## Step 7: If Still Slow...

### Check 1: Database Slow Queries
In phpMyAdmin, check slow query log:
```sql
SHOW VARIABLES LIKE 'slow_query_log%';
SHOW VARIABLES LIKE 'long_query_time';
```

### Check 2: PHP Configuration
Ask your cPanel host (or check WHM):
```
PHP 8.2+ installed? ✅
OPcache enabled? ✅
Memory limit ≥ 256MB? ✅
```

### Check 3: Upgrade cPanel Plan
If all else fails, your server might be overloaded:
- Too many concurrent users
- Shared hosting limitations
- Need dedicated resources

---

## ✅ Performance Optimization Checklist

```
[ ] Updated .env with production settings
[ ] Ran OPTIMIZE_DB.sql
[ ] Added .htaccess compression config
[ ] Created cache table in phpMyAdmin
[ ] Updated ProductController with CacheService
[ ] Updated CategoryController with CacheService
[ ] Updated BannerController with CacheService
[ ] Tested homepage loads < 1.5s
[ ] Tested product filtering works
[ ] Verified gzip compression enabled
[ ] Monitored cPanel resource usage
```

---

## 📞 Need Help?

1. **Test your changes locally first** - update local .env to match production settings
2. **Check error logs** - cPanel > Error Log
3. **Check cache is working** - phpMyAdmin, check `cache` table for rows
4. **Monitor real traffic** - use Google PageSpeed Insights or GTmetrix

Good luck! 🚀
