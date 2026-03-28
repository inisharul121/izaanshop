'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Search, Trash2, ExternalLink, ImageIcon, Check } from 'lucide-react';
import api from '@/utils/api';
import { getImageUrl } from '@/utils/api';

const MediaSection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copying, setCopying] = useState(null);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/media');
      setImages(data);
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url);
    setCopying(url);
    setTimeout(() => setCopying(null), 2000);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    const formData = new FormData();
    // For single or multiple, but our current backend handles single for /api/media/upload
    // If we want multiple, we'd need to loop or update backend
    try {
      for (const file of files) {
        const singleFormData = new FormData();
        singleFormData.append('image', file);
        await api.post('/media/upload', singleFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      fetchMedia();
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(img => 
    img.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search media..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl text-sm font-bold transition-all cursor-pointer hover:bg-primary-dark shadow-lg shadow-primary/20">
            <ImageIcon className="w-4 h-4" />
            Upload Image
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              onChange={handleUpload}
              disabled={loading}
            />
          </label>
          <button 
            onClick={fetchMedia} 
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-2xl text-sm font-bold transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-400">
           <RefreshCw className="w-10 h-10 animate-spin text-primary" />
           <p className="font-bold text-sm uppercase tracking-widest">Accessing Media Vault...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredImages.map((img, idx) => (
            <div key={idx} className="group bg-white p-2 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 relative border border-gray-50">
                <img src={getImageUrl(img.url)} className="w-full h-full object-cover" alt={img.name} />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="flex justify-center gap-2">
                       <button onClick={() => handleCopy(img.url)} className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors" title="Copy Path">
                          {copying === img.url ? <Check className="w-4 h-4 text-green-400" /> : <ExternalLink className="w-4 h-4" />}
                       </button>
                       <button className="p-2 bg-red-400/20 hover:bg-red-400/40 backdrop-blur-md rounded-lg text-red-200 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                       </button>
                   </div>
                </div>
              </div>
              <div className="mt-3 px-1">
                <p className="text-[10px] font-bold text-dark truncate" title={img.name}>{img.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium uppercase tracking-tight">/uploads/products</p>
              </div>
            </div>
          ))}
          {filteredImages.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-300">
              <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-bold text-sm uppercase">No media files found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaSection;
