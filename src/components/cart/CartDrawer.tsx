"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export function CartDrawer() {
  const { items, isOpen, toggleCart, removeFromCart, clearCart, total } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[99998]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface border-l-2 border-on-surface z-[99999] flex flex-col brutal-shadow"
          >
            {/* Noise Texture */}
            <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

            {/* Header */}
            <div className="p-6 border-b-2 border-on-surface flex items-center justify-between bg-surface relative z-10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                <h2 className="text-xl font-black uppercase tracking-tighter leading-tight">System_Cart</h2>
                <span className="bg-on-surface text-surface text-[10px] font-mono px-2 py-0.5 tracking-widest">
                  [{items.length}]
                </span>
              </div>
              <button 
                onClick={toggleCart}
                className="p-1 border border-transparent hover:border-on-surface/20 hover:bg-on-surface/5 transition-colors active:scale-95 flex items-center justify-center"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent relative z-10">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <span className="material-symbols-outlined text-6xl">inventory_2</span>
                  <div className="space-y-1">
                    <p className="font-mono text-xs uppercase tracking-widest">NO_ASSETS_FOUND</p>
                    <p className="font-mono text-[9px] tracking-widest">Awaiting input sequence...</p>
                  </div>
                  <button 
                    onClick={toggleCart} 
                    className="mt-4 bg-surface text-on-surface border border-on-surface/20 px-4 py-2 font-black uppercase text-[10px] tracking-widest transition-all hover:bg-on-surface hover:text-surface active:scale-95"
                  >
                    Return to Grid
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="group relative">
                      <Link 
                        href={`/${item.category.toLowerCase()}/product/${item.id}`}
                        onClick={toggleCart}
                        className="flex gap-4 p-3 border border-on-surface/10 bg-surface group-hover:border-on-surface transition-colors relative overflow-hidden"
                      >
                        <div className="w-16 h-16 bg-on-surface/[0.02] flex-shrink-0 flex items-center justify-center p-2 relative">
                          <img 
                            src={typeof item.image === 'string' ? item.image : item.image[0]} 
                            alt={item.name}
                            className="w-full h-full object-contain mix-blend-multiply"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <span className="text-[7px] font-mono opacity-40 uppercase tracking-[0.2em] block mb-1">
                              {item.category} // 0x{item.id.toString().substring(0,4)}
                            </span>
                            <h3 className="font-black text-sm uppercase leading-tight tracking-tighter line-clamp-1">
                              {item.name}
                            </h3>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-black tabular-nums tracking-tighter text-on-surface">
                              ${item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFromCart(item.id);
                        }}
                        className="absolute bottom-4 right-4 text-on-surface/40 hover:text-error transition-colors p-1 flex items-center justify-center z-20"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t-2 border-on-surface bg-surface space-y-4 relative z-10">
                <div className="flex flex-col mb-4">
                  <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest mb-1">Total_Valuation</span>
                  <span className="text-3xl font-black tabular-nums tracking-tighter text-on-surface">
                    ${total.toLocaleString()}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={clearCart}
                    className="w-full bg-surface text-on-surface border border-on-surface px-3 py-3 font-black uppercase text-[10px] tracking-widest transition-all hover:bg-on-surface hover:text-surface active:scale-95"
                  >
                    Clear_Mem
                  </button>
                  <button className="w-full bg-primary-fixed text-on-surface border-2 border-on-surface px-3 py-3 font-black uppercase text-[10px] tracking-widest transition-all brutal-shadow-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-[0.98]">
                    Execute_Node
                  </button>
                </div>
                
                <div className="pt-2 border-t border-on-surface/10 flex justify-center">
                  <p className="text-[7px] font-mono opacity-40 uppercase tracking-[0.3em]">
                    End-to-end encrypted transaction
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
