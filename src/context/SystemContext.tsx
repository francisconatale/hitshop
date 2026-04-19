"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProductsData } from '@/components/product/types';

interface SystemContextType {
  categories: string[];
  productsData: any;
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [productsData, setProductsData] = useState(initialProductsData);
  const [categories, setCategories] = useState<string[]>([]);

  // Cargar categorías iniciales y persistencia (mockeada con localStorage)
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
      [lowerName]: [] // Nueva categoría vacía
    };
    saveState(newData);
  };

  const removeCategory = (name: string) => {
    const lowerName = name.toLowerCase();
    const { [lowerName as any]: removed, ...rest } = productsData as any;
    saveState(rest);
  };

  return (
    <SystemContext.Provider value={{ categories, productsData, addCategory, removeCategory }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) throw new Error('useSystem must be used within a SystemProvider');
  return context;
}
