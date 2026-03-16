import React from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { cart, user } = useStore();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-1">
            <span className="bg-primary text-white px-2 py-0.5 rounded">I</span>
            IzaanShop
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
            <Link to="/wishlist" className="text-dark hover:text-primary transition-colors relative">
              <Heart className="w-6 h-6" />
            </Link>
            <Link to="/cart" className="text-dark hover:text-primary transition-colors relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to={user ? "/profile" : "/login"} className="text-dark hover:text-primary transition-colors">
              <User className="w-6 h-6" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative text-dark">
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
            <Link to="/" onClick={() => setIsOpen(false)} className="hover:text-primary">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="hover:text-primary">Shop</Link>
            <Link to="/categories" onClick={() => setIsOpen(false)} className="hover:text-primary">Categories</Link>
            <Link to="/profile" onClick={() => setIsOpen(false)} className="hover:text-primary">Profile</Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
