"use client";

import ProductGrid from "@/components/product/ProductGrid";
import { notFound } from "next/navigation";
import { useSystem } from "@/context/SystemContext";
import { use } from "react";

export default function DynamicCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);
  const { categories } = useSystem();

  if (categories.length > 0 && !categories.includes(category.toLowerCase())) {
    notFound();
  }

  return <ProductGrid category={category.toLowerCase() as any} />;
}
