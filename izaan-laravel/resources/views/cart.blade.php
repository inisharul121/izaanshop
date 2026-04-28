<x-shop-layout>
    <section class="py-12 bg-white min-h-[60vh]">
        <div class="container mx-auto px-4 lg:max-w-5xl lg:px-10">
            <h1 class="text-3xl md:text-4xl font-black text-dark mb-10">Your Basket</h1>

            @if(count($cart) > 0)
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <!-- Cart Items -->
                    <div class="lg:col-span-8 space-y-6">
                        @foreach($cart as $item)
                        <div class="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 group transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50">
                            <div class="w-20 h-20 md:w-24 md:h-24 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0">
                                <img src="{{ $item['image'] }}" alt="{{ $item['name'] }}" class="w-full h-full object-cover">
                            </div>
                            
                            <div class="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h3 class="font-bold text-dark text-sm md:text-base mb-1">{{ $item['name'] }}</h3>
                                    <p class="text-primary font-black text-sm">{{ $item['price'] }}৳</p>
                                </div>

                                <div class="flex items-center gap-6">
                                    <div class="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden shrink-0">
                                        <form action="{{ route('cart.update', $item['id']) }}" method="POST">
                                            @csrf
                                            @method('PATCH')
                                            <input type="hidden" name="quantity" value="{{ $item['quantity'] - 1 }}">
                                            <button type="submit" class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-r border-gray-100" {{ $item['quantity'] <= 1 ? 'disabled' : '' }}>
                                                <i data-lucide="minus" class="w-4 h-4 text-gray-400"></i>
                                            </button>
                                        </form>
                                        <span class="w-10 text-center font-bold text-sm">{{ $item['quantity'] }}</span>
                                        <form action="{{ route('cart.update', $item['id']) }}" method="POST">
                                            @csrf
                                            @method('PATCH')
                                            <input type="hidden" name="quantity" value="{{ $item['quantity'] + 1 }}">
                                            <button type="submit" class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-l border-gray-100">
                                                <i data-lucide="plus" class="w-4 h-4 text-gray-400"></i>
                                            </button>
                                        </form>
                                    </div>

                                    <form action="{{ route('cart.destroy', $item['id']) }}" method="POST">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-2.5 bg-white text-gray-300 hover:text-red-500 border border-gray-100 rounded-xl transition-all hover:border-red-100">
                                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        @endforeach
                    </div>

                    <!-- Summary -->
                    <div class="lg:col-span-4">
                        <div class="bg-dark text-white p-8 rounded-3xl shadow-2xl shadow-dark/20 sticky top-24">
                            <h2 class="text-xl font-black mb-8 uppercase tracking-widest text-primary/80">Order Summary</h2>
                            
                            <div class="space-y-4 mb-8">
                                <div class="flex justify-between text-sm font-bold text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{{ $totalPrice }}৳</span>
                                </div>
                                <div class="flex justify-between text-sm font-bold text-gray-400">
                                    <span>Shipping</span>
                                    <span>Calculated later</span>
                                </div>
                                <div class="h-px bg-white/10 my-4"></div>
                                <div class="flex justify-between text-xl font-black">
                                    <span class="uppercase tracking-widest">Total</span>
                                    <span class="text-primary">{{ $totalPrice }}৳</span>
                                </div>
                            </div>

                            <a href="/checkout" class="block w-full text-center bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                                Checkout Now
                            </a>
                            
                            <div class="mt-6 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                <i data-lucide="shield-check" class="w-4 h-4 text-green-500"></i>
                                <span>Secure Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            @else
                <div class="py-20 text-center">
                    <div class="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-full mb-8">
                        <i data-lucide="shopping-basket" class="w-12 h-12 text-gray-200"></i>
                    </div>
                    <h2 class="text-2xl font-black text-dark mb-4">Your basket is empty</h2>
                    <p class="text-gray-400 font-bold mb-10 max-w-sm mx-auto">Looks like you haven't added anything to your cart yet. Explore our products and find something you love!</p>
                    <a href="/" class="inline-block bg-dark text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-dark/20 hover:bg-primary transition-all active:scale-95">
                        Start Shopping
                    </a>
                </div>
            @endif
        </div>
    </section>
</x-shop-layout>
