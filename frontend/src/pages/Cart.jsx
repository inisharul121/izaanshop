import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getImageUrl } from '../utils/helpers';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, user } = useStore();

  const subtotal = cart.reduce((acc, item) => acc + (item.salePrice || item.price) * item.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 60;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-dark">Your cart is empty</h1>
          <p className="text-gray-500">Looks like you haven't added anything to your cart yet. Let's find something amazing for you!</p>
          <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-10">Your Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="flex gap-4 md:gap-6 bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <Link to={`/product/${item.slug}`} className="w-24 md:w-32 aspect-square rounded-lg overflow-hidden shrink-0">
                  <img src={getImageUrl(item.images?.[0])} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-bold text-dark hover:text-primary transition-colors text-lg line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 mt-1">Category Placeholder</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-gray-100 rounded-md h-10">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 text-gray-400 hover:text-primary"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 text-gray-400 hover:text-primary"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{(item.salePrice || item.price) * item.quantity}৳</p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-gray-400">{(item.salePrice || item.price)}৳ each</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{subtotal}৳</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-500 font-bold uppercase text-[10px]">Free</span> : `${shipping}৳`}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-dark">
                <span>Total</span>
                <span className="text-primary text-2xl">{total}৳</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full btn-primary py-4 text-lg flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>

            {!user && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Have an account?{' '}
                <a href="/login?redirect=checkout" className="text-primary font-bold hover:underline">
                  Sign in
                </a>
                {' '}for faster checkout
              </p>
            )}

            <p className="text-[10px] text-gray-400 text-center mt-3">
              Taxes and shipping calculated at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
