<x-shop-layout>
    <section class="py-24 bg-white">
        <div class="container mx-auto px-4 text-center">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full mb-8">
                <i data-lucide="check-circle" class="w-12 h-12 text-green-500"></i>
            </div>
            <h1 class="text-4xl font-black text-dark mb-4">Order Successful!</h1>
            <p class="text-gray-400 font-bold mb-2">Thank you for your purchase. Your order has been placed successfully.</p>
            <p class="text-dark font-black mb-10 uppercase tracking-widest text-sm">Order ID: <span class="text-primary">#{{ $order->id }}</span></p>

            <div class="max-w-md mx-auto bg-gray-50 rounded-[2.5rem] border border-gray-100 p-8 mb-12">
                <div class="space-y-4 text-left">
                    <div class="flex justify-between border-b border-gray-100 pb-4">
                        <span class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</span>
                        <span class="text-sm font-bold text-dark">{{ $order->guestName ?? auth()->user()->name }}</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-100 pb-4">
                        <span class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Amount</span>
                        <span class="text-sm font-bold text-primary">{{ $order->totalPrice }}৳</span>
                    </div>
                    <div class="flex justify-between border-b border-gray-100 pb-4">
                        <span class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Payment</span>
                        <span class="text-sm font-bold text-dark">{{ $order->paymentMethod }}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</span>
                        <span class="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">{{ $order->status }}</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/" class="w-full sm:w-auto bg-dark text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-dark/20 hover:scale-105 active:scale-95 transition-all">
                    Back to Shop
                </a>
                <button onclick="window.print()" class="w-full sm:w-auto bg-white border border-gray-100 text-dark px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-gray-50 transition-all active:scale-95">
                    Print Invoice
                </button>
            </div>
        </div>
    </section>
</x-shop-layout>
