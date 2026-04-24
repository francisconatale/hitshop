"use client";

import { db } from "@/lib/firebase";
import ProductsCollection from "@/lib/collections/ProductsCollection";
import ProductDetails from "@/components/product/ProductDetails";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Product, PublicProduct } from "@/types/product";

interface PageProps {
  params: Promise<{ category: string; id: string }>;
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | PublicProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  useEffect(() => {
    params.then(async (p) => {
      setCategory(p.category);
      const data = await ProductsCollection.getProductById(db, p.id, false);
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    });
  }, [params]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-8 h-8 border-2 border-on-surface/20 border-t-on-surface animate-spin" />
    </div>
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface selection:bg-on-surface selection:text-surface">
      <div className="container mx-auto py-12 px-4">
        {/* Simplified Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <Link 
            href={`/${category.toLowerCase()}`}
            className="inline-flex items-center gap-2 text-on-surface/40 hover:text-on-surface transition-colors font-mono text-[10px] uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" />
            <span>{category}</span>
          </Link>
        </motion.div>

        {/* Product Container */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-surface border border-on-surface/10 brutal-shadow">
            <ProductDetails product={product} />
          </div>
        </motion.div>

        {/* Minimal Footer */}
        <div className="max-w-6xl mx-auto mt-8 flex justify-between items-center font-mono text-[8px] opacity-10 uppercase tracking-widest">
          <span>{product.name}</span>
          <span>Asset_V1.0</span>
        </div>
      </div>
    </div>
  );
}