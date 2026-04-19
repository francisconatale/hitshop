"use client";

import Layout from "@/components/Layout";
import ProductGrid from "@/components/ProductGrid";
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

  // Validamos si la categoría existe en nuestro estado global
  if (categories.length > 0 && !categories.includes(category.toLowerCase())) {
    notFound();
  }

  return (
    <Layout>
      <ProductGrid category={category.toLowerCase() as any} />
    </Layout>
  );
}
