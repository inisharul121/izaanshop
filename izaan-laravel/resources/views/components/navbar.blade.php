<header x-data="{ isScrolled: false, isOpen: false }" @scroll.window="isScrolled = (window.pageYOffset > 20)"
    class="sticky top-0 left-0 z-[100] w-full bg-white shadow-sm">

    <!-- Premium Utility Bar (Orange Section) -->
    <div :class="isScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-20 py-2.5 opacity-100'"
        class="bg-[#E67E22] transition-all duration-300 origin-top overflow-hidden">
        <div class="max-w-4xl mx-auto px-4 flex justify-between items-center text-white">
            <div class="flex items-center gap-6 md:gap-10">
                <a href="tel:+8801752530303"
                    class="flex items-center gap-2 text-[11px] md:text-sm font-bold tracking-tight">
                    <i data-lucide="phone" class="w-3.5 h-3.5 md:w-4 md:h-4"></i>
                    <span>+880 1752-530303</span>
                </a>
                <a href="mailto:info@izaanshop.com"
                    class="hidden sm:flex items-center gap-2 text-[11px] md:text-sm font-bold tracking-tight">
                    <i data-lucide="mail" class="w-3.5 h-3.5 md:w-4 md:h-4"></i>
                    <span>info@izaanshop.com</span>
                </a>
            </div>

            <div class="flex items-center gap-3">
                <a href="https://wa.me/8801752530303" target="_blank" rel="noopener noreferrer"
                    class="hover:scale-110 transition-transform p-1.5 bg-white rounded-lg shadow-md flex items-center justify-center group"
                    title="WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#E67E22" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                        class="w-4 h-4">
                        <path
                            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                </a>
                <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer"
                    class="hover:scale-110 transition-transform p-1.5 bg-white rounded-lg shadow-md flex items-center justify-center group"
                    title="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="#E67E22" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                        class="w-4 h-4">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                </a>
            </div>
        </div>
    </div>

    <!-- Main Navbar Section -->
    <nav :class="isScrolled ? 'bg-white/95 backdrop-blur-md py-2 shadow-lg border-b border-gray-100' : 'bg-white py-4 md:py-6 shadow-sm border-b border-gray-100'"
        class="transition-all duration-300">
        <div class="container mx-auto px-4 lg:max-w-5xl lg:px-10 flex items-center justify-between gap-4">
            <!-- Logo -->
            <a href="/" class="flex items-center active:scale-95 transition-all shrink-0">
                <img src="{{ asset('images/logo.png') }}" alt="Izaan Shop" class="h-10 md:h-12 object-contain" />
            </a>

            <!-- Navigation / Search -->
            <div class="flex-1 flex items-center justify-center gap-4 md:gap-8">
                <div class="relative group max-w-[140px] sm:max-w-[280px] w-full">
                    <form action="/" method="GET">
                        <input type="text" name="keyword" placeholder="Search..."
                            class="w-full bg-[#FAFAFA] border border-[#F3E5D8] rounded-full py-2 md:py-2.5 pl-8 md:pl-10 pr-4 text-[10px] md:text-xs focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all">
                        <i data-lucide="search"
                            class="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors"></i>
                    </form>
                </div>

                <div class="hidden lg:flex items-center gap-5">
                    @auth
                        <a href="{{ route('dashboard') }}"
                            class="text-[11px] font-black text-[#1A2C4B] hover:text-primary transition-colors uppercase tracking-widest leading-none">Dashboard</a>
                        @if(auth()->user()->role === 'admin')
                            <a href="/admin"
                                class="text-[11px] font-black text-primary hover:text-dark transition-colors uppercase tracking-widest leading-none">Admin</a>
                        @endif
                    @endauth
                    <a href="/about"
                        class="text-[11px] font-black text-[#1A2C4B] hover:text-primary transition-colors uppercase tracking-widest leading-none">About</a>
                </div>
            </div>

            <!-- Right Actions (Desktop) -->
            <div class="hidden lg:flex items-center gap-4 border-l border-gray-100 pl-6 shrink-0 mr-4">
                <a href="/wishlist" class="p-1.5 text-dark hover:text-primary transition-all group">
                    <i data-lucide="heart"
                        class="w-5 h-5 group-hover:scale-110 group-hover:fill-primary/10 transition-all"></i>
                </a>

                <a href="/cart" class="relative p-1.5 text-dark hover:text-primary transition-all group">
                    <i data-lucide="shopping-cart" class="w-5 h-5 group-hover:scale-110 transition-all"></i>
                    @if($cartCount > 0)
                        <span
                            class="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
                            {{ $cartCount }}
                        </span>
                    @endif
                </a>

                @auth
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit"
                            class="bg-[#1A2C4B] text-white px-6 py-2.5 rounded-full hover:bg-primary transition-all font-black text-[11px] uppercase tracking-widest shadow-lg shadow-dark/10 active:scale-95 translate-x-1">
                            Logout
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}"
                        class="bg-[#1A2C4B] text-white px-6 py-2.5 rounded-full hover:bg-primary transition-all font-black text-[11px] uppercase tracking-widest shadow-lg shadow-dark/10 active:scale-95 translate-x-1">
                        Login
                    </a>
                @endauth
            </div>

            <!-- Mobile Actions -->
            <div class="lg:hidden flex items-center gap-1 sm:gap-2">
                <a href="/cart" class="relative p-1.5 text-dark">
                    <i data-lucide="shopping-cart" class="w-5.5 h-5.5"></i>
                    @if($cartCount > 0)
                        <span
                            class="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                            {{ $cartCount }}
                        </span>
                    @endif
                </a>
                <button @click="isOpen = !isOpen" class="p-1.5 bg-gray-50 rounded-xl active:scale-90 transition-all">
                    <template x-if="!isOpen">
                        <i data-lucide="menu" class="w-5.5 h-5.5 text-dark"></i>
                    </template>
                    <template x-if="isOpen">
                        <i data-lucide="x" class="w-5.5 h-5.5 text-dark"></i>
                    </template>
                </button>
            </div>
        </div>
    </nav>

    <!-- Mobile Drawer -->
    <div x-show="isOpen" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0"
        x-transition:enter-end="opacity-100" x-transition:leave="transition ease-in duration-300"
        x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0"
        class="fixed inset-0 bg-dark/40 backdrop-blur-md z-[1001]" @click="isOpen = false" style="display: none;">
        <div @click.stop x-show="isOpen" x-transition:enter="transition ease-out duration-500"
            x-transition:enter-start="translate-x-full" x-transition:enter-end="translate-x-0"
            x-transition:leave="transition ease-in duration-500" x-transition:leave-start="translate-x-0"
            x-transition:leave-end="translate-x-full"
            class="absolute top-0 right-0 h-screen w-[80%] max-w-sm bg-white shadow-2xl p-8">

            <div class="flex items-center justify-between mb-12">
                <a href="/" @click="isOpen = false">
                    <img src="{{ asset('images/logo.png') }}" alt="Izaan Shop" class="h-8 md:h-10 object-contain" />
                </a>
                <button @click="isOpen = false" class="p-2 bg-gray-50 rounded-full">
                    <i data-lucide="x" class="w-6 h-6"></i>
                </button>
            </div>

            <div class="relative mb-10">
                <form action="/" method="GET">
                    <input type="text" name="keyword" placeholder="Search products..."
                        class="w-full bg-gray-50 border border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:border-primary/20 outline-none transition-all">
                    <i data-lucide="search" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                </form>
            </div>

            <nav class="flex flex-col gap-2 mb-12">
                <a href="/" @click="isOpen = false"
                    class="text-lg font-black text-dark p-4 bg-gray-50 rounded-2xl flex items-center justify-between">Home
                    <i data-lucide="chevron-right" class="w-5 h-5 text-primary"></i></a>
                @auth
                    <a href="{{ route('dashboard') }}" @click="isOpen = false"
                        class="text-lg font-black text-dark p-4 flex items-center justify-between">Dashboard <i
                            data-lucide="chevron-right" class="w-5 h-5 text-gray-300"></i></a>
                @endauth
                <a href="/cart" @click="isOpen = false"
                    class="text-lg font-black text-dark p-4 flex items-center justify-between">My Cart <i
                        data-lucide="chevron-right" class="w-5 h-5 text-gray-300"></i></a>
                <a href="/about" @click="isOpen = false"
                    class="text-lg font-black text-dark p-4 flex items-center justify-between">About Us <i
                        data-lucide="chevron-right" class="w-5 h-5 text-gray-300"></i></a>
            </nav>

            <div class="space-y-4">
                @auth
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button type="submit"
                            class="w-full bg-[#1A2C4B] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                            Logout
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}" @click="isOpen = false"
                        class="block w-full text-center bg-gray-100 text-dark py-4 rounded-2xl font-black uppercase tracking-widest">Sign
                        In</a>
                    <a href="{{ route('register') }}" @click="isOpen = false"
                        class="block w-full text-center bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">Sign
                        Up</a>
                @endauth
            </div>
        </div>
    </div>

</header>