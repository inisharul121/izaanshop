<x-admin-layout>
    <div x-data="{ 
        images: [],
        loading: true,
        fetchImages() {
            this.loading = true;
            fetch('{{ route("admin.media.index") }}')
                .then(res => res.json())
                .then(data => {
                    this.images = data;
                    this.loading = false;
                });
        },
        uploadFile(event) {
            const formData = new FormData();
            formData.append('image', event.target.files[0]);
            
            fetch('{{ route("admin.media.upload") }}', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if(data.url) {
                    this.fetchImages();
                } else {
                    alert('Upload failed: ' + (data.message || 'Unknown error'));
                }
            })
            .catch(err => {
                console.error(err);
                alert('Upload failed.');
            });
        },
        deleteImage(filename) {
            if(!confirm('Are you sure you want to delete this image?')) return;
            
            fetch(`{{ url('admin/media') }}/${filename}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                }
            })
            .then(res => res.json())
            .then(data => {
                this.fetchImages();
            });
        }
    }" x-init="fetchImages()" class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-dark tracking-tight">Media Library</h1>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Manage all your uploaded files and product images</p>
            </div>
            <label class="inline-flex cursor-pointer items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <i data-lucide="upload" class="w-4 h-4"></i>
                Upload New Image
                <input type="file" @change="uploadFile" class="hidden" accept="image/*">
            </label>
        </div>

        <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 min-h-[500px]">
            <template x-if="loading">
                <div class="flex flex-col items-center justify-center py-32 gap-3 text-gray-400">
                   <i data-lucide="refresh-cw" class="w-10 h-10 animate-spin text-primary"></i>
                   <p class="text-xs font-bold uppercase tracking-widest">Loading Library...</p>
                </div>
            </template>

            <template x-if="!loading">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    <template x-for="(img, idx) in images" :key="idx">
                        <div class="group relative aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm hover:shadow-xl transition-all">
                            <img :src="img.url" class="w-full h-full object-cover" />
                            
                            <!-- Overlay Actions -->
                            <div class="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <a :href="img.url" target="_blank" class="w-10 h-10 bg-white text-dark rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors tooltip" title="View Full Image">
                                    <i data-lucide="external-link" class="w-4 h-4"></i>
                                </a>
                                <button type="button" @click="deleteImage(img.name)" class="w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors tooltip" title="Delete Image">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </div>
                    </template>
                    <template x-if="images.length === 0">
                        <div class="col-span-full py-32 text-center flex flex-col items-center gap-4">
                            <div class="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300">
                                <i data-lucide="image" class="w-10 h-10"></i>
                            </div>
                            <p class="text-gray-400 font-bold uppercase tracking-widest text-sm">Library is empty</p>
                        </div>
                    </template>
                </div>
            </template>
        </div>
    </div>
</x-admin-layout>
