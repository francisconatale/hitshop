import { db } from "@/lib/firebase";
import ProductsCollection from "@/lib/collections/ProductsCollection";
import ProductDetails from "@/components/product/ProductDetails";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { category, id } = await params;
  
  const product = await ProductsCollection.getProductById(db, id, false);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto mb-6">
        <Link 
          href={`/${category.toLowerCase()}`}
          className="inline-flex items-center gap-2 bg-on-surface text-surface px-4 py-2 font-mono text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-fixed hover:text-on-primary-fixed transition-colors brutal-shadow-primary"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to_{category.toUpperCase()}
        </Link>
      </div>

      <div className="max-w-5xl mx-auto border-4 border-on-surface brutal-shadow">
        <ProductDetails product={product} />
      </div>

      <div className="max-w-5xl mx-auto mt-6 flex justify-between items-center font-mono text-[8px] opacity-30 uppercase tracking-[0.3em]">
        <span>Route: /{category}/product/{id}</span>
        <span>Status: Viewing_Asset</span>
      </div>
    </div>
  );
}
