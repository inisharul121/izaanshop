'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Shield, Users, Globe, ShoppingBag, Sparkles, BookOpen } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  const stats = [
    { label: 'Happy Customers', value: '10K+', icon: Users, color: 'text-blue-500' },
    { label: 'Educational Toys', value: '500+', icon: Sparkles, color: 'text-orange-500' },
    { label: 'Books Collection', value: '1000+', icon: BookOpen, color: 'text-purple-500' },
    { label: 'Worldwide Shipping', value: '25+', icon: Globe, color: 'text-green-500' },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We hand-pick every toy and book to ensure it meets our high standards for educational value and durability.',
      icon: Shield,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      title: 'Made with Love',
      description: 'We care about your child\'s development as much as you do. Every product is curated with love and care.',
      icon: Heart,
      bg: 'bg-pink-50',
      color: 'text-pink-600',
    },
    {
      title: 'Expert Picked',
      description: 'Our team of educators and child development experts vet every item in our collection.',
      icon: Star,
      bg: 'bg-orange-50',
      color: 'text-orange-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-gray-50/50">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 rounded-full blur-[120px] animate-pulse" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <nav className="flex justify-center items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-8">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <div className="w-1 h-1 rounded-full bg-gray-200" />
              <span className="text-primary truncate">About Us</span>
            </nav>
            <h1 className="text-5xl md:text-7xl font-black text-dark tracking-tight leading-tight">
              Empowering the Next <br />
              <span className="text-primary">Generation of Thinkers</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Izaan Shop is more than just a store. We are a community dedicated to providing the best educational tools for children to explore, learn, and grow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center space-y-2">
                <div className={`w-12 h-12 ${stat.color} bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-3xl font-black text-dark tracking-tight">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="h-1 w-20 bg-primary rounded-full" />
              <h2 className="text-4xl font-black text-dark leading-tight">
                Our Mission is to ignite <br /> curiosity in every child.
              </h2>
              <div className="space-y-6 text-gray-500 leading-relaxed font-medium">
                <p>
                  Started with a simple vision, Izaan Shop has grown into a destination for parents who value quality over quantity. We believe that play is the most powerful form of research.
                </p>
                <p>
                  Every product in our catalog is carefully selected based on its ability to stimulate cognitive development, creativity, and fine motor skills. We don't just sell toys; we sell building blocks for a brighter future.
                </p>
              </div>
              <div className="flex gap-4 pt-4">
                <Link href="/" className="px-8 py-4 bg-dark text-white rounded-2xl font-black text-sm shadow-xl shadow-dark/20 hover:scale-[0.98] transition-all flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" /> Start Shopping
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-2"
            >
              <div className="absolute -inset-4 bg-primary/5 rounded-[3rem] -z-10" />
              <div className="aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&q=80&w=800" 
                  alt="Children playing" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-100 hidden md:block">
                <div className="w-full h-full bg-primary/10 rounded-2xl flex flex-col items-center justify-center text-center">
                  <Sparkles className="w-8 h-8 text-primary mb-2" />
                  <p className="text-[10px] font-black text-dark uppercase tracking-widest leading-tight">Premium Educational Tools</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gray-50/30">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl font-black text-dark tracking-tight mb-4 uppercase">Our Core Values</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">What drives us every day</p>
        </div>
        <div className="container mx-auto px-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {values.map((val, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-500 group"
              >
                <div className={`w-14 h-14 ${val.bg} ${val.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <val.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-dark mb-4">{val.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="bg-dark rounded-[3.5rem] p-12 md:p-24 relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-0" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                Ready to find the perfect <br /> gift for your little one?
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/" className="px-10 py-5 bg-primary text-white rounded-2xl font-black text-sm shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                  Browse Shop
                </Link>
                <Link href="/" className="px-10 py-5 bg-white/10 text-white backdrop-blur-md rounded-2xl font-black text-sm hover:bg-white/20 transition-all border border-white/10">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
