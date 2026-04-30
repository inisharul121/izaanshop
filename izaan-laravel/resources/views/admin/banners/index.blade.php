<x-admin-layout>
    <div x-data="{ 
        showModal: false, 
        editing: false, 
        id: '', 
        title: '', 
        subtitle: '',
        image: '',
        link: '',
        order: 0,
        isActive: true,
        
        openAdd() {
            this.editing = false;
            this.id = '';
            this.title = '';
            this.subtitle = '';
            this.image = '';
            this.link = '';
            this.order = 0;
            this.isActive = true;
            this.showModal = true;
        },
        openEdit(banner) {
            this.editing = true;
            this.id = banner.id;
            this.title = banner.title;
            this.subtitle = banner.subtitle;
            this.image = banner.image;
            this.link = banner.link;
            this.order = banner.order;
            this.isActive = banner.isActive;
            this.showModal = true;
        }
    }" 
    @izaan-media-selected.window="image = $event.detail.url"
    class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-dark tracking-tight">Home Banners</h1>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Manage carousel advertisements on the homepage</p>
            </div>
            <button @click="openAdd()" class="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Add Banner
            </button>
        </div>

        @if(session('success'))
        <div class="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            {{ session('success') }}
        </div>
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            @foreach($banners as $banner)
            <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all flex flex-col">
                <div class="aspect-[21/9] bg-gray-50 border-b border-gray-100 relative group overflow-hidden">
                    <img src="{{ $banner->image }}" class="w-full h-full object-cover">
                    <div class="absolute inset-0 bg-dark/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                        <button @click="openEdit({{ json_encode($banner) }})" class="w-12 h-12 bg-white text-dark rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-xl">
                            <i data-lucide="edit-3" class="w-5 h-5"></i>
                        </button>
                        <form action="{{ route('admin.banners.destroy', $banner->id) }}" method="POST" onsubmit="return confirm('Delete this banner?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="w-12 h-12 bg-white text-dark rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-xl">
                                <i data-lucide="trash-2" class="w-5 h-5"></i>
                            </button>
                        </form>
                    </div>
                </div>
                <div class="p-8 pb-10 flex-1">
                    <div class="flex justify-between items-start mb-4">
                        <h4 class="text-lg font-black text-dark leading-tight">{{ $banner->title }}</h4>
                        <span class="px-3 py-1 bg-gray-50 text-dark text-[10px] font-black rounded-full uppercase">Order: {{ $banner->order }}</span>
                    </div>
                    <p class="text-sm text-gray-400 font-bold mb-6 italic">"{{ $banner->subtitle }}"</p>
                    <div class="flex items-center gap-3">
                        <div class="w-2 h-2 rounded-full {{ $banner->isActive ? 'bg-green-500' : 'bg-red-500' }}"></div>
                        <span class="text-[10px] font-black uppercase tracking-widest {{ $banner->isActive ? 'text-green-600' : 'text-red-400' }}">{{ $banner->isActive ? 'Active' : 'Inactive' }}</span>
                    </div>
                </div>
            </div>
            @endforeach
        </div>

        <!-- Banner Modal -->
        <div x-show="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm" x-cloak>
            <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-10 max-h-[90vh] overflow-y-auto">
                <div class="mb-8">
                    <h2 class="text-2xl font-black text-dark tracking-tight" x-text="editing ? 'Edit Banner' : 'Add Banner'"></h2>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Configure your promotional display</p>
                </div>

                <form :action="editing ? '/admin/banners/' + id : '/admin/banners'" method="POST" class="space-y-6">
                    @csrf
                    <template x-if="editing">
                        <input type="hidden" name="_method" value="PUT">
                    </template>

                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Main Title</label>
                        <input type="text" name="title" x-model="title" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="e.g. Summer Collection">
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Subtitle</label>
                        <input type="text" name="subtitle" x-model="subtitle" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="e.g. Up to 50% Off everything">
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Banner Image</label>
                        <div class="space-y-4">
                            <input type="hidden" name="image" x-model="image">
                            
                            <template x-if="image">
                                <div class="relative aspect-[21/9] rounded-2xl overflow-hidden border border-gray-100 group">
                                    <img :src="image" class="w-full h-full object-cover">
                                    <button type="button" @click="image = ''" class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                                        <i data-lucide="x" class="w-3 h-3"></i>
                                    </button>
                                </div>
                            </template>
                            
                            <button type="button" @click="$dispatch('open-media-library')" 
                                    class="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-8 hover:border-primary/20 hover:bg-primary/5 transition-all text-gray-400 hover:text-primary group">
                                <i data-lucide="image-plus" class="w-8 h-8 mb-2 group-hover:scale-110 transition-all"></i>
                                <span class="text-[10px] font-black uppercase tracking-widest" x-text="image ? 'Change Banner Image' : 'Select Banner Image'"></span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Link (Optional)</label>
                        <input type="text" name="link" x-model="link" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="/product/my-slug">
                    </div>

                    <div class="grid grid-cols-2 gap-6">
                        <div>
                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Display Order</label>
                            <input type="number" name="order" x-model="order" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" required>
                        </div>
                        <div class="flex items-center gap-3 pt-6">
                            <input type="hidden" name="isActive" value="0">
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="isActive" value="1" x-model="isActive" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                <span class="ms-3 text-[10px] font-black uppercase text-gray-400 tracking-widest">Active</span>
                            </label>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button type="button" @click="showModal = false" class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Cancel</button>
                        <button type="submit" class="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" x-text="editing ? 'Save Changes' : 'Add Banner'"></button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-admin-layout>
