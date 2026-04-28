const { db } = require('../db');
const { products, categories, productAttributes, productVariants } = require('../db/schema');
const { eq, ne, and, or, like, gte, lte, sql, desc, asc, inArray } = require('drizzle-orm');
const formatProduct = require('../utils/formatProduct');
const { revalidateCache } = require('../utils/revalidateCache');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  const pageSize = Number(req.query.pageSize) || 12;
  const page = Number(req.query.pageNumber) || 1;

  try {
    const filters = [eq(products.isDeleted, false)];
    
    if (req.query.keyword) {
      filters.push(like(products.name, `%${req.query.keyword}%`));
    }

    if (req.query.minPrice) {
      filters.push(gte(products.price, Number(req.query.minPrice)));
    }
    if (req.query.maxPrice) {
      filters.push(lte(products.price, Number(req.query.maxPrice)));
    }

    // Category filter
    if (req.query.category) {
      const categoryData = await db.select().from(categories).where(eq(categories.slug, req.query.category)).limit(1);
      if (categoryData.length > 0) {
        filters.push(eq(products.categoryId, categoryData[0].id));
      }
    }

    const whereClause = and(...filters);

    // Sorting
    let orderBy = [desc(products.createdAt)];
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low': orderBy = [asc(products.price)]; break;
        case 'price-high': orderBy = [desc(products.price)]; break;
        case 'popular': orderBy = [desc(products.createdAt)]; break;
      }
    }

    const [countResult, maxPriceResult, storeMaxPriceResult] = await Promise.all([
      db.select({ count: sql`count(*)` }).from(products).where(whereClause),
      db.select({ max: sql`max(${products.price})` }).from(products).where(whereClause),
      db.select({ max: sql`max(${products.price})` }).from(products).where(eq(products.isDeleted, false))
    ]);

    // Fetch Products with Category Join (Standard SQL to avoid LATERAL JOIN)
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
    
    let attributesData = [];
    let variantsData = [];
    if (productIds.length > 0) {
      [attributesData, variantsData] = await Promise.all([
        db.select().from(productAttributes).where(inArray(productAttributes.productId, productIds)),
        db.select().from(productVariants).where(inArray(productVariants.productId, productIds))
      ]);
    }

    const productData = rawProducts.map(rp => {
      return {
        ...rp.product,
        category: rp.category,
        attributes: attributesData.filter(a => a.productId === rp.product.id),
        variants: variantsData.filter(v => v.productId === rp.product.id)
      };
    });

    const count = Number(countResult[0]?.count || 0);
    const formattedProducts = productData.map(formatProduct);

    res.json({ 
      products: formattedProducts, 
      page, 
      pages: Math.ceil(count / pageSize),
      maxPrice: Number(maxPriceResult[0]?.max || 5000),
      storeMaxPrice: Number(storeMaxPriceResult[0]?.max || 5000)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const isNumber = !isNaN(id);
    const whereCondition = isNumber ? eq(products.id, Number(id)) : eq(products.slug, id);

    const result = await db.select({
      product: products,
      category: categories
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isDeleted, false), whereCondition))
    .limit(1);

    if (result.length > 0) {
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

      // Fetch related products
      const relatedRaw = await db.select({
        product: products,
        category: categories
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(
        eq(products.categoryId, product.categoryId),
        ne(products.id, product.id),
        eq(products.isDeleted, false)
      ))
      .limit(4);

      const relatedIds = relatedRaw.map(r => r.product.id);
      let relatedAttrs = [];
      let relatedVars = [];
      if (relatedIds.length > 0) {
        [relatedAttrs, relatedVars] = await Promise.all([
          db.select().from(productAttributes).where(inArray(productAttributes.productId, relatedIds)),
          db.select().from(productVariants).where(inArray(productVariants.productId, relatedIds))
        ]);
      }

      const relatedProducts = relatedRaw.map(r => ({
        ...r.product,
        category: r.category,
        attributes: relatedAttrs.filter(a => a.productId === r.product.id),
        variants: relatedVars.filter(v => v.productId === r.product.id)
      }));

      const formattedProduct = formatProduct(product);
      res.json({ ...formattedProduct, relatedProducts: relatedProducts.map(formatProduct) });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  const { name, price, description, category, mainImage, gallery, stock, slug, salePrice, type, attributes, variants } = req.body;

  try {
    const images = {
      main: mainImage || '/placeholder.png',
      gallery: Array.isArray(gallery) ? gallery : []
    };

    const finalSlug = slug || name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const result = await db.transaction(async (tx) => {
      const [productInsert] = await tx.insert(products).values({
        name,
        description: description || '',
        price: (price !== undefined && price !== '') ? Number(price) : 0,
        categoryId: (category || req.body.categoryId) ? Number(category || req.body.categoryId) : undefined,
        stock: (stock !== undefined && stock !== '') ? Number(stock) : 0,
        images: JSON.stringify(images),
        slug: finalSlug,
        salePrice: (salePrice !== undefined && salePrice !== '') ? Number(salePrice) : null,
        type: type || 'SIMPLE'
      });

      const productId = productInsert.insertId;

      if (type === 'VARIABLE' && attributes) {
        for (const attr of attributes) {
          await tx.insert(productAttributes).values({
            name: attr.name,
            options: typeof attr.options === 'object' ? JSON.stringify(attr.options) : attr.options,
            productId
          });
        }
      }

      if (type === 'VARIABLE' && variants) {
        for (const variant of variants) {
          await tx.insert(productVariants).values({
            sku: variant.sku || null,
            price: parseFloat(variant.price) || 0,
            salePrice: (variant.salePrice && parseFloat(variant.salePrice) > 0) ? parseFloat(variant.salePrice) : null,
            stock: parseInt(variant.stock) || 0,
            options: typeof variant.options === 'object' ? JSON.stringify(variant.options) : variant.options,
            image: variant.image || '',
            isDefault: !!variant.isDefault,
            productId
          });
        }
      }

      return productId;
    });

    const createdProduct = await getProductByIdInternal(result);
    revalidateCache('shop-init');
    res.status(201).json(formatProduct(createdProduct));
  } catch (error) {
    next(error);
  }
};

// Internal helper to avoid code duplication and redundant queries
async function getProductByIdInternal(id) {
  const result = await db.select({
    product: products,
    category: categories
  })
  .from(products)
  .leftJoin(categories, eq(products.categoryId, categories.id))
  .where(eq(products.id, id))
  .limit(1);

  if (result.length === 0) return null;

  const [attr, vars] = await Promise.all([
    db.select().from(productAttributes).where(eq(productAttributes.productId, id)),
    db.select().from(productVariants).where(eq(productVariants.productId, id))
  ]);

  return {
    ...result[0].product,
    category: result[0].category,
    attributes: attr,
    variants: vars
  };
}

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  const { 
    name, price, description, category, mainImage, gallery, 
    stock, slug, salePrice, type, attributes, variants 
  } = req.body;
  const productId = Number(req.params.id);

  try {
    const existing = await db.select().from(products).where(eq(products.id, productId)).limit(1);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingProduct = existing[0];
    const currentImages = existingProduct.images ? JSON.parse(existingProduct.images) : { main: '', gallery: [] };
    const newMainImage = mainImage !== undefined ? mainImage : currentImages.main;
    const parsedGallery = typeof gallery === 'string' ? JSON.parse(gallery) : (gallery || currentImages.gallery);
    
    const finalImages = {
      main: newMainImage || '/placeholder.png',
      gallery: Array.isArray(parsedGallery) ? parsedGallery : []
    };

    await db.transaction(async (tx) => {
      await tx.update(products).set({
        name,
        price: (price !== undefined && price !== '') ? Number(price) : undefined,
        description,
        categoryId: (category || req.body.categoryId) ? Number(category || req.body.categoryId) : undefined,
        stock: (stock !== undefined && stock !== '') ? Number(stock) : undefined,
        slug: slug || undefined,
        salePrice: (salePrice !== undefined && salePrice !== '') ? Number(salePrice) : null,
        type: type || undefined,
        images: JSON.stringify(finalImages)
      }).where(eq(products.id, productId));

      if (type === 'VARIABLE' || existingProduct.type === 'VARIABLE') {
        await tx.delete(productAttributes).where(eq(productAttributes.productId, productId));
        await tx.delete(productVariants).where(eq(productVariants.productId, productId));

        if (type === 'VARIABLE' && attributes && variants) {
          for (const attr of attributes) {
            await tx.insert(productAttributes).values({
              name: attr.name,
              options: typeof attr.options === 'object' ? JSON.stringify(attr.options) : attr.options,
              productId
            });
          }
          for (const variant of variants) {
            await tx.insert(productVariants).values({
              sku: variant.sku || null,
              price: parseFloat(variant.price) || 0,
              salePrice: (variant.salePrice && parseFloat(variant.salePrice) > 0) ? parseFloat(variant.salePrice) : null,
              stock: parseInt(variant.stock) || 0,
              options: typeof variant.options === 'object' ? JSON.stringify(variant.options) : variant.options,
              image: variant.image || '',
              isDefault: !!variant.isDefault,
              productId
            });
          }
        }
      }
    });

    const updatedProduct = await getProductByIdInternal(productId);
    revalidateCache('shop-init');
    res.json(formatProduct(updatedProduct));
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    await db.update(products).set({ isDeleted: true }).where(eq(products.id, Number(req.params.id)));
    revalidateCache('shop-init');
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
