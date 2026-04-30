@if(count($categories) > 0)
<div class="bg-gray-50/50 border-b border-gray-100 overflow-hidden relative group/catbar">
    <div class="container mx-auto px-4 lg:max-w-5xl lg:px-10">
        <div class="flex items-center gap-0.5 overflow-x-auto custom-category-scrollbar py-3 md:justify-center scroll-smooth">
            @foreach($categories as $cat)
            @php $isActive = request('category') == ($cat['slug'] ?? $cat->slug); @endphp
            <a href="/?category={{ $cat['slug'] ?? $cat->slug }}#shop-now" 
               class="flex items-center gap-1.5 px-3 py-2 text-[10px] md:text-[11px] font-black {{ $isActive ? 'text-primary' : 'text-[#1A2C4B]' }} uppercase tracking-widest hover:text-primary transition-all shrink-0 group">
                <div class="p-1.5 bg-white rounded-lg shadow-sm border {{ $isActive ? 'border-primary/40' : 'border-gray-100' }} group-hover:border-primary/20 group-hover:scale-110 group-hover:shadow-md transition-all">
                    <i data-lucide="{{ $getIcon($cat['name'] ?? $cat->name) }}" class="w-3.5 h-3.5 text-primary"></i>
                </div>
                <span class="flex items-center gap-0.5">
                    {{ $cat['name'] ?? $cat->name }} 
                    <i data-lucide="chevron-right" class="w-3 h-3 {{ $isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1' }} group-hover:opacity-100 group-hover:translate-x-0 transition-all"></i>
                </span>
            </a>
            @endforeach
        </div>
    </div>
</div>

<style>
    .custom-category-scrollbar::-webkit-scrollbar {
        height: 3px;
    }
    .custom-category-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }
    .custom-category-scrollbar::-webkit-scrollbar-thumb {
        background: #eee;
        border-radius: 10px;
    }
    .custom-category-scrollbar:hover::-webkit-scrollbar-thumb {
        background: #e67e2244;
    }
    
    /* Hide scrollbar by default, show on hover of container */
    .custom-category-scrollbar {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
    }
    .group\/catbar:hover .custom-category-scrollbar {
        -ms-overflow-style: auto;
        scrollbar-width: thin;
    }
    .group\/catbar:hover .custom-category-scrollbar::-webkit-scrollbar {
        display: block;
    }
    @media (max-width: 768px) {
        .custom-category-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
        }
        .custom-category-scrollbar::-webkit-scrollbar {
            display: none !important;
        }
    }
</style>
@endif