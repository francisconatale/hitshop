"use client";

import { Product, PublicProduct } from "@/types/product";
import { Text } from "@/components/ui/Text";
import { Star, ShieldCheck, Storefront, HandCoins, Info, ArrowRight } from "@phosphor-icons/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetails({ product }: { product: Product | PublicProduct }) {
  const isSelled = product.selled;
  const images = product.image;
  const [activeImage, setActiveImage] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Simulated marketing data
  const originalPrice = Math.round(product.price * 1.25);
  const rating = 4.9;
  
  const description = product.description || "High-performance silicon unit optimized for extreme throughput and thermal efficiency.";
  const truncatedDesc = description.length > 200 ? description.slice(0, 200) + "..." : description;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-surface">
      {/* Image Section - 5 Columns on desktop, full width on mobile/tablet */}
      <div className="lg:col-span-5 relative flex flex-col border-b lg:border-b-0 lg:border-r border-on-surface/5 bg-on-surface/[0.01]">
        <div className="relative aspect-square sm:aspect-[4/3] md:aspect-video lg:aspect-square w-full overflow-hidden flex items-center justify-center p-6 sm:p-8 lg:p-12">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              src={images[activeImage]}
              alt={product.name}
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
            />
          </AnimatePresence>
          
          {isSelled && (
            <div className="absolute top-12 -right-20 w-80 rotate-45 bg-error text-on-error border-y-2 border-on-surface/20 font-black uppercase text-[10px] py-3 text-center tracking-[0.5em] z-20">
              <span>UNAVAILABLE</span>
            </div>
          )}
        </div>

        {/* Thumbnail Track */}
        {images.length > 1 && (
          <div className="p-4 border-t border-on-surface/5 flex gap-3 overflow-x-auto no-scrollbar justify-center">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 border transition-all duration-300 ${
                  activeImage === i ? "border-on-surface scale-105" : "border-on-surface/10 grayscale opacity-40 hover:opacity-100"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Section - 7 Columns on desktop, full width on mobile/tablet */}
      <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col">
        <div className="flex-grow">
          <div className="flex flex-col gap-1 mb-6">
            <span className="text-[10px] font-mono opacity-20 uppercase tracking-[0.2em]">Hardware_Asset</span>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight text-on-surface">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} weight={i < 4 ? "fill" : "regular"} className="text-on-surface" />
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold opacity-30">
              {rating} // VERIFIED_ASSET
            </span>
          </div>

          <div className="mb-10">
            <p className="text-on-surface/60 font-medium leading-relaxed text-sm">
              {showFullDesc ? description : truncatedDesc}
            </p>
            {description.length > 200 && (
              <button 
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="group flex items-center gap-2 text-[9px] font-black uppercase tracking-widest mt-3 border-b border-on-surface/20 hover:border-on-surface transition-all"
              >
                <span>{showFullDesc ? "LESS" : "MORE DETAILS"}</span>
                <ArrowRight className={`transition-transform duration-300 ${showFullDesc ? "-rotate-90" : ""}`} />
              </button>
            )}
          </div>

          <div className="flex flex-col mb-10">
            <span className="text-[10px] font-mono opacity-20 uppercase tracking-widest mb-1">Valuation</span>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter text-on-surface">
                ${product.price}
              </span>
              <span className="text-lg sm:text-xl font-mono opacity-10 line-through tracking-tighter">
                ${originalPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Action Layer */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 py-4 border-y border-on-surface/5">
            <div className="flex items-center gap-2">
              <Storefront size={18} weight="duotone" className="text-on-surface opacity-40" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Retiro Inmediato</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-on-surface/10" />
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} weight="duotone" className="text-on-surface opacity-40" />
              <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Garantía Directa</span>
            </div>
          </div>

          {!isSelled ? (
            <button className="group w-full bg-on-surface text-surface px-8 py-5 font-black uppercase text-sm tracking-widest transition-all active:scale-[0.98] brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
              <div className="flex items-center justify-center gap-3">
                <HandCoins size={20} weight="bold" />
                <Text path="productTexts.addButton" />
              </div>
            </button>
          ) : (
            <div className="w-full bg-on-surface/5 text-on-surface/30 border border-on-surface/10 px-8 py-5 font-black uppercase text-xs text-center tracking-widest">
              SOLD OUT
            </div>
          )}
          
          <button className="w-full bg-surface text-on-surface border border-on-surface/10 px-8 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-on-surface/5 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
            <Info size={16} weight="bold" className="opacity-30" />
            Consultar Ubicación
          </button>
        </div>
      </div>
    </div>
  );
}