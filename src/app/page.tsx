import ProductGrid from "@/components/product/ProductGrid";
import productsCollection from "@/lib/collections/ProductsCollection";
import { db } from "@/lib/firebase";
import TradeInPromo from "@/components/layout/TradeInPromo";

export default async function Home() {
  const products = await productsCollection.getProducts(db, false);

  return (
    <div className="relative">
      <ProductGrid initialProducts={products} animated={true} />

      <TradeInPromo animated={true} />
    </div>
  );
}