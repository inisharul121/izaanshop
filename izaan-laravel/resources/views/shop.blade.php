<x-shop-layout>
    <!-- Category Bar -->
    <div class="bg-white border-b border-gray-100 shadow-sm sticky top-[72px] md:top-[88px] z-40">
        <x-category-bar />
    </div>

    <!-- Hero Section -->
    <x-hero-slider :banners="$banners" />

    <!-- Shop Content -->
    <section id="shop-now" class="py-12 bg-white scroll-mt-[160px] md:scroll-mt-[200px]">
        <div class="container mx-auto px-4 lg:max-w-5xl lg:px-10">

            <!-- Mobile Filter Toggle -->
            <div x-data="{ filterOpen: false }">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 class="text-3xl md:text-4xl font-black text-dark mb-1">
                            @if(request('category'))
                                {{ ucfirst(request('category')) }}
                            @elseif(request('keyword'))
                                Search: "{{ request('keyword') }}"
                            @else
                                Premium Collection
                            @endif
                        </h2>
                        <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">
                            {{ $products->total() }} Products
                        </p>
                    </div>

                    <div class="flex items-center gap-3">
                        <!-- Mobile filter button -->
                        <button @click="filterOpen = !filterOpen"
                                class="lg:hidden flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest text-dark hover:border-primary/30 transition-all">
                            <i data-lucide="sliders-horizontal" class="w-3.5 h-3.5"></i>
                            Filters
                        </button>

                        <select onchange="window.location.href = this.value"
                                class="bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-5 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all">
                            <option value="{{ request()->fullUrlWithQuery(['sort' => 'popular']) }}" {{ request('sort', 'popular') == 'popular' ? 'selected' : '' }}>Popularity</option>
                            <option value="{{ request()->fullUrlWithQuery(['sort' => 'price-low']) }}" {{ request('sort') == 'price-low' ? 'selected' : '' }}>Price: Low → High</option>
                            <option value="{{ request()->fullUrlWithQuery(['sort' => 'price-high']) }}" {{ request('sort') == 'price-high' ? 'selected' : '' }}>Price: High → Low</option>
                        </select>

                        @if(request()->hasAny(['category', 'keyword', 'minPrice', 'maxPrice']))
                            <a href="/"
                               class="flex items-center gap-1.5 text-xs font-black text-gray-400 hover:text-red-500 transition-colors whitespace-nowrap">
                                <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
                                Clear
                            </a>
                        @endif
                    </div>
                </div>

                <!-- Main Grid: Sidebar + Products -->
                <div class="flex gap-8 items-start">

                    <!-- ─── Sidebar Filter (Desktop always-visible / Mobile drawer) ─── -->
                    <aside class="hidden lg:block w-56 shrink-0 sticky top-32">
                        <x-filter-sidebar :categories="$categories" :storeMaxPrice="$storeMaxPrice" />
                    </aside>

                    <!-- Mobile Drawer Backdrop -->
                    <div x-show="filterOpen"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0"
                         x-transition:enter-end="opacity-100"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-start="opacity-100"
                         x-transition:leave-end="opacity-0"
                         @click="filterOpen = false"
                         class="lg:hidden fixed inset-0 bg-dark/40 backdrop-blur-sm z-40"
                         style="display:none;">
                    </div>

                    <!-- Mobile Filter Panel (slide-in) -->
                    <div x-show="filterOpen"
                         x-transition:enter="transition ease-out duration-300"
                         x-transition:enter-start="-translate-x-full"
                         x-transition:enter-end="translate-x-0"
                         x-transition:leave="transition ease-in duration-200"
                         x-transition:leave-start="translate-x-0"
                         x-transition:leave-end="-translate-x-full"
                         @click.stop
                         class="lg:hidden fixed top-0 left-0 h-screen w-72 bg-white shadow-2xl z-50 overflow-y-auto p-6"
                         style="display:none;">
                        <div class="flex items-center justify-between mb-6">
                            <span class="font-black text-dark uppercase tracking-wider text-sm">Filters</span>
                            <button @click="filterOpen = false" class="p-1.5 bg-gray-100 rounded-full">
                                <i data-lucide="x" class="w-4 h-4"></i>
                            </button>
                        </div>
                        <x-filter-sidebar :categories="$categories" :storeMaxPrice="$storeMaxPrice" />
                    </div>

                    <!-- ─── Product Grid ─── -->
                    <div class="flex-1 min-w-0">
                        @if($products->count() > 0)
                            <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                                @foreach($products as $product)
                                    <x-product-card :product="$product" />
                                @endforeach
                            </div>

                            <!-- Pagination -->
                            <div class="mt-16">
                                {{ $products->appends(request()->query())->links() }}
                            </div>
                        @else
                            <div class="py-20 text-center">
                                <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-3xl mb-6">
                                    <i data-lucide="package-search" class="w-10 h-10 text-gray-300"></i>
                                </div>
                                <h3 class="text-xl font-black text-dark mb-2">No Products Found</h3>
                                <p class="text-gray-400 font-bold max-w-sm mx-auto">Try adjusting your filters or clear everything to browse all products.</p>
                                <a href="/" class="inline-block mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline">Clear all filters</a>
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        </div>
    </section>
</x-shop-layout>
