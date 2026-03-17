import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ToyBrick, PenTool, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import SEO from '../components/SEO';
import { getImageUrl } from '../utils/helpers';

const Home = () => {
  const [products, setProducts] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchKeyword, setSearchKeyword] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const navigate = React.useNavigate();

  React.useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?pageSize=8'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data.products);
        setCategories(catRes.data.slice(0, 3)); // Top 3 for featured
      } catch (error) {
        console.error('Failed to fetch home data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchKeyword) params.set('keyword', searchKeyword);
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <div className="pb-20">
      <SEO title="Home" description="Empower their future through learning with IzaanShop's educational books and toys." />
      {/* Hero Section */}
      <section className="relative min-h-[500px] md:h-[600px] overflow-hidden bg-gradient-to-br from-primary/10 via-white to-primary/5 flex items-center">
        <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between gap-12 pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-3/5 space-y-8 text-center md:text-left z-10"
          >
            <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full">
              <span className="text-primary font-bold tracking-wider text-[10px] uppercase">New Collection 2024</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-dark leading-[1.1]">
              Empower Their <span className="text-primary relative inline-block">Future<div className="absolute -bottom-2 left-0 w-full h-1.5 bg-primary/20 rounded-full" /></span> Through Learning
            </h1>
            <p className="text-gray-500 text-lg md:text-xl max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
              Discover curated educational toys, STEM kits, and books designed to spark curiosity and growth.
            </p>

            {/* Modern Search Filter Bar */}
            <form 
              onSubmit={handleSearch}
              className="relative max-w-2xl bg-white/70 backdrop-blur-xl p-2 rounded-[2rem] border border-white shadow-2xl flex flex-col sm:flex-row items-center gap-2 group transition-all hover:bg-white"
            >
              <div className="flex-1 w-full pl-6 flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-primary opacity-50" />
                <input 
                  type="text" 
                  placeholder="What are you looking for?"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-transparent border-none py-4 text-sm font-medium focus:ring-0 placeholder:text-gray-400"
                />
              </div>
              
              <div className="hidden sm:block w-px h-8 bg-gray-100" />

              <div className="flex-1 w-full flex items-center gap-3 px-4">
                <ToyBrick className="w-5 h-5 text-primary opacity-50" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-transparent border-none py-4 text-sm font-medium focus:ring-0 cursor-pointer text-gray-600 appearance-none"
                >
                  <option value="">All Categories</option>
                  {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                </select>
              </div>

              <button 
                type="submit"
                className="w-full sm:w-auto px-10 py-4 bg-dark text-white rounded-[1.5rem] font-bold text-sm tracking-tight hover:bg-primary transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center gap-2"
              >
                Search <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="flex items-center justify-center md:justify-start gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-dark">5k+</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Products</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-dark">2k+</span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Happy Kids</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="md:w-2/5 relative"
          >
            <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />
            <img
              src="https://placehold.co/800x1000/FF6B35/white?text=Educational+Toys"
              alt="Hero"
              className="w-full max-w-md mx-auto drop-shadow-2xl rounded-[3rem] border-8 border-white"
            />
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <Link key={cat.id || i} to={`/shop?category=${cat.slug}`}>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white border border-gray-100 rounded-3xl p-2 flex flex-col items-center text-center group cursor-pointer shadow-sm hover:shadow-xl transition-all"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-primary/5">
                  <img 
                    src={getImageUrl(cat.image)} 
                    alt={cat.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="pb-6 px-4">
                  <h3 className="text-xl font-bold text-dark">{cat.name}</h3>
                  <p className="text-xs mt-1 text-gray-400">Discover Collection</p>
                </div>
              </motion.div>
            </Link>
          ))}
          {categories.length === 0 && !loading && (
            <p className="col-span-full text-center text-gray-400 italic">No categories found.</p>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">Best Sellers</h2>
            <Link to="/shop" className="text-primary font-semibold flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4 py-20 text-center border-t border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: 'Free Delivery', desc: 'On orders over 2000৳', icon: CheckCircle },
            { title: 'Easy Returns', desc: '7 days return policy', icon: CheckCircle },
            { title: 'Secure Payment', desc: '100% secure checkout', icon: CheckCircle },
            { title: '24/7 Support', desc: 'Call us anytime', icon: CheckCircle },
          ].map((badge, i) => (
            <div key={i} className="flex flex-col items-center">
              <badge.icon className="w-10 h-10 text-primary mb-4" />
              <h4 className="font-bold text-sm mb-1">{badge.title}</h4>
              <p className="text-xs text-gray-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
