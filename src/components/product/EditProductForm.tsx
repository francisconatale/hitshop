"use client";

import { useEditProduct } from "@/hooks/product/useEditProduct";
import { Product } from "@/types/product";

const inputClass =
  "w-full bg-surface border border-on-surface/20 focus:border-primary-fixed outline-none px-3 py-2 text-sm font-mono uppercase tracking-widest placeholder:opacity-30 placeholder:normal-case placeholder:tracking-normal transition-colors";

const labelClass = "text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1 block";

const errorClass = "text-[9px] font-black uppercase tracking-widest text-error mt-1";

interface EditProductFormProps {
  product: Product;
  onSuccess?: () => void;
  onCancel: () => void;
}

export function EditProductForm({ product, onSuccess, onCancel }: EditProductFormProps) {
  const {
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
  } = useEditProduct(product);

  const handleSubmit = async () => {
    const isSuccess = await submit();
    if (isSuccess && onSuccess) onSuccess();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  return (
    <div className="border border-on-surface/20 bg-surface">
      <div className="border-b border-on-surface/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-xl text-primary-fixed">edit_square</span>
          <span className="font-black uppercase tracking-widest text-sm">
            Edit_{product.category.toUpperCase()}_Asset
          </span>
        </div>
        <button onClick={onCancel} className="text-on-surface/50 hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <label className={labelClass}>Descripción (Opcional)</label>
          <textarea
            className={`${inputClass} resize-none h-24 normal-case tracking-normal`}
            placeholder="Descripción detallada del producto..."
            value={form.description || ""}
            onChange={e => setField("description", e.target.value)}
          />
          {errors.description && <p className={errorClass}>{errors.description}</p>}
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className={labelClass}>Imágenes del producto</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* URL Input */}
            <div className="flex gap-2">
              <input
                type="text"
                className={`${inputClass} flex-1`}
                placeholder="Pegar URL de imagen..."
                value={imageInput}
                onChange={e => setImageInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addImage(imageInput)}
              />
              <button
                type="button"
                onClick={() => addImage(imageInput)}
                className="px-4 py-2 bg-on-surface text-surface font-black text-xs uppercase tracking-widest hover:bg-primary-fixed transition-colors"
              >
                Add
              </button>
            </div>

            {/* File Input */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploading}
              />
              <div className={`flex items-center justify-center gap-3 px-4 py-2 border-2 border-dashed border-on-surface/20 text-[10px] font-black uppercase tracking-widest transition-colors ${uploading ? 'bg-on-surface/5' : 'hover:bg-on-surface/5'}`}>
                {uploading ? (
                  <>
                    <span className="material-symbols-outlined text-base animate-spin">sync</span>
                    SUBIENDO...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-base">cloud_upload</span>
                    Subir archivo
                  </>
                )}
              </div>
            </div>
          </div>
          {errors.image && <p className={errorClass}>{errors.image}</p>}
          {(form.image || []).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-4">
              {(form.image || []).map((url, i) => (
                <div
                  key={i}
                  className="relative w-24 h-24 border border-on-surface/10 bg-on-surface/5 group"
                >
                  <img src={url} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-error text-on-error rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity brutal-shadow hover:scale-110"
                  >
                    <span className="material-symbols-outlined text-[10px] block">close</span>
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
              Producto actualizado exitosamente
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
                <span className="material-symbols-outlined text-sm">save</span>
                GUARDAR CAMBIOS
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
