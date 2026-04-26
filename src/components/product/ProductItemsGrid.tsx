"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ProductCard from "./ProductCard";
import { Product, PublicProduct } from "@/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Register ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductItemsGridProps {
  products: (Product | PublicProduct)[];
  layout?: "grid" | "carousel";
  isLatest?: boolean;
}

export default function ProductItemsGrid({ products, layout = "grid", isLatest = false }: ProductItemsGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || products.length === 0) return;

    const items = containerRef.current.querySelectorAll(".product-card-container");
    gsap.fromTo(items, 
      { 
        opacity: 0, 
        y: 20,
        filter: "blur(10px)"
      }, 
      { 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)",
        duration: 0.6, 
        stagger: 0.1, 
        ease: "power2.out",
        scrollTrigger: layout === "grid" ? {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none none"
        } : undefined
      }
    );
  }, { scope: containerRef, dependencies: [products] });

  const carouselOpts = {
    align: "start" as const,
    loop: true,
  };

  if (products.length === 0) {
    return (
      <div className="py-24 border-r border-b border-on-surface flex flex-col items-center justify-center bg-surface">
        <p className="text-[10px] font-black uppercase opacity-20 font-mono tracking-[0.5em]">ERROR: Empty_Node_Buffer</p>
      </div>
    );
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (a.selled === b.selled) return 0;
    return a.selled ? 1 : -1;
  });

  if (layout === "carousel") {
    return (
      <div className="relative group/carousel" ref={containerRef}>
        <Carousel
          opts={carouselOpts}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {sortedProducts.map((item) => (
              <CarouselItem key={item.id} className="pl-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 product-card-container">
                <ProductCard product={item} isLatest={isLatest} />
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {products.length > 4 && (
            <div className="absolute -top-12 right-12 flex gap-2">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 border-on-surface" />
              <CarouselNext className="static translate-y-0 h-10 w-10 border-on-surface" />
            </div>
          )}
        </Carousel>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-on-surface" ref={containerRef}>
      {sortedProducts.map((item) => (
        <div key={item.id} className="product-card-container">
          <ProductCard product={item} isLatest={isLatest} />
        </div>
      ))}
    </section>
  );
}
