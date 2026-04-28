'use client';

import React, { useState } from 'react';
import { 
  X, CreditCard, Users, Phone, MapPin, Check, Truck, ShieldCheck, 
  RefreshCw, Image as ImageIcon, Upload, Printer 
} from 'lucide-react';
import api, { getImageUrl } from '@/utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

// ... other modals ...

export const InvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('invoice-content');
    const orderNumber = String(order.id).padStart(6, '0');
    
    const printWindow = window.open('', '', 'height=1000,width=800');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice-Order-#${orderNumber}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { 
              font-family: 'Inter', sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              background: white !important;
              color: black !important;
            }
            @media print {
              @page { margin: 0; size: a4 portrait; }
              body { margin: 0; padding: 0; }
              .custom-padding { padding: 1.5cm !important; }
            }
            .text-dark { color: #111827 !important; }
            .text-gray-400 { color: #6b7280 !important; }
            .text-gray-100 { color: #f3f4f6 !important; }
            .border-dark { border-color: #111827 !important; }
            .bg-dark\/60 { display: none !important; }
          </style>
        </head>
        <body class="custom-padding p-8">
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
                window.close();
              }, 800);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white w-full md:w-[95%] lg:max-w-3xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
      >
        {/* Modal Header - Hidden on Print */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 text-dark">
          <h4 className="text-xl font-bold flex items-center gap-2">Order Invoice</h4>
          <div className="flex gap-2">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-dark text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-dark/20 hover:bg-black transition-all"
            >
              <Printer className="w-4 h-4" /> Print Now
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm text-gray-400"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar" id="invoice-content">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-black text-dark mb-1 uppercase">IZAAN SHOP</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                Toys, Book & Learning Tools<br/>
                Dhaka, Bangladesh<br/>
                Support: +880 1752-530303<br/>
                Email: info@izaanshop.com
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-black text-gray-100 uppercase tracking-tighter mb-1">INVOICE</h2>
              <p className="text-xs font-bold text-dark">#{String(order.id).padStart(6, '0')}</p>
              <p className="text-[10px] text-gray-400 font-medium">{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
            </div>
          </div>

          {/* Info Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 py-6 border-t border-b border-gray-100">
            <div className="space-y-3">
              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bill To:</h5>
              <div>
                <p className="text-sm font-black text-dark uppercase">{order.user?.name || order.guestName || 'Guest'}</p>
                <p className="text-xs text-gray-400 mt-1">{order.phone}</p>
                {(order.shippingEmail || order.guestEmail) && (
                  <p className="text-[10px] text-gray-400 font-medium italic mt-0.5">{order.shippingEmail || order.guestEmail}</p>
                )}
                <p className="text-xs text-gray-400 leading-relaxed mt-2 italic max-w-[200px]">
                  {order.street}, {order.city}<br/>
                  {order.state} {order.zipCode}, {order.country}
                </p>
              </div>
            </div>
            <div className="space-y-3 text-right">
               <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order Info:</h5>
               <div>
                  <p className="text-xs font-bold text-dark uppercase">Pay: {order.paymentMethod}</p>
                  <p className="text-xs font-bold text-dark mt-1 uppercase">Ship: {order.shippingMethod || 'Standard'}</p>
                  <p className="text-xs font-bold text-dark mt-1 uppercase">Status: {order.status}</p>
                  <p className="text-xs font-bold text-dark mt-1 uppercase">Date: {format(new Date(order.createdAt), 'hh:mm a')}</p>
               </div>
            </div>
          </div>

          {/* Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="border-b-2 border-dark text-left">
                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400">Description</th>
                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Price</th>
                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Qty</th>
                <th className="py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.orderItems?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-3 min-w-[200px]">
                    <p className="text-[13px] font-bold text-dark">{item.name}</p>
                    {item.variant?.options && (
                      <p className="text-[10px] text-gray-400 mt-0.5 italic">
                        {Object.entries(typeof item.variant.options === 'string' ? JSON.parse(item.variant.options) : item.variant.options).map(([k, v]) => `${k}: ${v}`).join(', ')}
                      </p>
                    )}
                  </td>
                  <td className="py-3 text-xs font-bold text-gray-500 text-center">{item.price}৳</td>
                  <td className="py-3 text-xs font-bold text-gray-500 text-center">{item.quantity}</td>
                  <td className="py-3 text-sm font-black text-dark text-right">{item.quantity * item.price}৳</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Totals */}
          <div className="flex justify-end gap-12 pt-6 border-t-2 border-gray-100">
            <div className="space-y-2 text-right min-w-[150px]">
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Subtotal:</span>
                <span>{order.totalPrice}৳</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <span>Shipping:</span>
                <span>{order.shippingPrice}৳</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                <span className="text-[10px] font-black uppercase tracking-widest text-dark">Grand Total:</span>
                <span className="text-xl font-black text-dark">{order.totalPrice}৳</span>
              </div>
            </div>
          </div>

          {/* Signature / Footer - Only on Print */}
          <div className="hidden print:flex justify-between items-end mt-16 text-dark px-4">
             <div className="text-center w-40 border-t border-gray-200 pt-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer Signature</p>
             </div>
             <div className="text-center w-40 border-t border-gray-200 pt-1">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Store Manager</p>
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const MediaLibraryModal = ({ isOpen, onClose, onSelect, multiple = false }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  React.useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.get('/media')
        .then(res => setImages(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleSelect = (url) => {
    if (multiple) {
      if (selected.includes(url)) {
        setSelected(selected.filter(u => u !== url));
      } else {
        setSelected([...selected, url]);
      }
    } else {
      onSelect(url);
      onClose();
    }
  };

  const handleConfirm = () => {
    onSelect(selected);
    onClose();
    setSelected([]);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full md:w-[95%] lg:max-w-3xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h4 className="text-xl font-bold flex items-center gap-2">Media Library <span className="text-xs font-medium text-gray-400">({images.length} images)</span></h4>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
               <RefreshCw className="w-8 h-8 animate-spin text-primary" />
               <p className="text-xs font-bold uppercase tracking-widest">Scanning Library...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleToggleSelect(img.url)}
                  className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all relative group ${
                    selected.includes(img.url) ? 'border-primary ring-4 ring-primary/20' : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <img src={getImageUrl(img.url)} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <div className="bg-white/90 p-1.5 rounded-full shadow-sm">
                        <Check className={`w-4 h-4 ${selected.includes(img.url) ? 'text-primary' : 'text-gray-400'}`} />
                     </div>
                  </div>
                </div>
              ))}
              {images.length === 0 && <p className="col-span-full text-center py-20 text-gray-400 text-sm">No images found in the library.</p>}
            </div>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-400 font-medium">{multiple ? `${selected.length} items selected` : 'Select an image to continue'}</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400">Cancel</button>
              {multiple && (
                <button 
                  onClick={handleConfirm} 
                  disabled={selected.length === 0}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 disabled:bg-gray-300 transition-all font-black uppercase tracking-widest"
                >
                  Insert Selected
                </button>
              )}
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export const OrderModal = ({ order, isOpen, onClose, onDeliver }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white w-full md:w-[95%] lg:max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[95vh] flex flex-col"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Shipping Method</p>
              <p className="text-sm font-black text-dark flex items-center gap-2 uppercase">
                <Truck className="w-4 h-4 text-primary" /> {order.shippingMethod || 'Standard'}
              </p>
            </div>
            <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Shipping Price</p>
              <p className="text-sm font-black text-dark">
                {order.shippingPrice}৳
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
                  <p className="text-xs text-gray-400">{order.shippingEmail || order.user?.email || order.guestEmail || 'No email provided'}</p>
                  {order.shippingEmail && order.shippingEmail !== (order.user?.email || order.guestEmail) && (
                    <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-tight">Specified for Shipping</p>
                  )}
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
            <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest">Shipping Address</h5>
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0 text-blue-600">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-dark leading-relaxed">
                  {order.street ? (
                    <>
                      {order.street}, {order.city}, {order.state} {order.zipCode}, {order.country}
                    </>
                  ) : 'No address provided'}
                </p>
                <p className="text-xs text-gray-400 mt-1">Delivery Location</p>
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
                    {item.variant?.options && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(typeof item.variant.options === 'string' ? JSON.parse(item.variant.options) : item.variant.options).map(([k, v]) => (
                          <span key={k} className="text-[9px] font-black bg-gray-200 px-1.5 py-0.5 rounded text-gray-400 uppercase">
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 uppercase mt-1">{item.quantity} x {item.price}৳</p>
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
  const [mainImage, setMainImage] = useState('');
  const [gallery, setGallery] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaTarget, setMediaTarget] = useState('main'); // 'main', 'gallery', or 'variant'
  const [activeVariantIdx, setActiveVariantIdx] = useState(null);
  const [basePrice, setBasePrice] = useState('');
  const [baseSalePrice, setBaseSalePrice] = useState('');
  const [baseStock, setBaseStock] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(''); // Track selected category

  React.useEffect(() => {
    if (isOpen) {
      console.log('ProductModal Opened. editingItem:', editingItem);
      if (editingItem?.images) {
        try {
          const imgs = typeof editingItem.images === 'object' ? editingItem.images : JSON.parse(editingItem.images);
          setMainImage(imgs.main || '');
          setGallery(Array.isArray(imgs.gallery) ? imgs.gallery : []);
          console.log('Synced images from editingItem:', imgs);
        } catch (e) {
          console.error('Failed to sync images:', e);
          setMainImage('');
          setGallery([]);
        }
      } else {
        setMainImage('');
        setGallery([]);
      }
      setBasePrice(editingItem?.price || '');
      setBaseSalePrice(editingItem?.salePrice || '');
      setBaseStock(editingItem?.stock || 0);
      setDescription(editingItem?.description || '');
      setCategoryId(editingItem?.categoryId || ''); // Sync category selection
    }
  }, [editingItem, isOpen]);

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
  const quickAddAttribute = (name) => {
    if (!attributes.find(a => a.name.toLowerCase() === name.toLowerCase())) {
      setAttributes([...attributes, { name, options: [], inputVal: '' }]);
    }
  };
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

    setVariants(combos.map(c => {
      const existing = variants.find(v => JSON.stringify(v.options) === JSON.stringify(c));
      return existing || {
        options: c,
        price: null,
        salePrice: null,
        stock: null,
        sku: `${slug}-${Object.values(c).join('-')}`.toLowerCase(),
        image: '',
        isDefault: false
      };
    }));
  };

  const updateVariant = (idx, field, val) => {
    const newVariants = [...variants];
    newVariants[idx][field] = val;
    setVariants(newVariants);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full md:w-[95%] lg:max-w-2xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h4 className="text-xl font-bold">{editingItem?.id ? 'Edit' : 'Add'} Product</h4>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <form onSubmit={onSave} className="p-4 md:p-6 space-y-4 overflow-y-auto custom-scrollbar">
          {/* Hidden input to ensure categoryId is captured by FormData */}
          <input type="hidden" name="category" value={categoryId} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="flex justify-between items-center gap-2">
                   <h5 className="text-[10px] font-black uppercase text-gray-400">Attributes</h5>
                   <div className="flex gap-2">
                      <button type="button" onClick={() => quickAddAttribute('Color')} className="text-[9px] font-bold bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200">+ Color</button>
                      <button type="button" onClick={() => quickAddAttribute('Size')} className="text-[9px] font-bold bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200">+ Size</button>
                      <button type="button" onClick={addAttribute} className="text-[9px] font-bold text-primary border border-primary/20 px-2 py-0.5 rounded hover:bg-primary/5 transition-all">+ Custom</button>
                   </div>
                </div>
                {attributes.map((attr, idx) => (
                  <div key={idx} className="space-y-2 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex gap-2 items-center">
                      <input placeholder="Attribute (e.g. Color)" value={attr.name} onChange={(e) => updateAttributeName(idx, e.target.value)} className="flex-1 bg-gray-50 border-none rounded-lg p-2 text-xs font-bold" />
                      <button type="button" onClick={() => removeAttribute(idx)} className="text-gray-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                       {attr.options.map(o => <span key={o} className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">{o} <button type="button" onClick={() => removeOptionTag(idx, o)}><X className="w-2.5 h-2.5" /></button></span>)}
                    </div>
                    <div className="flex gap-2">
                       <input placeholder="Add option (e.g. Red, XL)" value={attr.inputVal} onChange={(e) => updateAttributeInput(idx, e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOptionTag(idx))} className="flex-1 bg-gray-50 border-none rounded-lg p-2 text-[10px]" />
                       <button type="button" onClick={() => addOptionTag(idx)} className="bg-dark text-white text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-tighter">Add</button>
                    </div>
                  </div>
                ))}
                
                {attributes.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <button type="button" onClick={generateVariants} className="w-full py-2 bg-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-dark/20 hover:scale-[1.02] active:scale-95 transition-all">
                      {variants.length > 0 ? 'Regenerate Variants' : 'Generate Variants'} ({variants.length})
                    </button>
                  </div>
                )}

                {variants.length > 0 && (
                  <div className="space-y-3 mt-4">
                     <h5 className="text-[10px] font-black uppercase text-gray-400">Manage Variants</h5>
                     <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                        {variants.map((v, idx) => (
                           <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                              <div className="flex justify-between items-start gap-4">
                                 <div className="flex gap-3 flex-1">
                                    <div 
                                      onClick={() => { setActiveVariantIdx(idx); setMediaTarget('variant'); setShowMediaLibrary(true); }}
                                      className="w-12 h-12 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 cursor-pointer hover:border-primary transition-all group"
                                    >
                                       {v.image ? (
                                          <img src={getImageUrl(v.image)} className="w-full h-full object-cover" />
                                       ) : (
                                          <ImageIcon className="w-4 h-4 text-gray-300 group-hover:text-primary" />
                                       )}
                                    </div>
                                    <div className="space-y-1 py-1">
                                       <div className="flex flex-wrap gap-1">
                                          {Object.entries(v.options || {}).map(([k, val]) => (
                                             <span key={k} className="text-[10px] font-black bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase">{val}</span>
                                          ))}
                                       </div>
                                       <p className="text-[9px] text-gray-400 font-mono truncate max-w-[150px]">{v.sku}</p>
                                    </div>
                                 </div>
                                 <div className="flex flex-col gap-2 items-end">
                                    <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => {
                                       const newVariants = variants.map((varnt, i) => ({ ...varnt, isDefault: i === idx }));
                                       setVariants(newVariants);
                                       // Auto-sync with base product
                                       if (v.image) setMainImage(v.image);
                                       if (v.price) setBasePrice(v.price);
                                       if (v.salePrice) setBaseSalePrice(v.salePrice);
                                       if (v.stock) setBaseStock(v.stock);
                                    }}>
                                       <span className="text-[9px] font-black text-gray-400 uppercase">Default</span>
                                       <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${v.isDefault ? 'bg-primary border-primary text-white' : 'border-gray-200 bg-white'}`}>
                                          {v.isDefault && <Check className="w-2.5 h-2.5" />}
                                       </div>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end mt-1">
                                       <div className="flex items-center gap-2 mb-1">
                                          <button 
                                             type="button" 
                                             onClick={() => updateVariant(idx, 'stock', 0)}
                                             className={`text-[8px] px-1.5 py-0.5 rounded ${v.stock <= 0 ? 'bg-red-100 text-red-600 font-bold' : 'bg-gray-100 text-gray-400'}`}
                                          >
                                             Out
                                          </button>
                                          <button 
                                             type="button" 
                                             onClick={() => updateVariant(idx, 'stock', 999999)}
                                             className={`text-[8px] px-1.5 py-0.5 rounded ${v.stock >= 999999 ? 'bg-blue-100 text-blue-600 font-bold' : v.stock > 0 ? 'bg-green-100 text-green-600 font-bold' : 'bg-gray-100 text-gray-400'}`}
                                          >
                                             {v.stock >= 999999 ? 'Unlimited' : 'In'}
                                          </button>
                                       </div>
                                       <span className="text-[9px] font-black text-gray-300 uppercase">Qty</span>
                                       <input 
                                          type="number" 
                                          value={v.stock >= 999999 ? '' : (v.stock || 0)} 
                                          onChange={(e) => updateVariant(idx, 'stock', Number(e.target.value))}
                                          placeholder="∞"
                                          className="w-16 bg-gray-50 border-none rounded-lg p-1.5 text-[10px] text-center font-bold"
                                       />
                                    </div>
                                 </div>
                              </div>
                              <div className="grid grid-cols-2 gap-3 pb-1">
                                 <div className="space-y-1">
                                    <span className="text-[9px] font-black text-gray-300 uppercase ml-1">Price</span>
                                    <input 
                                       type="number" 
                                       value={v.price || ''} 
                                       onChange={(e) => updateVariant(idx, 'price', Number(e.target.value))}
                                       placeholder="Price"
                                       className="w-full bg-gray-50 border-none rounded-xl p-2.5 text-xs font-bold"
                                    />
                                 </div>
                                 <div className="space-y-1">
                                    <span className="text-[9px] font-black text-gray-300 uppercase ml-1">Sale Price</span>
                                    <input 
                                       type="number" 
                                       value={v.salePrice || ''} 
                                       onChange={(e) => updateVariant(idx, 'salePrice', Number(e.target.value))}
                                       placeholder="Discount"
                                       className="w-full bg-gray-50 border-none rounded-xl p-2.5 text-xs font-bold text-primary"
                                    />
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Base Price</label>
              <input name="price" type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Sale Price</label>
              <input name="salePrice" type="number" value={baseSalePrice} onChange={(e) => setBaseSalePrice(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase">Stock {baseStock >= 999999 && "(Unlimited)"}</label>
                <div className="flex bg-gray-100 p-0.5 rounded-lg">
                  <button 
                    type="button" 
                    onClick={() => setBaseStock(0)}
                    className={`px-2 py-0.5 text-[9px] font-black rounded-md transition-all ${baseStock <= 0 ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}
                  >
                    OUT
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setBaseStock(999999)}
                    className={`px-2 py-0.5 text-[9px] font-black rounded-md transition-all ${baseStock >= 999999 ? 'bg-white text-blue-500 shadow-sm' : baseStock > 0 ? 'bg-white text-green-500 shadow-sm' : 'text-gray-400'}`}
                  >
                    {baseStock >= 999999 ? 'UNLIMITED' : 'IN'}
                  </button>
                </div>
              </div>
              <input type="hidden" name="stock" value={baseStock} />
              <input type="number" value={baseStock >= 999999 ? '' : baseStock} onChange={(e) => setBaseStock(e.target.value)} placeholder="Enter quantity or select Unlimited" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm">
              <option value="">Select Category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
            <div className="quill-wrapper">
              <input type="hidden" name="description" value={description} />
              <ReactQuill 
                theme="snow" 
                value={description} 
                onChange={setDescription}
                placeholder="Product details, features, and specifications..."
                className="bg-gray-50 rounded-xl overflow-hidden border-none text-sm"
              />
            </div>
            <style jsx global>{`
              .quill-wrapper .ql-container {
                border-bottom-left-radius: 0.75rem;
                border-bottom-right-radius: 0.75rem;
                border: none !important;
                background: #f9fafb;
                min-height: 150px;
                font-family: inherit;
              }
              .quill-wrapper .ql-toolbar {
                border-top-left-radius: 0.75rem;
                border-top-right-radius: 0.75rem;
                border: none !important;
                border-bottom: 1px solid #f3f4f6 !important;
                background: #f9fafb;
              }
              .quill-wrapper .ql-editor {
                font-size: 0.875rem;
                line-height: 1.5;
              }
              .quill-wrapper .ql-editor.ql-blank::before {
                color: #9ca3af;
                font-style: normal;
              }
            `}</style>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 uppercase">Product Images</label>
            <div className="grid grid-cols-2 gap-6">
              {/* Main Image */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black uppercase text-gray-400">Main Image</p>
                   <button type="button" onClick={() => { setMediaTarget('main'); setShowMediaLibrary(true); }} className="text-[10px] text-primary font-bold hover:underline">Media Library</button>
                </div>
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 group relative">
                    {mainImage ? (
                      <img src={getImageUrl(mainImage)} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-gray-300" />
                    )}
                    <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  <input 
                    name="mainImage" 
                    value={mainImage} 
                    onChange={(e) => setMainImage(e.target.value)} 
                    placeholder="URL..." 
                    className="flex-1 bg-gray-50 border-none rounded-xl px-3 py-2 text-xs h-16" 
                  />
                </div>
              </div>

              {/* Gallery Images */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase text-gray-400">Gallery</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setMediaTarget('gallery'); setShowMediaLibrary(true); }} className="text-[10px] text-primary font-bold hover:underline">Media Library</button>
                    <span className="text-gray-300">|</span>
                    <button 
                      type="button" 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.multiple = true;
                        input.onchange = async (e) => {
                          const files = Array.from(e.target.files);
                          if (files.length === 0) return;
                          setUploadingImage(true);
                          try {
                            const uploadedUrls = await Promise.all(
                              files.map(async (file) => {
                                const formData = new FormData();
                                formData.append('image', file);
                                const { data } = await api.post('/upload', formData);
                                return data.mainImage;
                              })
                            );
                            setGallery([...gallery, ...uploadedUrls]);
                          } catch (err) {
                            alert('Some uploads failed');
                          } finally {
                            setUploadingImage(false);
                          }
                        };
                        input.click();
                      }}
                      className="text-[10px] text-primary font-bold hover:underline"
                    >
                      + Upload
                    </button>
                  </div>
                </div>
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                  {gallery.map((img, idx) => (
                    <div key={idx} className="flex gap-2">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 relative">
                        {img ? <img src={getImageUrl(img)} className="w-full h-full object-cover" /> : <ImageIcon className="w-4 h-4 text-gray-300" />}
                        <input 
                          type="file" 
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('image', file);
                            try {
                              const { data } = await api.post('/upload', formData);
                              const newGallery = [...gallery];
                              newGallery[idx] = data.mainImage;
                              setGallery(newGallery);
                            } catch (err) { alert('Upload failed'); }
                          }} 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                        />
                      </div>
                      <input 
                        value={img} 
                        onChange={(e) => {
                          const newGallery = [...gallery];
                          newGallery[idx] = e.target.value;
                          setGallery(newGallery);
                        }} 
                        placeholder="Gallery Image URL..." 
                        className="flex-1 bg-gray-50 border-none rounded-lg px-3 py-1 text-[10px]" 
                      />
                      <button type="button" onClick={() => setGallery(gallery.filter((_, i) => i !== idx))} className="text-gray-300 hover:text-red-500"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                  {gallery.length === 0 && <p className="text-[10px] text-gray-400 italic">No gallery images added.</p>}
                </div>
              </div>
            </div>
            <input type="hidden" name="gallery" value={JSON.stringify(gallery.filter(Boolean))} />
          </div>

          <MediaLibraryModal 
            isOpen={showMediaLibrary} 
            onClose={() => setShowMediaLibrary(false)} 
            multiple={mediaTarget === 'gallery'}
            onSelect={(urls) => {
              if (mediaTarget === 'main') {
                setMainImage(urls);
              } else if (mediaTarget === 'gallery') {
                setGallery([...gallery, ...(Array.isArray(urls) ? urls : [urls])]);
              } else if (mediaTarget === 'variant' && activeVariantIdx !== null) {
                const newVariants = [...variants];
                newVariants[activeVariantIdx].image = Array.isArray(urls) ? urls[0] : urls;
                setVariants(newVariants);
                setActiveVariantIdx(null);
              }
            }}
          />

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
