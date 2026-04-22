"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from "firebase/auth";
import { authService } from '@/lib/auth/auth';
import { initialProductsData } from '@/components/product/types';

interface SystemContextType {
  user: User | null;
  loading: boolean;
  categories: string[];
  productsData: any;
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  logout: () => Promise<void>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState(initialProductsData);
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
      setCategories(Object.keys(initialProductsData));
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
