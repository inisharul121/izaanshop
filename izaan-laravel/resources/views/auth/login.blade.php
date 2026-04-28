<x-shop-layout>
    <div class="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
        <div class="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-10 border border-gray-100">
            <div class="text-center mb-10">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6">
                    <i data-lucide="lock" class="w-8 h-8 text-primary"></i>
                </div>
                <h1 class="text-3xl font-black text-dark tracking-tight">Welcome Back</h1>
                <p class="text-gray-400 font-bold mt-2 uppercase tracking-widest text-[10px]">Login to your IzaanShop account</p>
            </div>

            <!-- Session Status -->
            <x-auth-session-status class="mb-6" :status="session('status')" />

            <form method="POST" action="{{ route('login') }}" class="space-y-6">
                @csrf

                <!-- Email Address -->
                <div>
                    <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <div class="relative">
                        <input id="email" type="email" name="email" :value="old('email')" required autofocus class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 pl-12 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="you@example.com">
                        <i data-lucide="mail" class="w-5 h-5 absolute left-4 top-4 text-gray-300"></i>
                    </div>
                    <x-input-error :messages="$errors->get('email')" class="mt-2" />
                </div>

                <!-- Password -->
                <div>
                    <div class="flex items-center justify-between mb-2 ml-1">
                        <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                        @if (Route::has('password.request'))
                            <a class="text-[10px] font-black text-primary uppercase tracking-widest hover:underline" href="{{ route('password.request') }}">
                                Forgot?
                            </a>
                        @endif
                    </div>
                    <div class="relative">
                        <input id="password" type="password" name="password" required class="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 pl-12 text-sm focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="••••••••">
                        <i data-lucide="key-round" class="w-5 h-5 absolute left-4 top-4 text-gray-300"></i>
                    </div>
                    <x-input-error :messages="$errors->get('password')" class="mt-2" />
                </div>

                <!-- Remember Me -->
                <div class="flex items-center ml-1">
                    <label for="remember_me" class="inline-flex items-center cursor-pointer">
                        <input id="remember_me" type="checkbox" class="rounded-lg border-gray-200 text-primary shadow-sm focus:ring-primary/20 w-5 h-5" name="remember">
                        <span class="ms-3 text-xs font-bold text-gray-400 uppercase tracking-widest">{{ __('Remember me') }}</span>
                    </label>
                </div>

                <div class="pt-4">
                    <button type="submit" class="w-full bg-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-sm">
                        {{ __('Sign In') }}
                    </button>
                </div>
            </form>

            <div class="mt-10 text-center">
                <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Don't have an account? 
                    <a href="{{ route('register') }}" class="text-primary font-black hover:underline ms-2">Create Account</a>
                </p>
            </div>
        </div>
    </div>
</x-shop-layout>
