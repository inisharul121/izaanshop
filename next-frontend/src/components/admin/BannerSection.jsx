'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, GripVertical, Eye, EyeOff, X, Image as ImageIcon, Layers } from 'lucide-react';
import api, { getImageUrl } from '@/utils/api';

const BannerSection = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  // Form state
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(0);

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banners/all');
      setBanners(res.data);
    } catch (err) {
      console.error('Failed to fetch banners', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMedia = async () => {
    try {
      const res = await api.get('/media');
      setMediaFiles(res.data || []);
    } catch (err) {
      console.error('Failed to fetch media', err);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const resetForm = () => {
    setTitle(''); setSubtitle(''); setImage(''); setLink('');
    setIsActive(true); setOrder(0); setEditingBanner(null); setShowForm(false);
  };

  const openEdit = (banner) => {
    setEditingBanner(banner);
    setTitle(banner.title || '');
    setSubtitle(banner.subtitle || '');
    setImage(banner.image || '');
    setLink(banner.link || '');
    setIsActive(banner.isActive);
    setOrder(banner.order);
    setShowForm(true);
  };

  const handleSave = async () => {
    const data = { title, subtitle, image, link, isActive, order: Number(order) };
    try {
      if (editingBanner) {
        await api.put(`/banners/${editingBanner.id}`, data);
      } else {
        await api.post('/banners', data);
      }
      resetForm();
      fetchBanners();
    } catch (err) {
      alert('Failed to save banner: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      fetchBanners();
    } catch (err) {
      alert('Failed to delete banner');
    }
  };

  const toggleActive = async (banner) => {
    try {
      await api.put(`/banners/${banner.id}`, { isActive: !banner.isActive });
      fetchBanners();
    } catch (err) { console.error(err); }
  };

  const openMediaPicker = () => {
    fetchMedia();
    setShowMediaPicker(true);
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading banners...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-dark">Hero Banners</h2>
          <p className="text-xs text-gray-400 font-medium mt-1">Manage promotional slider images on the home page</p>
          <p className="text-[10px] text-gray-300 font-medium mt-0.5">📐 Recommended size: <strong>1600 × 500 px</strong> (ratio 16:5). Use wide landscape images for best results.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" /> Add Banner
        </button>
      </div>

      {/* Banner List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner) => (
          <div key={banner.id} className={`bg-white rounded-2xl border overflow-hidden shadow-sm transition-all ${!banner.isActive ? 'opacity-60 border-red-200' : 'border-gray-100'}`}>
            <div className="aspect-[16/7] bg-gray-100 relative overflow-hidden">
              {banner.image ? (
                <img src={getImageUrl(banner.image)} alt={banner.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              {!banner.isActive && (
                <div className="absolute inset-0 bg-dark/40 flex items-center justify-center pointer-events-none">
                  <span className="text-white text-xs font-black uppercase tracking-widest bg-dark/60 px-3 py-1 rounded-full">Hidden</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-sm text-dark truncate">{banner.title || 'Untitled Banner'}</h3>
              <p className="text-[10px] text-gray-400 truncate">{banner.subtitle || 'No subtitle'}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-[9px] font-black text-gray-300 uppercase">Order: {banner.order}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(banner)} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${banner.isActive ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-red-50 text-red-500 hover:bg-red-100'}`}>
                    {banner.isActive ? '● Active' : '○ Activate'}
                  </button>
                  <button onClick={() => openEdit(banner)} className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all">
                    <Edit className="w-3.5 h-3.5 text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(banner.id)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-all">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-gray-100">
            <Layers className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No banners yet. Add your first promotional banner!</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4" onClick={() => resetForm()}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-black text-dark">{editingBanner ? 'Edit Banner' : 'New Banner'}</h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Image Preview & Picker */}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Banner Image *</label>
                {image ? (
                  <div className="relative aspect-[16/7] rounded-xl overflow-hidden border border-gray-100 mb-2">
                    <img src={getImageUrl(image)} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => setImage('')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"><X className="w-3 h-3" /></button>
                  </div>
                ) : (
                  <div className="aspect-[16/7] bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-2">
                    <p className="text-gray-300 text-sm font-medium">No image selected</p>
                  </div>
                )}
                <button onClick={openMediaPicker} className="w-full py-2.5 bg-gray-50 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors border border-gray-100">
                  Select from Media Library
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Sale 50% Off" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Subtitle</label>
                <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="e.g. Shop the best deals now" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Link (optional)</label>
                <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="e.g. /product/my-product" className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Order</label>
                  <input type="number" value={order} onChange={(e) => setOrder(e.target.value)} className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm" />
                </div>
                <div className="flex-1 flex items-end">
                  <button onClick={() => setIsActive(!isActive)} className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-500 border border-red-200'}`}>
                    {isActive ? '✓ Active' : '✗ Inactive'}
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button onClick={resetForm} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={!image} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none">
                {editingBanner ? 'Update Banner' : 'Create Banner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-[300] flex items-center justify-center p-4" onClick={() => setShowMediaPicker(false)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-black text-dark">Select Image</h3>
              <button onClick={() => setShowMediaPicker(false)} className="p-2 hover:bg-gray-100 rounded-xl"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto grid grid-cols-3 md:grid-cols-4 gap-3">
              {mediaFiles.map((file, i) => (
                <button key={i} onClick={() => { setImage(file.path || file.url || file); setShowMediaPicker(false); }} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                  <img src={getImageUrl(file.path || file.url || file)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              {mediaFiles.length === 0 && <p className="col-span-full text-center text-gray-400 py-10">No media found. Upload images first in Media Library.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerSection;
