<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} Admin</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    
    <!-- Quill Rich Text Editor -->
    <link href="https://cdn.quilljs.com/1.3.6/quill.snow.css" rel="stylesheet">
    <script src="https://cdn.quilljs.com/1.3.6/quill.min.js"></script>
    
    <!-- Alpine.js -->
    <script defer src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"></script>

    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <style>
        [x-cloak] { display: none !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

        /* Quill Styles */
        .ql-toolbar.ql-snow {
            border: 1px solid #f3f4f6 !important;
            border-top-left-radius: 1.5rem;
            border-top-right-radius: 1.5rem;
            background: #f9fafb;
            padding: 12px 20px !important;
        }
        .ql-container.ql-snow {
            border: 1px solid #f3f4f6 !important;
            border-bottom-left-radius: 1.5rem;
            border-bottom-right-radius: 1.5rem;
            font-family: inherit !important;
            min-height: 250px;
        }
        .ql-editor {
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            padding: 20px 24px !important;
            color: #111827;
        }
        .ql-editor.ql-blank::before {
            color: #9ca3af !important;
            font-style: normal !important;
            font-weight: 500 !important;
            left: 24px !important;
        }
    </style>
</head>
<body class="font-sans antialiased bg-gray-50 text-dark overflow-x-hidden">
    <div x-data="{ 
        sidebarOpen: false,
        activeTab: '{{ request()->segment(2) ?? 'dashboard' }}'
    }" class="min-h-screen flex">
        
        <!-- Sidebar Shell -->
        <div class="print:hidden">
            <!-- Mobile Backdrop -->
            <div 
                x-show="sidebarOpen" 
                x-cloak
                @click="sidebarOpen = false"
                class="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[45] lg:hidden"
            ></div>

            <aside 
                :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
                class="w-72 md:w-64 bg-dark text-white flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 transform lg:translate-x-0 lg:static lg:inset-0"
            >
                <div class="p-8 flex flex-col items-center relative">
                    <button 
                        @click="sidebarOpen = false"
                        class="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-white"
                    >
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                    
                    <a href="{{ route('home') }}" class="relative group block">
                        <div class="absolute -inset-1.5 bg-gradient-to-r from-primary to-orange-400 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div class="relative bg-dark border border-white/10 p-3 rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-110">
                            <img src="{{ asset('images/logo.png') }}" alt="IzaanShop Logo" class="w-14 h-auto object-contain">
                        </div>
                    </a>
                    <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-6 opacity-80">Control Center</p>
                </div>

                <nav class="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                    @php
                        $menuItems = [
                            ['id' => 'dashboard', 'label' => 'Overview', 'icon' => 'bar-chart-3', 'route' => 'admin.dashboard'],
                            ['id' => 'products', 'label' => 'Products', 'icon' => 'shopping-bag', 'route' => 'admin.products.index'],
                            ['id' => 'categories', 'label' => 'Categories', 'icon' => 'tag', 'route' => 'admin.categories.index'],
                            ['id' => 'orders', 'label' => 'Orders', 'icon' => 'package', 'route' => 'admin.orders.index'],
                            ['id' => 'coupons', 'label' => 'Coupons', 'icon' => 'credit-card', 'route' => 'admin.coupons.index'],
                            ['id' => 'users', 'label' => 'Customers', 'icon' => 'users', 'route' => 'admin.users.index'],
                            ['id' => 'admin_approvals', 'label' => 'Admin Approvals', 'icon' => 'shield-check', 'route' => 'admin.approvals.index'],
                            ['id' => 'banners', 'label' => 'Banners', 'icon' => 'image', 'route' => 'admin.banners.index'],
                            ['id' => 'shipping', 'label' => 'Shipping', 'icon' => 'truck', 'route' => 'admin.shipping.index'],
                            ['id' => 'media', 'label' => 'Media Library', 'icon' => 'image', 'route' => 'admin.media.page'],
                            ['id' => 'financial_report', 'label' => 'Financials', 'icon' => 'file-text', 'route' => 'admin.reports.finance'],
                            ['id' => 'product_report', 'label' => 'Stock Reports', 'icon' => 'file-text', 'route' => 'admin.reports.stock'],
                            ['id' => 'payment_settings', 'label' => 'Payments', 'icon' => 'settings', 'route' => 'admin.reports.payments'],
                        ];
                    @endphp

                    @foreach($menuItems as $item)
                        @php
                            $route = $item['route'] ? route($item['route']) : '#';
                            $isActive = $item['route'] && (request()->routeIs($item['route']) || ($item['id'] !== 'dashboard' && str_contains(request()->url(), $item['id'])));
                        @endphp
                        <a 
                            href="{{ $route }}"
                            class="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all {{ $isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white' }}"
                        >
                            <i data-lucide="{{ $item['icon'] }}" class="w-5 h-5"></i>
                            {{ $item['label'] }}
                        </a>
                    @endforeach
                </nav>

                <div class="p-4 border-t border-white/5">
                    <form method="POST" action="{{ route('logout') }}">
                        @csrf
                        <button
                            type="submit"
                            class="w-full flex items-center gap-3 px-4 py-4 text-red-400 hover:bg-red-400/10 rounded-2xl text-sm font-bold transition-all"
                        >
                            <i data-lucide="log-out" class="w-5 h-5"></i>
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 min-h-screen flex flex-col print:ml-0 print:bg-white w-full">
            <!-- Header -->
            <header class="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 print:hidden">
                <div class="flex items-center gap-4 flex-1">
                    <button 
                        @click="sidebarOpen = !sidebarOpen"
                        class="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <i data-lucide="menu" class="w-6 h-6"></i>
                    </button>
                    <div class="relative max-w-md w-full hidden sm:block">
                        <input
                            type="text"
                            placeholder="Search products, orders..."
                            class="w-full bg-gray-50 border border-gray-100 rounded-2xl py-2.5 px-4 pl-10 text-sm focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        />
                        <i data-lucide="search" class="absolute left-3.5 top-3 text-gray-400 w-4 h-4"></i>
                    </div>
                </div>

                <div class="flex items-center gap-6">
                    <button class="relative p-2 text-gray-400 hover:text-dark transition-colors">
                        <i data-lucide="bell" class="w-5 h-5"></i>
                        <span class="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white"></span>
                    </button>
                    
                    <div class="h-8 w-px bg-gray-100 mx-2"></div>

                    <div class="flex items-center gap-3">
                        <div class="text-right hidden sm:block">
                            <p class="text-sm font-black text-dark leading-none">{{ auth()->user()->name }}</p>
                            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Super Admin</p>
                        </div>
                        <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black uppercase">
                            {{ substr(auth()->user()->name, 0, 1) }}
                        </div>
                    </div>
                </div>
            </header>
            
            <main class="p-8 flex-1 print:p-0">
                {{ $slot }}
            </main>
        </div>
    </div>

    <x-media-library />

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            lucide.createIcons();
        });
    </script>
</body>
</html>
