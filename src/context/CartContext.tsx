'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductColor } from '@/types';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  subtotal: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size: string, color: ProductColor, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shree_fashion_cart_v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  }, []);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    } catch (err) {
      console.error('Failed to save cart:', err);
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, size: string, color: ProductColor, quantity = 1) => {
    const existingIndex = cart.findIndex(
      item => item.productId === product.id && item.size === size && item.color.name === color.name
    );

    let updatedCart: CartItem[];
    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${size}-${color.name}-${Date.now()}`,
        productId: product.id,
        title: product.title,
        price: product.price,
        size,
        color,
        image: color.image || product.images[0],
        quantity
      };
      updatedCart = [newItem, ...cart];
    }

    saveCart(updatedCart);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const updated = cart.filter(item => item.id !== cartItemId);
    saveCart(updated);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updated = cart.map(item => (item.id === cartItemId ? { ...item, quantity } : item));
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        totalItems,
        subtotal,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
