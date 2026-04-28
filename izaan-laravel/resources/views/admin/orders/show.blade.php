<x-admin-layout>
    <div class="space-y-8 max-w-5xl mx-auto">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <a href="{{ route('admin.orders.index') }}" class="p-3 bg-white text-gray-400 hover:text-dark rounded-xl border border-gray-100 transition-all">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </a>
                <div>
                    <h1 class="text-3xl font-black text-dark tracking-tight">Order #{{ str_pad($order->id, 6, '0', STR_PAD_LEFT) }}</h1>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Details and management for this transaction</p>
                </div>
            </div>
            <a href="{{ route('admin.orders.invoice', $order->id) }}" target="_blank" class="inline-flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-dark/20 hover:scale-[1.02] active:scale-95 transition-all">
                <i data-lucide="printer" class="w-4 h-4"></i> Print Invoice
            </a>
        </div>

        @if(session('success'))
        <div class="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            {{ session('success') }}
        </div>
        @endif

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left: Order Details -->
            <div class="lg:col-span-8 space-y-8">
                <!-- Status Management -->
                <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h2 class="text-xl font-black mb-8 flex items-center gap-3 text-dark font-black tracking-tight uppercase tracking-widest text-xs opacity-50">
                        Update Status
                    </h2>
                    
                    <form action="{{ route('admin.orders.update', $order->id) }}" method="POST" class="flex flex-wrap items-end gap-4">
                        @csrf
                        @method('PATCH')
                        <div class="flex-1 min-w-[200px]">
                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Order Status</label>
                            <select name="status" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none">
                                <option value="Pending" {{ $order->status == 'Pending' ? 'selected' : '' }}>Pending</option>
                                <option value="Processing" {{ $order->status == 'Processing' ? 'selected' : '' }}>Processing</option>
                                <option value="Shipped" {{ $order->status == 'Shipped' ? 'selected' : '' }}>Shipped</option>
                                <option value="Delivered" {{ $order->status == 'Delivered' ? 'selected' : '' }}>Delivered</option>
                                <option value="Cancelled" {{ $order->status == 'Cancelled' ? 'selected' : '' }}>Cancelled</option>
                            </select>
                        </div>
                        <div class="flex-1 min-w-[150px]">
                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Payment Status</label>
                            <select name="isPaid" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all appearance-none">
                                <option value="0" {{ !$order->isPaid ? 'selected' : '' }}>Unpaid</option>
                                <option value="1" {{ $order->isPaid ? 'selected' : '' }}>Paid</option>
                            </select>
                        </div>
                        <button type="submit" class="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mb-0.5">
                            Update Order
                        </button>
                    </form>
                </div>

                <!-- Order Items -->
                <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div class="p-8 border-b border-gray-50">
                        <h2 class="text-xl font-black text-dark tracking-tight">Order Items</h2>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead>
                                <tr class="bg-gray-50">
                                    <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Product</th>
                                    <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Qty</th>
                                    <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Unit Price</th>
                                    <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                @foreach($order->orderItems as $item)
                                <tr class="hover:bg-gray-50/50 transition-all">
                                    <td class="px-8 py-6 flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                                            <img src="{{ $item->image }}" class="w-full h-full object-cover">
                                        </div>
                                        <div>
                                            <p class="font-black text-dark text-sm">{{ $item->name }}</p>
                                            @if($item->variant)
                                                <p class="text-[10px] font-bold text-primary uppercase tracking-widest">{{ $item->variant->sku }}</p>
                                            @endif
                                        </div>
                                    </td>
                                    <td class="px-8 py-6 text-center font-bold text-sm text-dark">{{ $item->quantity }}</td>
                                    <td class="px-8 py-6 text-right font-bold text-sm text-gray-400">{{ number_format($item->price) }}৳</td>
                                    <td class="px-8 py-6 text-right font-black text-dark text-sm">{{ number_format($item->price * $item->quantity) }}৳</td>
                                </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                    <div class="p-8 bg-gray-50 flex flex-col items-end space-y-3">
                        <div class="flex justify-between w-48 text-sm font-bold text-gray-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span>{{ number_format($order->itemsPrice) }}৳</span>
                        </div>
                        <div class="flex justify-between w-48 text-sm font-bold text-gray-400 uppercase tracking-widest">
                            <span>Shipping</span>
                            <span>{{ number_format($order->shippingPrice) }}৳</span>
                        </div>
                        @if($order->taxPrice > 0)
                        <div class="flex justify-between w-48 text-sm font-bold text-gray-400 uppercase tracking-widest">
                            <span>Tax</span>
                            <span>{{ number_format($order->taxPrice) }}৳</span>
                        </div>
                        @endif
                        @if($order->discountAmount > 0)
                        <div class="flex justify-between w-48 text-sm font-bold text-green-500 uppercase tracking-widest">
                            <span>Discount ({{ $order->couponCode ?? 'Coupon' }})</span>
                            <span>-{{ number_format($order->discountAmount) }}৳</span>
                        </div>
                        @endif
                        <div class="pt-3 border-t border-gray-200 flex justify-between w-48 text-xl font-black text-primary">
                            <span class="uppercase tracking-widest">Total</span>
                            <span>{{ number_format($order->totalPrice) }}৳</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Customer Info -->
            <div class="lg:col-span-4 space-y-8">
                <div class="bg-dark text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <h2 class="text-xl font-black mb-8 relative z-10">Customer Information</h2>
                    
                    <div class="space-y-6 relative z-10">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                                <i data-lucide="user" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Name</p>
                                <p class="font-bold text-sm">{{ $order->guestName ?? ($order->user->name ?? 'N/A') }}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                                <i data-lucide="phone" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Phone</p>
                                <p class="font-bold text-sm">{{ $order->guestPhone ?? ($order->phone ?? 'N/A') }}</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary">
                                <i data-lucide="mail" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <p class="text-[10px] font-black uppercase text-white/40 tracking-widest mb-1">Email</p>
                                <p class="font-bold text-sm">{{ $order->shippingEmail ?: ($order->user->email ?? 'N/A') }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h2 class="text-xl font-black mb-8 flex items-center gap-3 text-dark">
                        <i data-lucide="map-pin" class="w-5 h-5 text-gray-400"></i>
                        Shipping Address
                    </h2>
                    
                    <div class="text-sm font-bold text-gray-500 leading-relaxed">
                        <p class="text-dark font-black mb-1 uppercase text-[10px] tracking-widest opacity-40">Delivery Location</p>
                        <p class="text-dark font-black text-lg leading-snug">{{ $order->street }}</p>
                        
                        @if(($order->city && $order->city !== 'N/A') || ($order->zipCode && $order->zipCode !== 'N/A'))
                        <div class="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                            @if($order->city && $order->city !== 'N/A')
                            <div>
                                <p class="text-dark font-black mb-1">City</p>
                                <p>{{ $order->city }}</p>
                            </div>
                            @endif
                            @if($order->zipCode && $order->zipCode !== 'N/A')
                            <div>
                                <p class="text-dark font-black mb-1">Zip</p>
                                <p>{{ $order->zipCode }}</p>
                            </div>
                            @endif
                        </div>
                        @endif
                    </div>
                </div>

                <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h2 class="text-xl font-black mb-8 flex items-center gap-3 text-dark">
                        <i data-lucide="credit-card" class="w-5 h-5 text-gray-400"></i>
                        Payment Method
                    </h2>
                    
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-black text-dark">{{ $order->paymentMethod }}</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Transaction ID: {{ $order->transactionId ?? 'N/A' }}
                            </p>
                        </div>
                        <div class="px-4 py-2 bg-gray-50 rounded-xl">
                            <i data-lucide="shield-check" class="w-5 h-5 text-green-500"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-admin-layout>
