"use client";

import { Text } from '@/components/ui/Text';
import { Product } from './types';
import Link from 'next/link';

export default function ProductCard({ product }: { product: Product }) {
  const suffix = product.id.toString().slice(-3).toUpperCase().padStart(3, "0");
  const systemId = `IDX.${product.name.substring(0, 3).toUpperCase()}.${suffix}`;

  return (
    <div className="group border-r border-b border-on-surface bg-surface flex flex-col relative overflow-hidden hover:bg-on-surface hover:text-surface transition-all duration-300">
      <Link href={`/${product.category.toLowerCase()}/product/${product.id}`} className="flex-grow flex flex-col">
        <div className="flex justify-between items-center px-3 py-1.5 border-b border-on-surface/10 font-mono text-[7px] font-black tracking-widest opacity-40">
          <span>{systemId}</span>
          <span className={`flex items-center gap-1 ${product.selled ? 'text-error' : 'text-success'}`}>
            <span className={`w-1 h-1 rounded-full ${product.selled ? 'bg-error' : 'bg-success animate-pulse'}`}></span>
            {product.selled ? "VENDIDO" : "DISPONIBLE"}
          </span>
        </div>

        <div className="aspect-square relative overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
          <img
            alt={product.name}
            src={Array.isArray(product.image) ? product.image[0] : product.image}
            className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-primary-fixed/0 group-hover:bg-primary-fixed/5 transition-colors" />

          {product.selled && (
            <div className="absolute top-10 -right-16 w-72 rotate-45 bg-error text-on-error border-y-4 border-on-surface font-black uppercase text-[10px] py-2 text-center tracking-[0.5em] z-10 shadow-[10px_10px_0px_0px_rgba(27,38,1,0.2)]">
              <div className="flex whitespace-nowrap justify-center items-center gap-8 pl-[0.5em]">
                <span>SELLED</span>
                <div className="w-1.5 h-1.5 bg-on-surface rotate-45" />
                <span>SELLED</span>
                <div className="w-1.5 h-1.5 bg-on-surface rotate-45" />
                <span>SELLED</span>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-grow border-t border-on-surface/10">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-black uppercase tracking-tighter leading-none group-hover:text-primary-fixed transition-colors">
              {product.name}
            </h3>
            <span className="text-[8px] font-mono opacity-30">v1.0</span>
          </div>
        </div>
      </Link>

      <div className="p-4 pt-0 mt-auto flex justify-between items-end">
        <div className="flex flex-col">
          <span className="text-[7px] font-mono opacity-30 uppercase">Price</span>
          <span className="text-xl font-black tabular-nums tracking-tighter text-primary-fixed">${product.price}</span>
        </div>

        {!product.selled && (
          <button className="bg-surface text-on-surface border-2 border-on-surface px-4 py-1.5 font-black uppercase text-[10px] brutal-shadow transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none hover:bg-primary-fixed">
            <Text path="productTexts.addButton" />
          </button>
        )}
      </div>
    </div>
  );
}