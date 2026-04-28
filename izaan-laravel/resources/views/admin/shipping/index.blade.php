<x-admin-layout>
    <div x-data="{ 
        showModal: false, 
        editing: false, 
        id: '', 
        name: '', 
        price: '', 
        isActive: true,
        
        openAdd() {
            this.editing = false;
            this.id = '';
            this.name = '';
            this.price = '';
            this.isActive = true;
            this.showModal = true;
        },
        openEdit(method) {
            this.editing = true;
            this.id = method.id;
            this.name = method.name;
            this.price = method.price;
            this.isActive = !!method.isActive;
            this.showModal = true;
        }
    }" class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-dark tracking-tight">Shipping Methods</h1>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Manage delivery options and pricing</p>
            </div>
            <button @click="openAdd()" class="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Add Method
            </button>
        </div>

        @if(session('success'))
        <div class="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-3">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            {{ session('success') }}
        </div>
        @endif

        <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-gray-50 border-b border-gray-100">
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Method Name</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Price</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-center">Status</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($shippingMethods as $method)
                        <tr class="hover:bg-gray-50/50 transition-all group">
                            <td class="px-8 py-6">
                                <span class="font-black text-dark tracking-tight">{{ $method->name }}</span>
                            </td>
                            <td class="px-8 py-6">
                                <span class="font-black text-primary text-sm">{{ number_format($method->price) }}৳</span>
                            </td>
                            <td class="px-8 py-6 text-center">
                                <span class="px-3 py-1 text-[10px] font-black rounded-full uppercase {{ $method->isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600' }}">
                                    {{ $method->isActive ? 'Active' : 'Disabled' }}
                                </span>
                            </td>
                            <td class="px-8 py-6 text-right">
                                <div class="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                                    <button @click="openEdit({{ json_encode($method) }})" class="p-2 text-gray-400 hover:text-primary transition-colors">
                                        <i data-lucide="edit-3" class="w-5 h-5"></i>
                                    </button>
                                    <form action="{{ route('admin.shipping.destroy', $method->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this shipping method?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="px-8 py-20 text-center">
                                <div class="flex flex-col items-center gap-4">
                                    <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                                        <i data-lucide="truck" class="w-8 h-8"></i>
                                    </div>
                                    <p class="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">No shipping methods found</p>
                                </div>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal -->
        <div 
            x-show="showModal" 
            x-cloak
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/40 backdrop-blur-sm"
        >
            <div 
                @click.away="showModal = false"
                class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
                <form :action="editing ? '{{ url('admin/shipping') }}/' + id : '{{ route('admin.shipping.store') }}'" method="POST" class="p-8 md:p-10">
                    @csrf
                    <template x-if="editing">
                        @method('PUT')
                    </template>

                    <div class="flex items-center justify-between mb-8">
                        <div>
                            <h2 class="text-2xl font-black text-dark tracking-tight" x-text="editing ? 'Edit Shipping Method' : 'Add New Shipping Method'"></h2>
                            <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Fill in the delivery details below</p>
                        </div>
                        <button type="button" @click="showModal = false" class="p-2 text-gray-400 hover:text-dark">
                            <i data-lucide="x" class="w-6 h-6"></i>
                        </button>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Method Name</label>
                            <input type="text" name="name" x-model="name" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="e.g. Inside Dhaka" required>
                        </div>

                        <div>
                            <label class="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Price (৳)</label>
                            <input type="number" name="price" x-model="price" class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="0" required>
                        </div>

                        <div>
                            <label class="flex items-center gap-3 cursor-pointer group">
                                <div class="relative">
                                    <input type="checkbox" name="isActive" value="1" x-model="isActive" class="sr-only peer">
                                    <div class="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-all"></div>
                                    <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full peer-checked:translate-x-6 transition-all shadow-sm"></div>
                                </div>
                                <span class="text-xs font-black uppercase text-gray-400 tracking-widest group-hover:text-dark transition-colors">Enabled for Checkout</span>
                            </label>
                        </div>
                    </div>

                    <div class="flex gap-4 mt-10">
                        <button type="button" @click="showModal = false" class="flex-1 px-8 py-4 bg-gray-50 text-dark rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 px-8 py-4 bg-dark text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all shadow-xl shadow-dark/20">
                            Save Method
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-admin-layout>
