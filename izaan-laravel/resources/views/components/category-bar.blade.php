@if(count($categories) > 0)
<div class="bg-gray-50/50 border-b border-gray-100 overflow-hidden">
    <div class="container mx-auto px-4 lg:max-w-5xl lg:px-10">
        <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 md:justify-center">
            @foreach($categories as $cat)
            <a href="/?category={{ $cat['slug'] ?? $cat->slug }}#shop-now" class="flex items-center gap-2 px-4 py-2 text-[11px] font-black text-gray-500 uppercase tracking-widest hover:text-primary transition-all shrink-0 group">
                <div class="p-1.5 bg-white rounded-lg shadow-sm border border-gray-100 group-hover:border-primary/20 group-hover:scale-110 transition-all">
                    <i data-lucide="{{ $getIcon($cat['name'] ?? $cat->name) }}" class="w-4 h-4 text-primary"></i>
                </div>
                <span class="flex items-center gap-0.5">
                    {{ $cat['name'] ?? $cat->name }} 
                    <i data-lucide="chevron-right" class="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"></i>
                </span>
            </a>
            @endforeach
        </div>
    </div>
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
@endif