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

  const saveState = (newData: any) => {
    setProductsData(newData);
    setCategories(Object.keys(newData));
    localStorage.setItem('hitshop_categories', JSON.stringify(newData));
  };

  const addCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    if (productsData[lowerName as keyof typeof productsData]) return;
    
    const newData = {
      ...productsData,
      [lowerName]: []
    };
    saveState(newData);
  };

  const removeCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    const { [lowerName as any]: removed, ...rest } = productsData as any;
    saveState(rest);
  };

  const addProductToState = (category: string, product: any) => {
    const lowerCat = category.toLowerCase();
    const current = (productsData as any)[lowerCat] ?? [];
    const newData = { ...productsData, [lowerCat]: [...current, product] };
    saveState(newData);
  };

  const setCategoryProducts = (category: string, products: any[]) => {
    const lowerCat = category.toLowerCase();
    const newData = { ...productsData, [lowerCat]: products };
    saveState(newData);
  };

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
