"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import productsCollection from "@/lib/collections/ProductsCollection";
import { Product, UpdateProductRequest } from "@/types/product";
import { ProductValidationErrors, validateProduct, isProductValid } from "@/lib/validation/product";

export function useEditProduct(initialProduct: Product) {
  const [form, setForm] = useState<UpdateProductRequest>({
    id: initialProduct.id,
    name: initialProduct.name,
    description: initialProduct.description || "",
    price: initialProduct.price,
    purchasePrice: initialProduct.purchasePrice || 0,
    margin: initialProduct.margin || 0,
    image: initialProduct.image || [],
    category: initialProduct.category,
    selled: initialProduct.selled || false,
    rating: initialProduct.rating || 0,
  });
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<ProductValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const setField = <K extends keyof UpdateProductRequest>(key: K, value: UpdateProductRequest[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const next = { ...prev }; delete next[key as keyof ProductValidationErrors]; return next; });
  };

  const addImage = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setField("image", [...(form.image || []), trimmed]);
    setImageInput("");
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      
      if (!res.ok) throw new Error("Upload failed");
      
      const { secure_url } = await res.json();
      addImage(secure_url);
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      setErrors(prev => ({ ...prev, image: "Error al subir la imagen" }));
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setField("image", (form.image || []).filter((_, i) => i !== index));
  };

  const submit = async () => {
    const validationErrors = validateProduct(form as any);

    if (!isProductValid(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      await productsCollection.updateProduct(db, form.id, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    imageInput,
    setImageInput,
    errors,
    saving,
    uploading,
    success,
    setField,
    addImage,
    handleFileUpload,
    removeImage,
    submit,
  };
}
