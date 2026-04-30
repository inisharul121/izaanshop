<x-admin-layout>
    <div x-data="productForm()" @izaan-media-selected.window="handleMediaSelection($event.detail)">
        <form action="{{ route('admin.products.store') }}" method="POST" @submit.prevent="if(validate()) $el.submit()" class="space-y-8 max-w-5xl mx-auto pb-20">
            @csrf
            <template x-if="editingItem">
                @method('PUT')
            </template>

            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <a href="{{ route('admin.products.index') }}" class="p-3 bg-white text-gray-400 hover:text-dark rounded-xl border border-gray-100 transition-all">
                        <i data-lucide="arrow-left" class="w-5 h-5"></i>
                    </a>
                    <div>
                        <h1 class="text-3xl font-black text-dark tracking-tight" x-text="editingItem ? 'Edit Product' : 'Add New Product'"></h1>
                        <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Catalog management & inventory control</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <button type="submit" class="bg-dark text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-dark/10 hover:scale-[1.02] active:scale-95 transition-all">
                        Save Product
                    </button>
                </div>
            </div>
            
            @if ($errors->any())
                <div class="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] space-y-2">
                    <div class="flex items-center gap-3 text-red-500 font-black uppercase tracking-widest text-xs">
                        <i data-lucide="alert-circle" class="w-5 h-5"></i>
                        Please fix the following errors
                    </div>
                    <ul class="list-disc list-inside text-sm font-bold text-red-400 ml-1">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <!-- Main Content Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <!-- Left Column: Details -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- General Information -->
                    <div class="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 class="text-xl font-black text-dark tracking-tight flex items-center gap-3">
                            <span class="w-8 h-8 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center italic font-serif">i</span>
                            General Information
                        </h3>

                        <div class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                                    <input type="text" name="name" x-model="formData.name" @input="updateSlug" required 
                                        class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="Enter product name">
                                </div>
                                <div class="space-y-1">
                                    <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Slug (URL)</label>
                                    <input type="text" name="slug" x-model="formData.slug" required 
                                        class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-400 focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="product-url-slug">
                                </div>
                            </div>

                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                                <div id="quill-editor" class="bg-gray-50 border border-gray-100 rounded-2xl transition-all outline-none"></div>
                                <input type="hidden" name="description" x-model="formData.description">
                            </div>
                        </div>
                    </div>

                    <!-- Pricing & Inventory -->
                    <div class="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <h3 class="text-xl font-black text-dark tracking-tight flex items-center gap-3">
                            <i data-lucide="banknote" class="w-8 h-8 text-green-500"></i>
                            Pricing & Inventory
                        </h3>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Price (৳)</label>
                                <input type="number" name="price" x-model="formData.price" required 
                                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sale Price (৳)</label>
                                <input type="number" name="salePrice" x-model="formData.salePrice" 
                                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none">
                            </div>
                            <div class="space-y-1">
                                <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stock Qty (Empty = Unlimited)</label>
                                <input type="number" name="stock" x-model="formData.stock" 
                                    class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 transition-all outline-none" placeholder="Unlimited">
                            </div>
                        </div>
                    </div>

                    <!-- Variations & Attributes -->
                    <div class="bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8" x-show="formData.type === 'VARIABLE'">
                        <div class="flex justify-between items-center">
                            <h3 class="text-xl font-black text-dark tracking-tight">Product Variations</h3>
                            <button type="button" @click="addAttribute" class="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-all">
                                <i data-lucide="plus-circle" class="w-4 h-4"></i> Add Attribute
                            </button>
                        </div>

                        <!-- Attributes Config -->
                        <div class="space-y-4">
                            <template x-for="(attr, attrIdx) in attributes" :key="attrIdx">
                                <div class="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                                     <div class="flex justify-between items-center bg-white p-2 px-4 rounded-xl border border-gray-100 mb-2">
                                         <input type="text" x-model="attr.name" placeholder="Attribute Name (e.g. Color)" 
                                             class="flex-1 bg-transparent border-none text-sm font-black text-dark p-0 focus:ring-0 placeholder:text-gray-300">
                                        <button type="button" @click="removeAttribute(attrIdx)" class="text-gray-300 hover:text-red-500 active:scale-90 transition-all">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                    <div class="flex flex-wrap gap-2">
                                        <template x-for="(opt, optIdx) in attr.options" :key="optIdx">
                                            <span class="bg-white border border-gray-200 text-dark px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                                                <span x-text="opt"></span>
                                                <button type="button" @click="removeOption(attrIdx, opt)" class="text-gray-300 hover:text-red-500">
                                                    <i data-lucide="x" class="w-3 h-3"></i>
                                                </button>
                                            </span>
                                        </template>
                                        <input type="text" placeholder="Add option & press enter" 
                                            @keydown.enter.prevent="addOption(attrIdx, $event.target.value); $event.target.value = ''"
                                            class="bg-white border border-gray-200 rounded-xl px-4 py-1.5 text-[10px] font-bold outline-none focus:ring-4 focus:ring-primary/10 transition-all">
                                    </div>
                                </div>
                            </template>

                            <button type="button" @click="generateVariants" 
                                class="w-full py-4 bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-dark/20 hover:scale-[1.01] transition-all">
                                Generate Variations (<span x-text="variants.length"></span>)
                            </button>
                        </div>

                        <!-- Variants List -->
                        <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar" x-show="variants.length > 0">
                            <template x-for="(v, vIdx) in variants" :key="vIdx">
                                <div class="p-6 bg-white border border-gray-200 rounded-[2rem] space-y-4 shadow-sm relative overflow-hidden group">
                                    <div class="flex items-center gap-4">
                                        <div 
                                            @click="activeVariantIdx = vIdx; openMediaLibrary('variant')"
                                            class="w-16 h-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 flex items-center justify-center cursor-pointer hover:border-primary group transition-all shrink-0 overflow-hidden"
                                        >
                                            <template x-if="v.image">
                                                <img :src="v.image" class="w-full h-full object-cover">
                                            </template>
                                            <template x-if="!v.image">
                                                <i data-lucide="image-plus" class="w-6 h-6 text-gray-200 group-hover:text-primary"></i>
                                            </template>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex flex-wrap gap-1 mb-1">
                                                <template x-for="(val, key) in v.options" :key="key">
                                                    <span class="text-[9px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-lg uppercase" x-text="`${key}: ${val}`"></span>
                                                </template>
                                            </div>
                                            <input type="text" x-model="v.sku" placeholder="SKU" class="text-[10px] font-mono text-gray-400 bg-transparent border-none p-0 focus:ring-0 uppercase">
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span class="text-[9px] font-black text-gray-400 uppercase">Default</span>
                                            <input type="radio" name="defaultVariant" :checked="v.isDefault" @click="setDefault(vIdx)" class="w-4 h-4 text-primary border-gray-300 focus:ring-primary">
                                        </div>
                                    </div>
                                    <div class="grid grid-cols-3 gap-4">
                                        <div class="space-y-1">
                                            <label class="text-[9px] font-black text-gray-300 uppercase ml-1">Price</label>
                                            <input type="number" x-model="v.price" placeholder="Price" class="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold">
                                        </div>
                                        <div class="space-y-1">
                                            <label class="text-[9px] font-black text-gray-300 uppercase ml-1">Sale Price</label>
                                            <input type="number" x-model="v.salePrice" placeholder="Sale" class="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold text-primary">
                                        </div>
                                        <div class="space-y-1">
                                            <label class="text-[9px] font-black text-gray-300 uppercase ml-1">Stock</label>
                                            <input type="number" x-model="v.stock" placeholder="Stock" class="w-full bg-gray-50 border-none rounded-xl p-3 text-xs font-bold">
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Images & Categories -->
                <div class="space-y-8">
                    <!-- Product Images -->
                    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <h3 class="text-lg font-black text-dark tracking-tight">Main Image</h3>
                        
                        <div 
                            @click="openMediaLibrary('main')"
                            class="aspect-square bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-all group relative overflow-hidden"
                        >
                            <template x-if="formData.mainImage">
                                <img :src="formData.mainImage" class="w-full h-full object-cover">
                            </template>
                            <template x-if="!formData.mainImage">
                                <div class="text-center p-6">
                                    <i data-lucide="upload-cloud" class="w-10 h-10 text-gray-200 group-hover:text-primary mb-3 mx-auto"></i>
                                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Image</p>
                                </div>
                            </template>
                        </div>

                        <!-- Gallery -->
                        <div class="pt-6 border-t border-gray-50 space-y-4">
                            <div class="flex justify-between items-center">
                                <h3 class="text-sm font-black text-dark uppercase tracking-widest">Gallery</h3>
                                <button type="button" @click="openMediaLibrary('gallery', true)" class="text-[10px] font-bold text-primary italic underline uppercase tracking-tighter">Add More</button>
                            </div>
                            <div class="grid grid-cols-3 gap-3">
                                <template x-for="(img, idx) in formData.gallery" :key="idx">
                                    <div class="aspect-square bg-gray-100 rounded-2xl border border-gray-200 relative group overflow-hidden">
                                        <img :src="img" class="w-full h-full object-cover">
                                        <button type="button" @click="gallery = gallery.filter((_, i) => i !== idx)" 
                                            class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                            <i data-lucide="x" class="w-3 h-3"></i>
                                        </button>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Category & Status -->
                    <div class="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                            <select name="type" x-model="formData.type" required class="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold appearance-none">
                                <option value="SIMPLE">Simple Product</option>
                                <option value="VARIABLE">Variable Product</option>
                            </select>
                        </div>

                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                            <select name="categoryId" x-model="formData.categoryId" required class="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold appearance-none">
                                <option value="">Select Category</option>
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}">{{ $category->name }}</option>
                                @endforeach
                            </select>
                        </div>

                        <div class="flex items-center justify-between p-4 bg-gray-100 rounded-2xl">
                            <span class="text-xs font-black text-dark uppercase tracking-widest">Featured</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="isFeatured" x-model="formData.isFeatured" value="1" class="sr-only peer">
                                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Hidden Inputs for JSON data -->
            <input type="hidden" name="mainImage" :value="formData.mainImage">
            <input type="hidden" name="gallery" :value="JSON.stringify(formData.gallery)">
            <input type="hidden" name="attributes" :value="JSON.stringify(attributes)">
            <input type="hidden" name="variants" :value="JSON.stringify(variants)">
        </form>
    </div>

    <script>
        function productForm() {
            return {
                editingItem: @json($product ?? null),
                formData: {
                    name: @json(old('name', '')),
                    slug: @json(old('slug', '')),
                    description: @json(old('description', '')),
                    price: @json(old('price', '')),
                    salePrice: @json(old('salePrice', '')),
                    stock: @json(old('stock', '')),
                    type: @json(old('type', 'SIMPLE')),
                    categoryId: @json(old('categoryId', '')),
                    isFeatured: @json(old('isFeatured') ? true : false),
                    mainImage: @json(old('mainImage', '')),
                    gallery: @json(json_decode(old('gallery', '[]'), true))
                },
                attributes: @json(json_decode(old('attributes', '[]'), true)),
                variants: @json(json_decode(old('variants', '[]'), true)),
                activeVariantIdx: null,
                mediaTarget: 'main', // main, gallery, variant
                isMultiple: false,

                init() {
                    // Initialize Quill
                    this.quill = new Quill('#quill-editor', {
                        theme: 'snow',
                        placeholder: 'Detailed product description...',
                        modules: {
                            toolbar: [
                                [{ 'header': [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{'list': 'ordered'}, {'list': 'bullet'}],
                                ['link', 'clean']
                            ]
                        }
                    });

                    // Sync Quill with Alpine
                    this.quill.on('text-change', () => {
                        this.formData.description = this.quill.root.innerHTML;
                    });

                    if (this.editingItem) {
                        this.formData = {
                            ...this.formData,
                            name: this.editingItem.name,
                            slug: this.editingItem.slug,
                            description: this.editingItem.description,
                            price: this.editingItem.price,
                            salePrice: this.editingItem.salePrice,
                            stock: this.editingItem.stock,
                            type: this.editingItem.type,
                            categoryId: this.editingItem.categoryId,
                            isFeatured: this.editingItem.isFeatured,
                            mainImage: this.editingItem.images?.main || '',
                            gallery: this.editingItem.images?.gallery || []
                        };
                        this.attributes = this.editingItem.attributes || [];
                        this.variants = this.editingItem.variants || [];
                        
                        // Set Quill content
                        this.quill.root.innerHTML = this.formData.description || '';
                    }
                    
                    // Re-initialize Lucide icons when templates render
                    this.$watch('attributes', () => this.$nextTick(() => lucide.createIcons()));
                    this.$watch('variants', () => this.$nextTick(() => lucide.createIcons()));
                },

                updateSlug() {
                    if (!this.editingItem) {
                        this.formData.slug = this.formData.name.toLowerCase()
                            .replace(/ /g, '-')
                            .replace(/[^\w-]+/g, '');
                    }
                },

                openMediaLibrary(target, multiple = false) {
                    this.mediaTarget = target;
                    this.isMultiple = multiple;
                    window.dispatchEvent(new CustomEvent('open-media-library', { detail: { multiple } }));
                },

                handleMediaSelection(detail) {
                    if (this.mediaTarget === 'main') {
                        this.formData.mainImage = detail.url;
                    } else if (this.mediaTarget === 'gallery') {
                        if (detail.urls) {
                            this.formData.gallery = [...new Set([...this.formData.gallery, ...detail.urls])];
                        } else {
                            this.formData.gallery.push(detail.url);
                        }
                    } else if (this.mediaTarget === 'variant') {
                        this.variants[this.activeVariantIdx].image = detail.url;
                    }
                },

                addAttribute() {
                    const nextId = this.attributes.length + 1;
                    this.attributes.push({ name: 'Attribute ' + nextId, options: [] });
                },

                removeAttribute(idx) {
                    this.attributes.splice(idx, 1);
                },

                addOption(attrIdx, val) {
                    if (val && !this.attributes[attrIdx].options.includes(val)) {
                        this.attributes[attrIdx].options.push(val);
                    }
                },

                removeOption(attrIdx, opt) {
                    this.attributes[attrIdx].options = this.attributes[attrIdx].options.filter(o => o !== opt);
                },

                generateVariants() {
                    if (this.attributes.length === 0) return;
                    
                    const attrData = this.attributes.filter(a => (a.name || '').trim() && a.options.length > 0);
                    if (attrData.length === 0) {
                        alert('Please ensure all attributes have names and at least one option.');
                        return;
                    }

                    let combos = [{}];
                    attrData.forEach(attr => {
                        const next = [];
                        combos.forEach(combo => {
                            attr.options.forEach(opt => {
                                next.push({ ...combo, [attr.name]: opt });
                            });
                        });
                        combos = next;
                    });

                    this.variants = combos.map(c => {
                        const existing = this.variants.find(v => JSON.stringify(v.options) === JSON.stringify(c));
                        return existing || {
                            options: c,
                            price: this.formData.price,
                            salePrice: this.formData.salePrice,
                            stock: this.formData.stock,
                            sku: (this.formData.slug + '-' + Object.values(c).join('-')).toLowerCase(),
                            image: this.formData.mainImage,
                            isDefault: false
                        };
                    });
                },

                setDefault(idx) {
                    this.variants = this.variants.map((v, i) => ({ ...v, isDefault: i === idx }));
                },

                validate() {
                    if (!this.formData.description || this.formData.description.trim() === '' || this.formData.description === '<p><br></p>') {
                        alert('Product description is required before saving.');
                        return false;
                    }
                    if (this.formData.type === 'VARIABLE' && this.variants.length === 0) {
                        alert('Please generate variants for variable products.');
                        return false;
                    }
                    return true;
                }
            }
        }
    </script>
</x-admin-layout>
