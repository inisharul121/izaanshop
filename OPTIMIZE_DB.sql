-- 🚀 Izaan Shop Database Speed Optimization Script
-- RUN THIS IN CPANEL PHPMYADMIN SQL TAB

-- 1. Add Index to Products for faster filtering and sorting
-- Note: Check if these exist first. If Drizzle already created some, SQL might error but Table will remain safe.
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
