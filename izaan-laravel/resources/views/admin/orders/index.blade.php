<x-admin-layout>
    <div class="space-y-8">
        <div>
            <h1 class="text-3xl font-black text-dark tracking-tight">Order Management</h1>
            <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Track and update customer orders</p>
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
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Order ID</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Total</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Payment</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Date</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @foreach($orders as $order)
                        <tr class="hover:bg-gray-50/50 transition-all">
                            <td class="px-8 py-6 font-black text-dark text-sm">#{{ $order->id }}</td>
                            <td class="px-8 py-6">
                                <p class="font-bold text-dark text-sm">{{ $order->guestName ?? ($order->user->name ?? 'Guest') }}</p>
                                <p class="text-[10px] font-medium text-gray-400">{{ $order->phone }}</p>
                            </td>
                            <td class="px-8 py-6">
                                <span class="font-black text-primary text-sm">{{ number_format($order->totalPrice) }}৳</span>
                            </td>
                            <td class="px-8 py-6">
                                @php
                                    $statusClasses = [
                                        'Pending' => 'bg-yellow-50 text-yellow-600',
                                        'Processing' => 'bg-blue-50 text-blue-600',
                                        'Shipped' => 'bg-purple-50 text-purple-600',
                                        'Delivered' => 'bg-green-50 text-green-600',
                                        'Cancelled' => 'bg-red-50 text-red-600',
                                    ];
                                @endphp
                                <span class="px-3 py-1 {{ $statusClasses[$order->status] ?? 'bg-gray-100 text-gray-600' }} text-[10px] font-black rounded-full uppercase">{{ $order->status }}</span>
                            </td>
                            <td class="px-8 py-6">
                                <div class="flex items-center gap-2">
                                    <div class="w-1.5 h-1.5 rounded-full {{ $order->isPaid ? 'bg-green-500' : 'bg-red-500' }}"></div>
                                    <span class="text-[10px] font-black uppercase tracking-widest {{ $order->isPaid ? 'text-green-600' : 'text-red-600' }}">{{ $order->isPaid ? 'Paid' : 'Unpaid' }}</span>
                                </div>
                            </td>
                            <td class="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ $order->createdAt->format('M d, Y') }}</td>
                            <td class="px-8 py-6 text-right">
                                <div class="flex items-center justify-end gap-2 text-gray-400">
                                    <a href="{{ route('admin.orders.show', $order->id) }}" class="p-2 hover:text-primary transition-colors"><i data-lucide="eye" class="w-5 h-5"></i></a>
                                    <form action="{{ route('admin.orders.destroy', $order->id) }}" method="POST" onsubmit="return confirm('Are you sure?')">
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
                {{ $orders->links() }}
            </div>
        </div>
    </div>
</x-admin-layout>
