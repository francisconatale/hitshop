import ProductCard from "./ProductCard";
import { Product, PublicProduct } from "@/types/product";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductItemsGridProps {
  products: (Product | PublicProduct)[];
  layout?: "grid" | "carousel";
}

export default function ProductItemsGrid({ products, layout = "grid" }: ProductItemsGridProps) {
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
      <div className="relative group/carousel">
        <Carousel
          opts={carouselOpts}
          className="w-full"
        >
          <CarouselContent className="-ml-0">
            {sortedProducts.map((item) => (
              <CarouselItem key={item.id} className="pl-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={item} />
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
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-on-surface">
      {sortedProducts.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </section>
  );
}
