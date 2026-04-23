"use client";

import { useState } from "react";
import { useAddProduct } from "@/hooks/product/useAddProduct";

const inputClass =
  "w-full bg-surface border border-on-surface/20 focus:border-primary-fixed outline-none px-3 py-2 text-sm font-mono uppercase tracking-widest placeholder:opacity-30 placeholder:normal-case placeholder:tracking-normal transition-colors";

const labelClass = "text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1 block";

const errorClass = "text-[9px] font-black uppercase tracking-widest text-error mt-1";

interface AddProductFormProps {
  onSuccess?: () => void;
}

export function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [open, setOpen] = useState(false);
  const { form, imageInput, setImageInput, errors, saving, success, category, setField, addImage, removeImage, submit } =
    useAddProduct();

  const handleSubmit = async () => {
    await submit();
    if (onSuccess) onSuccess();
  };

  return (
    <div className="border border-on-surface/20 bg-surface mb-0">
      {/* Header / Toggle */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-on-surface/5 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-primary-fixed">add_box</span>
          <span className="font-black uppercase tracking-widest text-sm">
            New_{category.toUpperCase()}_Asset
          </span>
        </div>
        <span className={`material-symbols-outlined transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {/* Form Body */}
      {open && (
        <div className="border-t border-on-surface/10 px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category badge (read-only, inferida del path) */}
          <div className="md:col-span-2 flex items-center gap-3">
            <span className={labelClass}>Categoría detectada del path:</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] bg-primary-fixed text-on-primary-fixed px-3 py-1">
              {category}
            </span>
          </div>

          {/* Name */}
          <div>
            <label className={labelClass}>Nombre del producto</label>
            <input
              type="text"
              className={inputClass}
              placeholder="RTX 5090 Founder's Edition"
              value={form.name}
              onChange={e => setField("name", e.target.value)}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Precio venta ($)</label>
              <input
                type="number"
                className={inputClass}
                placeholder="1999"
                value={form.price || ""}
                onChange={e => setField("price", Number(e.target.value))}
              />
              {errors.price && <p className={errorClass}>{errors.price}</p>}
            </div>
            <div>
              <label className={labelClass}>Costo compra ($)</label>
              <input
                type="number"
                className={inputClass}
                placeholder="1200"
                value={form.purchasePrice || ""}
                onChange={e => setField("purchasePrice", Number(e.target.value))}
              />
              {errors.purchasePrice && <p className={errorClass}>{errors.purchasePrice}</p>}
            </div>
          </div>

          {/* Margin */}
          <div>
            <label className={labelClass}>Margen (%)</label>
            <input
              type="number"
              className={inputClass}
              placeholder="25"
              value={form.margin || ""}
              onChange={e => setField("margin", Number(e.target.value))}
            />
            {errors.margin && <p className={errorClass}>{errors.margin}</p>}
          </div>

          {/* Selled toggle */}
          <div className="flex flex-col justify-end">
            <label className={labelClass}>Estado del producto</label>
            <button
              type="button"
              onClick={() => setField("selled", !form.selled)}
              className={`flex items-center gap-3 px-4 py-2 border-2 text-sm font-black uppercase tracking-widest transition-colors ${
                form.selled
                  ? "border-error text-error bg-error/5"
                  : "border-success text-success bg-success/5"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {form.selled ? "block" : "check_circle"}
              </span>
              {form.selled ? "VENDIDO" : "DISPONIBLE"}
            </button>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className={labelClass}>Descripción</label>
            <textarea
              className={`${inputClass} resize-none h-24 normal-case tracking-normal`}
              placeholder="Descripción detallada del producto..."
              value={form.description}
              onChange={e => setField("description", e.target.value)}
            />
            {errors.description && <p className={errorClass}>{errors.description}</p>}
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className={labelClass}>URLs de imágenes</label>
            <div className="flex gap-2">
              <input
                type="text"
                className={`${inputClass} flex-1`}
                placeholder="https://..."
                value={imageInput}
                onChange={e => setImageInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addImage()}
              />
              <button
                type="button"
                onClick={addImage}
                className="px-4 py-2 bg-on-surface text-surface font-black text-xs uppercase tracking-widest hover:bg-primary-fixed transition-colors"
              >
                Add
              </button>
            </div>
            {errors.image && <p className={errorClass}>{errors.image}</p>}
            {form.image.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {form.image.map((url, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-on-surface/5 border border-on-surface/10 px-3 py-1 text-[10px] font-mono max-w-[240px]"
                  >
                    <span className="truncate opacity-60">{url}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="text-error hover:scale-110 transition-transform flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex items-center justify-between border-t border-on-surface/10 pt-6">
            {success && (
              <span className="text-success text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                Producto creado exitosamente
              </span>
            )}
            {!success && <span />}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-3 px-8 py-3 bg-on-surface text-surface font-black uppercase text-xs tracking-widest hover:bg-primary-fixed disabled:opacity-40 disabled:cursor-not-allowed transition-colors brutal-shadow"
            >
              {saving ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                  GUARDANDO...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">upload</span>
                  DEPLOY_PRODUCT
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
