<x-shop-layout>
    <div class="py-12 md:py-20 bg-gray-50">
        <div class="container mx-auto px-4 lg:max-w-4xl">
            <h1 class="text-3xl md:text-4xl font-black text-dark mb-8 md:mb-12 text-center uppercase tracking-[0.2em] leading-tight">Frequently Asked Questions</h1>

            <div class="space-y-4 md:space-y-6">
                <!-- Question 1 -->
                <div x-data="{ open: false }" class="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <button @click="open = !open" class="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50">
                        <span class="font-black text-dark uppercase tracking-wider text-sm md:text-base">How do I place an order?</span>
                        <i data-lucide="chevron-down" class="w-4 h-4 md:w-5 md:h-5 text-primary transition-transform" :class="open ? 'rotate-180' : ''"></i>
                    </button>
                    <div x-show="open" x-collapse class="px-6 md:px-8 pb-6 md:pb-8 text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                        Placing an order is simple! Browse our products, add your favorites to the cart, and proceed to checkout. You can pay via Cash on Delivery or digital payment methods. Once confirmed, we'll start processing your order immediately.
                    </div>
                </div>

                <!-- Question 2 -->
                <div x-data="{ open: false }" class="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <button @click="open = !open" class="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50">
                        <span class="font-black text-dark uppercase tracking-wider text-sm md:text-base">What are the delivery charges?</span>
                        <i data-lucide="chevron-down" class="w-4 h-4 md:w-5 md:h-5 text-primary transition-transform" :class="open ? 'rotate-180' : ''"></i>
                    </button>
                    <div x-show="open" x-collapse class="px-6 md:px-8 pb-6 md:pb-8 text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                        Our standard delivery charges are 60 BDT inside Dhaka and 120 BDT outside Dhaka. Sometimes we offer free delivery during special promotions!
                    </div>
                </div>

                <!-- Question 3 -->
                <div x-data="{ open: false }" class="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <button @click="open = !open" class="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50">
                        <span class="font-black text-dark uppercase tracking-wider text-sm md:text-base">How can I track my order?</span>
                        <i data-lucide="chevron-down" class="w-4 h-4 md:w-5 md:h-5 text-primary transition-transform" :class="open ? 'rotate-180' : ''"></i>
                    </button>
                    <div x-show="open" x-collapse class="px-6 md:px-8 pb-6 md:pb-8 text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                        You can track your order directly from your dashboard. Once your order is shipped, you will also receive a tracking ID via SMS to monitor the delivery progress.
                    </div>
                </div>

                <!-- Question 4 -->
                <div x-data="{ open: false }" class="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <button @click="open = !open" class="w-full px-6 md:px-8 py-5 md:py-6 flex items-center justify-between text-left transition-colors hover:bg-gray-50">
                        <span class="font-black text-dark uppercase tracking-wider text-sm md:text-base">What is your return policy?</span>
                        <i data-lucide="chevron-down" class="w-4 h-4 md:w-5 md:h-5 text-primary transition-transform" :class="open ? 'rotate-180' : ''"></i>
                    </button>
                    <div x-show="open" x-collapse class="px-6 md:px-8 pb-6 md:pb-8 text-gray-500 leading-relaxed font-medium text-sm md:text-base">
                        We accept returns for damaged or incorrect products within 3 days of delivery. Please ensure you have an unboxing video as proof. For more details, check our full Return & Refund Policy page.
                    </div>
                </div>
            </div>

            <div class="mt-12 md:mt-16 text-center">
                <p class="text-gray-400 font-bold uppercase text-[10px] md:text-xs tracking-widest mb-4">Still have questions?</p>
                <a href="/contact" class="inline-block bg-primary text-white px-8 md:px-10 py-3.5 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all text-xs md:text-sm">
                    Contact Support
                </a>
            </div>
        </div>
    </div>
</x-shop-layout>
