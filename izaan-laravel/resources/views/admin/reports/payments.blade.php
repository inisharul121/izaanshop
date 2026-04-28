<x-admin-layout>
    <div class="space-y-8">
        <div>
            <h1 class="text-3xl font-black text-dark tracking-tight">Payments Report</h1>
            <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Breakdown of order payment methods</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shrink-0">
                    <i data-lucide="banknote" class="w-8 h-8"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">Total Revenue (All Methods)</p>
                    <h3 class="text-3xl font-black text-dark tracking-tight">{{ number_format($totalRevenue) }}৳</h3>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <i data-lucide="shopping-cart" class="w-8 h-8"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">Total Orders (All Methods)</p>
                    <h3 class="text-3xl font-black text-dark tracking-tight">{{ number_format($totalOrders) }}</h3>
                </div>
            </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 class="text-xl font-black text-dark mb-6">Payment Methods Popularity</h3>
            <div class="space-y-4">
                @forelse($paymentMethods as $method => $data)
                    <div class="flex items-center justify-between p-6 bg-gray-50 rounded-2xl">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-dark shadow-sm">
                                <i data-lucide="{{ $method === 'Cash on Delivery' ? 'truck' : 'credit-card' }}" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="font-bold text-dark">{{ $method }}</h4>
                                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">{{ $data['count'] }} Orders</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <span class="text-lg font-black text-primary">{{ number_format($data['revenue']) }}৳</span>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Generated</p>
                        </div>
                    </div>
                @empty
                    <p class="text-sm text-gray-400 font-bold text-center py-10">No payment data available yet.</p>
                @endforelse
            </div>
        </div>
    </div>
</x-admin-layout>
