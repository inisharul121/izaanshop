import { mysqlTable, varchar, text, double, boolean, timestamp, int, longtext, mysqlEnum, index } from "drizzle-orm/mysql-core";
import { relations, sql } from "drizzle-orm";

// 1. User Table
export const users = mysqlTable("User", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).default("user").notNull(),
  phone: varchar("phone", { length: 255 }),
  street: varchar("street", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  zipCode: varchar("zipCode", { length: 255 }),
  country: varchar("country", { length: 255 }).default("Bangladesh"),
  isApproved: boolean("isApproved").default(true).notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  emailIdx: index("email_idx").on(table.email),
}));

// 2. Category Table
export const categories = mysqlTable("Category", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).unique().notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  image: longtext("image"),
  description: text("description"),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  slugIdx: index("category_slug_idx").on(table.slug),
}));

// 3. Product Table
export const products = mysqlTable("Product", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  description: text("description").notNull(),
  price: double("price").notNull(),
  salePrice: double("salePrice"),
  stock: int("stock").default(0).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  images: longtext("images"),
  rating: double("rating").default(0).notNull(),
  numReviews: int("numReviews").default(0).notNull(),
  type: mysqlEnum("type", ["SIMPLE", "VARIABLE"]).default("SIMPLE").notNull(),
  categoryId: int("categoryId").notNull(),
  isDeleted: boolean("isDeleted").default(false).notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  slugIdx: index("product_slug_idx").on(table.slug),
  categoryIdx: index("product_category_idx").on(table.categoryId),
  isDeletedIdx: index("product_deleted_idx").on(table.isDeleted),
  priceIdx: index("product_price_idx").on(table.price),
  createdAtIdx: index("product_created_at_idx").on(table.createdAt),
}));

// 4. ProductAttribute Table
export const productAttributes = mysqlTable("ProductAttribute", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  options: longtext("options").notNull(),
  productId: int("productId").notNull(),
}, (table) => ({
  productIdx: index("attr_product_idx").on(table.productId),
}));

// 5. ProductVariant Table
export const productVariants = mysqlTable("ProductVariant", {
  id: int("id").primaryKey().autoincrement(),
  sku: varchar("sku", { length: 255 }).unique(),
  price: double("price").notNull(),
  salePrice: double("salePrice"),
  stock: int("stock").default(0).notNull(),
  options: longtext("options").notNull(),
  image: longtext("image"),
  productId: int("productId").notNull(),
  isDefault: boolean("isDefault").default(false).notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  productIdx: index("variant_product_idx").on(table.productId),
  skuIdx: index("variant_sku_idx").on(table.sku),
}));

// 6. Review Table
export const reviews = mysqlTable("Review", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  comment: text("comment").notNull(),
  productId: int("productId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (table) => ({
  productIdx: index("review_product_idx").on(table.productId),
  userIdx: index("review_user_idx").on(table.userId),
}));

// 7. Order Table
export const orders = mysqlTable("Order", {
  id: int("id").primaryKey().autoincrement(),
  totalPrice: double("totalPrice").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 255 }).notNull(),
  itemsPrice: double("itemsPrice").notNull(),
  taxPrice: double("taxPrice").default(0).notNull(),
  shippingPrice: double("shippingPrice").default(0).notNull(),
  isPaid: boolean("isPaid").default(false).notNull(),
  paidAt: timestamp("paidAt"),
  isDelivered: boolean("isDelivered").default(false).notNull(),
  deliveredAt: timestamp("deliveredAt"),
  status: varchar("status", { length: 255 }).default("Pending").notNull(),
  street: varchar("street", { length: 255 }),
  city: varchar("city", { length: 255 }),
  state: varchar("state", { length: 255 }),
  zipCode: varchar("zipCode", { length: 255 }),
  country: varchar("country", { length: 255 }).default("Bangladesh"),
  paymentId: varchar("paymentId", { length: 255 }),
  transactionId: varchar("transactionId", { length: 255 }),
  paymentStatus: varchar("paymentStatus", { length: 255 }),
  paymentEmail: varchar("paymentEmail", { length: 255 }),
  userId: int("userId"),
  guestName: varchar("guestName", { length: 255 }),
  guestEmail: varchar("guestEmail", { length: 255 }),
  guestPhone: varchar("guestPhone", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  shippingEmail: varchar("shippingEmail", { length: 255 }),
  shippingMethod: varchar("shippingMethod", { length: 255 }),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  userIdx: index("order_user_idx").on(table.userId),
  statusIdx: index("order_status_idx").on(table.status),
  createdAtIdx: index("order_created_at_idx").on(table.createdAt),
}));

// 8. OrderItem Table
export const orderItems = mysqlTable("OrderItem", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  image: longtext("image").notNull(),
  price: double("price").notNull(),
  variantId: int("variantId"),
  orderId: int("orderId").notNull(),
  productId: int("productId").notNull(),
}, (table) => ({
  orderIdx: index("item_order_idx").on(table.orderId),
  productIdx: index("item_product_idx").on(table.productId),
}));

// 9. ShippingMethod Table
export const shippingMethods = mysqlTable("ShippingMethod", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  price: double("price").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

// 10. Coupon Table
export const coupons = mysqlTable("Coupon", {
  id: int("id").primaryKey().autoincrement(),
  code: varchar("code", { length: 255 }).unique().notNull(),
  discountType: varchar("discountType", { length: 255 }).notNull(),
  discountValue: double("discountValue").notNull(),
  expiryDate: timestamp("expiryDate"),
  isActive: boolean("isActive").default(true).notNull(),
  maxUses: int("maxUses"),
  usedCount: int("usedCount").default(0).notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
}, (table) => ({
  codeIdx: index("coupon_code_idx").on(table.code),
}));

// 11. Settings Table
export const settings = mysqlTable("Settings", {
  id: int("id").primaryKey().autoincrement(),
  key: varchar("key", { length: 255 }).unique().notNull(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

// 12. Banner Table
export const banners = mysqlTable("Banner", {
  id: int("id").primaryKey().autoincrement(),
  title: varchar("title", { length: 255 }),
  subtitle: varchar("subtitle", { length: 255 }),
  image: longtext("image").notNull(),
  link: varchar("link", { length: 255 }),
  isActive: boolean("isActive").default(true).notNull(),
  order: int("order").default(0).notNull(),
  createdAt: timestamp("createdAt").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updatedAt").onUpdateNow(),
});

// --- RELATIONSHIPS ---

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  reviews: many(reviews),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  attributes: many(productAttributes),
  variants: many(productVariants),
  reviews: many(reviews),
  orderItems: many(orderItems),
}));

export const productAttributesRelations = relations(productAttributes, ({ one }) => ({
  product: one(products, {
    fields: [productAttributes.productId],
    references: [products.id],
  }),
}));

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  orderItems: many(orderItems),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));
