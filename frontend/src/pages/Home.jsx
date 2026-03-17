import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, ToyBrick, PenTool, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import SEO from '../components/SEO';

const Home = () => {
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products?pageSize=8');
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="pb-20">
      <SEO title="Home" description="Empower their future through learning with IzaanShop's educational books and toys." />
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between gap-8 pt-12 md:pt-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 space-y-6 text-center md:text-left"
          >
            <span className="text-primary font-bold tracking-wider text-xs uppercase">Welcome to IzaanShop</span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-dark leading-tight">
              Empower Their <span className="text-primary">Future</span> Through Learning
            </h1>
            <p className="text-gray-600 text-lg max-w-lg mx-auto md:mx-0">
              Discover the best educational books, STEM toys, and school supplies for children of all ages.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Link to="/shop" className="btn-primary flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/categories" className="px-6 py-2 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-all">
                Browse Categories
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 hidden md:block"
          >
            <img
              src="https://placehold.co/800x600/FF6B35/white?text=Izaan+Shop+hero"
              alt="Hero"
              className="w-full max-w-md mx-auto drop-shadow-2xl"
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
                    src={cat.image || `https://placehold.co/400?text=${cat.name}`} 
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
                <ProductCard key={product._id} product={product} />
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
