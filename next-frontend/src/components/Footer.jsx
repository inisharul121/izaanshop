import React from 'react';
import { Globe, Send, Heart, Play, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import SafeImage from './SafeImage';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <Link href="/" className="inline-block group">
              <div className="relative">
                <div className="absolute -inset-1 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <SafeImage 
                  src={logo} 
                  alt="IzaanShop Logo" 
                  width={120} 
                  height={54} 
                  className="h-10 w-auto opacity-100 object-contain transition-transform group-hover:scale-110" 
                  style={{ width: 'auto', height: 'auto' }}
                  loading="lazy"
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs md:max-w-none mx-auto md:mx-0">
              Premium educational products, books, and toys for the next generation. Quality and learning delivered to your doorstep.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors border border-white/10 p-2.5 rounded-full hover:border-primary/50 bg-white/5"><Globe className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors border border-white/10 p-2.5 rounded-full hover:border-primary/50 bg-white/5"><Send className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors border border-white/10 p-2.5 rounded-full hover:border-primary/50 bg-white/5"><Heart className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors border border-white/10 p-2.5 rounded-full hover:border-primary/50 bg-white/5"><Play className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary/80">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-bold">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary/80">Customer Service</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-bold">
              <li><Link href="/shipping-policy" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary/80">Contact Us</h4>
            <ul className="space-y-5 text-gray-400 text-sm font-bold">
              <li className="flex flex-col items-center md:items-start gap-2">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <span>Dhaka, Bangladesh</span>
                </div>
              </li>
              <li className="flex flex-col items-center md:items-start gap-2">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span>+880 1752-530303</span>
                </div>
              </li>
              <li className="flex flex-col items-center md:items-start gap-2">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span>info@izaanshop.com</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">
          <p>© 2024 IzaanShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
