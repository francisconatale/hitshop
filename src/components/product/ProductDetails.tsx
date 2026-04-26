"use client";

import { Product, PublicProduct } from "@/types/product";
import { Text } from "@/components/ui/Text";
import { ShieldCheck, Storefront, HandCoins, Info } from "@phosphor-icons/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { RatingStars } from "@/components/ui/RatingStars";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ProductDetails({ product }: { product: Product | PublicProduct }) {
  const { addToCart, items, removeFromCart } = useCart();
  const isInCart = items.some(item => item.id === product.id);
  const isSelled = product.selled;
  const images = product.image;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [showFullDesc, setShowFullDesc] = useState(false);

  // Optimistic Greed Counter
  const [extraGreed, setExtraGreed] = useState(0);
  const greedLevel = ((product as PublicProduct).greedCounter || 0) + extraGreed;

  useEffect(() => {
    const handleIncrement = (e: any) => {
      if (e.detail?.productId === product.id) {
        setExtraGreed(prev => prev + 1);
      }
    };
    window.addEventListener('product-greed-increment', handleIncrement);
    return () => window.removeEventListener('product-greed-increment', handleIncrement);
  }, [product.id]);

  const carouselOpts = useMemo(() => ({ 
    loop: true,
    duration: 20,
    skipSnaps: true,
  }), []);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    api.on("reInit", onSelect);

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  const scrollTo = (index: number) => api?.scrollTo(index, true); 

  const originalPrice = Math.round(product.price * 1.25);
  const rating = product.rating || 0;

  const description = product.description || "High-performance silicon unit optimized for extreme throughput and thermal efficiency.";
  const truncatedDesc = description.length > 200 ? description.slice(0, 200) + "..." : description;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-surface">
      {/* Image Section - 5 Columns on desktop */}
      <div className="lg:col-span-5 relative flex flex-col border-b lg:border-b-0 lg:border-r border-on-surface/10 bg-on-surface/[0.01]">
        <div className="relative w-full flex-grow flex flex-col p-6 sm:p-8 lg:p-12">
          <Carousel 
            setApi={setApi} 
            className="w-full relative px-4 sm:px-12" 
            opts={carouselOpts}
          >
            <CarouselContent className="ml-0">
              {images.map((img, i) => (
                <CarouselItem key={i} className="pl-0 aspect-square flex items-center justify-center relative">
                  <Image
                    src={img}
                    alt={`${product.name} - image ${i + 1}`}
                    fill
                    className="object-contain mix-blend-multiply p-4"
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-0 h-10 w-10 border-on-surface/20 bg-surface text-on-surface hover:bg-on-surface hover:text-surface transition-all active:scale-90 z-1 rounded-none" />
                <CarouselNext className="right-0 h-10 w-10 border-on-surface/20 bg-surface text-on-surface hover:bg-on-surface hover:text-surface transition-all active:scale-90 z-1 rounded-none" />
              </>
            )}
          </Carousel>

          {isSelled && (
            <div className="absolute top-12 -right-20 w-80 rotate-45 bg-error/40 text-on-error border-y-2 border-on-surface/20 font-black uppercase text-[10px] py-3 text-center tracking-[0.8em] z-20 pointer-events-none backdrop-blur-sm">
              <span>UNAVAILABLE</span>
            </div>
          )}
        </div>

        {/* Technical Description moved here to fill space */}
        <div className="p-8 lg:p-12 pt-0 mt-auto border-t border-on-surface/5">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono opacity-40 uppercase tracking-[0.2em]">Technical_Description</span>
              <span className="text-[7px] font-mono opacity-20 uppercase tracking-[0.3em]">Module_0x{product.id.toString().substring(0,4)}</span>
            </div>
            <p className="text-on-surface/60 font-mono text-[10px] uppercase leading-relaxed tracking-tight">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Info Section - 7 Columns on desktop */}
      <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col">
        <div className="flex-grow">
          {/* 1. Header Block */}
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-[9px] font-mono opacity-40 uppercase tracking-[0.2em]">Hardware_Asset</span>
            <h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-tight text-on-surface">
              {product.name}
            </h1>
          </div>

          {/* 2. Rating Block */}
          <div className="flex items-center gap-3 mb-8">
            <RatingStars rating={rating} />
            <span className="text-[9px] font-mono font-bold opacity-40">
              {rating.toFixed(1)} // VERIFIED_ASSET
            </span>
          </div>

          {/* 3. Transaction Block (Price + Trust) */}
          <div className="mb-8 p-6 border border-on-surface/10 bg-on-surface/[0.02] relative overflow-hidden">
            {/* Contextual Demand Status */}
            {greedLevel > 0 && !isSelled && (
              <div className={cn(
                "absolute top-0 right-0 bg-primary-fixed text-on-surface px-3 py-1 text-[8px] font-black uppercase tracking-widest border-l border-b border-on-surface/10 transition-all duration-500",
                extraGreed > 0 ? "animate-pulse scale-110" : ""
              )}>
                TENDENCIA: {greedLevel} PERSONAS INTERESADAS
              </div>
            )}

            <div className="flex flex-col mb-6">
              <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest mb-1">Valuation</span>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl sm:text-6xl font-black tabular-nums tracking-tighter text-on-surface">
                  ${product.price}
                </span>
                <span className="text-lg sm:text-2xl font-mono opacity-20 line-through tracking-tighter">
                  ${originalPrice}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 border-y border-on-surface/10">
              <div className="flex items-center gap-2">
                <Storefront size={18} weight="duotone" className="text-on-surface opacity-40" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Retiro Inmediato</span>
              </div>
              <div className="w-[1px] h-3 bg-on-surface/20" />
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} weight="duotone" className="text-on-surface opacity-40" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Garantía Directa</span>
              </div>
            </div>
          </div>

          {/* 4. Action Block */}
          <div className="space-y-4">
            {!isSelled ? (
              <button 
                onClick={() => isInCart ? removeFromCart(product.id) : addToCart(product as PublicProduct)}
                className={cn(
                  "group w-full px-8 py-5 font-black uppercase text-sm tracking-widest transition-all active:scale-[0.98] border-2 border-on-surface",
                  isInCart 
                    ? "bg-surface text-on-surface hover:bg-on-surface/5" 
                    : "bg-primary-fixed text-on-surface brutal-shadow-primary hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
                )}
              >
                <div className="flex items-center justify-center gap-3">
                  {isInCart ? (
                    <>
                      <span className="material-symbols-outlined">delete</span>
                      <span>Remove_Asset</span>
                    </>
                  ) : (
                    <>
                      <HandCoins size={20} weight="bold" />
                      <Text path="productTexts.addButton" />
                    </>
                  )}
                </div>
              </button>
            ) : (
              <div className="w-full bg-on-surface/5 text-on-surface/30 border border-on-surface/10 px-8 py-5 font-black uppercase text-xs text-center tracking-[0.4em]">
                SOLD OUT
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
