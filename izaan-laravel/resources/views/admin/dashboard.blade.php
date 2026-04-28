<x-admin-layout>
    <div class="space-y-10">
        <!-- KPI Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50 group">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <i data-lucide="shopping-cart" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Total Orders</p>
                        <h3 class="text-2xl font-black text-dark tracking-tight">{{ number_format($kpis['totalOrders']) }}</h3>
                    </div>
                </div>
                <div class="h-1 bg-gray-50 rounded-full overflow-hidden">
                    <div class="h-full bg-primary w-2/3"></div>
                </div>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50 group">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                        <i data-lucide="banknote" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Total Revenue</p>
                        <h3 class="text-2xl font-black text-dark tracking-tight">{{ number_format($kpis['totalRevenue']) }}৳</h3>
                    </div>
                </div>
                <div class="h-1 bg-gray-50 rounded-full overflow-hidden">
                    <div class="h-full bg-green-500 w-1/2"></div>
                </div>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50 group">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <i data-lucide="users" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Customers</p>
                        <h3 class="text-2xl font-black text-dark tracking-tight">{{ number_format($kpis['totalCustomers']) }}</h3>
                    </div>
                </div>
                <div class="h-1 bg-gray-50 rounded-full overflow-hidden">
                    <div class="h-full bg-orange-500 w-1/3"></div>
                </div>
            </div>

            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:shadow-gray-200/50 group">
                <div class="flex items-center gap-4 mb-6">
                    <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        <i data-lucide="package" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none mb-1">Products</p>
                        <h3 class="text-2xl font-black text-dark tracking-tight">{{ number_format($kpis['totalProducts']) }}</h3>
                    </div>
                </div>
                <div class="h-1 bg-gray-50 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 w-3/4"></div>
                </div>
            </div>
        </div>



        <!-- Recent Orders Table -->
        <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div class="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h2 class="text-xl font-black text-dark tracking-tight">Recent Orders</h2>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Status of your latest customer transactions</p>
                </div>
                <a href="{{ route('admin.orders.index') }}" class="px-6 py-2 bg-gray-50 text-dark text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">View All</a>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-gray-50">
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Order ID</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Total</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @foreach($recentOrders as $order)
                        <tr class="hover:bg-gray-50/50 transition-all">
                            <td class="px-8 py-6 font-black text-dark text-sm">#{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</td>
                            <td class="px-8 py-6">
                                <p class="font-bold text-dark text-sm">{{ $order->guestName ?? ($order->user->name ?? 'Guest User') }}</p>
                                <p class="text-[10px] font-medium text-gray-400">{{ $order->phone }}</p>
                            </td>
                            <td class="px-8 py-6 font-black text-primary text-sm">{{ number_format($order->totalPrice) }}৳</td>
                            <td class="px-8 py-6">
                                @php
                                    $statusColors = [
                                        'Pending' => 'bg-yellow-50 text-yellow-600',
                                        'Processing' => 'bg-blue-50 text-blue-600',
                                        'Shipped' => 'bg-indigo-50 text-indigo-600',
                                        'Delivered' => 'bg-green-50 text-green-600',
                                        'Cancelled' => 'bg-red-50 text-red-600',
                                    ];
                                    $color = $statusColors[$order->status] ?? 'bg-gray-50 text-gray-600';
                                @endphp
                                <span class="px-3 py-1 {{ $color }} text-[10px] font-black rounded-full uppercase">{{ $order->status }}</span>
                            </td>
                            <td class="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ $order->createdAt->format('M d, Y') }}</td>
                            <td class="px-8 py-6 text-right">
                                <a href="{{ route('admin.orders.show', $order->id) }}" class="p-2 text-gray-400 hover:text-primary inline-block"><i data-lucide="eye" class="w-5 h-5"></i></a>
                                <a href="{{ route('admin.orders.invoice', $order->id) }}" class="p-2 text-gray-400 hover:text-dark inline-block"><i data-lucide="printer" class="w-5 h-5"></i></a>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-admin-layout>
