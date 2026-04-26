"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, ReactNode, useEffect, useMemo, useRef } from 'react';
import ScrambleText from '@/components/ui/ScrambleText';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { useSystem } from '@/context/SystemContext';
import { AddProductForm } from '@/components/product/AddProductForm';
import ProductItemsGrid from '@/components/product/ProductItemsGrid';
import { Product, PublicProduct } from '@/types/product';
import HowToBuy from '@/components/layout/HowToBuy';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ProductGridProps {
  category?: string;
  initialProducts?: (Product | PublicProduct)[];
  children?: ReactNode;
  animated?: boolean;
}

export function CategoryHeader({ category, count }: { category: string, count?: number }) {
  const { userData } = useAuth();
  const { productsData } = useSystem();
  const isAdmin = userData?.role === 'admin';

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
              <h1 className="text-2xl sm:text-4xl font-black font-heading uppercase tracking-tighter leading-none text-on-surface">
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

export default function ProductGrid({ 
  category, 
  initialProducts = [], 
  children,
  animated = false 
}: ProductGridProps) {
  const [isHeroComplete, setIsHeroComplete] = useState(false);
  const latestRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHeroComplete = useCallback(() => {
    setIsHeroComplete(true);
  }, []);

  useGSAP(() => {
    if (!latestRef.current || !animated) return;

    const titleParts = latestRef.current.querySelectorAll('.animate-title-part');
    const badge = latestRef.current.querySelector('.animate-badge');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: latestRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    tl.fromTo(badge, 
      { opacity: 0, x: -20, filter: 'blur(5px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out' }
    )
    .fromTo(titleParts,
      { opacity: 0, y: 30, skewY: 5, filter: 'blur(10px)' },
      { opacity: 1, y: 0, skewY: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.1, ease: 'expo.out' },
      '-=0.4'
    );
  }, { scope: containerRef, dependencies: [isHeroComplete, animated] });

  if (category) {
    return (
      <div className="max-w-[1440px] mx-auto mb-6 px-4">
        <div className="border-l border-t border-on-surface min-h-[400px] relative">
          {children || <ProductItemsGrid products={initialProducts} animated={animated} />}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full" ref={containerRef}>
      {/* SECCIÓN 1: HERO - OCUPA TODO EL VIEWPORT PERO SCROLLEA NATURAL */}
      <section className="min-h-[80dvh] sm:min-h-screen w-full flex flex-col justify-center bg-surface relative px-4 sm:px-6 border-b-[8px] sm:border-b-[12px] border-on-surface/5">
        <div className="max-w-[1440px] mx-auto w-full relative py-12 sm:py-0">
          <div className="relative">
            <div className="absolute -top-16 sm:-top-12 left-0 text-[7px] sm:text-[8px] font-mono font-black text-primary-dim/70 tracking-[0.2em] sm:tracking-[0.3em] uppercase flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/5 border-l-2 border-primary/30">
              {isHeroComplete ? "SYSTEM_STABLE // NO_ERRORS" : "DECRYPTING_PRIMARY_NODE..."}
              {!isHeroComplete && <span className="w-1.5 h-1.5 bg-primary-fixed animate-ping"></span>}
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-12 border-b-[8px] md:border-b-[24px] border-on-surface pb-6 md:pb-12 overflow-hidden relative">
              <div className="absolute bottom-[8px] md:bottom-[24px] left-0 w-full h-[1px] md:h-[2px] bg-primary-fixed/30 z-10" />

              <div className="max-w-full lg:max-w-5xl relative p-2 sm:p-4">
                <div className="absolute top-0 left-0 w-4 h-4 sm:w-8 sm:h-8 border-t-2 border-l-2 border-primary-fixed/20" />
                <div className="absolute top-0 right-0 w-2 h-4 sm:w-2 sm:h-8 border-t-2 border-r-2 border-primary-fixed/20" />

                <h1 className="text-[3.5rem] xs:text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-black font-heading uppercase tracking-tighter leading-[0.85] sm:leading-[0.75] text-on-surface relative flex flex-col">
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
                </h1>
              </div>

              <AnimatePresence>
                {isHeroComplete && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col items-start lg:items-end gap-3 sm:gap-6 lg:mb-4 px-2 sm:px-0 pb-4 sm:pb-0"
                  >
                    <Text path="productTexts.dropLabel" className="text-lg sm:text-2xl font-black bg-on-surface text-surface dark:bg-primary-fixed dark:text-on-surface px-4 sm:px-6 py-1 sm:py-2 uppercase rotate-1 brutal-shadow-primary dark:brutal-shadow inline-block" />
                    <Text path="productTexts.heroDescription" className="max-w-[280px] sm:max-w-md font-bold text-sm sm:text-xl leading-[1.1] text-left lg:text-right uppercase text-on-surface-variant" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* GUÍA VISUAL SIMPLE */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-20 hidden sm:block">
           <span className="text-[7px] font-mono font-black uppercase tracking-[0.5em] animate-pulse">Scroll_To_Access_Inventory</span>
        </div>
      </section>

      {/* SECCIÓN 2: HOW TO BUY */}
      <HowToBuy animated={animated} />

      {/* SECCIÓN 3: DROPS - TOTALMENTE ESTÁTICA */}
      <section className="bg-surface border-t-2 border-on-surface">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-16 md:py-24">
          {isHeroComplete && initialProducts && initialProducts.length > 0 && (
            <div className="mb-24" ref={latestRef}>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className={`text-[10px] font-mono font-black text-primary-fixed uppercase tracking-[0.3em] animate-badge ${animated ? 'opacity-0' : ''}`}>Novedades_Destacadas</span>
                  <h2 className="text-4xl sm:text-6xl font-black font-heading uppercase tracking-tighter">
                    <span className={`inline-block animate-title-part ${animated ? 'opacity-0' : ''}`}>Últimos</span>{' '}
                    <span className={`inline-block animate-title-part ${animated ? 'opacity-0' : ''}`}>Ingresos</span>
                  </h2>
                </div>
              </div>
              <ProductItemsGrid products={initialProducts} layout="carousel" isLatest={true} animated={animated} />
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
