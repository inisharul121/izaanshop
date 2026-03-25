'use client';

import React from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, LayoutDashboard } from 'lucide-react';
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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="relative group">
            <div className="absolute -inset-1 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <Image 
              src={logo} 
              alt="IzaanShop" 
              className="relative h-10 md:h-12 w-auto object-contain transition-all duration-300 group-hover:scale-110" 
            />
          </Link>

          {/* Search Box - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for books, toys..."
                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            </div>
          </div>

          {/* Desktop Icons */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/wishlist" className="text-dark hover:text-primary transition-colors relative">
              <Heart className="w-6 h-6" />
            </Link>
            <Link href="/cart" className="text-dark hover:text-primary transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            {mounted && user?.role === 'admin' && (
              <Link href="/admin" className="text-dark hover:text-primary transition-colors flex items-center gap-1 font-bold text-sm">
                <LayoutDashboard className="w-5 h-5" /> Admin
              </Link>
            )}
            <Link href="/profile" className="text-dark hover:text-primary transition-colors font-bold text-sm">
              Dashboard
            </Link>
            <Link href="/about" className="text-dark hover:text-primary transition-colors font-bold text-sm">
              About Us
            </Link>
            {mounted && user ? (
              <button
                onClick={logout}
                className="text-dark hover:text-primary transition-colors font-bold text-sm"
              >
                Logout
              </button>
            ) : mounted ? (
              <>
                <Link href="/login" className="text-dark hover:text-primary transition-colors font-bold text-sm">
                  Login
                </Link>
                <Link href="/register" className="text-dark hover:text-primary transition-colors font-bold text-sm">
                  Register
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative text-dark">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-dark">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 animate-in fade-in slide-in-from-top duration-300">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
          <nav className="flex flex-col gap-3 font-medium text-dark">
            {mounted && user?.role === 'admin' && (
              <Link href="/admin" onClick={() => setIsOpen(false)} className="text-primary font-bold flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5" /> Admin Panel
              </Link>
            )}
            <Link href="/profile" onClick={() => setIsOpen(false)} className="hover:text-primary">Dashboard</Link>
            {mounted && user ? (
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-left hover:text-primary"
              >
                Logout
              </button>
            ) : mounted ? (
              <>
                <Link href="/login" onClick={() => setIsOpen(false)} className="hover:text-primary">Login</Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="hover:text-primary">Register</Link>
              </>
            ) : null}
            <Link href="/categories" onClick={() => setIsOpen(false)} className="hover:text-primary">Categories</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="hover:text-primary">About Us</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
