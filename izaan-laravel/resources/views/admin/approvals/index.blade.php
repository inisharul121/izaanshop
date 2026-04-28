<x-admin-layout>
    <div class="space-y-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-black text-dark tracking-tight">Admin Approvals</h1>
                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">Review and approve new user registrations</p>
            </div>
            <div class="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                <div class="px-6 py-2 {{ $pendingUsers->count() > 0 ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600' }} font-black text-[10px] uppercase tracking-widest rounded-xl">
                    {{ $pendingUsers->count() }} Pending Approvals
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
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">User Details</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Requested Role</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest">Registration Date</th>
                            <th class="px-8 py-5 text-[10px] font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        @forelse($pendingUsers as $user)
                        <tr class="hover:bg-gray-50/50 transition-all group">
                            <td class="px-8 py-6">
                                <div class="flex items-center gap-4">
                                    <div class="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 font-black uppercase">
                                        {{ substr($user->name, 0, 1) }}
                                    </div>
                                    <div>
                                        <h4 class="font-black text-dark tracking-tight">{{ $user->name }}</h4>
                                        <p class="text-[10px] font-bold text-gray-400">{{ $user->email }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-8 py-6">
                                <span class="px-3 py-1 bg-gray-100 text-[10px] font-black rounded-full uppercase text-gray-500 tracking-widest">
                                    {{ $user->role }}
                                </span>
                            </td>
                            <td class="px-8 py-6">
                                <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">{{ $user->createdAt->format('M d, Y') }}</p>
                            </td>
                            <td class="px-8 py-6 text-right">
                                <form action="{{ route('admin.approvals.approve', $user->id) }}" method="POST">
                                    @csrf
                                    <button type="submit" class="inline-flex items-center gap-2 bg-dark text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-dark/10 hover:scale-105 active:scale-95 transition-all">
                                        <i data-lucide="shield-check" class="w-4 h-4 text-primary"></i>
                                        Approve Access
                                    </button>
                                </form>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="4" class="px-8 py-20 text-center">
                                <div class="flex flex-col items-center gap-4">
                                    <div class="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                                        <i data-lucide="check-circle" class="w-8 h-8"></i>
                                    </div>
                                    <div>
                                        <p class="text-gray-900 font-black text-lg">Queue Clean!</p>
                                        <p class="text-gray-400 font-bold text-[10px] mt-1 uppercase tracking-widest">No pending user approvals at the moment</p>
                                    </div>
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
