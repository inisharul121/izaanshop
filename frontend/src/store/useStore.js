import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      // Auth State
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),

      // Cart State
      cart: [],
      addToCart: (product, quantity = 1) => set((state) => {
        const existingItem = state.cart.find((item) => item._id === product._id);
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, quantity }] };
      }),
      removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter((item) => item._id !== productId),
      })),
      updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        ),
      })),
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'izaan-shop-storage',
    }
  )
);
