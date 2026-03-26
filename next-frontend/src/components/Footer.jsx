import React from 'react';
import { Globe, Send, Heart, Play, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <div className="relative">
                <div className="absolute -inset-1 bg-primary/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                <Image 
                  src={logo} 
                  alt="IzaanShop Logo" 
                  width={48} 
                  height={48} 
                  className="relative object-contain transition-transform group-hover:scale-110" 
                />
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium educational products, books, and toys for the next generation. Quality and learning delivered to your doorstep.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Globe className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Send className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Heart className="w-5 h-5" /></a>
              <a href="https://www.facebook.com/izaanshop2" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><Play className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link href="/categories" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-bold mb-6">Customer Service</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/shipping" className="hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>1 No. Narinda Lane, Narinda, Dhaka-1100</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+880 1752-530303</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>emranemon21@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-xs">
          <p>© 2024 IzaanShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
