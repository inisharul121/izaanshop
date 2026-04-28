<div class="card flex flex-col h-full group transition-all hover:-translate-y-1">
    <a href="/product/{{ $product->slug }}" class="relative block aspect-[4/5] overflow-hidden rounded-md mb-4">
        <img 
            src="{{ $mainImage }}" 
            alt="{{ $product->name }}"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            {{ $priority ? 'loading=eager' : 'loading=lazy' }}
        >
        @if($discount)
        <span class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {{ $discount }}% OFF
        </span>
        @endif
    </a>

    <div class="flex-1 flex flex-col">
        <div class="flex items-center gap-0.5 mb-1">
            @for($i = 0; $i < 5; $i++)
            <i data-lucide="star" class="w-2.5 h-2.5 md:w-3 md:h-3 {{ $i < floor($product->rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300' }}"></i>
            @endfor
            <span class="text-[9px] md:text-[10px] text-gray-400 ml-1">({{ $product->numReviews }})</span>
        </div>
        
        <a href="/product/{{ $product->slug }}" class="text-[11px] md:text-sm font-semibold text-dark hover:text-primary transition-colors mb-2 line-clamp-2 leading-tight h-7 md:h-10">
            {{ $product->name }}
        </a>

        <div class="mt-auto">
            <div class="flex items-center gap-1.5 mb-2 md:mb-3">
                @if($product->salePrice)
                    <span class="text-primary font-bold text-sm md:text-base">{{ $product->salePrice }}৳</span>
                    <span class="text-gray-400 text-[10px] md:text-xs line-through">{{ $product->price }}৳</span>
                @else
                    <span class="text-dark font-bold text-sm md:text-base">{{ $product->price }}৳</span>
                @endif
            </div>

            <div class="flex flex-col gap-1.5">
                <form action="/cart/add" method="POST">
                    @csrf
                    <input type="hidden" name="product_id" value="{{ $product->id }}">
                    <button type="submit" class="w-full bg-primary/10 text-primary border border-primary/20 py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-all duration-300">
                        <i data-lucide="shopping-cart" class="w-3 h-3"></i>
                        Add to Cart
                    </button>
                </form>
                <form action="/checkout/direct" method="POST">
                    @csrf
                    <input type="hidden" name="product_id" value="{{ $product->id }}">
                    <button type="submit" class="w-full bg-dark text-white py-1.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-dark/90 transition-all active:scale-95">
                        <i data-lucide="credit-card" class="w-3 h-3"></i>
                        Buy Now
                    </button>
                </form>
            </div>
        </div>
    </div>
</div>