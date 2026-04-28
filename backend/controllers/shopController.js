const { db } = require('../db');
const { banners, categories, products, productAttributes, productVariants } = require('../db/schema');
const { eq, and, sql, desc, asc, like, gte, lte, inArray } = require('drizzle-orm');
const formatProduct = require('../utils/formatProduct');

// @desc    Fetch consolidated shop data (MariaDB compatible - avoided LATERAL JOIN)
// @route   GET /api/shop/init
// @access  Public
const getShopData = async (req, res, next) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  try {
    const filters = [eq(products.isDeleted, false)];
    
    if (req.query.keyword) filters.push(like(products.name, `%${req.query.keyword}%`));
    if (req.query.minPrice) filters.push(gte(products.price, Number(req.query.minPrice)));
    if (req.query.maxPrice) filters.push(lte(products.price, Number(req.query.maxPrice)));

    if (req.query.category) {
      const categoryData = await db.select().from(categories).where(eq(categories.slug, req.query.category)).limit(1);
      if (categoryData.length > 0) {
        filters.push(eq(products.categoryId, categoryData[0].id));
      }
    }

    const whereClause = and(...filters);

    let orderBy = [desc(products.createdAt)];
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low': orderBy = [asc(products.price)]; break;
        case 'price-high': orderBy = [desc(products.price)]; break;
      }
    }

    // 1. Fetch Basic Data
    const [bannerData, allCategories, countResult, maxPriceResult, storeMaxPriceResult] = await Promise.all([
      db.select().from(banners).where(eq(banners.isActive, true)).orderBy(asc(banners.order)),
      db.select().from(categories),
      db.select({ count: sql`count(*)` }).from(products).where(whereClause),
      db.select({ max: sql`max(${products.price})` }).from(products).where(whereClause),
      db.select({ max: sql`max(${products.price})` }).from(products).where(eq(products.isDeleted, false))
    ]);

    // 2. Fetch Products with Category Join (Standard SQL)
    const rawProducts = await db.select({
      product: products,
      category: categories
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(whereClause)
    .limit(pageSize)
    .offset(pageSize * (page - 1))
    .orderBy(...orderBy);

    const productIds = rawProducts.map(rp => rp.product.id);
    
    // 3. Fetch Relations for matched products
    let attributesData = [];
    let variantsData = [];
    if (productIds.length > 0) {
      [attributesData, variantsData] = await Promise.all([
        db.select().from(productAttributes).where(inArray(productAttributes.productId, productIds)),
        db.select().from(productVariants).where(inArray(productVariants.productId, productIds))
      ]);
    }

    // 4. Map everything back to the expected structure
    const productData = rawProducts.map(rp => ({
      ...rp.product,
      category: rp.category,
      attributes: attributesData.filter(a => a.productId === rp.product.id),
      variants: variantsData.filter(v => v.productId === rp.product.id)
    }));

    const count = Number(countResult[0]?.count || 0);
    const formattedProducts = productData.map(formatProduct);

    res.json({ 
      banners: bannerData,
      categories: allCategories,
      products: formattedProducts, 
      pagination: {
        page,
        pages: Math.ceil(count / pageSize),
        total: count
      },
      maxPrice: Number(maxPriceResult[0]?.max || 5000),
      storeMaxPrice: Number(storeMaxPriceResult[0]?.max || 5000)
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getShopData };
