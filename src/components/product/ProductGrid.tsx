"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import ScrambleText from '@/components/ui/ScrambleText';
import { Product, Print } from './types';
import { productTexts as texts } from '@/locales';
import { useSystem } from '@/context/SystemContext';

function ProductCard({ product }: { product: Product }) {
  const systemId = `IDX.${product.name.substring(0, 3).toUpperCase()}.${Math.floor(Math.random() * 999)}`;

  return (
    <div className="group border-r border-b border-on-surface bg-surface flex flex-col relative overflow-hidden hover:bg-on-surface hover:text-surface transition-all duration-300">
      <div className="flex justify-between items-center px-3 py-1.5 border-b border-on-surface/10 font-mono text-[7px] font-black tracking-widest opacity-40">
        <span>{systemId}</span>
        <span className="flex items-center gap-1">
          <span className="w-1 h-1 bg-primary-fixed animate-pulse"></span>
          ONLINE
        </span>
      </div>

      <div className="aspect-square relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
        <img
          alt={product.name}
          src={product.image}
          className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-primary-fixed/0 group-hover:bg-primary-fixed/5 transition-colors" />
      </div>
      
      <div className="p-4 flex flex-col flex-grow border-t border-on-surface/10">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-black uppercase tracking-tighter leading-none group-hover:text-primary-fixed transition-colors">
            {product.name}
          </h3>
          <span className="text-[8px] font-mono opacity-30">v1.0</span>
        </div>

        <div className="mt-auto flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[7px] font-mono opacity-30 uppercase">Price</span>
            <span className="text-xl font-black tabular-nums tracking-tighter text-primary-fixed">${product.price}</span>
          </div>
          
          <button className="bg-surface text-on-surface border-2 border-on-surface px-4 py-1.5 font-black uppercase text-[10px] brutal-shadow transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-primary-fixed">
            {texts.addButton}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrintCard({ print }: { print: Print }) {
  return (
    <div className="group border-r border-b border-on-surface p-3 flex flex-col bg-surface hover:bg-primary-container/5 transition-all">
      <div className="aspect-[4/5] bg-surface-container mb-3 border border-on-surface/10 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
        <img
          alt={print.name}
          src={print.image}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex justify-between items-end mt-auto">
        <div className="flex flex-col">
          <span className="text-[7px] font-mono opacity-30 uppercase">{print.series}</span>
          <h4 className="text-md font-black uppercase tracking-tighter">{print.name}</h4>
        </div>
        <span className="text-md font-black tabular-nums">${print.price}</span>
      </div>
    </div>
  );
}

export default function ProductGrid({ category }: { category?: string }) {
  const { productsData } = useSystem();
  const [isHeroComplete, setIsHeroComplete] = useState(false);

  // Memorizamos la función para que no cambie en cada renderizado
  const handleHeroComplete = useCallback(() => {
    setIsHeroComplete(true);
  }, []);

  if (category) {
    const categoryProducts = (productsData as any)[category] || [];

    return (
      <div className="max-w-[1440px] mx-auto my-6 px-4">
        <div className="border border-on-surface bg-surface flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 mb-0">
          <div className="flex items-center gap-4 mb-4 sm:mb-0">
             <div className="bg-on-surface text-surface p-2 aspect-square flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">
                  {category === 'cpus' ? 'developer_board' : category === 'gpus' ? 'memory' : 'inventory_2'}
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
              <span className="text-sm font-black">{categoryProducts.length}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[7px] opacity-30 uppercase">Status</span>
              <span className="text-sm font-black text-success">READY</span>
            </div>
          </div>
        </div>

        <div className="border-l border-t border-on-surface">
          {categoryProducts.length > 0 ? (
            <section className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}>
              {categoryProducts.map((item: any) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </section>
          ) : (
            <div className="py-24 border-r border-b border-on-surface flex flex-col items-center justify-center bg-surface">
              <p className="text-[10px] font-black uppercase opacity-20 font-mono tracking-[0.5em]">ERROR: Empty_Node_Buffer</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8 sm:py-12 overflow-hidden">
      {/* Title Sequence */}
      <div className="mb-24 sm:mb-32 relative">
        <div className="absolute -top-8 sm:-top-12 left-0 text-[7px] sm:text-[8px] font-mono font-black text-primary-dim/70 tracking-[0.2em] sm:tracking-[0.3em] uppercase flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1 sm:py-1.5 bg-primary/5 border-l-2 border-primary/30">
           {isHeroComplete ? "SYSTEM_STABLE // NO_ERRORS" : "DECRYPTING_PRIMARY_NODE..."}
           {!isHeroComplete && <span className="w-1.5 h-1.5 bg-primary-fixed animate-ping"></span>}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-12 border-b-[12px] md:border-b-[24px] border-on-surface pb-6 md:pb-12 overflow-hidden relative">
          {/* Neon Trace Line */}
          <div className="absolute bottom-[12px] md:bottom-[24px] left-0 w-full h-[2px] bg-primary-fixed/30 z-10" />

          <div className="max-w-full lg:max-w-5xl relative p-2 sm:p-4">
            {/* Subtle Corner Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 sm:w-8 sm:h-8 border-t-2 border-l-2 border-primary-fixed/20" />
            <div className="absolute top-0 right-0 w-2 h-4 sm:w-2 sm:h-8 border-t-2 border-r-2 border-primary-fixed/20" />

            <h1 className="text-[4.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-black uppercase tracking-tighter leading-[0.85] sm:leading-[0.75] text-on-surface relative">
              <span className="block">
                <ScrambleText text="SYSTEM" />
              </span>
              <span className="block">
                <ScrambleText 
                  text="HARDWARE" 
                  onComplete={handleHeroComplete}
                />
              </span>
              {/* Floating Tech Marker */}
              <span className="absolute -right-2 sm:-right-4 top-0 text-[7px] sm:text-[10px] font-mono text-primary-fixed/40 [writing-mode:vertical-lr]">
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
                <span className="text-xl sm:text-2xl font-black bg-on-surface text-surface px-4 sm:px-6 py-1 sm:py-2 uppercase rotate-1 brutal-shadow-primary">
                  {texts.dropLabel}
                </span>
                <p className="max-w-xs sm:max-w-md font-bold text-base sm:text-xl leading-[1.1] text-left lg:text-right uppercase text-on-surface-variant">
                  {texts.heroDescription}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Industrial Footer Status Entrance */}
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
