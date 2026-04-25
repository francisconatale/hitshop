"use client";

import React from 'react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

export function CartIcon() {
  const { toggleCart, itemCount } = useCart();

  return (
    <button 
      onClick={toggleCart}
      className="relative group p-2 hover:bg-on-surface/5 transition-colors rounded-none"
      title="Ver Carrito"
    >
      <span className="material-symbols-outlined text-3xl cursor-pointer">
        shopping_bag
      </span>
      {itemCount > 0 && (
        <span className={cn(
          "absolute top-0 right-0",
          "flex h-5 w-5 items-center justify-center",
          "rounded-none bg-primary-fixed text-[10px] font-black text-on-surface",
          "border-2 border-surface"
        )}>
          {itemCount}
        </span>
      )}
    </button>
  );
}
