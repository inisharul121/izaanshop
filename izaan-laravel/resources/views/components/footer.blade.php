<footer class="bg-dark text-white pt-16 pb-8">
    <div class="container mx-auto px-4 lg:max-w-5xl lg:px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center md:text-left">
            <!-- Brand -->
            <div class="space-y-6 flex flex-col items-center md:items-start">
                <a href="/" class="inline-block group">
                    <div class="relative">
                        <div class="absolute -inset-1 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <img src="{{ asset('images/logo.png') }}" alt="IzaanShop Logo" class="h-10 w-auto opacity-100 object-contain transition-transform group-hover:scale-110" />
                    </div>
                </a>
                <p class="text-gray-400 text-sm leading-relaxed max-w-xs md:max-w-none mx-auto md:mx-0">
                    Premium educational products, books, and toys for the next generation. Quality and learning delivered to your doorstep.
                </p>
                <div class="flex justify-center md:justify-start gap-4">
                    <a href="https://wa.me/8801752530303" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors border border-white/10 p-2.5 rounded-full hover:border-primary/50 bg-white/5" title="WhatsApp">
                        <i data-lucide="phone" class="w-5 h-5"></i>
                    </a>
                    <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors border border-white/10 p-2.5 rounded-full hover:border-primary/50 bg-white/5" title="Facebook">
                        <i data-lucide="facebook" class="w-5 h-5"></i>
                    </a>
                </div>
            </div>

            <!-- Quick Links -->
            <div>
                <h4 class="text-lg font-black mb-6 uppercase tracking-widest text-primary/80">Quick Links</h4>
                <ul class="space-y-4 text-gray-400 text-sm font-bold">
                    <li><a href="/" class="hover:text-primary transition-colors">All Products</a></li>
                    <li><a href="/#shop-now" class="hover:text-primary transition-colors">Categories</a></li>
                    <li><a href="/about" class="hover:text-primary transition-colors">About Us</a></li>
                    <li><a href="/contact" class="hover:text-primary transition-colors">Contact</a></li>
                </ul>
            </div>

            <!-- Customer Service -->
            <div>
                <h4 class="text-lg font-black mb-6 uppercase tracking-widest text-primary/80">Customer Service</h4>
                <ul class="space-y-4 text-gray-400 text-sm font-bold">
                    <li><a href="/shipping-policy" class="hover:text-primary transition-colors">Shipping Policy</a></li>
                    <li><a href="/return-policy" class="hover:text-primary transition-colors">Returns & Refunds</a></li>
                    <li><a href="/faq" class="hover:text-primary transition-colors">FAQ</a></li>
                    <li><a href="/privacy-policy" class="hover:text-primary transition-colors">Privacy Policy</a></li>
                </ul>
            </div>

            <!-- Contact Info -->
            <div>
                <h4 class="text-lg font-black mb-6 uppercase tracking-widest text-primary/80">Contact Us</h4>
                <ul class="space-y-5 text-gray-400 text-sm font-bold">
                    <li class="flex flex-col items-center md:items-start gap-2">
                        <div class="flex items-center gap-3">
                            <i data-lucide="map-pin" class="w-5 h-5 text-primary shrink-0"></i>
                            <span>Dhaka, Bangladesh</span>
                        </div>
                    </li>
                    <li class="flex flex-col items-center md:items-start gap-2">
                        <div class="flex items-center gap-3">
                            <i data-lucide="phone" class="w-5 h-5 text-primary shrink-0"></i>
                            <span>+880 1752-530303</span>
                        </div>
                    </li>
                    <li class="flex flex-col items-center md:items-start gap-2">
                        <div class="flex items-center gap-3">
                            <i data-lucide="mail" class="w-5 h-5 text-primary shrink-0"></i>
                            <span>info@izaanshop.com</span>
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div class="border-t border-white/5 pt-8 text-center text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
            <p>© {{ date('Y') }} IzaanShop. All rights reserved.</p>
        </div>
    </div>
</footer>