@props(['categories', 'storeMaxPrice' => 5000])

<div x-data="{
    min: {{ (int) request('minPrice', 0) }},
    max: {{ (int) request('maxPrice', $storeMaxPrice) }},
    storeMax: {{ (int) $storeMaxPrice }},
    
    applyFilter() {
        let params = new URLSearchParams(window.location.search);
        params.set('minPrice', this.min);
        params.set('maxPrice', this.max);
        params.set('page', 1);
        window.location.href = window.location.pathname + '?' + params.toString() + '#shop-now';
    }
}" class="space-y-6">
    <!-- ── Categories ── -->
    <div>
        <h3 class="text-[11px] font-black text-dark uppercase tracking-widest mb-3 flex items-center gap-2">
            <i data-lucide="layout-grid" class="w-3.5 h-3.5 text-primary"></i>
            Categories
        </h3>
        <div class="space-y-1">
            <a href="{{ request()->fullUrlWithQuery(['category' => null, 'page' => null]) }}#shop-now"
               class="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold transition-all
                      {{ !request('category') ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'text-gray-500 hover:bg-gray-50 hover:text-dark' }}">
                <span>All Products</span>
                @if(!request('category'))<i data-lucide="check" class="w-3 h-3"></i>@endif
            </a>
            @foreach($categories as $cat)
                @php $catSlug = $cat['slug'] ?? $cat->slug; @endphp
                <a href="{{ request()->fullUrlWithQuery(['category' => $catSlug, 'page' => null]) }}#shop-now"
                   class="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold transition-all
                          {{ request('category') == $catSlug ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'text-gray-500 hover:bg-gray-50 hover:text-dark' }}">
                    <span>{{ $cat['name'] ?? $cat->name }}</span>
                    @if(request('category') == $catSlug)<i data-lucide="check" class="w-3 h-3"></i>@endif
                </a>
            @endforeach
        </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-100"></div>

    <!-- ── Price Range ── -->
    <div>
        <h3 class="text-[11px] font-black text-dark uppercase tracking-widest mb-3 flex items-center gap-2">
            <i data-lucide="tag" class="w-3.5 h-3.5 text-primary"></i>
            Price Range
        </h3>

        <div class="space-y-3">
            <!-- Visual range track -->
            <div class="range-slider-container">
                 <div class="absolute h-1 w-full bg-gray-200 rounded-full top-1/2 -translate-y-1/2"></div>
                 <div class="absolute h-1 bg-primary rounded-full top-1/2 -translate-y-1/2"
                      :style="`left:${(min/storeMax)*100}%; width:${((max-min)/storeMax)*100}%`"></div>
                 
                 <input type="range" x-model.number="min" 
                        min="0" :max="storeMax" step="10"
                        @input="if(min > max-100) min = max-100"
                        @change="applyFilter()">
                 
                 <input type="range" x-model.number="max" 
                        min="0" :max="storeMax" step="10"
                        @input="if(max < min+100) max = min+100"
                        @change="applyFilter()">
            </div>

            <!-- Min / Max inputs -->
            <div class="flex items-center gap-2">
                <div class="flex-1 relative">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">৳</span>
                    <input type="number" x-model.number="min"
                           min="0" :max="max-1"
                           @change="applyFilter()"
                           class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-5 pr-2 py-2 text-[11px] font-bold text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
                           placeholder="0">
                </div>
                <span class="text-gray-300 text-xs">—</span>
                <div class="flex-1 relative">
                    <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">৳</span>
                    <input type="number" x-model.number="max"
                           :min="min+1" :max="storeMax"
                           @change="applyFilter()"
                           class="w-full bg-gray-50 border border-gray-200 rounded-lg pl-5 pr-2 py-2 text-[11px] font-bold text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none"
                           :placeholder="storeMax">
                </div>
            </div>

            <!-- Apply Button -->
            <button @click="applyFilter()"
                    class="w-full bg-primary text-white py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-primary-light active:scale-95 transition-all shadow-sm shadow-primary/20">
                Apply Filters
            </button>
        </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-100"></div>

    <!-- ── Clear All ── -->
    @if(request()->hasAny(['category', 'minPrice', 'maxPrice', 'keyword']))
        <a href="/"
           class="flex items-center gap-2 text-[11px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors">
            <i data-lucide="x-circle" class="w-3.5 h-3.5"></i>
            Clear All Filters
        </a>
    @endif
</div>
