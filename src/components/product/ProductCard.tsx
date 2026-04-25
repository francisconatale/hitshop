"use client";

import { Text } from '@/components/ui/Text';
import { Product, PublicProduct } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Flame, Trophy } from '@phosphor-icons/react';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }: { product: Product | PublicProduct }) {
  const { addToCart } = useCart();
  const suffix = product.id.toString().slice(-3).toUpperCase().padStart(3, "0");
  const systemId = `IDX.${product.name.substring(0, 3).toUpperCase()}.${suffix}`;

  // Simulated marketing data
  const originalPrice = Math.round(product.price * 1.25);
  const rating = 4.5;
  const isPopular = Number(product.id) % 3 === 0;
  const isLowStock = Number(product.id) % 4 === 0 && !product.selled;

  return (
    <div className="group border-r border-b border-on-surface/10 bg-surface flex flex-col relative overflow-hidden transition-all duration-300 hover:bg-on-surface/[0.02]">
      <Link href={`/${product.category.toLowerCase()}/product/${product.id}`} className="flex-grow flex flex-col">
        <div className="flex justify-between items-center px-3 py-2 border-b border-on-surface/5 font-mono text-[7px] font-bold tracking-[0.2em] opacity-20">
          <span>{systemId}</span>
          {!product.selled && <span className="text-success flex items-center gap-1">AVAILABLE</span>}
        </div>

        <div className="aspect-square relative overflow-hidden transition-all duration-700 p-4">
          <Image
            alt={product.name}
            src={product.image[0]}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain mix-blend-multiply scale-100 group-hover:scale-105 transition-transform duration-700 p-4"
          />

          {/* Subtle Badges */}
          {!product.selled && (
            <div className="absolute top-4 left-4 flex flex-col gap-1 z-30 pointer-events-none">
              {isPopular && (
                <div className="flex items-center gap-1 bg-on-surface text-surface px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest border border-on-surface/10">
                  <Trophy size={8} weight="fill" />
                  POPULAR
                </div>
              )}
              {isLowStock && (
                <div className="flex items-center gap-1 bg-on-surface/5 text-on-surface px-1.5 py-0.5 text-[7px] font-black uppercase tracking-widest border border-on-surface/10">
                  <Flame size={8} weight="fill" />
                  LOW_STOCK
                </div>
              )}
            </div>
          )}

          {product.selled && (
            <div className="absolute inset-0 bg-surface/80 backdrop-blur-[2px] flex items-center justify-center z-40 pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] border-y border-on-surface/20 py-1 px-4 opacity-40">
                OUT_OF_STOCK
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow border-t border-on-surface/5">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-black uppercase tracking-tighter leading-tight text-on-surface/80 group-hover:text-on-surface transition-colors">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={8} weight={i < 4 ? "fill" : "regular"} />
              ))}
            </div>
            <span className="text-[7px] font-mono tracking-tighter">REF_{rating}</span>
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0 mt-auto flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[7px] font-mono opacity-20 uppercase tracking-widest">Valuation</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black tabular-nums tracking-tighter text-on-surface">${product.price}</span>
            <span className="text-[10px] font-mono opacity-10 line-through tracking-tighter">${originalPrice}</span>
          </div>
        </div>

        {!product.selled && (
          <button 
            onClick={() => addToCart(product as PublicProduct)}
            className="bg-surface text-on-surface border border-on-surface/20 px-3 py-1 font-black uppercase text-[9px] tracking-widest transition-all hover:bg-on-surface hover:text-surface active:scale-95"
          >
            <Text path="productTexts.addButton" />
          </button>
        )}
      </div>
    </div>
  );
}
