<x-admin-layout>
    <div x-data="{ showAddModal: false, editingCoupon: null }">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-3xl font-black text-dark tracking-tight">Coupons</h1>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Manage discount codes and promotions</p>
            </div>
            <button @click="showAddModal = true; editingCoupon = null" class="px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                <i data-lucide="plus" class="w-5 h-5"></i> Create Coupon
            </button>
        </div>

        @if(session('success'))
        <div class="bg-green-50 border border-green-100 text-green-600 px-6 py-4 rounded-2xl font-bold text-sm mb-6 flex items-center gap-3">
            <i data-lucide="check-circle" class="w-5 h-5"></i>
            {{ session('success') }}
        </div>
        @endif

        <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50">
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Code</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Discount</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Expiry</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Usage</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest">Status</th>
                            <th class="px-8 py-4 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($coupons as $coupon)
                        <tr class="hover:bg-gray-50/30 transition-all">
                            <td class="px-8 py-6">
                                <span class="font-black text-dark text-sm bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-tighter">{{ $coupon->code }}</span>
                            </td>
                            <td class="px-8 py-6">
                                <p class="font-bold text-dark text-sm">
                                    {{ $coupon->discountValue }}{{ $coupon->discountType === 'percentage' ? '%' : '৳' }}
                                </p>
                                <p class="text-[10px] text-gray-400 font-bold uppercase">{{ $coupon->discountType }}</p>
                            </td>
                            <td class="px-8 py-6 text-sm text-gray-500 font-medium">
                                {{ $coupon->expiryDate ? \Carbon\Carbon::parse($coupon->expiryDate)->format('M d, Y') : 'Never' }}
                            </td>
                            <td class="px-8 py-6">
                                <div class="w-24 bg-gray-100 h-1.5 rounded-full overflow-hidden mb-1.5">
                                    <div class="bg-primary h-full" style="width: {{ $coupon->maxUses ? ($coupon->usedCount / $coupon->maxUses * 100) : 0 }}%"></div>
                                </div>
                                <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest">{{ $coupon->usedCount }} / {{ $coupon->maxUses ?? '∞' }}</p>
                            </td>
                            <td class="px-8 py-6">
                                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase {{ $coupon->isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600' }}">
                                    {{ $coupon->isActive ? 'Active' : 'Expired' }}
                                </span>
                            </td>
                            <td class="px-8 py-6 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button 
                                        @click="showAddModal = true; editingCoupon = {{ json_encode($coupon) }}"
                                        class="p-2 text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <i data-lucide="edit-3" class="w-5 h-5"></i>
                                    </button>
                                    <form action="{{ route('admin.coupons.destroy', $coupon->id) }}" method="POST" onsubmit="return confirm('Delete this coupon?')" class="inline">
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
                            <td colspan="6" class="px-8 py-12 text-center text-gray-400 font-bold italic">No coupons created yet.</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Add/Edit Modal -->
        <div x-show="showAddModal" x-cloak class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
            <div @click.away="showAddModal = false" class="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div class="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h4 class="text-xl font-bold" x-text="editingCoupon ? 'Edit Coupon' : 'Create New Coupon'"></h4>
                    <button @click="showAddModal = false" class="p-2 hover:bg-white rounded-full transition-colors"><i data-lucide="x" class="w-5 h-5"></i></button>
                </div>
                
                <form :action="editingCoupon ? `/admin/coupons/${editingCoupon.id}` : '{{ route('admin.coupons.store') }}'" method="POST" class="p-8 space-y-4">
                    @csrf
                    <template x-if="editingCoupon">
                        @method('PUT')
                    </template>

                    <div class="space-y-1">
                        <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Coupon Code</label>
                        <input type="text" name="code" :value="editingCoupon?.code" placeholder="e.g. FLASH20" required class="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold uppercase">
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                            <select name="discountType" x-model="editingCoupon ? editingCoupon.discountType : 'percentage'" class="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold appearance-none">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed (৳)</option>
                            </select>
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Value</label>
                            <input type="number" name="discountValue" :value="editingCoupon?.discountValue" placeholder="10" required class="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold">
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Max Uses</label>
                            <input type="number" name="maxUses" :value="editingCoupon?.maxUses" placeholder="100" class="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold">
                        </div>
                        <div class="space-y-1">
                            <label class="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                            <input type="date" name="expiryDate" :value="editingCoupon?.expiryDate ? editingCoupon.expiryDate.split(' ')[0] : ''" class="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm font-bold">
                        </div>
                    </div>

                    <div class="flex items-center gap-3 pt-2">
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" name="isActive" value="1" class="sr-only peer" :checked="editingCoupon ? editingCoupon.isActive : true">
                            <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                        <span class="text-xs font-bold text-gray-400 uppercase">Active for Customers</span>
                    </div>

                    <div class="pt-6">
                        <button type="submit" class="w-full py-4 bg-dark text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-dark/20 hover:scale-[1.02] active:scale-95 transition-all">
                            Save Coupon
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-admin-layout>
