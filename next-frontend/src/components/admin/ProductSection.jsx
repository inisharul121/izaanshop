'use client';

import React from 'react';
import { Search, Plus, Edit, Trash2, Package, RefreshCw } from 'lucide-react';

const ProductSection = ({ 
  products, 
  searchTerm, 
  setSearchTerm, 
  onAdd, 
  onEdit, 
  onDelete, 
  getImageUrl 
}) => {
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 rounded-2xl py-3 px-4 pl-12 text-sm shadow-sm focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400 w-4 h-4" />
        </div>
        <button
          onClick={onAdd}
          className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                        <img 
                          src={getImageUrl(product.images?.main || (product.images ? JSON.parse(product.images).main : '/placeholder.png'))} 
                          alt={product.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-dark truncate max-w-[200px]">{product.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">ID: {String(product.id).padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                       <span className="text-sm font-bold text-dark">{product.stock} Units</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-dark">{product.price.toLocaleString()}৳</p>
                    {product.salePrice && <p className="text-[10px] text-primary font-bold line-through opacity-50">{product.salePrice.toLocaleString()}৳</p>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm border border-transparent hover:border-gray-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-red-500 transition-all shadow-sm border border-transparent hover:border-gray-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center text-gray-400 italic">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
