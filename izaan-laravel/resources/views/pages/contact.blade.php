<x-shop-layout>
    <div class="py-12 md:py-24 bg-gray-50/50 relative overflow-hidden">
        <!-- Background Elements -->
        <div class="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary/5 blur-[80px] md:blur-[120px] rounded-full -z-10"></div>
        <div class="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-blue-500/5 blur-[80px] md:blur-[120px] rounded-full -z-10"></div>

        <div class="container mx-auto px-4 lg:max-w-6xl">
            <div class="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                <h1 class="text-4xl md:text-6xl font-black text-dark mb-4 md:mb-6 uppercase tracking-tight leading-tight">Get In <span class="text-primary">Touch</span></h1>
                <p class="text-base md:text-lg text-gray-500 font-medium leading-relaxed">
                    Have questions about our products, orders, or anything else? Our team is ready to help you every step of the way.
                </p>
            </div>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <!-- Contact Info Cards -->
                <div class="lg:col-span-1 space-y-4 md:space-y-6">
                    <div class="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div class="w-12 h-12 md:w-14 md:h-14 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                            <i data-lucide="phone" class="w-6 h-6 md:w-7 md:h-7"></i>
                        </div>
                        <h4 class="text-lg md:text-xl font-bold text-dark mb-1 md:mb-2">Phone</h4>
                        <p class="text-sm md:text-base text-gray-500 font-medium">+880 1752-530303</p>
                        <p class="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 md:mt-4">Available 10AM - 8PM</p>
                    </div>

                    <div class="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div class="w-12 h-12 md:w-14 md:h-14 bg-blue-50 text-blue-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                            <i data-lucide="mail" class="w-6 h-6 md:w-7 md:h-7"></i>
                        </div>
                        <h4 class="text-lg md:text-xl font-bold text-dark mb-1 md:mb-2">Email</h4>
                        <p class="text-sm md:text-base text-gray-500 font-medium">info@izaanshop.com</p>
                        <p class="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 md:mt-4">Response within 24 hours</p>
                    </div>

                    <div class="bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div class="w-12 h-12 md:w-14 md:h-14 bg-green-50 text-green-500 rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 group-hover:scale-110 transition-transform">
                            <i data-lucide="map-pin" class="w-6 h-6 md:w-7 md:h-7"></i>
                        </div>
                        <h4 class="text-lg md:text-xl font-bold text-dark mb-1 md:mb-2">Address</h4>
                        <p class="text-sm md:text-base text-gray-500 font-medium">Dhaka, Bangladesh</p>
                        <p class="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mt-3 md:mt-4">Visit our warehouse</p>
                    </div>
                </div>
                
                <!-- Contact Form -->
                <div class="lg:col-span-2 bg-white p-6 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 shadow-2xl relative">
                    <form action="#" class="space-y-6 md:space-y-8">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div class="space-y-2 md:space-y-3">
                                <label class="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Your Name</label>
                                <input type="text" class="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 focus:ring-2 focus:ring-primary/20 text-dark font-bold placeholder:text-gray-300 outline-none transition-all text-sm md:text-base" placeholder="John Doe">
                            </div>
                            <div class="space-y-2 md:space-y-3">
                                <label class="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                                <input type="email" class="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 focus:ring-2 focus:ring-primary/20 text-dark font-bold placeholder:text-gray-300 outline-none transition-all text-sm md:text-base" placeholder="john@example.com">
                            </div>
                        </div>

                        <div class="space-y-2 md:space-y-3">
                            <label class="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Subject</label>
                            <div class="relative">
                                <select class="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 focus:ring-2 focus:ring-primary/20 text-dark font-bold outline-none transition-all appearance-none text-sm md:text-base">
                                    <option>General Inquiry</option>
                                    <option>Order Status</option>
                                    <option>Product Feedback</option>
                                    <option>Returns & Exchanges</option>
                                </select>
                                <i data-lucide="chevron-down" class="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
                            </div>
                        </div>

                        <div class="space-y-2 md:space-y-3">
                            <label class="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Message</label>
                            <textarea rows="4 md:rows-5" class="w-full bg-gray-50 border-none rounded-xl md:rounded-2xl py-4 md:py-5 px-5 md:px-6 focus:ring-2 focus:ring-primary/20 text-dark font-bold placeholder:text-gray-300 outline-none transition-all resize-none text-sm md:text-base" placeholder="How can we help you?"></textarea>
                        </div>

                        <button type="submit" class="w-full bg-primary text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 md:gap-3 group text-xs md:text-sm">
                            Send Message
                            <i data-lucide="send" class="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</x-shop-layout>
