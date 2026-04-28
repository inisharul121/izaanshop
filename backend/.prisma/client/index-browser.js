
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.2.1
 * Query Engine version: 4123509d24aa4dede1e864b46351bf2790323b69
 */
Prisma.prismaVersion = {
  client: "6.2.1",
  engine: "4123509d24aa4dede1e864b46351bf2790323b69"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  phone: 'phone',
  street: 'street',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  country: 'country',
  isApproved: 'isApproved',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  image: 'image',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  price: 'price',
  salePrice: 'salePrice',
  stock: 'stock',
  isFeatured: 'isFeatured',
  images: 'images',
  rating: 'rating',
  numReviews: 'numReviews',
  type: 'type',
  categoryId: 'categoryId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isDeleted: 'isDeleted'
};

exports.Prisma.ProductAttributeScalarFieldEnum = {
  id: 'id',
  name: 'name',
  options: 'options',
  productId: 'productId'
};

exports.Prisma.ProductVariantScalarFieldEnum = {
  id: 'id',
  sku: 'sku',
  price: 'price',
  salePrice: 'salePrice',
  stock: 'stock',
  options: 'options',
  image: 'image',
  productId: 'productId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isDefault: 'isDefault'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  name: 'name',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt',
  productId: 'productId',
  userId: 'userId'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  totalPrice: 'totalPrice',
  paymentMethod: 'paymentMethod',
  itemsPrice: 'itemsPrice',
  taxPrice: 'taxPrice',
  shippingPrice: 'shippingPrice',
  isPaid: 'isPaid',
  paidAt: 'paidAt',
  isDelivered: 'isDelivered',
  deliveredAt: 'deliveredAt',
  status: 'status',
  street: 'street',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  country: 'country',
  paymentId: 'paymentId',
  transactionId: 'transactionId',
  paymentStatus: 'paymentStatus',
  paymentEmail: 'paymentEmail',
  userId: 'userId',
  guestName: 'guestName',
  guestEmail: 'guestEmail',
  guestPhone: 'guestPhone',
  phone: 'phone',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  shippingEmail: 'shippingEmail',
  shippingMethod: 'shippingMethod'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  name: 'name',
  quantity: 'quantity',
  image: 'image',
  price: 'price',
  variantId: 'variantId',
  orderId: 'orderId',
  productId: 'productId'
};

exports.Prisma.ShippingMethodScalarFieldEnum = {
  id: 'id',
  name: 'name',
  price: 'price',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  code: 'code',
  discountType: 'discountType',
  discountValue: 'discountValue',
  expiryDate: 'expiryDate',
  isActive: 'isActive',
  maxUses: 'maxUses',
  usedCount: 'usedCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SettingsScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  updatedAt: 'updatedAt'
};

exports.Prisma.BannerScalarFieldEnum = {
  id: 'id',
  title: 'title',
  subtitle: 'subtitle',
  image: 'image',
  link: 'link',
  isActive: 'isActive',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.UserOrderByRelevanceFieldEnum = {
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  phone: 'phone',
  street: 'street',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  country: 'country'
};

exports.Prisma.CategoryOrderByRelevanceFieldEnum = {
  name: 'name',
  slug: 'slug',
  image: 'image',
  description: 'description'
};

exports.Prisma.ProductOrderByRelevanceFieldEnum = {
  name: 'name',
  slug: 'slug',
  description: 'description',
  images: 'images'
};

exports.Prisma.ProductAttributeOrderByRelevanceFieldEnum = {
  name: 'name',
  options: 'options'
};

exports.Prisma.ProductVariantOrderByRelevanceFieldEnum = {
  sku: 'sku',
  options: 'options',
  image: 'image'
};

exports.Prisma.ReviewOrderByRelevanceFieldEnum = {
  name: 'name',
  comment: 'comment'
};

exports.Prisma.OrderOrderByRelevanceFieldEnum = {
  paymentMethod: 'paymentMethod',
  status: 'status',
  street: 'street',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  country: 'country',
  paymentId: 'paymentId',
  transactionId: 'transactionId',
  paymentStatus: 'paymentStatus',
  paymentEmail: 'paymentEmail',
  guestName: 'guestName',
  guestEmail: 'guestEmail',
  guestPhone: 'guestPhone',
  phone: 'phone',
  shippingEmail: 'shippingEmail',
  shippingMethod: 'shippingMethod'
};

exports.Prisma.OrderItemOrderByRelevanceFieldEnum = {
  name: 'name',
  image: 'image'
};

exports.Prisma.ShippingMethodOrderByRelevanceFieldEnum = {
  name: 'name'
};

exports.Prisma.CouponOrderByRelevanceFieldEnum = {
  code: 'code',
  discountType: 'discountType'
};

exports.Prisma.SettingsOrderByRelevanceFieldEnum = {
  key: 'key',
  value: 'value'
};

exports.Prisma.BannerOrderByRelevanceFieldEnum = {
  title: 'title',
  subtitle: 'subtitle',
  image: 'image',
  link: 'link'
};
exports.ProductType = exports.$Enums.ProductType = {
  SIMPLE: 'SIMPLE',
  VARIABLE: 'VARIABLE'
};

exports.Prisma.ModelName = {
  User: 'User',
  Category: 'Category',
  Product: 'Product',
  ProductAttribute: 'ProductAttribute',
  ProductVariant: 'ProductVariant',
  Review: 'Review',
  Order: 'Order',
  OrderItem: 'OrderItem',
  ShippingMethod: 'ShippingMethod',
  Coupon: 'Coupon',
  Settings: 'Settings',
  Banner: 'Banner'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
