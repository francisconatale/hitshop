import { db } from "@/lib/firebase";
import ProductsCollection from "@/lib/collections/ProductsCollection";
import { notFound } from "next/navigation";
import ProductPageClient from "@/components/product/ProductPageClient";

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { category, id } = await params;
  
  const product = await ProductsCollection.getProductById(db, id, false);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} category={category} />;
}
