'use client';

import React from 'react';
import { Tag, Edit, Trash2, Plus, Percent, Calendar } from 'lucide-react';

export const CategorySection = ({ categories, onAdd, onEdit, onDelete }) => (
  <div className="space-y-6">
    <div className="flex justify-end">
      <button onClick={onAdd} className="btn-primary flex items-center gap-2 px-6 py-3">
        <Plus className="w-5 h-5" /> Add Category
      </button>
    </div>
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Slug</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 p-1">
                   {cat.image ? <img src={getImageUrl(cat.image)} className="w-full h-full object-contain" /> : <Tag className="w-full h-full p-2 text-gray-300" />}
                </div>
                <p className="text-sm font-bold text-dark">{cat.name}</p>
              </td>
              <td className="px-6 py-4">
                <code className="text-xs font-mono text-gray-400">{cat.slug}</code>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(cat)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm border border-transparent hover:border-gray-100">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(cat.id)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-gray-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const CouponSection = ({ coupons, onAdd, onEdit, onDelete }) => (
  <div className="space-y-6">
    <div className="flex justify-end">
      <button onClick={onAdd} className="btn-primary flex items-center gap-2 px-6 py-3">
        <Plus className="w-5 h-5" /> Add Coupon
      </button>
    </div>
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Code</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Discount</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Expiry</th>
            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {coupons.map((cp) => (
            <tr key={cp.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-4">
                <p className="text-sm font-black text-dark tracking-widest uppercase">{cp.code}</p>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-primary">
                  {cp.discountType === 'Percentage' ? `${cp.discountValue}% Off` : `${cp.discountValue}৳ Off`}
                </p>
              </td>
              <td className="px-6 py-4 text-xs font-bold text-gray-400">
                {cp.expiryDate && typeof cp.expiryDate === 'string' ? cp.expiryDate.split('T')[0] : (cp.expiryDate ? new Date(cp.expiryDate).toISOString().split('T')[0] : 'No expiry')}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(cp)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm border border-transparent hover:border-gray-100">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(cp.id)} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-gray-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
