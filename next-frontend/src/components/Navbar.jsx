'use client';

import React from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, LayoutDashboard, Phone } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '../store/useStore';
import Image from 'next/image';
import logo from '../assets/logo.png';

import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith('/admin');
  
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const { cart, user, logout } = useStore();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (isAdminPath) return null;

  const cartCount = mounted ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0;

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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Section 1: Top Bar (Search, Phone, Social) */}
      <div className="bg-gray-50/80 backdrop-blur-md py-2 border-b border-gray-100/50">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          {/* Search Bar - Centered */}
          <div className="w-full md:w-1/2 lg:w-1/3 order-2 md:order-1">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-white border border-gray-200 rounded-full py-1.5 pl-10 pr-4 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm group-hover:border-gray-300"
              />
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
            </div>
          </div>
          
          {/* Contact & Social - Centered */}
          <div className="flex flex-wrap items-center justify-center gap-5 order-1 md:order-2">
            <a 
              href="tel:+8801752530303" 
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-primary transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100"
            >
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">+880 1752-530303</span>
              <span className="sm:hidden text-[10px]">Call Us</span>
            </a>
            
            <div className="flex items-center gap-2 border-l border-gray-200 pl-5">
              <a 
                href="https://wa.me/8801752530303" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500/10 p-2 rounded-full hover:bg-green-500 transition-all group shadow-sm"
                title="WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4 text-green-600 group-hover:text-white" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600/10 p-2 rounded-full hover:bg-blue-600 transition-all group shadow-sm"
                title="Facebook"
              >
                <FacebookIcon className="w-4 h-4 text-blue-600 group-hover:text-white" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Main Navbar (Logo, Nav Links, Actions) */}
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-8 w-full">
          {/* Logo - Start */}
          <Link href="/" className="flex flex-shrink-0 active:scale-95 transition-transform">
            <Image src={logo} alt="Izaan Shop" width={110} height={35} className="h-8 w-auto md:h-9" priority />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/wishlist" className="hidden sm:flex text-dark hover:text-primary transition-colors relative">
              <Heart className="w-5.5 h-5.5" />
            </Link>
            <Link href="/cart" className="text-dark hover:text-primary transition-colors relative p-1">
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <div className="hidden md:flex items-center gap-4 border-l pl-4 md:pl-6 border-gray-100 ml-2">
              {mounted && user?.role === 'admin' && (
                <Link href="/admin" className="text-dark hover:text-primary transition-colors flex items-center gap-1.5 font-bold text-[13px] uppercase tracking-wide">
                  <LayoutDashboard className="w-4.5 h-4.5" /> Admin
                </Link>
              )}
              <Link href="/profile" className="text-dark hover:text-primary transition-colors font-bold text-[13px] uppercase tracking-wide">
                Dashboard
              </Link>
              <Link href="/about" className="text-dark hover:text-primary transition-colors font-bold text-[13px] uppercase tracking-wide">
                About Us
              </Link>
              {mounted && user ? (
                <button
                  onClick={logout}
                  className="bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-primary transition-all font-bold text-[13px] uppercase tracking-wide shadow-sm"
                >
                  Logout
                </button>
              ) : mounted ? (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-dark hover:text-primary transition-colors font-bold text-[13px] uppercase tracking-wide">
                    Login
                  </Link>
                  <Link href="/register" className="bg-primary text-white px-5 py-2 rounded-full hover:bg-dark transition-all font-bold text-[13px] uppercase tracking-wide shadow-sm">
                    Register
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden text-dark p-1 ml-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-6 px-4 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4 font-medium text-dark">
            {mounted && user?.role === 'admin' && (
              <Link href="/admin" onClick={() => setIsOpen(false)} className="text-primary font-bold flex items-center gap-3 p-2 bg-primary/5 rounded-lg">
                <LayoutDashboard className="w-5 h-5" /> Admin Panel
              </Link>
            )}
            <Link href="/profile" onClick={() => setIsOpen(false)} className="hover:text-primary p-2 transition-colors">Dashboard</Link>
            <Link href="/wishlist" onClick={() => setIsOpen(false)} className="hover:text-primary p-2 transition-colors flex items-center gap-2">
              <Heart className="w-5 h-5" /> Wishlist
            </Link>
            <Link href="/categories" onClick={() => setIsOpen(false)} className="hover:text-primary p-2 transition-colors">Categories</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-primary p-2 transition-colors">About Us</Link>
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              {mounted && user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  Logout
                </button>
              ) : mounted ? (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="text-center py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">Login</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="text-center py-3 bg-primary text-white rounded-xl font-bold hover:bg-dark transition-colors">Register</Link>
                </>
              ) : null}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
