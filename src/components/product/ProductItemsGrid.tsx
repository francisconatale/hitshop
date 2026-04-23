import ProductCard from "./ProductCard";
import { Product, PublicProduct } from "./types";

interface ProductItemsGridProps {
  products: (Product | PublicProduct)[];
}

export default function ProductItemsGrid({ products }: ProductItemsGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-24 border-r border-b border-on-surface flex flex-col items-center justify-center bg-surface">
        <p className="text-[10px] font-black uppercase opacity-20 font-mono tracking-[0.5em]">ERROR: Empty_Node_Buffer</p>
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-l border-t border-on-surface">
      {products.map((item) => (
        <ProductCard key={item.id} product={item} />
      ))}
    </section>
  );
}
