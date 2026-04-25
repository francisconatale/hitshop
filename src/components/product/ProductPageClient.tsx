"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductDetails from "@/components/product/ProductDetails";
import { EditProductForm } from "@/components/product/EditProductForm";
import { Product, PublicProduct } from "@/types/product";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import productsCollection from "@/lib/collections/ProductsCollection";

interface ProductPageClientProps {
  product: Product | PublicProduct;
  category: string;
}

export default function ProductPageClient({ product, category }: ProductPageClientProps) {
  const { userData } = useAuth();
  const isAdmin = userData?.role === 'admin';
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [fullProduct, setFullProduct] = useState<Product | null>(null);

  const handleEditClick = async () => {
    if ('purchasePrice' in product) {
      setFullProduct(product as Product);
      setIsEditing(true);
      return;
    }
    
    try {
      setIsLoadingEdit(true);
      const full = await productsCollection.getProductById(db, product.id, true);
      if (full && 'purchasePrice' in full) {
        setFullProduct(full as Product);
        setIsEditing(true);
      } else {
        alert("No se pudieron cargar los datos privados del producto.");
      }
    } catch (error) {
      console.error("Error fetching full product:", error);
      alert("Error al cargar los datos para edición.");
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.")) return;
    
    try {
      setIsDeleting(true);
      await productsCollection.deleteProduct(db, product.id);
      router.push(`/${category.toLowerCase()}`);
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
      setIsDeleting(false);
      alert("Error al eliminar el producto");
    }
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-on-surface selection:text-surface">
      <div className="max-w-[1440px] mx-auto pt-4 pb-12 px-4 md:px-8">
        
        {isAdmin && (
          <div className="mb-4 flex gap-4 justify-end">
            {!isEditing ? (
              <button
                onClick={handleEditClick}
                disabled={isLoadingEdit}
                className="flex items-center gap-2 px-4 py-2 bg-primary-fixed text-on-primary-fixed text-[10px] font-black uppercase tracking-widest brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-sm">{isLoadingEdit ? "sync" : "edit"}</span>
                {isLoadingEdit ? "Cargando..." : "Editar Producto"}
              </button>
            ) : null}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-error text-on-error text-[10px] font-black uppercase tracking-widest brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">{isDeleting ? "sync" : "delete"}</span>
              {isDeleting ? "Eliminando..." : "Eliminar Producto"}
            </button>
          </div>
        )}

        {/* Product Container */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="bg-surface border border-on-surface/10 brutal-shadow-primary">
            {isEditing && fullProduct ? (
              <EditProductForm 
                product={fullProduct} 
                onCancel={() => setIsEditing(false)} 
                onSuccess={() => {
                  setIsEditing(false);
                  router.refresh();
                }} 
              />
            ) : (
              <ProductDetails product={product} />
            )}
          </div>
        </motion.div>

        {/* Minimal Footer Metadata */}
        <div className="mt-6 flex justify-between items-center font-mono text-[7px] opacity-40 uppercase tracking-[0.3em]">
          <span>Trace: node_0x{product.id.toString().substring(0,6)}...</span>
          <span>Asset: {product.name} // V1.0</span>
        </div>
      </div>
    </div>
  );
}
