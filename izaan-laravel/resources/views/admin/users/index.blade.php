<x-admin-layout>
    <div class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-dark tracking-tight">Customers</h1>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Manage your customer relationships</p>
            </div>
            <div class="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <div class="px-6 py-2 bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl">
                    {{ $users->count() }} Total Customers
                </div>
            </div>
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
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Customer</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Contact</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Location</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Joined Date</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($users as $user)
                        <tr class="hover:bg-gray-50/50 transition-all group">
                            <td class="px-8 py-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black uppercase shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                                        {{ substr($user->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <h4 class="font-black text-dark tracking-tight">{{ $user->name }}</h4>
                                        <span class="px-2 py-0.5 bg-gray-100 text-[8px] font-black rounded text-gray-500 uppercase tracking-widest">ID: #{{ $user->id }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-8 py-6">
                                <p class="text-sm font-bold text-dark">{{ $user->email }}</p>
                                <p class="text-[10px] font-bold text-gray-400 mt-1">{{ $user->phone ?? 'No Phone' }}</p>
                            </td>
                            <td class="px-8 py-6">
                                <p class="text-sm font-bold text-dark">{{ $user->city ?? 'N/A' }}</p>
                                <p class="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{{ $user->country ?? 'Bangladesh' }}</p>
                            </td>
                            <td class="px-8 py-6">
                                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">{{ $user->createdAt->format('M d, Y') }}</p>
                            </td>
                            <td class="px-8 py-6 text-right">
                                <div class="flex items-center justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all">
                                    <form action="{{ route('admin.users.destroy', $user->id) }}" method="POST" onsubmit="return confirm('WARNING: Are you sure you want to delete this customer? This will remove all their data.');">
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
                            <td colspan="5" class="px-8 py-20 text-center">
                                <div class="flex flex-col items-center gap-4">
                                    <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
                                        <i data-lucide="users" class="w-8 h-8"></i>
                                    </div>
                                    <p class="text-gray-400 font-bold text-sm mt-2 uppercase tracking-widest">No customers found</p>
                                </div>
                            </td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</x-admin-layout>
