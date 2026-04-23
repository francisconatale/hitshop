import { db } from "@/lib/firebase";
import productsCollection from "@/lib/collections/ProductsCollection";
import ProductItemsGrid from "./ProductItemsGrid";
import { SyncSystemState } from "./ProductGrid";

interface ProductListFetcherProps {
  category: string;
}

export default async function ProductListFetcher({ category }: ProductListFetcherProps) {
  const products = await productsCollection.getProductsByCategory(db, category.toLowerCase(), false);

  return (
    <div className="max-w-[1440px] mx-auto mb-6 px-4">
      <SyncSystemState category={category} products={products} />
      <ProductItemsGrid products={products} />
    </div>
  );
}
