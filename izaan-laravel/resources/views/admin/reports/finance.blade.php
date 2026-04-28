<x-admin-layout>
    <div class="space-y-8">
        <div>
            <h1 class="text-3xl font-black text-dark tracking-tight">Finance Report</h1>
            <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Overview of revenue and sales performance</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shrink-0">
                    <i data-lucide="banknote" class="w-8 h-8"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">Total Revenue</p>
                    <h3 class="text-3xl font-black text-dark tracking-tight">{{ number_format($totalRevenue) }}৳</h3>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <i data-lucide="shopping-cart" class="w-8 h-8"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">Total Orders</p>
                    <h3 class="text-3xl font-black text-dark tracking-tight">{{ number_format($totalOrders) }}</h3>
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-6">
                <div class="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                    <i data-lucide="calculator" class="w-8 h-8"></i>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-2">Avg. Order Value</p>
                    <h3 class="text-3xl font-black text-dark tracking-tight">{{ number_format($avgOrderValue) }}৳</h3>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 class="text-xl font-black text-dark mb-6">Last 30 Days Revenue</h3>
                <div class="space-y-4">
                    @forelse($dailyRevenue as $date => $revenue)
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">{{ \Carbon\Carbon::parse($date)->format('M d, Y') }}</span>
                            <span class="text-sm font-black text-primary">{{ number_format($revenue) }}৳</span>
                        </div>
                    @empty
                        <p class="text-sm text-gray-400 font-bold text-center py-10">No revenue data for the last 30 days.</p>
                    @endforelse
                </div>
            </div>

            <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h3 class="text-xl font-black text-dark mb-6">Monthly Revenue</h3>
                <div class="space-y-4">
                    @forelse($monthlyRevenue as $month => $revenue)
                        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">{{ \Carbon\Carbon::parse($month . '-01')->format('F Y') }}</span>
                            <span class="text-sm font-black text-green-500">{{ number_format($revenue) }}৳</span>
                        </div>
                    @empty
                        <p class="text-sm text-gray-400 font-bold text-center py-10">No monthly revenue data.</p>
                    @endforelse
                </div>
            </div>
        </div>
    </div>
</x-admin-layout>
