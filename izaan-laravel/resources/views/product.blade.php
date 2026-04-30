@php
    $images = $product->images;
    $mainImage = $images['main'] ?? '/placeholder.png';
    $gallery = array_merge([$mainImage], ($images['gallery'] ?? []));
    $gallery = array_filter($gallery);

    $originalPrice = (float)$product->price;
    $salePrice = (float)$product->salePrice;
    $finalPrice = $salePrice > 0 ? $salePrice : $originalPrice;
    $discount = ($salePrice > 0 && $salePrice < $originalPrice) ? round((($originalPrice - $salePrice) / $originalPrice) * 100) : null;
@endphp

<x-shop-layout>
    <div x-data="{ 
        activeImg: 0, 
        mainImage: '{{ $mainImage }}',
        gallery: {{ json_encode($gallery) }},
        quantity: 1,
        activeTab: 'description',
        selectedOptions: {},
        productType: '{{ $product->type }}',
        variants: {{ $product->variants->toJson() }},
        activeVariant: null,

        init() {
            if (this.productType === 'VARIABLE' && this.variants.length > 0) {
                let defaultVariant = this.variants.find(v => v.isDefault) || this.variants[0];
                if (defaultVariant) {
                    this.selectedOptions = typeof defaultVariant.options === 'string' ? JSON.parse(defaultVariant.options) : defaultVariant.options;
                    this.updateVariant();
                }
            }
        },

        updateVariant() {
            if (this.productType !== 'VARIABLE') return;
            
            let cleanedSelected = {};
            Object.keys(this.selectedOptions).forEach(k => {
                cleanedSelected[k.trim().toLowerCase()] = (this.selectedOptions[k] || '').toString().trim().toLowerCase();
            });

            // Only count attributes that actually HAVE options
            const totalRequiredAttributes = {{ $product->attributes->reject(fn($a) => empty($a->options))->count() }};
            const selectedCount = Object.keys(cleanedSelected).length;

            let match = this.variants.find(v => {
                let vOptions = typeof v.options === 'string' ? JSON.parse(v.options) : v.options;
                let cleanedVOptions = {};
                Object.keys(vOptions || {}).forEach(k => {
                    cleanedVOptions[k.trim().toLowerCase()] = (vOptions[k] || '').toString().trim().toLowerCase();
                });

                // Match if all selected match, AND if we have a full selection
                const isMatch = Object.entries(cleanedSelected).every(([key, val]) => cleanedVOptions[key] === val);
                return isMatch && selectedCount === totalRequiredAttributes;
            });
            
            this.activeVariant = match;
            if (match && match.image) {
                this.mainImage = match.image;
            }
        },

        handleOptionChange(name, val) {
            this.selectedOptions = { ...this.selectedOptions, [name]: val };
            this.updateVariant();
        }
    }" class="bg-white min-h-screen pb-20">
        
        <div class="container mx-auto px-4 lg:max-w-5xl lg:px-10 pt-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                
                <!-- Left: Gallery -->
                <div class="lg:col-span-6 space-y-4">
                    <div class="lg:sticky lg:top-24 space-y-6">
                        <div class="aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative group">
                            <img :src="mainImage" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                            @if($discount)
                                <div class="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-sm z-10">
                                    {{ $discount }}% OFF
                                </div>
                            @endif
                        </div>

                        <div class="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            <template x-for="(img, i) in gallery" :key="i">
                                <button @click="activeImg = i; mainImage = img" 
                                        :class="(mainImage === img) ? 'border-primary ring-2 ring-primary/10' : 'border-gray-100 hover:border-gray-200'"
                                        class="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border transition-all">
                                    <img :src="img" class="w-full h-full object-cover">
                                </button>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Right: Info -->
                <div class="lg:col-span-6 flex flex-col pt-4">
                    <div class="space-y-6">
                        <div>
                            <a href="/?category={{ $product->category?->slug }}" class="inline-block px-3 py-1 bg-gray-100 text-gray-600 font-bold text-[10px] uppercase tracking-wider rounded-md mb-4">
                                {{ $product->category?->name }}
                            </a>
                            <h1 class="text-3xl md:text-4xl font-bold text-dark leading-tight mb-4">
                                {{ $product->name }}
                            </h1>
                            
                            <div class="flex items-center gap-6">
                                <div class="flex items-center gap-1.5">
                                    <div class="flex items-center gap-0.5">
                                        @for($i = 0; $i < 5; $i++)
                                            <i data-lucide="star" class="w-3.5 h-3.5 {{ $i < floor($product->rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200' }}"></i>
                                        @endfor
                                    </div>
                                    <span class="text-xs text-gray-400 font-medium">({{ $product->numReviews }} Reviews)</span>
                                </div>
                                <div class="h-4 w-px bg-gray-200"></div>
                                <div class="flex items-center gap-2">
                                    <div class="w-1.5 h-1.5 rounded-full {{ ($product->stock === null || $product->stock > 0) ? 'bg-green-500' : 'bg-red-500' }}"></div>
                                    <span class="text-xs font-bold uppercase tracking-wider {{ ($product->stock === null || $product->stock > 0) ? 'text-green-600' : 'text-red-600' }}">
                                        {{ ($product->stock === null || $product->stock > 0) ? 'In Stock' : 'Out of Stock' }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Variant Selectors -->
                        @if($product->type === 'VARIABLE' && $product->attributes->count() > 0)
                            <div class="space-y-5 py-6 border-t border-b border-gray-100">
                                @foreach($product->attributes as $attr)
                                    @php $options = $attr->options; @endphp
                                    <div class="space-y-3">
                                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ $attr->name }}</span>
                                        <div class="flex flex-wrap gap-2">
                                            @foreach($options as $opt)
                                                <button @click="handleOptionChange('{{ $attr->name }}', '{{ $opt }}')"
                                                        :class="selectedOptions['{{ $attr->name }}'] === '{{ $opt }}' ? 'bg-primary border-primary text-white shadow-lg' : 'bg-white border-gray-100 text-gray-500'"
                                                        class="px-5 py-2.5 rounded-xl text-xs font-bold border transition-all">
                                                    {{ $opt }}
                                                </button>
                                            @endforeach
                                        </div>
                                    </div>
                                @endforeach
                            </div>
                        @endif

                        <div class="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div class="flex items-baseline gap-3">
                                <span class="text-4xl font-bold tracking-tight text-primary">
                                    <span x-text="activeVariant ? (parseFloat(activeVariant.salePrice) > 0 ? activeVariant.salePrice : activeVariant.price) : {{ $finalPrice }}"></span>৳
                                </span>
                                <template x-if="activeVariant ? (parseFloat(activeVariant.salePrice) > 0 && parseFloat(activeVariant.price) > parseFloat(activeVariant.salePrice)) : {{ $discount ? 'true' : 'false' }}">
                                    <span class="text-lg text-gray-400 line-through font-medium">
                                        <span x-text="activeVariant ? activeVariant.price : {{ $originalPrice }}"></span>৳
                                    </span>
                                </template>
                            </div>
                            
                            <div class="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                                <button @click="quantity = Math.max(1, quantity - 1)" class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-r border-gray-100"><i data-lucide="minus" class="w-4 h-4"></i></button>
                                <span x-text="quantity" class="w-10 text-center font-bold text-sm"></span>
                                <button @click="quantity++" class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-l border-gray-100"><i data-lucide="plus" class="w-4 h-4"></i></button>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-3 pt-2">
                             <form @submit.prevent="
                                let btn = $event.target.querySelector('button');
                                let origHTML = btn.innerHTML;
                                btn.disabled = true;
                                btn.innerHTML = '<svg class=\'w-5 h-5 animate-spin\' viewBox=\'0 0 24 24\'><circle cx=\'12\' cy=\'12\' r=\'10\' stroke=\'currentColor\' stroke-width=\'3\' fill=\'none\' stroke-dasharray=\'31.4 31.4\'/></svg> Adding...';
                                fetch('/cart/add', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}', 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
                                    body: JSON.stringify({ product_id: {{ $product->id }}, quantity: quantity, variant_id: activeVariant?.id || null })
                                }).then(r => r.json()).then(data => {
                                    document.querySelectorAll('[data-cart-count]').forEach(el => { el.textContent = data.cartCount; el.closest('[data-cart-badge]').style.display = 'flex'; });
                                    btn.innerHTML = '<svg xmlns=\'http://www.w3.org/2000/svg\' class=\'w-5 h-5\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\'><polyline points=\'20 6 9 17 4 12\'/></svg> Added to Basket!';
                                    btn.classList.add('!bg-green-500', '!text-white', '!border-green-500');
                                    window.showCartToast && window.showCartToast(data.message || 'Added to cart!');
                                    setTimeout(() => { btn.innerHTML = origHTML; btn.disabled = false; btn.classList.remove('!bg-green-500', '!text-white', '!border-green-500'); }, 2000);
                                }).catch(() => { btn.innerHTML = origHTML; btn.disabled = false; });
                            " class="flex-1">
                                <button type="submit" class="w-full py-4 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white font-bold text-sm flex items-center justify-center gap-3 transition-all">
                                    <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                                    Add To Basket
                                </button>
                            </form>
                            <form action="/checkout/direct" method="POST" class="flex-1">
                                @csrf
                                <input type="hidden" name="product_id" value="{{ $product->id }}">
                                <input type="hidden" name="quantity" :value="quantity">
                                <input type="hidden" name="variant_id" :value="activeVariant?.id">
                                <button type="submit" class="w-full py-4 rounded-xl bg-dark text-white hover:bg-dark/90 font-bold text-sm flex items-center justify-center gap-3 shadow-xl transition-all">
                                    <i data-lucide="credit-card" class="w-5 h-5"></i>
                                    Buy Now
                                </button>
                            </form>
                        </div>

                        <!-- Divider -->
                        <div class="pt-10">
                            <div class="flex border-b border-gray-100 mb-8">
                                <button @click="activeTab = 'description'" :class="activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'" class="px-6 py-4 text-sm font-bold uppercase transition-all">Description</button>
                                <button @click="activeTab = 'reviews'" :class="activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'" class="px-6 py-4 text-sm font-bold uppercase transition-all">Reviews</button>
                            </div>
                            
                            <div class="min-h-[200px] text-gray-500 leading-relaxed text-sm">
                                <div x-show="activeTab === 'description'">
                                    {!! $product->description !!}
                                </div>
                                <div x-show="activeTab === 'reviews'" class="text-center py-12">
                                    No reviews yet for this product.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Products -->
            @if($relatedProducts->count() > 0)
                <section class="mt-24 pt-24 border-t border-gray-100">
                    <h2 class="text-2xl font-bold text-dark mb-10">You Might Also Like</h2>
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        @foreach($relatedProducts as $p)
                            <x-product-card :product="$p" />
                        @endforeach
                    </div>
                </section>
            @endif
        </div>
    </div>
</x-shop-layout>
