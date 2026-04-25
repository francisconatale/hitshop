import ProductGrid from "@/components/product/ProductGrid";
import productsCollection from "@/lib/collections/ProductsCollection";
import { db } from "@/lib/firebase";

export default async function Home() {
  const products = await productsCollection.getProducts(db, false);
  
  return <ProductGrid initialProducts={products} />;
}