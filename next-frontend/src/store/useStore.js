'use client';

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
        const productKey = product.selectedVariant?.id ? `${product.id}-${product.selectedVariant.id}` : `${product.id}-simple`;
        const existingItem = state.cart.find((item) => {
          const itemKey = item.selectedVariant?.id ? `${item.id}-${item.selectedVariant.id}` : `${item.id}-simple`;
          return itemKey === productKey;
        });

        if (existingItem) {
          return {
            cart: state.cart.map((item) => {
              const itemKey = item.selectedVariant?.id ? `${item.id}-${item.selectedVariant.id}` : `${item.id}-simple`;
              return itemKey === productKey ? { ...item, quantity: item.quantity + quantity } : item;
            }),
          };
        }
        return { cart: [...state.cart, { ...product, quantity }] };
      }),
      removeFromCart: (productId, variantId = null) => set((state) => ({
        cart: state.cart.filter((item) => {
          const isMatch = item.id === productId && (variantId ? item.selectedVariant?.id === variantId : !item.selectedVariant?.id);
          return !isMatch;
        }),
      })),
      updateQuantity: (productId, quantity, variantId = null) => set((state) => ({
        cart: state.cart.map((item) => {
          const isMatch = item.id === productId && (variantId ? item.selectedVariant?.id === variantId : !item.selectedVariant?.id);
          return isMatch ? { ...item, quantity } : item;
        }),
      })),
      clearCart: () => set({ cart: [] }),
      
      // Hydration State
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'izaan-shop-storage',
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true);
      }
    }
  )
);
