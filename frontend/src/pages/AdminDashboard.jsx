import React from 'react';
import api from '../utils/api';
import { LayoutDashboard, ShoppingBag, Users, BarChart3, Plus, Edit, Trash2, Check, X, Filter, Ticket, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = React.useState('orders');
  const [orders, setOrders] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [coupons, setCoupons] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState(''); // 'product', 'category', 'coupon'
  const [editingItem, setEditingItem] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [orderRes, prodRes, catRes, coupRes] = await Promise.all([
          api.get('/orders'),
          api.get('/products'),
          api.get('/categories'),
          api.get('/coupons')
        ]);
        setOrders(orderRes.data);
        setProducts(prodRes.data.products);
        setCategories(catRes.data);
        setCoupons(coupRes.data);
      } catch (error) {
        console.error('Admin fetch error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleDeliver = async (id) => {
    try {
      await api.put(`/orders/${id}/deliver`);
      setOrders(orders.map(o => o.id === id ? { ...o, isDelivered: true, status: 'Delivered' } : o));
    } catch (error) {
      alert('Action failed');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      try {
        await api.delete(`/coupons/${id}`);
        setCoupons(coupons.filter(c => c.id !== id));
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Convert numerical fields
    if (data.price) data.price = Number(data.price);
    if (data.salePrice) data.salePrice = Number(data.salePrice);
    else delete data.salePrice; // Remove empty string so backend uses null
    
    if (data.stock) data.stock = Number(data.stock);
    if (data.category) data.category = Number(data.category);
    if (data.discountValue) data.discountValue = Number(data.discountValue);
    if (data.maxUses) data.maxUses = Number(data.maxUses);
    
    // Images array (simplified for now)
    if (data.image) data.images = [data.image];

    try {
      if (modalType === 'product') {
        if (editingItem) {
          const res = await api.put(`/products/${editingItem.id}`, data);
          setProducts(products.map(p => p.id === editingItem.id ? res.data : p));
        } else {
          const res = await api.post('/products', data);
          setProducts([res.data, ...products]);
        }
      } else if (modalType === 'category') {
        if (editingItem) {
          const res = await api.put(`/categories/${editingItem.id}`, data);
          setCategories(categories.map(c => c.id === editingItem.id ? res.data : c));
        } else {
          const res = await api.post('/categories', data);
          setCategories([res.data, ...categories]);
        }
      } else if (modalType === 'coupon') {
        if (editingItem) {
          const res = await api.put(`/coupons/${editingItem.id}`, data);
          setCoupons(coupons.map(c => c.id === editingItem.id ? res.data : c));
        } else {
          const res = await api.post('/coupons', data);
          setCoupons([res.data, ...coupons]);
        }
      }
      setShowModal(false);
    } catch (error) {
      alert('Operation failed: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 space-y-2">
          <h2 className="text-xl font-bold mb-6 px-4">Admin Panel</h2>
          {[
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'orders', label: 'Manage Orders', icon: ShoppingBag },
            { id: 'products', label: 'Manage Products', icon: LayoutDashboard },
            { id: 'categories', label: 'Manage Categories', icon: Filter },
            { id: 'coupons', label: 'Coupons', icon: Ticket },
            { id: 'payments', label: 'Payments', icon: CreditCard },
            { id: 'users', label: 'Shop Customers', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl text-sm font-medium transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm overflow-hidden">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-bold capitalize">{activeTab.replace('-', ' ')}</h3>
            {activeTab === 'products' && (
              <button onClick={() => handleOpenModal('product')} className="btn-primary flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Add Product
              </button>
            )}
            {activeTab === 'coupons' && (
              <button onClick={() => handleOpenModal('coupon')} className="btn-primary flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Add Coupon
              </button>
            )}
            {activeTab === 'categories' && (
              <button onClick={() => handleOpenModal('category')} className="btn-primary flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-50 rounded-xl"></div>)}
            </div>
          ) : activeTab === 'orders' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4 font-bold">Customer</th>
                    <th className="pb-4 font-bold">Total</th>
                    <th className="pb-4 font-bold">Paid</th>
                    <th className="pb-4 font-bold">Delivered</th>
                    <th className="pb-4 font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-5">
                        <p className="font-bold text-dark">{order.user?.name || 'Guest'}</p>
                        <p className="text-[10px] text-gray-400">{String(order.id).padStart(6, '0')}</p>
                      </td>
                      <td className="py-5 font-bold">{order.totalPrice}৳</td>
                      <td className="py-5 text-gray-400">
                        {order.isPaid ? (
                          <span className="text-green-500 flex items-center gap-1 font-bold text-xs"><Check className="w-3 h-3" /> YES</span>
                        ) : 'NO'}
                      </td>
                      <td className="py-5">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.isDelivered ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-5">
                        {!order.isDelivered && (
                          <button onClick={() => handleDeliver(order.id)} className="text-primary hover:underline text-xs font-bold">Mark Delivered</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'products' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group p-4 border border-gray-100 rounded-3xl hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50">
                    <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-dark line-clamp-1">{product.name}</p>
                    <div className="flex justify-between items-center">
                      <p className="text-primary font-bold">{product.price}৳</p>
                      <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded-full font-medium text-gray-500">Stock: {product.stock}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => handleOpenModal('product', product)} className="flex-1 p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors flex justify-center"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="flex-1 p-2 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors flex justify-center"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'categories' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="p-4 border border-gray-100 rounded-3xl text-center space-y-3">
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto overflow-hidden">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    ) : (
                      <Filter className="w-8 h-8 text-primary" />
                    )}
                  </div>
                   <p className="font-bold text-dark">{cat.name}</p>
                   <div className="flex gap-2 pt-2">
                    <button onClick={() => handleOpenModal('category', cat)} className="flex-1 p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-primary"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="flex-1 p-2 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'coupons' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4 font-bold">Code</th>
                    <th className="pb-4 font-bold">Discount</th>
                    <th className="pb-4 font-bold">Expires</th>
                    <th className="pb-4 font-bold">Usage</th>
                    <th className="pb-4 font-bold">Status</th>
                    <th className="pb-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="text-sm">
                      <td className="py-5 font-bold text-primary">{coupon.code}</td>
                      <td className="py-5">
                        {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : '৳'}
                      </td>
                      <td className="py-5 text-gray-400">
                        {coupon.expiryDate ? format(new Date(coupon.expiryDate), 'dd MMM yyyy') : 'No Expiry'}
                      </td>
                      <td className="py-5">
                        {coupon.usedCount} / {coupon.maxUses || '∞'}
                      </td>
                      <td className="py-5">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${coupon.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {coupon.isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="py-5 text-right space-x-2">
                        <button onClick={() => handleOpenModal('coupon', coupon)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-primary"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteCoupon(coupon.id)} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : activeTab === 'payments' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    <th className="pb-4 font-bold">Order ID</th>
                    <th className="pb-4 font-bold">Date</th>
                    <th className="pb-4 font-bold">Customer</th>
                    <th className="pb-4 font-bold">Method</th>
                    <th className="pb-4 font-bold">Amount</th>
                    <th className="pb-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.filter(o => o.isPaid).map((order) => (
                    <tr key={order.id} className="text-sm">
                      <td className="py-5 font-bold">#{String(order.id).padStart(6, '0')}</td>
                      <td className="py-5 text-gray-400">{format(new Date(order.paidAt || order.createdAt), 'dd MMM yyyy')}</td>
                      <td className="py-5 font-bold">{order.user?.name || 'Guest'}</td>
                      <td className="py-5 capitalize">{order.paymentMethod}</td>
                      <td className="py-5 font-bold">{order.totalPrice}৳</td>
                      <td className="py-5">
                        <span className="bg-green-50 text-green-600 px-2 py-1 rounded text-[10px] font-bold">COMPLETED</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center opacity-30">
               <BarChart3 className="w-20 h-20 mx-auto mb-4" />
               <p>Detailed analytics module is coming soon.</p>
            </div>
          )}
        </main>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h4 className="text-xl font-bold">
                {editingItem ? 'Edit' : 'Add New'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h4>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {modalType === 'product' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Product Name</label>
                      <input name="name" defaultValue={editingItem?.name} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
                      <input name="slug" defaultValue={editingItem?.slug} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Regular Price</label>
                      <input name="price" type="number" defaultValue={editingItem?.price} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Sale Price (Optional)</label>
                      <input name="salePrice" type="number" defaultValue={editingItem?.salePrice} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Stock Count</label>
                      <input name="stock" type="number" defaultValue={editingItem?.stock} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                    <select name="category" defaultValue={editingItem?.categoryId} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Main Image URL</label>
                    <input name="image" defaultValue={editingItem?.images?.[0]} required placeholder="https://..." className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description} rows="4" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                </>
              ) : modalType === 'category' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Category Name</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
                    <input name="slug" defaultValue={editingItem?.slug} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
                    <input name="image" defaultValue={editingItem?.image} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description} rows="3" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                </>
              ) : modalType === 'coupon' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Coupon Code</label>
                      <input name="code" defaultValue={editingItem?.code} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Discount Type</label>
                      <select name="discountType" defaultValue={editingItem?.discountType || 'percentage'} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (৳)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Discount Value</label>
                      <input name="discountValue" type="number" defaultValue={editingItem?.discountValue} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Max Uses (Optional)</label>
                      <input name="maxUses" type="number" defaultValue={editingItem?.maxUses} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Expiry Date</label>
                      <input name="expiryDate" type="date" defaultValue={editingItem?.expiryDate ? format(new Date(editingItem.expiryDate), 'yyyy-MM-dd') : ''} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                </>
              ) : null}

              <div className="pt-4">
                <button type="submit" className="w-full btn-primary py-4 rounded-2xl font-bold shadow-lg shadow-primary/20">
                  {editingItem ? 'Save Changes' : `Create ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
