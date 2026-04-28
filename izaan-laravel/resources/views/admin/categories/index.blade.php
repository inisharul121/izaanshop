<x-admin-layout>
    <div x-data="{ 
        showModal: false, 
        editing: false, 
        id: '', 
        name: '', 
        image: '', 
        description: '',
        
        openAdd() {
            this.editing = false;
            this.id = '';
            this.name = '';
            this.image = '';
            this.description = '';
            this.showModal = true;
        },
        openEdit(category) {
            this.editing = true;
            this.id = category.id;
            this.name = category.name;
            this.image = category.image;
            this.description = category.description;
            this.showModal = true;
        }
    }" 
    @izaan-media-selected.window="image = $event.detail.url"
    class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-dark tracking-tight">Categories</h1>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Organize your products into departments</p>
            </div>
            <button @click="openAdd()" class="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Add Category
            </button>
        </div>

        @if(session('success'))
        <div class="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            {{ session('success') }}
        </div>
        @endif

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @foreach($categories as $category)
            <div class="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all">
                <a href="{{ route('admin.products.index', ['categoryId' => $category->id]) }}" class="flex items-center gap-4 hover:opacity-75 transition-opacity">
                    <div class="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                        <img src="{{ $category->image ?: '/images/placeholder-cat.png' }}" class="w-full h-full object-cover">
                    </div>
                    <div>
                        <h4 class="font-black text-dark tracking-tight">{{ $category->name }}</h4>
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ $category->products_count ?? 0 }} Products</p>
                    </div>
                </a>
                <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button @click="openEdit({{ json_encode($category) }})" class="p-2 text-gray-400 hover:text-primary transition-colors">
                        <i data-lucide="edit-3" class="w-4 h-4"></i>
                    </button>
                    <form action="{{ route('admin.categories.destroy', $category->id) }}" method="POST" onsubmit="return confirm('Delete this category?')">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </form>
                </div>
            </div>
            @endforeach
        </div>

        <!-- Category Modal -->
        <div x-show="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm" x-cloak>
            <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden p-10">
                <div class="mb-8">
                    <h2 class="text-2xl font-black text-dark tracking-tight" x-text="editing ? 'Edit Category' : 'Add Category'"></h2>
                    <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Fill in the information below</p>
                </div>

                <form :action="editing ? '/admin/categories/' + id : '/admin/categories'" method="POST" class="space-y-6">
                    @csrf
                    <template x-if="editing">
                        <input type="hidden" name="_method" value="PUT">
                    </template>

                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Category Name</label>
                        <input type="text" name="name" x-model="name" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" required placeholder="e.g. Toys & Games">
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Category Image</label>
                        <div class="space-y-4">
                            <input type="hidden" name="image" x-model="image">
                            
                            <template x-if="image">
                                <div class="relative w-32 h-32 rounded-2xl overflow-hidden border border-gray-100 group">
                                    <img :src="image" class="w-full h-full object-cover">
                                    <button type="button" @click="image = ''" class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg">
                                        <i data-lucide="x" class="w-3 h-3"></i>
                                    </button>
                                </div>
                            </template>
                            
                            <button type="button" @click="$dispatch('open-media-library')" 
                                    class="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-8 hover:border-primary/20 hover:bg-primary/5 transition-all text-gray-400 hover:text-primary group">
                                <i data-lucide="image-plus" class="w-8 h-8 mb-2 group-hover:scale-110 transition-all"></i>
                                <span class="text-[10px] font-black uppercase tracking-widest" x-text="image ? 'Change Image' : 'Select Category Image'"></span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Description (Optional)</label>
                        <textarea name="description" x-model="description" rows="3" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="Brief description..."></textarea>
                    </div>

                    <div class="flex items-center justify-end gap-3 pt-4">
                        <button type="button" @click="showModal = false" class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Cancel</button>
                        <button type="submit" class="bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" x-text="editing ? 'Save Changes' : 'Create Category'"></button>
                    </div>
                </form>
            </div>
        </div>


    </div>
</x-admin-layout>
