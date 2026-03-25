import React from 'react';
import { ShoppingCart, User, Search, Menu, X, Heart, LayoutDashboard, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { cart, user, logout } = useStore();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

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
      <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 py-2.5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Box - Now in Section 1 and shown on desktop & tablet */}
            <div className="w-full lg:max-w-xl order-2 lg:order-1">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search for books, toys..."
                  className="w-full bg-white border border-gray-200 rounded-full py-2.5 px-4 pl-11 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm group-hover:border-gray-300 shadow-sm"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4.5 h-4.5 group-focus-within:text-primary transition-colors" />
              </div>
            </div>

            {/* Contact & Social Info */}
            <div className="flex items-center justify-between w-full lg:w-auto gap-4 md:gap-8 order-1 lg:order-2">
              <div className="flex items-center gap-4">
                <a 
                  href="tel:+8801752530303" 
                  className="flex items-center gap-1.5 text-dark hover:text-primary transition-colors text-sm font-semibold"
                >
                  <div className="bg-primary/10 p-1.5 rounded-full">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="hidden sm:inline">+880 1752-530303</span>
                  <span className="sm:hidden text-[12px]">Call Us</span>
                </a>
              </div>
              
              <div className="flex items-center gap-3 border-l pl-4 md:pl-8 border-gray-200">
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
      </div>

      {/* Section 2: Main Navbar (Logo, Others) */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <img 
              src={logo} 
              alt="IzaanShop" 
              className="h-9 md:h-12 w-auto object-contain transition-transform group-hover:scale-105" 
            />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <Link to="/wishlist" className="hidden sm:flex text-dark hover:text-primary transition-colors relative">
              <Heart className="w-5.5 h-5.5" />
            </Link>
            <Link to="/cart" className="text-dark hover:text-primary transition-colors relative p-1">
              <ShoppingCart className="w-5.5 h-5.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>
            
            <div className="hidden md:flex items-center gap-4 border-l pl-4 md:pl-6 border-gray-100 ml-2">
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-dark hover:text-primary transition-colors flex items-center gap-1.5 font-bold text-[13px] uppercase tracking-wide">
                  <LayoutDashboard className="w-4.5 h-4.5" /> Admin
                </Link>
              )}
              <Link to="/profile" className="text-dark hover:text-primary transition-colors font-bold text-[13px] uppercase tracking-wide">
                Dashboard
              </Link>
              {user ? (
                <button
                  onClick={logout}
                  className="bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-primary transition-all font-bold text-[13px] uppercase tracking-wide shadow-sm"
                >
                  Logout
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-dark hover:text-primary transition-colors font-bold text-[13px] uppercase tracking-wide">
                    Login
                  </Link>
                  <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-full hover:bg-dark transition-all font-bold text-[13px] uppercase tracking-wide shadow-sm">
                    Register
                  </Link>
                </div>
              )}
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
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-6 px-4 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4 font-medium text-dark">
            {user?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="text-primary font-bold flex items-center gap-3 p-2 bg-primary/5 rounded-lg">
                <LayoutDashboard className="w-5 h-5" /> Admin Panel
              </Link>
            )}
            <Link to="/profile" onClick={() => setIsOpen(false)} className="hover:text-primary p-2 transition-colors">Dashboard</Link>
            <Link to="/wishlist" onClick={() => setIsOpen(false)} className="hover:text-primary p-2 transition-colors flex items-center gap-2">
              <Heart className="w-5 h-5" /> Wishlist
            </Link>
            <Link to="/categories" onClick={() => setIsOpen(false)} className="hover:text-primary p-2 transition-colors">Categories</Link>
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-colors">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="text-center py-3 bg-primary text-white rounded-xl font-bold hover:bg-dark transition-colors">Register</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
