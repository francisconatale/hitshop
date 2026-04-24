import { Suspense } from "react";
import ProductListFetcher from "@/components/product/ProductListFetcher";
import { ProductGridSkeleton } from "@/components/product/ProductSkeleton";
import { CategoryHeader } from "@/components/product/ProductGrid";
import { notFound } from "next/navigation";

const VALID_CATEGORIES = ['gpus'];

export default async function DynamicCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const lowerCategory = category.toLowerCase();

  if (!VALID_CATEGORIES.includes(lowerCategory)) {
    notFound();
  }

  return (
    <>
      <CategoryHeader category={lowerCategory} />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductListFetcher category={lowerCategory} />
      </Suspense>
    </>
  );
}
