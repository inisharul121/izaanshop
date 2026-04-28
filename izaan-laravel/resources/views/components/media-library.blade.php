<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('mediaLibrary', () => ({
        showMediaLibrary: false,
        images: [],
        loading: true,
        selected: [],
        multiple: false,
        fetchImages() {
            this.loading = true;
            fetch('{{ route("admin.media.index") }}')
                .then(res => res.json())
                .then(data => {
                    this.images = data;
                    this.loading = false;
                });
        },
        toggleSelect(url) {
            if (this.multiple) {
                if (this.selected.includes(url)) {
                    this.selected = this.selected.filter(u => u !== url);
                } else {
                    this.selected.push(url);
                }
            } else {
                window.dispatchEvent(new CustomEvent('izaan-media-selected', { 
                    detail: { url: url },
                    bubbles: true,
                    composed: true
                }));
                
                // Small delay to ensure the event is processed before the modal is hidden
                setTimeout(() => {
                    this.showMediaLibrary = false;
                }, 100);
            }
        },
        confirmSelection() {
            window.dispatchEvent(new CustomEvent('media-selected', { detail: { urls: this.selected } }));
            this.showMediaLibrary = false;
            this.selected = [];
        },
        uploadFile(e) {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);
            
            fetch('{{ route("admin.media.upload") }}', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                this.fetchImages();
                if (!this.multiple) {
                    this.toggleSelect(data.url);
                }
            });
        }
    }))
})
</script>

    <div 
        x-data="mediaLibrary()"
        x-show="showMediaLibrary" 
        x-cloak
        style="z-index: 999999;"
        @open-media-library.window="showMediaLibrary = true"
        x-init="$watch('showMediaLibrary', value => { if (value) $nextTick(() => fetchImages()) })"
        class="fixed inset-0 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm"
    >
    <div class="bg-white w-full md:w-[95%] lg:max-w-3xl rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        <div class="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h4 class="text-xl font-bold flex items-center gap-2">
                Media Library 
                <span class="text-xs font-medium text-gray-400" x-text="`(${images.length} images)`"></span>
            </h4>
            <div class="flex items-center gap-4">
                <label class="cursor-pointer px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-primary/20 transition-all">
                    <i data-lucide="upload" class="w-4 h-4"></i> Upload New
                    <input type="file" @change="uploadFile" class="hidden" accept="image/*">
                </label>
                <button type="button" @click="showMediaLibrary = false" class="p-2 hover:bg-white rounded-full transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
        </div>
        
        <div class="p-6 overflow-y-auto flex-1 custom-scrollbar">
            <template x-if="loading">
                <div class="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
                   <i data-lucide="refresh-cw" class="w-8 h-8 animate-spin text-primary"></i>
                   <p class="text-xs font-bold uppercase tracking-widest">Scanning Library...</p>
                </div>
            </template>

            <template x-if="!loading">
                <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    <template x-for="(img, idx) in images" :key="idx">
                        <div 
                            @click="toggleSelect(img.url)"
                            class="aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all relative group"
                            :class="selected.includes(img.url) ? 'border-primary ring-4 ring-primary/20' : 'border-transparent hover:border-gray-200'"
                        >
                            <img :src="img.url" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                 <div class="bg-white/90 p-1.5 rounded-full shadow-sm text-primary">
                                    <i data-lucide="check" class="w-4 h-4"></i>
                                 </div>
                            </div>
                        </div>
                    </template>
                    <template x-if="images.length === 0">
                        <p class="col-span-full text-center py-20 text-gray-400 text-sm">No images found in the library.</p>
                    </template>
                </div>
            </template>
        </div>

        <div class="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <p class="text-xs text-gray-400 font-medium" x-text="multiple ? `${selected.length} items selected` : 'Select an image to continue'"></p>
            <div class="flex gap-3">
                <button type="button" @click="showMediaLibrary = false" class="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-400">Cancel</button>
                <template x-if="multiple">
                    <button 
                        type="button"
                        @click="confirmSelection" 
                        :disabled="selected.length === 0"
                        class="px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 disabled:bg-gray-300 transition-all font-black uppercase tracking-widest"
                    >
                        Insert Selected
                    </button>
                </template>
            </div>
        </div>
    </div>
</div>
