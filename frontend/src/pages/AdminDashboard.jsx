import React, { useState } from 'react';
import api from '../utils/api';
import { LayoutDashboard, ShoppingBag, Users, BarChart3, Plus, Edit, Trash2, Check, X, Filter, Ticket, CreditCard, Tag, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'product', 'category', 'coupon'
  const [editingItem, setEditingItem] = useState(null);
  const [slug, setSlug] = useState('');
  const [uploading, setUploading] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectingFor, setSelectingFor] = useState(null); // 'main', 'gallery'
  const [productType, setProductType] = useState('SIMPLE');
  const [attributes, setAttributes] = useState([]); // [{ name: 'Color', options: ['Red', 'Blue'], inputVal: '' }]
  const [variants, setVariants] = useState([]); // [{ sku: '', price: 0, stock: 0, options: {} }]

  const getImageUrl = (img) => {
    if (!img) return 'https://placehold.co/400x400/F8F9FA/2D3748?text=Product';
    if (img.startsWith('http')) return img;
    const cleanPath = img.startsWith('/') ? img : `/${img}`;
    return `http://localhost:5001${cleanPath}`;
  };

  const fetchMedia = async () => {
    try {
      const res = await api.get('/media');
      setMediaFiles(res.data);
      setShowMediaLibrary(true);
    } catch (error) {
      alert('Error fetching media');
    }
  };

  const selectMedia = (file) => {
    if (selectingFor === 'main') {
      setEditingItem(prev => ({
        ...prev,
        images: { ...prev?.images, main: file.url }
      }));
    } else if (selectingFor === 'gallery') {
      setEditingItem(prev => ({
        ...prev,
        images: { 
          ...prev?.images, 
          gallery: [...(prev?.images?.gallery || []), file.url] 
        }
      }));
    }
    setShowMediaLibrary(false);
  };

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
    setSlug(item?.slug || '');
    setMainImage(null);
    setGalleryFiles([]);
    setProductType(item?.type || 'SIMPLE');
    setAttributes((item?.attributes || []).map(a => ({ ...a, inputVal: '' })));
    setVariants(item?.variants || []);
    setShowModal(true);
  };

  const handleNameChange = (e) => {
    const val = e.target.value;
    if (!editingItem) {
      setSlug(val.toLowerCase().trim().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Add variants and attributes if VARIABLE
    if (modalType === 'product') {
      data.type = productType;
      if (productType === 'VARIABLE') {
        data.attributes = attributes;
        data.variants = variants;
      }
    }
    try {
      setUploading(true);

      // Handle Image Uploads if product
      if (modalType === 'product') {
        let mainImageUrl = editingItem?.images?.main || '';
        let galleryUrls = editingItem?.images?.gallery || [];

        if (mainImage || galleryFiles.length > 0) {
          const uploadData = new FormData();
          if (mainImage) uploadData.append('image', mainImage);
          galleryFiles.forEach(file => uploadData.append('gallery', file));

          const uploadRes = await api.post('/upload', uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          if (uploadRes.data.mainImage) mainImageUrl = uploadRes.data.mainImage;
          if (uploadRes.data.gallery.length > 0) {
            galleryUrls = [...galleryUrls, ...uploadRes.data.gallery];
          }
        }

        data.mainImage = mainImageUrl;
        data.gallery = galleryUrls;
      }

      // Convert numerical fields
      if (data.price) data.price = Number(data.price);
      if (data.salePrice) data.salePrice = Number(data.salePrice);
      else delete data.salePrice;
      
      data.stock = data.stock ? Number(data.stock) : 0;
      if (data.category) data.category = Number(data.category);
      if (data.discountValue) data.discountValue = Number(data.discountValue);
      if (data.maxUses) data.maxUses = Number(data.maxUses);
      
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
      const data = error.response?.data;
      const detail = data?.error ? ` (${data.error})` : '';
      const hint = data?.hint ? `\nHint: ${data.hint}` : '';
      alert(`Operation failed: ${data?.message || error.message}${detail}${hint}`);
    } finally {
      setUploading(false);
    }
  };

  const addAttribute = () => {
    setAttributes([...attributes, { name: '', options: [], inputVal: '' }]);
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
    setVariants([]); // reset variants when attr removed
  };

  const updateAttributeName = (index, value) => {
    const newAttrs = [...attributes];
    newAttrs[index].name = value;
    setAttributes(newAttrs);
  };

  const updateAttributeInput = (index, value) => {
    const newAttrs = [...attributes];
    newAttrs[index].inputVal = value;
    setAttributes(newAttrs);
  };

  const addOptionTag = (index) => {
    const newAttrs = [...attributes];
    const val = (newAttrs[index].inputVal || '').trim();
    if (!val) return;
    if (!newAttrs[index].options.includes(val)) {
      newAttrs[index].options = [...newAttrs[index].options, val];
    }
    newAttrs[index].inputVal = '';
    setAttributes(newAttrs);
    setVariants([]); // reset variants on change
  };

  const removeOptionTag = (attrIndex, option) => {
    const newAttrs = [...attributes];
    newAttrs[attrIndex].options = newAttrs[attrIndex].options.filter(o => o !== option);
    setAttributes(newAttrs);
    setVariants([]);
  };

  const addPreset = (name) => {
    const exists = attributes.find(a => a.name.toLowerCase() === name.toLowerCase());
    if (exists) {
      alert(`Attribute "${name}" already exists.`);
      return;
    }
    setAttributes([...attributes, { name, options: [], inputVal: '' }]);
  };

  const generateVariants = () => {
    if (attributes.length === 0) return;
    const emptyAttr = attributes.find(a => a.options.length === 0);
    if (emptyAttr) {
      alert(`Attribute "${emptyAttr.name || 'unnamed'}" has no options. Please add at least one option.`);
      return;
    }
    const cartesian = (...args) => args.reduce((a, b) => a.flatMap(d => b.map(e => ({ ...d, ...e }))), [{}]);
    const attrOptions = attributes.map(attr =>
      attr.options.map(opt => ({ [attr.name]: opt }))
    );
    const generated = cartesian(...attrOptions);
    setVariants(generated.map(opt => ({
      sku: `${slug}-${Object.values(opt).join('-')}`.toLowerCase(),
      price: null,
      salePrice: null,
      stock: null,
      options: opt,
      image: editingItem?.images?.main || ''
    })));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = field === 'price' || field === 'stock' || field === 'salePrice' ? (value === '' ? null : Number(value)) : value;
    setVariants(newVariants);
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
                    <img src={getImageUrl(product.images?.main || product.images?.[0])} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
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
                      <img src={getImageUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover" />
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
                      <input name="name" defaultValue={editingItem?.name} onChange={handleNameChange} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
                      <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>

                  <div className="space-y-1 py-4 border-t border-b border-gray-100">
                    <label className="text-xs font-bold text-gray-400 uppercase">Product Type</label>
                    <div className="flex gap-4 pt-2">
                       <button 
                        type="button"
                        onClick={() => setProductType('SIMPLE')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${productType === 'SIMPLE' ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                       >
                         Simple Product
                       </button>
                       <button 
                        type="button"
                        onClick={() => setProductType('VARIABLE')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${productType === 'VARIABLE' ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100'}`}
                       >
                         Variable Product
                       </button>
                    </div>
                  </div>

                  {productType === 'VARIABLE' && (
                    <div className="space-y-5">
                      {/* Preset + Custom buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => addPreset('Color')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Color
                        </button>
                        <button type="button" onClick={() => addPreset('Size')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Size
                        </button>
                        <button type="button" onClick={() => addPreset('Material')} className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:border-primary hover:text-primary transition-all flex items-center gap-1">
                          <Plus className="w-3 h-3" /> Material
                        </button>
                        <button type="button" onClick={addAttribute} className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-bold text-primary hover:bg-primary/20 transition-all flex items-center gap-1">
                          <Tag className="w-3 h-3" /> Custom
                        </button>
                      </div>

                      {/* Attribute Cards */}
                      {attributes.map((attr, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
                          <div className="flex items-center gap-3">
                            <input
                              placeholder="Attribute name (e.g. Color)"
                              value={attr.name}
                              onChange={(e) => updateAttributeName(idx, e.target.value)}
                              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                            <button type="button" onClick={() => removeAttribute(idx)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Tag chips */}
                          <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                            {attr.options.map(opt => (
                              <span key={opt} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg">
                                {opt}
                                <button type="button" onClick={() => removeOptionTag(idx, opt)} className="hover:text-red-500 transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                            {attr.options.length === 0 && <span className="text-[10px] text-gray-300 italic self-center">No options yet — type below and press Enter</span>}
                          </div>

                          {/* Option input */}
                          <div className="flex gap-2">
                            <input
                              placeholder={`Add ${attr.name || 'option'} (e.g. Red)`}
                              value={attr.inputVal || ''}
                              onChange={(e) => updateAttributeInput(idx, e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addOptionTag(idx); } }}
                              className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                            />
                            <button type="button" onClick={() => addOptionTag(idx)} className="px-3 py-2 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-dark transition-colors flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Add
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Generate / Clear buttons */}
                      {attributes.length > 0 && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={generateVariants}
                            className="flex-1 py-3 bg-dark text-white rounded-xl text-sm font-bold hover:bg-dark/90 transition-all flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                            {variants.length > 0 ? `Regenerate (${variants.length})` : 'Generate Variants'}
                          </button>
                          {variants.length > 0 && (
                            <button
                              type="button"
                              onClick={() => setVariants([])}
                              className="px-4 py-3 border border-gray-200 text-gray-400 rounded-xl text-sm font-bold hover:border-red-200 hover:text-red-500 transition-all"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      )}

                      {/* Variant Rows */}
                      {variants.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{variants.length} Variant{variants.length > 1 ? 's' : ''} — leave price/stock blank to use base values</p>
                          {variants.map((variant, vIdx) => (
                            <div key={vIdx} className="p-4 border border-gray-100 rounded-2xl space-y-3 bg-white">
                              {/* Option badges */}
                              <div className="flex flex-wrap gap-1.5">
                                {Object.entries(variant.options).map(([key, val]) => (
                                  <span key={key} className="px-2 py-0.5 bg-dark/5 text-dark text-[10px] font-bold rounded-md">{key}: {val}</span>
                                ))}
                              </div>
                              {/* 3-col grid: Price · Sale · Stock */}
                              <div className="grid grid-cols-3 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">Price</label>
                                  <input
                                    type="number"
                                    placeholder="Base"
                                    value={variant.price ?? ''}
                                    onChange={(e) => updateVariant(vIdx, 'price', e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-lg px-2 py-2 text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">Sale Price</label>
                                  <input
                                    type="number"
                                    placeholder="—"
                                    value={variant.salePrice ?? ''}
                                    onChange={(e) => updateVariant(vIdx, 'salePrice', e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-lg px-2 py-2 text-sm"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-400 uppercase">Stock</label>
                                  <input
                                    type="number"
                                    placeholder="Base"
                                    value={variant.stock ?? ''}
                                    onChange={(e) => updateVariant(vIdx, 'stock', e.target.value)}
                                    className="w-full bg-gray-50 border-none rounded-lg px-2 py-2 text-sm"
                                  />
                                </div>
                              </div>
                              {/* SKU full-width */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-400 uppercase">SKU</label>
                                <input
                                  value={variant.sku || ''}
                                  onChange={(e) => updateVariant(vIdx, 'sku', e.target.value)}
                                  className="w-full bg-gray-50 border-none rounded-lg px-2 py-2 text-xs font-mono text-gray-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-gray-50">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        {productType === 'VARIABLE' ? 'Base Price' : 'Price'}
                      </label>
                      <input name="price" type="number" defaultValue={editingItem?.price} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        {productType === 'VARIABLE' ? 'Base Sale Price' : 'Sale Price'} (Optional)
                      </label>
                      <input name="salePrice" type="number" defaultValue={editingItem?.salePrice} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">
                        {productType === 'VARIABLE' ? 'Base Stock' : 'Stock'} (Optional)
                      </label>
                      <input name="stock" type="number" defaultValue={editingItem?.stock} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
                    <select name="category" defaultValue={editingItem?.categoryId} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase flex justify-between">
                        Main Image
                        <button type="button" onClick={() => { setSelectingFor('main'); fetchMedia(); }} className="text-primary hover:underline">Select from Media</button>
                      </label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setMainImage(e.target.files[0])}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                      />
                      {editingItem?.images?.main && <p className="text-[10px] text-gray-400 truncate">Current: {editingItem.images.main.split('/').pop()}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase flex justify-between">
                        Gallery Images
                        <button type="button" onClick={() => { setSelectingFor('gallery'); fetchMedia(); }} className="text-primary hover:underline">Select from Media</button>
                      </label>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*"
                        onChange={(e) => setGalleryFiles(Array.from(e.target.files))}
                        className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                      />
                      {editingItem?.images?.gallery?.length > 0 && <p className="text-[10px] text-gray-400">{editingItem.images.gallery.length} current items</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description} required rows="4" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                </>
              ) : modalType === 'category' ? (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Category Name</label>
                    <input name="name" defaultValue={editingItem?.name} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
                      <input name="slug" defaultValue={editingItem?.slug} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Image URL</label>
                      <input name="image" defaultValue={editingItem?.image} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                    <textarea name="description" defaultValue={editingItem?.description} rows="3" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Coupon Code</label>
                      <input name="code" defaultValue={editingItem?.code} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Discount Type</label>
                      <select name="discountType" defaultValue={editingItem?.discountType || 'Percentage'} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20">
                        <option value="Percentage">Percentage (%)</option>
                        <option value="Fixed">Fixed Amount (৳)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Value</label>
                      <input name="discountValue" type="number" defaultValue={editingItem?.discountValue} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Max Uses (Optional)</label>
                      <input name="maxUses" type="number" defaultValue={editingItem?.maxUses} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-400 uppercase">Expiry Date</label>
                      <input name="expiryDate" type="date" defaultValue={editingItem?.expiryDate?.split('T')[0]} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={uploading}
                  className={`w-full py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark shadow-primary/20'}`}
                >
                  {uploading ? 'Uploading & Saving...' : editingItem ? 'Save Changes' : `Create ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h4 className="text-xl font-bold">Select Media</h4>
              <button onClick={() => setShowMediaLibrary(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {mediaFiles.map((file, i) => (
                <div 
                  key={i} 
                  onClick={() => selectMedia(file)}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary cursor-pointer transition-all bg-gray-50"
                >
                  <img src={getImageUrl(file.url)} alt={file.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-dark/80 p-2 transform translate-y-full group-hover:translate-y-0 transition-transform">
                    <p className="text-[10px] text-white truncate text-center">{file.name}</p>
                  </div>
                </div>
              ))}
              {mediaFiles.length === 0 && <p className="col-span-full text-center py-10 text-gray-400">No media files found.</p>}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
