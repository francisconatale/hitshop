"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import PageLayout from '@/components/layout/PageLayout';
import Link from 'next/link';
import { Text } from '@/components/ui/Text';
import { useRouter } from 'next/navigation';

export default function SelectionPage() {
  const { items, removeFromCart, total } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <PageLayout>
        <div className="max-w-[1440px] mx-auto py-20 px-6 text-center space-y-8">
          <p className="font-mono text-xs uppercase tracking-[0.5em] opacity-40">SISTEMA VACÍO // NO HAY ACTIVOS SELECCIONADOS</p>
          <Link href="/" className="inline-block border-2 border-on-surface px-8 py-3 font-black uppercase text-xs tracking-widest hover:bg-on-surface hover:text-surface transition-all brutal-shadow">
            VOLVER AL INICIO
          </Link>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-[1440px] mx-auto py-2 md:py-4 px-6 lg:px-12">
        
        {/* Stepper */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="flex items-center gap-6 font-mono text-[9px] tracking-[0.4em]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-fixed"></span>
              <Text path="cartTexts.steps.selection" className="opacity-100 font-black text-on-surface" />
            </div>
            <span className="opacity-10">/</span>
            <div className="flex items-center gap-2 opacity-20">
              <span className="w-1.5 h-1.5 bg-on-surface"></span>
              <Text path="cartTexts.steps.validation" />
            </div>
            <span className="opacity-10">/</span>
            <div className="flex items-center gap-2 opacity-20">
              <span className="w-1.5 h-1.5 bg-on-surface"></span>
              <Text path="cartTexts.steps.procurement" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-on-surface shadow-2xl overflow-hidden max-h-[calc(100vh-200px)] lg:max-h-none">
          <div className="lg:col-span-8 bg-on-surface text-surface dark:bg-surface-container dark:text-on-surface p-6 md:p-8 space-y-8 order-2 lg:order-1 border-b-2 lg:border-b-0 lg:border-r-2 border-on-surface overflow-y-auto">
            <header className="flex items-baseline justify-between border-b border-surface/10 dark:border-on-surface/10 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-tighter italic flex items-baseline gap-4">
                Activos Seleccionados
                <span className="text-xs font-mono not-italic text-primary-fixed tracking-[0.3em]">0x{items.length}</span>
              </h2>
            </header>

            <div className="divide-y divide-surface/5 dark:divide-on-surface/5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 py-4 first:pt-0 group">
                  <div className="w-20 h-20 bg-surface dark:bg-surface-container p-3 flex-shrink-0 flex items-center justify-center border-2 border-primary-fixed/20 group-hover:border-primary-fixed transition-colors">
                    <img 
                      src={typeof item.image === 'string' ? item.image : item.image[0]} 
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110 duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-black uppercase tracking-tight leading-tight group-hover:text-primary-fixed transition-colors">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-surface/20 dark:text-on-surface/20 hover:text-error transition-colors p-1"
                        >
                          <span className="material-symbols-outlined text-sm">delete_forever</span>
                        </button>
                      </div>
                      <p className="text-[8px] font-mono text-primary-fixed/60 uppercase tracking-[0.3em]">{item.category} // SERIAL {item.id.substring(0,8)}</p>
                    </div>
                    <p className="text-xl font-black tabular-nums tracking-tighter">${item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-surface p-6 md:p-8 flex flex-col justify-between order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-2 h-2 bg-on-surface"></span>
                Resumen
              </h2>
              
              <div className="space-y-3 pt-4 border-t border-on-surface/10">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Subtotal</span>
                  <span className="text-lg font-black tabular-nums tracking-tighter">${total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Impuestos</span>
                  <span className="text-lg font-black tabular-nums tracking-tighter">$0</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t-2 border-on-surface">
                  <span className="text-[10px] font-mono font-black uppercase tracking-[0.3em]">Total</span>
                  <span className="text-3xl font-black tabular-nums tracking-tighter">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button 
                onClick={() => router.push('/checkout/validation')}
                className="w-full bg-on-surface text-surface border-2 border-on-surface py-4 font-black uppercase text-xs tracking-[0.4em] transition-all brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-4"
              >
                CONTINUAR A VALIDACIÓN
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
