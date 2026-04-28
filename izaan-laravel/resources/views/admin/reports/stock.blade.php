<x-admin-layout>
    <div class="space-y-8">
        <div>
            <h1 class="text-3xl font-black text-dark tracking-tight">Stock Report</h1>
            <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Inventory health and product warnings</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                <div class="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
                    <i data-lucide="package" class="w-8 h-8"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">Total Products</p>
                    <h3 class="text-3xl font-black text-dark tracking-tight">{{ number_format($totalProducts) }}</h3>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shrink-0">
                    <i data-lucide="banknote" class="w-8 h-8"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">Inventory Value</p>
                    <h3 class="text-3xl font-black text-dark tracking-tight">{{ number_format($totalInventoryValue) }}৳</h3>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Out of Stock -->
            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 class="text-xl font-black text-dark mb-6 flex items-center gap-2">
                    <i data-lucide="alert-circle" class="w-5 h-5 text-red-500"></i>
                    Out of Stock
                    <span class="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg ml-auto">{{ $outOfStockProducts->count() }} Items</span>
                </h3>
                <div class="space-y-4">
                    @forelse($outOfStockProducts as $product)
                        <div class="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100">
                            <span class="text-sm font-bold text-dark">{{ $product->name }}</span>
                            <a href="{{ route('admin.products.edit', $product->id) }}" class="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline">Restock</a>
                        </div>
                    @empty
                        <p class="text-sm text-gray-400 font-bold text-center py-10">No products are out of stock. Great job!</p>
                    @endforelse
                </div>
            </div>

            <!-- Low Stock -->
            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 class="text-xl font-black text-dark mb-6 flex items-center gap-2">
                    <i data-lucide="alert-triangle" class="w-5 h-5 text-orange-500"></i>
                    Low Stock (< 5 items)
                    <span class="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-lg ml-auto">{{ $lowStockProducts->count() }} Items</span>
                </h3>
                <div class="space-y-4">
                    @forelse($lowStockProducts as $product)
                        <div class="flex items-center justify-between p-4 bg-orange-50/50 rounded-2xl border border-orange-100">
                            <div>
                                <span class="text-sm font-bold text-dark block">{{ $product->name }}</span>
                                <span class="text-[10px] font-black text-orange-500 uppercase tracking-widest">{{ $product->stock }} remaining</span>
                            </div>
                            <a href="{{ route('admin.products.edit', $product->id) }}" class="p-2 text-gray-400 hover:text-dark">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </a>
                        </div>
                    @empty
                        <p class="text-sm text-gray-400 font-bold text-center py-10">No low stock warnings.</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</x-admin-layout>
