import { Product, PublicProduct } from "./types";
import { Text } from "@/components/ui/Text";

export default function ProductDetails({ product }: { product: Product | PublicProduct }) {
  const isSelled = product.selled;
  const images = Array.isArray(product.image) ? product.image : [product.image];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-surface">
      <div className="aspect-square relative overflow-hidden bg-on-surface/5 border-b md:border-b-0 md:border-r border-on-surface">
        <img
          src={images[0]}
          alt={product.name}
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
        />
        {isSelled && (
           <div className="absolute top-10 -right-16 w-72 rotate-45 bg-error text-on-error border-y-4 border-on-surface font-black uppercase text-[10px] py-2 text-center tracking-[0.5em] z-10">
           <span>SELLED</span>
         </div>
        )}
      </div>

      <div className="p-8 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">
              {product.name}
            </h1>
            <span className="text-[10px] font-mono opacity-30 mt-2">v1.0.42</span>
          </div>

          <p className="text-on-surface/70 font-medium mb-8 leading-relaxed max-w-md">
            {"description" in product ? product.description : "No description available for this unit. High-performance components guaranteed."}
          </p>

          <div className="flex flex-col mb-8">
            <span className="text-[10px] font-mono opacity-30 uppercase mb-1">Price Unit</span>
            <span className="text-4xl font-black tabular-nums tracking-tighter text-primary-fixed">
              ${product.price}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {!isSelled ? (
            <button className="w-full bg-primary-fixed text-on-primary-fixed border-4 border-on-surface px-8 py-4 font-black uppercase text-sm brutal-shadow transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
              <Text path="productTexts.addButton" />
            </button>
          ) : (
            <div className="w-full bg-error/10 text-error border-4 border-error px-8 py-4 font-black uppercase text-sm text-center">
              Out of Stock / Sold Out
            </div>
          )}
          
          <button className="w-full bg-surface text-on-surface border-4 border-on-surface px-8 py-4 font-black uppercase text-sm brutal-shadow transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}