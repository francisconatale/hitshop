"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { PublicProduct } from '@/types/product';
import { useSystemUI } from './SystemUIContext';
import { db } from '@/lib/firebase';
import ProductsCollection from '@/lib/collections/ProductsCollection';

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
const GREED_HISTORY_KEY = 'hitshop_greed_history';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PublicProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const { showNotification } = useSystemUI();

  // Inicialización
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setItems(parsed);
      } catch (e) {}
    }
    setIsHydrated(true);
  }, []);

  // Persistencia
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = useCallback((product: PublicProduct) => {
    const alreadyInCart = items.some(item => item.id === product.id);
    
    if (!alreadyInCart) {
      setItems((prev) => [...prev, product]);
      
      // Control de duplicados en el contador (Cache Local)
      const greedHistory = JSON.parse(localStorage.getItem(GREED_HISTORY_KEY) || '[]');
      const hasIncrementedBefore = greedHistory.includes(product.id);

      if (!hasIncrementedBefore) {
        // Incrementamos el contador de codicia en Firestore
        ProductsCollection.incrementGreedCounter(db, product.id).catch(console.error);
        
        // Guardamos en el historial local para no repetir
        const newHistory = [...greedHistory, product.id];
        localStorage.setItem(GREED_HISTORY_KEY, JSON.stringify(newHistory));

        // Despachamos un evento para actualización optimista en la UI (diferido)
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('product-greed-increment', { 
            detail: { productId: product.id } 
          }));
        }, 0);
      }
      
      showNotification("PRODUCTO AGREGADO CON ÉXITO", 'add');
    }
  }, [items, showNotification]);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter(item => item.id !== productId));
    showNotification("PRODUCTO QUITADO CON ÉXITO", 'remove');
  }, [showNotification]);

  const clearCart = useCallback((silent = false) => {
    setItems([]);
    if (!silent) {
      showNotification("CARRITO VACIADO COMPLETAMENTE", 'remove');
    }
  }, [showNotification]);

  // Listener para cerrar sesión
  useEffect(() => {
    const handleLogout = () => clearCart(true);
    window.addEventListener('user-logout', handleLogout);
    return () => window.removeEventListener('user-logout', handleLogout);
  }, [clearCart]);

  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);
  
  const total = useMemo(() => items.reduce((acc, item) => acc + item.price, 0), [items]);
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
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
