"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, ReactNode, useEffect, useMemo } from 'react';
import ScrambleText from '@/components/ui/ScrambleText';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { useSystem } from '@/context/SystemContext';
import { AddProductForm } from '@/components/product/AddProductForm';
import ProductCard from '@/components/product/ProductCard';
import ProductItemsGrid from '@/components/product/ProductItemsGrid';
import { Product, PublicProduct } from '@/types/product';

interface ProductGridProps {
  category?: string;
  initialProducts?: (Product | PublicProduct)[];
  children?: ReactNode;
}

export function CategoryHeader({ category, count }: { category: string, count?: number }) {
  const { userData } = useAuth();
  const { productsData } = useSystem();
  const isAdmin = userData?.role === 'admin';

  // Si no se pasa un conteo explícito, intentamos leerlo del estado global
  const contextCount = (productsData as any)[category.toLowerCase()]?.length;
  const finalCount = count !== undefined ? count : contextCount;
  const isSyncing = finalCount === undefined;

  const categoryIcon = useMemo(() => {
    const CATEGORY_ICONS: Record<string, string> = {
      gpus: 'memory',
      cpus: 'developer_board',
      systems: 'desktop_windows',
      peripherals: 'keyboard',
    };
    return CATEGORY_ICONS[category.toLowerCase()] ?? 'inventory_2';
  }, [category]);

  return (
    <div className="max-w-[1440px] mx-auto mt-6 px-4">
      <div className="border border-on-surface bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-0">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
           <div className="bg-on-surface text-surface p-2 aspect-square flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">
                {categoryIcon}
              </span>
           </div>
           <div>
              <div className="text-[7px] font-mono font-black text-primary-dim/60 uppercase tracking-[0.2em] leading-none mb-1 px-1 py-0.5 bg-primary/5 inline-block border-l-2 border-primary/20">
                SYSTEM / HARDWARE
              </div>
              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter leading-none text-on-surface">
                <ScrambleText text={category.toUpperCase()} />
              </h1>
           </div>
        </div>
        <div className="flex gap-4 sm:gap-6 font-mono text-right w-full sm:w-auto justify-between sm:justify-end border-t border-on-surface/10 sm:border-t-0 pt-4 sm:pt-0">
          <div className="flex flex-col items-end">
            <span className="text-[7px] opacity-30 uppercase">Active_Assets</span>
            <span className="text-sm font-black">{!isSyncing ? finalCount : '--'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[7px] opacity-30 uppercase">Status</span>
            <span className="text-sm font-black text-primary-fixed">
              {isSyncing ? 'FETCHING...' : 'SYNCHRONIZED'}
            </span>
          </div>
        </div>
      </div>
      {isAdmin && <AddProductForm />}
    </div>
  );
}

/**
 * Componente invisible que reporta los productos cargados al sistema global
 * para que otros componentes (como el Header) puedan reaccionar.
 */
export function SyncSystemState({ category, products }: { category: string, products: any[] }) {
  const { setCategoryProducts } = useSystem();
  const count = products.length;
  
  useEffect(() => {
    if (category && products) {
      setCategoryProducts(category, products);
    }
  }, [category, count, setCategoryProducts]);

  return null;
}

export default function ProductGrid({ category, initialProducts = [], children }: ProductGridProps) {
  const [isHeroComplete, setIsHeroComplete] = useState(false);

  const handleHeroComplete = useCallback(() => {
    setIsHeroComplete(true);
  }, []);

  if (category) {
    return (
      <>
        <div className="max-w-[1440px] mx-auto mb-6 px-4">
          <div className="border-l border-t border-on-surface min-h-[400px] relative">
            {children || (
              <ProductItemsGrid products={initialProducts} />
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      <div className="mb-24 sm:mb-32 relative">
        <div className="absolute -top-8 sm:-top-12 left-0 text-[7px] sm:text-[8px] font-mono font-black text-primary-dim/70 tracking-[0.2em] sm:tracking-[0.3em] uppercase flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/5 border-l-2 border-primary/30">
           {isHeroComplete ? "SYSTEM_STABLE // NO_ERRORS" : "DECRYPTING_PRIMARY_NODE..."}
           {!isHeroComplete && <span className="w-1.5 h-1.5 bg-primary-fixed animate-ping"></span>}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-12 border-b-[12px] md:border-b-[24px] border-on-surface pb-6 md:pb-12 overflow-hidden relative">
          <div className="absolute bottom-[12px] md:bottom-[24px] left-0 w-full h-[2px] bg-primary-fixed/30 z-10" />

          <div className="max-w-full lg:max-w-5xl relative p-2 sm:p-4">
            <div className="absolute top-0 left-0 w-4 h-4 sm:w-8 sm:h-8 border-t-2 border-l-2 border-primary-fixed/20" />
            <div className="absolute top-0 right-0 w-2 h-4 sm:w-2 sm:h-8 border-t-2 border-r-2 border-primary-fixed/20" />

            <h1 className="text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-black uppercase tracking-tighter leading-[0.85] sm:leading-[0.75] text-on-surface relative flex flex-col">
              <Text path="productTexts.heroTitle">
                {(text) => {
                  const parts = text.split(" ");
                  return (
                    <>
                      <span className="block"><ScrambleText text={parts[0] || ""} /></span>
                      <span className="block"><ScrambleText text={parts.slice(1).join(" ") || ""} onComplete={handleHeroComplete} /></span>
                    </>
                  );
                }}
              </Text>
              <span className="absolute -right-2 sm:-right-4 top-0 text-[7px] sm:text-[10px] font-mono text-primary-fixed/40 [writing-mode:vertical-lr] pointer-events-none">
                PRT_77-X
              </span>
            </h1>
          </div>

          <AnimatePresence>
            {isHeroComplete && (
              <motion.div 
                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-start lg:items-end gap-3 sm:gap-6 lg:mb-4 px-2 sm:px-0"
              >
                <Text path="productTexts.dropLabel" className="text-xl sm:text-2xl font-black bg-on-surface text-surface px-4 sm:px-6 py-1 sm:py-2 uppercase rotate-1 brutal-shadow-primary inline-block" />
                <Text path="productTexts.heroDescription" className="max-w-xs sm:max-w-md font-bold text-base sm:text-xl leading-[1.1] text-left lg:text-right uppercase text-on-surface-variant" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isHeroComplete && initialProducts && initialProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-24"
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-[10px] font-mono font-black text-primary-fixed uppercase tracking-[0.3em]">Featured_Nodes</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter">Latest Drops</h2>
              </div>
            </div>
            <ProductItemsGrid products={initialProducts} layout="carousel" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isHeroComplete ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 border-l-2 border-t-2 border-on-surface"
      >
        {['Status: Online', 'Uptime: 99.9%', 'Node: DC-04', 'Auth: Root'].map((text, i) => (
          <div key={text} className="border-r-2 border-b-2 border-on-surface p-4 sm:p-6 font-mono text-[8px] sm:text-[10px] font-black uppercase text-on-surface-variant opacity-50 hover:opacity-100 transition-opacity">
            {text}
          </div>
        ))}
      </motion.div>
    </div>
  );
}