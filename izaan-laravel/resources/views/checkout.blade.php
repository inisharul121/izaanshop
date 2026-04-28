<x-shop-layout>
    <div x-data="{ 
        shippingMethods: {{ json_encode($shippingMethods) }},
        selectedShippingId: '',
        shippingPrice: 0,
        subtotal: {{ $subtotal }},
        couponCode: '',
        discount: 0,
        appliedCoupon: null,
        paymentMethod: 'Cash on Delivery',

        updateShipping() {
            let method = this.shippingMethods.find(m => m.id == this.selectedShippingId);
            this.shippingPrice = method ? parseFloat(method.price) : 0;
        },

        async applyCoupon() {
            if (!this.couponCode) return;

            try {
                const response = await fetch('{{ route('coupon.validate') }}', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: JSON.stringify({ code: this.couponCode })
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || 'Invalid coupon');
                    return;
                }

                this.appliedCoupon = data;
                if (data.discountType === 'percentage') {
                    this.discount = (this.subtotal * data.discountValue) / 100;
                } else {
                    this.discount = parseFloat(data.discountValue);
                }
                
                alert('Coupon applied successfully!');
            } catch (error) {
                console.error('Error applying coupon:', error);
                alert('Something went wrong. Please try again.');
            }
        }
    }" class="container mx-auto px-4 lg:max-w-5xl lg:px-10 py-16">
        <div class="mb-12">
            <h1 class="text-4xl font-black text-dark mb-3 tracking-tight">Checkout</h1>
            <div class="text-gray-400 font-medium">
                @auth
                    Logged in as <span class="text-primary font-bold">{{ auth()->user()->name }}</span>
                @else
                    Ordering as <span class="text-primary font-bold italic underline">Guest</span> · <a href="{{ route('login') }}" class="text-dark hover:text-primary transition-colors">Sign in</a>
                @endauth
            </div>
        </div>

        <form action="{{ route('checkout.store') }}" method="POST" class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            @csrf
            <div class="lg:col-span-7 space-y-8">
                <!-- Shipping Details -->
                <div class="bg-white p-5 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h2 class="text-xl font-black mb-8 flex items-center gap-3 text-dark">
                        <i data-lucide="truck" class="w-6 h-6 text-primary"></i>
                        Shipping Details
                    </h2>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                            <input type="text" name="name" value="{{ auth()->user()->name ?? '' }}" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" required>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Full Address</label>
                            <textarea name="address" rows="3" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" required>{{ auth()->user()->address ?? '' }}</textarea>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                <input type="text" name="phone" value="{{ auth()->user()->phone ?? '' }}" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" required>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email (Optional)</label>
                                <input type="email" name="email" value="{{ auth()->user()->email ?? '' }}" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all">
                            </div>
                        </div>

                        <div>
                            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Shipping Method</label>
                            <select name="shippingMethodId" x-model="selectedShippingId" @change="updateShipping()" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" required>
                                <option value="">Select Shipping Method</option>
                                <template x-for="method in shippingMethods" :key="method.id">
                                    <option :value="method.id" x-text="method.name + ' — ' + method.price + '৳'"></option>
                                </template>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Payment Method -->
                <div class="bg-white p-5 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <h2 class="text-xl font-black mb-8 flex items-center gap-3 text-dark">
                        <i data-lucide="credit-card" class="w-6 h-6 text-orange-500"></i>
                        Payment Method
                    </h2>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        @foreach(['Cash on Delivery', 'bKash', 'Nagad', 'Card'] as $method)
                            <label class="relative flex items-center p-4 border rounded-2xl cursor-pointer transition-all"
                                   :class="paymentMethod === '{{ $method }}' ? 'bg-primary/5 border-primary' : 'border-gray-100'">
                                <input type="radio" name="paymentMethod" value="{{ $method }}" x-model="paymentMethod" class="w-4 h-4 text-primary">
                                <span class="ml-3 font-bold text-xs" :class="paymentMethod === '{{ $method }}' ? 'text-primary' : 'text-dark'">{{ $method }}</span>
                            </label>
                        @endforeach
                    </div>

                    <div x-show="paymentMethod === 'bKash' || paymentMethod === 'Nagad'" class="mt-8 p-6 bg-gray-50 rounded-[2rem] border border-gray-200 space-y-4">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <i data-lucide="phone" class="w-5 h-5"></i>
                            </div>
                            <div>
                                <h4 class="font-black text-dark text-sm uppercase">Manual <span x-text="paymentMethod"></span> Payment</h4>
                                <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Follow these steps to complete order</p>
                            </div>
                        </div>
                        <div class="bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                            <div>
                                <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Send Money to</p>
                                <p class="font-black text-dark" x-text="paymentMethod === 'bKash' ? '{{ $settings['bkash_number'] ?? '017XXXXXXXX' }}' : '{{ $settings['nagad_number'] ?? '018XXXXXXXX' }}'"></p>
                            </div>
                            <span class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">Personal</span>
                        </div>
                        <div>
                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transaction ID (TxID)</label>
                            <input type="text" name="transaction_id" placeholder="8X7Y6Z..." class="w-full bg-white border border-gray-100 rounded-xl px-4 py-3 text-sm font-mono tracking-widest outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Order Summary -->
            <div class="lg:col-span-5">
                <div class="bg-dark text-white p-8 rounded-[2.5rem] shadow-2xl sticky top-24 overflow-hidden">
                    <h2 class="text-2xl font-black mb-8">Order Summary</h2>
                    
                    <div class="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        @foreach($cart as $item)
                            <div class="flex justify-between items-center gap-4">
                                <div class="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0">
                                    <img src="{{ $item['image'] }}" class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-bold text-sm line-clamp-1">{{ $item['name'] }}</h4>
                                    <p class="text-[10px] font-black uppercase text-white/40 tracking-widest">{{ $item['quantity'] }} Units</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-primary font-black">{{ $item['price'] * $item['quantity'] }}৳</p>
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <!-- Coupon -->
                    <div class="mb-8 p-6 bg-white/5 border border-white/10 rounded-3xl">
                        <label class="block text-[10px] font-black uppercase text-white/40 tracking-widest mb-3">Have a Coupon?</label>
                        <div class="flex gap-2">
                            <input type="text" x-model="couponCode" placeholder="CODE123" class="flex-1 bg-white/10 border-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono">
                            <button type="button" @click="applyCoupon()" class="px-6 py-3 bg-primary text-white text-xs font-black rounded-xl hover:bg-primary/90 transition-all">Apply</button>
                        </div>
                        <input type="hidden" name="coupon_code" :value="appliedCoupon ? appliedCoupon.code : ''">
                    </div>

                    <div class="border-t border-white/10 pt-8 space-y-4">
                        <div class="flex justify-between text-sm font-bold opacity-40 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span x-text="subtotal + '৳'"></span>
                        </div>
                        <template x-if="discount > 0">
                            <div class="flex justify-between text-sm font-bold text-green-400 uppercase tracking-widest">
                                <span>Discount</span>
                                <span x-text="'-' + discount + '৳'"></span>
                            </div>
                        </template>
                        <div class="flex justify-between text-sm font-bold opacity-40 uppercase tracking-widest">
                            <span>Delivery</span>
                            <span x-text="shippingPrice > 0 ? shippingPrice + '৳' : 'Select Method'"></span>
                        </div>
                        <div class="pt-6 mt-6 border-t border-white/10 flex justify-between items-end">
                            <div>
                                <p class="text-[10px] font-black uppercase opacity-40 tracking-widest mb-1">Grand Total</p>
                                <p class="text-4xl font-black text-white" x-text="(subtotal - discount + shippingPrice) + '৳'"></p>
                            </div>
                        </div>
                    </div>

                    <button type="submit" class="w-full mt-10 py-5 rounded-[1.5rem] font-black text-dark bg-white hover:bg-primary hover:text-white transition-all duration-300 text-lg shadow-xl shadow-white/5">
                        Place Order
                    </button>
                </div>
            </div>
        </form>
    </div>
</x-shop-layout>
