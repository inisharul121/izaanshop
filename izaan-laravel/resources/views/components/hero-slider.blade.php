@if(isset($banners) && is_countable($banners) && count($banners) > 0)
<section 
    x-data="{ 
        current: 0, 
        banners: {{ json_encode($banners) }},
        next() { this.current = (this.current + 1) % this.banners.length },
        prev() { this.current = (this.current - 1 + this.banners.length) % this.banners.length },
        autoplay() {
            setInterval(() => { this.next() }, 5000)
        }
    }"
    x-init="autoplay()"
    class="relative w-full overflow-hidden bg-gray-100 py-3 md:py-0"
>
    <div class="container mx-auto px-4 md:px-0 lg:max-w-5xl lg:px-10">
        <div class="relative aspect-[2.5/1] sm:aspect-[16/5] w-full rounded-2xl md:rounded-none overflow-hidden shadow-sm md:shadow-none">
            
            <template x-for="(banner, index) in banners" :key="index">
                <div 
                    x-show="current === index"
                    x-transition:enter="transition ease-out duration-500"
                    x-transition:enter-start="opacity-0 scale-105"
                    x-transition:enter-end="opacity-100 scale-100"
                    x-transition:leave="transition ease-in duration-500"
                    x-transition:leave-start="opacity-100 scale-100"
                    x-transition:leave-end="opacity-0 scale-95"
                    class="absolute inset-0"
                >
                    <img 
                        :src="banner.image" 
                        :alt="banner.title" 
                        class="w-full h-full object-cover"
                        :loading="index === 0 ? 'eager' : 'lazy'"
                        :fetchpriority="index === 0 ? 'high' : 'auto'"
                    >
                    
                    <div x-show="banner.title || banner.subtitle" class="absolute inset-0 bg-gradient-to-r from-dark/60 via-dark/20 to-transparent flex items-center">
                        <div class="container mx-auto px-4 md:px-12">
                            <div class="max-w-xl space-y-4">
                                <h2 x-text="banner.title" class="text-2xl md:text-5xl font-black text-white leading-tight drop-shadow-lg"></h2>
                                <p x-text="banner.subtitle" class="text-sm md:text-lg text-white/80 font-medium drop-shadow"></p>
                                <template x-if="banner.link">
                                    <a :href="banner.link" class="inline-block mt-2 px-6 md:px-8 py-2.5 md:py-3 bg-primary text-white rounded-full font-bold text-xs md:text-sm shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                                        Shop Now
                                    </a>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Arrows -->
            <template x-if="banners.length > 1">
                <div>
                    <button @click="prev()" class="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10">
                        <i data-lucide="chevron-left" class="w-4 h-4 md:w-5 md:h-5 text-dark"></i>
                    </button>
                    <button @click="next()" class="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10">
                        <i data-lucide="chevron-right" class="w-4 h-4 md:w-5 md:h-5 text-dark"></i>
                    </button>
                </div>
            </template>

            <!-- Dots -->
            <template x-if="banners.length > 1">
                <div class="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    <template x-for="(banner, index) in banners" :key="index">
                        <button 
                            @click="current = index"
                            :class="current === index ? 'w-6 md:w-8 h-2 md:h-2.5 bg-primary shadow-lg shadow-primary/30' : 'w-2 md:w-2.5 h-2 md:h-2.5 bg-white/60 hover:bg-white'"
                            class="rounded-full transition-all duration-300"
                        ></button>
                    </template>
                </div>
            </template>
        </div>
    </div>
</section>
@endif