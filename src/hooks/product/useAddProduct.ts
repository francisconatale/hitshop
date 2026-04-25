"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import productsCollection from "@/lib/collections/ProductsCollection";
import { ProductAdminRequest } from "@/types/product";
import { ProductValidationErrors, validateProduct, isProductValid } from "@/lib/validation/product";
import { useSystem } from "@/context/SystemContext";

const EMPTY_FORM: Omit<ProductAdminRequest, 'category'> = {
  name: "",
  description: "",
  price: 0,
  purchasePrice: 0,
  margin: 0,
  image: [],
  selled: false,
  rating: 0,
};

export function useAddProduct() {
  const pathname = usePathname();
  const category = pathname.split("/").filter(Boolean)[0] ?? "";
  const { addProductToState } = useSystem();

  const [form, setForm] = useState(EMPTY_FORM);
  const [imageInput, setImageInput] = useState("");
  const [errors, setErrors] = useState<ProductValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const setField = <K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => { const next = { ...prev }; delete next[key as keyof ProductValidationErrors]; return next; });
  };

  const addImage = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setField("image", [...form.image, trimmed]);
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
    setField("image", form.image.filter((_, i) => i !== index));
  };

  const reset = () => {
    setForm(EMPTY_FORM);
    setImageInput("");
    setErrors({});
    setSuccess(false);
  };

  const submit = async () => {
    const request: ProductAdminRequest = { ...form, category };
    const validationErrors = validateProduct(request);

    if (!isProductValid(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      const id = await productsCollection.createProduct(db, request);
      // Añadir el nuevo producto al estado local inmediatamente (sin refetch)
      addProductToState(category, { ...request, id });
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error creating product:", error);
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
    category,
    setField,
    addImage,
    handleFileUpload,
    removeImage,
    submit,
    reset,
  };
}
