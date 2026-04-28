'use client';

import React from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, LayoutDashboard, Phone, Mail, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../store/useStore';
import SafeImage from './SafeImage';
import logo from '../assets/logo.png';
import CategoryBar from './CategoryBar';

import { usePathname } from 'next/navigation';

// WhatsApp SVG Icon
const WhatsAppIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.4 8.38 8.38 0 0 1 3.8.9L21 3.5Z" />
    <path d="m15.5 10.5-2.5 2.5-2.5-2.5" />
    <path d="M13 13v.01" />
  </svg>
);

// Facebook SVG Icon
const FacebookIcon = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Navbar = () => {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');
  
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { cart, user, logout } = useStore();

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminPath) return null;

  const cartCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

  return (
    <>
    <header className="fixed top-0 left-0 z-[100] w-full bg-white">
      {/* Premium Utility Bar (Orange Section) - Hides on scroll for better space */}
      <div className={`bg-[#E67E22] transition-all duration-300 origin-top overflow-hidden ${isScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-20 py-2.5 opacity-100'}`}>
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-6 md:gap-10">
            <a href="tel:+8801752530303" className="flex items-center gap-2 text-[11px] md:text-sm font-bold tracking-tight">
              <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>+880 1752-530303</span>
            </a>
            <a href="mailto:info@izaanshop.com" className="hidden sm:flex items-center gap-2 text-[11px] md:text-sm font-bold tracking-tight">
              <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>info@izaanshop.com</span>
            </a>
          </div>
          
          <div className="flex items-center gap-6">
            <a 
              href="https://wa.me/8801752530303" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform p-1 bg-white/10 rounded-lg"
              title="WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
            </a>
            <a 
              href="https://www.facebook.com/izaanshop2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:scale-110 transition-transform p-1 bg-white/10 rounded-lg"
              title="Facebook"
            >
              <FacebookIcon className="w-4 h-4 md:w-5 md:h-5 text-white fill-current" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Section */}
      <nav className={`transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md py-2 shadow-lg border-b border-gray-100' : 'bg-white py-4 md:py-6 shadow-sm border-b border-gray-100'}`}>
        <div className="container mx-auto px-4 lg:max-w-5xl lg:px-10 flex items-center justify-between gap-4">
          {/* Logo & Brand - Perfectly V-Centered */}
          <Link href="/" className="flex items-center active:scale-95 transition-all shrink-0">
            <div className="flex items-center justify-start overflow-visible">
              <SafeImage 
                src={logo} 
                alt="Izaan Shop" 
                width={120} 
                height={54} 
                className="object-contain" 
                style={{ width: 'auto', height: 'auto' }}
                priority 
              />
            </div>
          </Link>

          {/* Centered Navigation Group (Desktop) / Search Bar (Mobile Integration) */}
          <div className="flex-1 flex items-center justify-center gap-4 md:gap-8">
            {/* Search Pill - Now visible on mobile too */}
            <div className="relative group max-w-[140px] sm:max-w-[280px] w-full">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-[#FAFAFA] border border-[#F3E5D8] rounded-full py-2 md:py-2.5 pl-8 md:pl-10 pr-4 text-[10px] md:text-xs focus:ring-4 focus:ring-primary/5 focus:border-primary/30 outline-none transition-all"
              />
              <Search className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors" />
            </div>

            {/* Desktop-only Links */}
            <div className="hidden lg:flex items-center gap-5">
              <Link href="/profile" className="text-[11px] font-black text-[#1A2C4B] hover:text-primary transition-colors uppercase tracking-widest leading-none">Dashboard</Link>
              <Link href="/about" className="text-[11px] font-black text-[#1A2C4B] hover:text-primary transition-colors uppercase tracking-widest leading-none">About</Link>
              {mounted && user?.role === 'admin' && (
                <Link href="/admin" className="text-[11px] font-black text-primary hover:text-dark transition-colors uppercase tracking-widest leading-none">Admin</Link>
              )}
            </div>
          </div>

          {/* Right Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 border-l border-gray-100 pl-6 shrink-0 mr-4">
            <Link href="/wishlist" className="p-1.5 text-dark hover:text-primary transition-all group">
              <Heart className="w-5 h-5 group-hover:scale-110 group-hover:fill-primary/10 transition-all" />
            </Link>
            
            <Link href="/cart" className="relative p-1.5 text-dark hover:text-primary transition-all group">
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-all" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {mounted && user ? (
              <button
                onClick={logout}
                className="bg-[#1A2C4B] text-white px-6 py-2.5 rounded-full hover:bg-primary transition-all font-black text-[11px] uppercase tracking-widest shadow-lg shadow-dark/10 active:scale-95 translate-x-1"
              >
                Logout
              </button>
            ) : mounted ? (
              <Link href="/login" className="bg-[#1A2C4B] text-white px-6 py-2.5 rounded-full hover:bg-primary transition-all font-black text-[11px] uppercase tracking-widest shadow-lg shadow-dark/10 active:scale-95 translate-x-1">
                Login
              </Link>
            ) : null}
          </div>

          {/* Mobile Actions Container (Cart & Hamburger) */}
          <div className="lg:hidden flex items-center gap-1 sm:gap-2">
            <Link href="/cart" className="relative p-1.5 text-dark">
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-1.5 bg-gray-50 rounded-xl active:scale-90 transition-all"
            >
              {isOpen ? <X className="w-5.5 h-5.5 text-dark" /> : <Menu className="w-5.5 h-5.5 text-dark" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (High-end Slide) */}
      <div className={`fixed inset-0 bg-dark/40 backdrop-blur-md z-[1001] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}>
        <div 
          className={`absolute top-0 right-0 h-screen w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out p-8 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-12">
             <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <SafeImage src={logo} alt="Izaan Shop" width={40} height={18} style={{ width: 'auto', height: 'auto' }} />
             </Link>
            <button onClick={() => setIsOpen(false)} className="p-2 bg-gray-50 rounded-full"><X className="w-6 h-6" /></button>
          </div>
          
          <div className="relative mb-10">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-gray-50 border border-transparent rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:border-primary/20 outline-none transition-all"
            />
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <nav className="flex flex-col gap-2 mb-12">
            <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-black text-dark p-4 bg-gray-50 rounded-2xl flex items-center justify-between">Home <ChevronRight className="w-5 h-5 text-primary" /></Link>
            <Link href="/profile" onClick={() => setIsOpen(false)} className="text-lg font-black text-dark p-4 flex items-center justify-between">Dashboard <ChevronRight className="w-5 h-5 text-gray-300" /></Link>
            <Link href="/cart" onClick={() => setIsOpen(false)} className="text-lg font-black text-dark p-4 flex items-center justify-between">My Cart <ChevronRight className="w-5 h-5 text-gray-300" /></Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-black text-dark p-4 flex items-center justify-between">About Us <ChevronRight className="w-5 h-5 text-gray-300" /></Link>
          </nav>

          <div className="space-y-4">
            {mounted && user ? (
              <button 
                onClick={() => { logout(); setIsOpen(false); }} 
                className="w-full bg-[#1A2C4B] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full text-center bg-gray-100 text-dark py-4 rounded-2xl font-black uppercase tracking-widest">Sign In</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="block w-full text-center bg-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Navbar: Categories (Static or Sticky based on preference) */}
      <div className={`transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
        <CategoryBar />
      </div>
    </header>
    {/* Spacer to prevent content from hiding under fixed header */}
    <div className="h-[240px] md:h-[290px]" aria-hidden="true" />
    </>
  );
};

export default Navbar;
