"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { PublicProduct } from '@/types/product';

interface CartContextType {
  items: PublicProduct[];
  isOpen: boolean;
  addToCart: (product: PublicProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'hitshop_cart_session';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PublicProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Inicializar desde sessionStorage (solo en cliente)
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing cart from sessionStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Persistir cambios en sessionStorage
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = (product: PublicProduct) => {
    setItems((prev) => {
      // Evitar duplicados ya que la cantidad siempre es 1
      if (prev.find(item => item.id === product.id)) return prev;
      return [...prev, product];
    });
    setIsOpen(true); // Abrir el carrito al agregar algo
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = () => {
    setIsOpen(prev => !prev);
  };

  const total = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price, 0);
  }, [items]);

  const itemCount = items.length;

  return (
    <CartContext.Provider value={{
      items,
      isOpen,
      addToCart,
      removeFromCart,
      clearCart,
      toggleCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
