'use client';

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { Truck, Plus, Trash2, Edit2, Loader2, Save, X, ToggleLeft, ToggleRight } from 'lucide-react';

const ShippingSection = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', price: '', isActive: true });
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const { data } = await api.get('/shipping/admin');
      setMethods(data);
    } catch (error) {
      console.error('Failed to fetch shipping methods');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name || !formData.price) return;
    setSubmitting(true);
    try {
      await api.post('/shipping', formData);
      setFormData({ name: '', price: '', isActive: true });
      setIsAdding(false);
      fetchMethods();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create shipping method';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id) => {
    setSubmitting(true);
    try {
      await api.put(`/shipping/${id}`, formData);
      setIsEditing(null);
      fetchMethods();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update shipping method';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this shipping method?')) return;
    try {
      await api.delete(`/shipping/${id}`);
      fetchMethods();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete shipping method';
      alert(errorMessage);
    }
  };

  const startEdit = (method) => {
    setIsEditing(method.id);
    setFormData({ name: method.name, price: method.price, isActive: method.isActive });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-dark flex items-center gap-2 uppercase tracking-tight">
            Shipping Methods
          </h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage delivery options and pricing</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" /> Add New Rate
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-[2rem] border-2 border-primary/20 shadow-xl animate-in zoom-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Method Name</label>
              <input
                type="text"
                placeholder="e.g. Standard Shipping"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Price (৳)</label>
              <input
                type="number"
                placeholder="60"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all font-bold"
              />
            </div>
            <div className="flex items-end gap-3">
              <button
                disabled={submitting}
                onClick={handleCreate}
                className="flex-1 py-4 bg-primary text-white rounded-2xl text-xs font-black shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Method'}
              </button>
              <button
                onClick={() => setIsAdding(false)}
                className="p-4 bg-gray-100 text-gray-400 rounded-2xl hover:bg-gray-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {methods.map((method) => (
          <div 
            key={method.id} 
            className={`bg-white p-6 rounded-[2rem] border transition-all ${isEditing === method.id ? 'border-primary shadow-xl scale-[1.02]' : 'border-gray-100 shadow-sm hover:shadow-md'}`}
          >
            {isEditing === method.id ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-primary"
                />
                <div className="flex gap-4">
                   <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">৳</span>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm font-bold outline-none focus:border-primary"
                      />
                   </div>
                   <button 
                      onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                      className={`px-4 rounded-xl flex items-center justify-center transition-colors ${formData.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                   >
                      {formData.isActive ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                   </button>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    disabled={submitting}
                    onClick={() => handleUpdate(method.id)}
                    className="flex-1 py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    {submitting ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(null)}
                    className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-dark tracking-tight">{method.name}</h4>
                    {!method.isActive && <span className="bg-red-50 text-red-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Inactive</span>}
                  </div>
                  <div className="text-2xl font-black text-primary">{method.price}৳</div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">{method.price === 0 ? 'FREE' : 'FLAT RATE'}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(method)}
                    className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2.5 bg-gray-50 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingSection;
