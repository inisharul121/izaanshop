<x-admin-layout>
    <div class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-dark tracking-tight">Products</h1>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Manage your store catalog and inventory</p>
            </div>
            <a href="{{ route('admin.products.create') }}" class="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Add Product
            </a>
        </div>

        @if(session('success'))
        <div class="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            {{ session('success') }}
        </div>
        @endif

        <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Product</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Category</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Price</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Stock</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Type</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @foreach($products as $product)
                        <tr class="hover:bg-gray-50/50 transition-all">
                            <td class="px-8 py-6">
                                <a href="{{ route('product.show', $product->slug) }}" target="_blank" class="flex items-center gap-4 group">
                                    <div class="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50 group-hover:border-primary/30 transition-all">
                                        <img src="{{ $product->images['main'] ?? '/placeholder.png' }}" class="w-full h-full object-cover">
                                    </div>
                                    <div>
                                        <p class="font-black text-dark text-sm truncate max-w-[200px] group-hover:text-primary transition-all">{{ $product->name }}</p>
                                        <p class="text-[10px] font-mono text-gray-400">#{{ $product->id }} / {{ $product->slug }}</p>
                                    </div>
                                </a>
                            </td>
                            <td class="px-8 py-6">
                                <span class="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-full uppercase">{{ $product->category->name ?? 'N/A' }}</span>
                            </td>
                            <td class="px-8 py-6">
                                <div class="flex flex-col">
                                    <span class="font-black text-primary text-sm">{{ $product->salePrice ?: $product->price }}৳</span>
                                    @if($product->salePrice)
                                        <span class="text-[10px] text-gray-400 line-through font-bold">{{ $product->price }}৳</span>
                                    @endif
                                </div>
                            </td>
                            <td class="px-8 py-6">
                                <div class="flex items-center gap-2">
                                    <div class="w-2 h-2 rounded-full {{ $product->stock > 0 ? ($product->stock < 10 ? 'bg-orange-500' : 'bg-green-500') : 'bg-red-500' }}"></div>
                                    <span class="font-bold text-dark text-sm">{{ $product->stock }}</span>
                                </div>
                            </td>
                            <td class="px-8 py-6">
                                <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full uppercase">{{ $product->type }}</span>
                            </td>
                            <td class="px-8 py-6 text-right">
                                <div class="flex items-center justify-end gap-2 text-gray-400">
                                    <a href="{{ route('product.show', $product->slug) }}" target="_blank" class="p-2 hover:text-primary transition-all"><i data-lucide="external-link" class="w-4 h-4"></i></a>
                                    <div class="w-px h-4 bg-gray-100 mx-1"></div>
                                    <a href="{{ route('admin.products.edit', $product->id) }}" class="p-2 hover:text-primary transition-colors"><i data-lucide="edit-3" class="w-5 h-5"></i></a>
                                    <form action="{{ route('admin.products.destroy', $product->id) }}" method="POST" onsubmit="return confirm('Are you sure?')">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-2 hover:text-red-500 transition-colors"><i data-lucide="trash-2" class="w-5 h-5"></i></button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="p-8 border-t border-gray-50">
                {{ $products->links() }}
            </div>
        </div>
    </div>
</x-admin-layout>
