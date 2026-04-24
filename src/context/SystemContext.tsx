"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from "firebase/auth";
import { authService } from '@/lib/auth/auth';

const DEFAULT_CATEGORIES = {
  cpus: [],
  gpus: [],
  apparel: [],
  peripherals: []
};

interface SystemContextType {
  user: User | null;
  loading: boolean;
  categories: string[];
  productsData: any;
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  addProductToState: (category: string, product: any) => void;
  setCategoryProducts: (category: string, products: any[]) => void;
  logout: () => Promise<void>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState(DEFAULT_CATEGORIES);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Cargar categorías iniciales y persistencia
  useEffect(() => {
    const saved = localStorage.getItem('hitshop_categories');
    if (saved) {
      const parsed = JSON.parse(saved);
      setProductsData(parsed);
      setCategories(Object.keys(parsed));
    } else {
      setCategories(Object.keys(DEFAULT_CATEGORIES));
    }
  }, []);

  const saveStateToStorage = (newData: any) => {
    localStorage.setItem('hitshop_categories', JSON.stringify(newData));
  };

  const addCategory = React.useCallback((name: string) => {
    const lowerName = name.toLowerCase();
    setProductsData(prev => {
      if ((prev as any)[lowerName]) return prev;
      const newData = { ...prev, [lowerName]: [] };
      setCategories(Object.keys(newData));
      saveStateToStorage(newData);
      return newData;
    });
  }, []);

  const removeCategory = React.useCallback((name: string) => {
    const lowerName = name.toLowerCase();
    setProductsData(prev => {
      const { [lowerName as any]: removed, ...rest } = prev as any;
      setCategories(Object.keys(rest));
      saveStateToStorage(rest);
      return rest;
    });
  }, []);

  const addProductToState = React.useCallback((category: string, product: any) => {
    const lowerCat = category.toLowerCase();
    setProductsData(prev => {
      const current = (prev as any)[lowerCat] ?? [];
      const newData = { ...prev, [lowerCat]: [...current, product] };
      saveStateToStorage(newData);
      return newData;
    });
  }, []);

  const setCategoryProducts = React.useCallback((category: string, products: any[]) => {
    const lowerCat = category.toLowerCase();
    setProductsData(prev => {
      const currentProducts = (prev as any)[lowerCat] || [];
      if (currentProducts.length === products.length) return prev;
      const newData = { ...prev, [lowerCat]: products };
      saveStateToStorage(newData);
      return newData;
    });
  }, []);

  const logout = async () => {
    await authService.logout();
    window.location.href = '/login';
  };

  return (
    <SystemContext.Provider value={{ 
      user, 
      loading, 
      categories, 
      productsData, 
      addCategory, 
      removeCategory,
      addProductToState,
      setCategoryProducts,
      logout 
    }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
}
