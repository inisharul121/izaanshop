'use client';

import React, { useState } from 'react';
import { X, CreditCard, Users, Phone, MapPin, Check, Truck, ShieldCheck, RefreshCw, Image as ImageIcon, Upload } from 'lucide-react';
import api, { getImageUrl } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export const OrderModal = ({ order, isOpen, onClose, onDeliver }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h4 className="text-xl font-bold text-dark flex items-center gap-2">
              Order Details <span className="text-sm font-medium text-gray-400">#{String(order.id).padStart(6, '0')}</span>
            </h4>
            <p className="text-xs text-gray-400 font-medium">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {order.status}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Payment Method</p>
              <p className="text-sm font-bold text-dark flex items-center gap-2 uppercase">
                <CreditCard className="w-4 h-4 text-gray-400" /> {order.paymentMethod}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Customer info</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">{order.user?.name || order.guestName || 'Guest'}</p>
                  <p className="text-xs text-gray-400">{order.user?.email || order.guestEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0 text-green-600">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-dark">{order.phone}</p>
                  <p className="text-xs text-gray-400">Contact Phone</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Items</h5>
             <div className="space-y-3">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-gray-100 shrink-0">
                    <img src={getImageUrl(item.image)} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-dark truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 uppercase">{item.quantity} x {item.price}৳</p>
                  </div>
                  <p className="text-sm font-black text-dark">{item.quantity * item.price}৳</p>
                </div>
              ))}
             </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Grand Total</p>
              <p className="text-3xl font-black text-dark">{order.totalPrice}৳</p>
            </div>
            {order.isPaid && <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase"><Check className="w-4 h-4" /> Paid</div>}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 px-4 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-500">Close</button>
          {!order.isDelivered && (
             <button onClick={() => { onDeliver(order.id); onClose(); }} className="flex-1 py-3 px-4 bg-primary text-white rounded-xl text-sm font-bold hover:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <Truck className="w-4 h-4" /> Mark Delivered
             </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export const ProductModal = ({ 
  isOpen, 
  onClose, 
  editingItem, 
  categories,
  onSave, 
  uploading,
  // Variant props
  productType,
  setProductType,
  attributes,
  setAttributes,
  variants,
  setVariants,
  slug,
  setSlug
}) => {
  const [mainImage, setMainImage] = useState(editingItem?.images?.main || (editingItem?.images ? JSON.parse(editingItem.images).main : ''));
  const [uploadingImage, setUploadingImage] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMainImage(data.mainImage);
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (!editingItem?.id) {
      setSlug(value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  };

  const addAttribute = () => setAttributes([...attributes, { name: '', options: [], inputVal: '' }]);
  const removeAttribute = (idx) => setAttributes(attributes.filter((_, i) => i !== idx));
  const updateAttributeName = (idx, name) => {
    const newAttrs = [...attributes];
    newAttrs[idx].name = name;
    setAttributes(newAttrs);
  };
  const updateAttributeInput = (idx, val) => {
    const newAttrs = [...attributes];
    newAttrs[idx].inputVal = val;
    setAttributes(newAttrs);
  };
  const addOptionTag = (idx) => {
    const newAttrs = [...attributes];
    if (newAttrs[idx].inputVal.trim() && !newAttrs[idx].options.includes(newAttrs[idx].inputVal.trim())) {
      newAttrs[idx].options.push(newAttrs[idx].inputVal.trim());
      newAttrs[idx].inputVal = '';
      setAttributes(newAttrs);
    }
  };
  const removeOptionTag = (idx, opt) => {
    const newAttrs = [...attributes];
    newAttrs[idx].options = newAttrs[idx].options.filter(o => o !== opt);
    setAttributes(newAttrs);
  };

  const generateVariants = () => {
    if (attributes.length === 0) return;
    const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => ({ ...d, [b.name]: e }))));
    const attrData = attributes.filter(a => a.name && a.options.length > 0);
    if (attrData.length === 0) return;

    let combos = attrData[0].options.map(opt => ({ [attrData[0].name]: opt }));
    for (let i = 1; i < attrData.length; i++) {
        const next = [];
        for (const c of combos) {
            for (const opt of attrData[i].options) {
                next.push({...c, [attrData[i].name]: opt});
            }
        }
        combos = next;
    }

    setVariants(combos.map(c => ({
      options: c,
      price: null,
      salePrice: null,
      stock: null,
      sku: `${slug}-${Object.values(c).join('-')}`.toLowerCase()
    })));
  };

  const updateVariant = (idx, field, val) => {
    const newVariants = [...variants];
    newVariants[idx][field] = val;
    setVariants(newVariants);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h4 className="text-xl font-bold">{editingItem?.id ? 'Edit' : 'Add'} Product</h4>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={onSave} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Product Name</label>
              <input name="name" defaultValue={editingItem?.name} onChange={handleNameChange} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
              <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Product Type</label>
            <div className="flex gap-4">
              <button type="button" onClick={() => setProductType('SIMPLE')} className={`flex-1 py-3 rounded-xl text-sm font-bold border ${productType === 'SIMPLE' ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-transparent'}`}>Simple</button>
              <button type="button" onClick={() => setProductType('VARIABLE')} className={`flex-1 py-3 rounded-xl text-sm font-bold border ${productType === 'VARIABLE' ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-transparent'}`}>Variable</button>
            </div>
          </div>

          {productType === 'VARIABLE' && (
             <div className="space-y-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                <div className="flex justify-between items-center">
                   <h5 className="text-xs font-black uppercase text-gray-400">Attributes & Variants</h5>
                   <button type="button" onClick={addAttribute} className="text-[10px] font-black uppercase text-primary border border-primary/20 px-2 py-1 rounded-md hover:bg-primary/5 transition-all">Add Attribute</button>
                </div>
                {attributes.map((attr, idx) => (
                  <div key={idx} className="space-y-2 bg-white p-3 rounded-xl border border-gray-100">
                    <div className="flex gap-2">
                      <input placeholder="Attribute (e.g. Color)" value={attr.name} onChange={(e) => updateAttributeName(idx, e.target.value)} className="flex-1 bg-gray-50 border-none rounded-lg p-2 text-xs font-bold" />
                      <button type="button" onClick={() => removeAttribute(idx)} className="text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                       {attr.options.map(o => <span key={o} className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">{o} <button type="button" onClick={() => removeOptionTag(idx, o)}><X className="w-2.5 h-2.5" /></button></span>)}
                    </div>
                    <div className="flex gap-2">
                       <input placeholder="Add option" value={attr.inputVal} onChange={(e) => updateAttributeInput(idx, e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOptionTag(idx))} className="flex-1 bg-gray-50 border-none rounded-lg p-2 text-[10px]" />
                       <button type="button" onClick={() => addOptionTag(idx)} className="bg-dark text-white text-[10px] px-3 py-1 rounded-lg">Add</button>
                    </div>
                  </div>
                ))}
                {attributes.length > 0 && <button type="button" onClick={generateVariants} className="w-full py-2 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Generate {variants.length > 0 ? 'Again' : ''} ({variants.length})</button>}
             </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Base Price</label>
              <input name="price" type="number" defaultValue={editingItem?.price} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Sale Price</label>
              <input name="salePrice" type="number" defaultValue={editingItem?.salePrice} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Stock</label>
              <input name="stock" type="number" defaultValue={editingItem?.stock} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
            <select name="categoryId" defaultValue={editingItem?.categoryId} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
            <textarea name="description" defaultValue={editingItem?.description} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm min-h-[100px]" placeholder="Product details..."></textarea>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Product Image</label>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 group relative">
                {mainImage ? (
                  <>
                    <img src={getImageUrl(mainImage)} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <p className="text-[10px] text-white font-bold">Change</p>
                    </div>
                  </>
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                {uploadingImage && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><RefreshCw className="w-5 h-5 animate-spin text-primary" /></div>}
              </div>
              <div className="flex-1 space-y-2">
                <input 
                  name="mainImage" 
                  value={mainImage} 
                  onChange={(e) => setMainImage(e.target.value)} 
                  placeholder="Or paste image URL here..." 
                  className="w-full bg-gray-50 border-none rounded-xl p-3 text-xs" 
                />
                <p className="text-[10px] text-gray-400 italic">Preferred: Square image (800x800px). Supports PNG, JPG.</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" disabled={uploading} className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:bg-gray-400 transition-all font-black uppercase tracking-widest">
              {uploading ? 'Saving Product...' : 'Save Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const CategoryModal = ({ isOpen, onClose, editingItem, setEditingItem, slug, setSlug, onSave, uploading }) => {
  if (!isOpen) return null;

  const handleNameChange = (e) => {
    const value = e.target.value;
    if (!editingItem?.id) {
      setSlug(value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h4 className="text-xl font-bold">{editingItem?.id ? 'Edit' : 'Add'} Category</h4>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Category Name</label>
            <input name="name" defaultValue={editingItem?.name} onChange={handleNameChange} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Slug</label>
            <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Banner Image URL</label>
            <input name="image" defaultValue={editingItem?.image} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" placeholder="https://..." />
          </div>
          <div className="pt-4">
            <button type="submit" disabled={uploading} className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:bg-gray-400 transition-all">
              {uploading ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export const CouponModal = ({ isOpen, onClose, editingItem, onSave, uploading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h4 className="text-xl font-bold">{editingItem?.id ? 'Edit' : 'Add'} Coupon</h4>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={onSave} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Code</label>
              <input name="code" defaultValue={editingItem?.code} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/20" placeholder="SUMMER20" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Discount Type</label>
              <select name="discountType" defaultValue={editingItem?.discountType || 'Percentage'} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm">
                <option value="Percentage">Percentage (%)</option>
                <option value="Fixed">Fixed Amount (৳)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Value</label>
              <input name="discountValue" type="number" defaultValue={editingItem?.discountValue} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Expiry Date</label>
              <input name="expiryDate" type="date" defaultValue={editingItem?.expiryDate?.split('T')[0]} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" disabled={uploading} className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold shadow-lg shadow-primary/20 disabled:bg-gray-400 transition-all">
              {uploading ? 'Saving...' : 'Save Coupon'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
