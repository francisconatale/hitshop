"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImageService } from "@/lib/ImageService";
import { collectionService } from "@/lib/collections/CollectionService";
import { useRouter } from "next/navigation";

const sellSchema = z.object({
  marca: z.string().min(2, "La marca es requerida"),
  modelo: z.string().min(3, "El modelo es requerido"),
  categoria: z.enum(['gpus', 'cpus', 'motherboards', 'ram', 'storage'], {
    errorMap: () => ({ message: "Selecciona una categoría válida" }),
  }),
  uso: z.enum(['gaming', 'minado', 'oficina', 'otro'], {
    errorMap: () => ({ message: "Selecciona el uso que tuvo el componente" }),
  }),
  tempCarga: z.number().min(20, "Temperatura no válida").max(120, "Temperatura excesiva"),
  tieneCaja: z.boolean(),
  tieneFactura: z.boolean(),
  descripcion: z.string().optional(),
  sellerName: z.string().min(2, "Tu nombre es requerido"),
  sellerContact: z.string().min(5, "Tu contacto es requerido (WhatsApp/IG)"),
});

type SellFormData = z.infer<typeof sellSchema>;

const inputClass =
  "w-full bg-surface border border-on-surface/20 focus:border-primary-fixed outline-none px-3 py-2 text-sm font-mono tracking-widest placeholder:opacity-30 transition-colors text-on-surface";
const labelClass = "text-[9px] font-black uppercase tracking-[0.2em] opacity-50 mb-1 block";
const errorClass = "text-[9px] font-black uppercase tracking-widest text-error mt-1";

export default function SellHardwareForm() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imageError, setImageError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<SellFormData>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      tieneCaja: false,
      tieneFactura: false,
    }
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      if (images.length + newFiles.length > 4) {
        setImageError("Máximo 4 imágenes permitidas.");
        return;
      }
      setImages(prev => [...prev, ...newFiles]);
      setImageError("");
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SellFormData) => {
    if (images.length === 0) {
      setImageError("Debes subir al menos 1 imagen del componente.");
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);

      // 1. Subir imágenes
      const imageUrls = await Promise.all(
        images.map(file => ImageService.uploadImage(file))
      );

      setUploading(false);

      // 2. Crear solicitud
      const requestData = {
        ...data,
        images: imageUrls,
      };

      await collectionService.createSellRequest(requestData);

      // 3. Redirigir a éxito
      router.push("/vender/hardware/gracias");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Hubo un error al enviar tu solicitud. Inténtalo de nuevo.");
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Component Info Group */}
        <div className="bg-surface border border-on-surface/10 p-8 space-y-6 brutal-shadow-sm">
          <div className="border-b border-on-surface/10 pb-4 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter text-on-surface">1. Identificación del Hardware</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Tipo de Componente</label>
              <select className={inputClass} {...register("categoria")}>
                <option value="">Seleccionar...</option>
                <option value="gpus">Placa de Video (GPU)</option>
                <option value="cpus">Procesador (CPU)</option>
                <option value="motherboards">Motherboard</option>
                <option value="ram">Memoria RAM</option>
                <option value="storage">Almacenamiento (SSD/HDD)</option>
              </select>
              {errors.categoria && <p className={errorClass}>{errors.categoria.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Marca (Ensamblador)</label>
              <input type="text" className={inputClass} placeholder="Ej: ASUS, MSI, EVGA..." {...register("marca")} />
              {errors.marca && <p className={errorClass}>{errors.marca.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Modelo Exacto</label>
              <input type="text" className={inputClass} placeholder="Ej: RTX 3080 TUF Gaming OC" {...register("modelo")} />
              {errors.modelo && <p className={errorClass}>{errors.modelo.message}</p>}
            </div>
          </div>
        </div>

        {/* Technical Status Group */}
        <div className="bg-on-surface/[0.02] border border-on-surface/10 p-8 space-y-6 brutal-shadow-sm">
          <div className="border-b border-on-surface/10 pb-4 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter text-on-surface">2. Estado Técnico</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Historial de Uso</label>
              <select className={inputClass} {...register("uso")}>
                <option value="">Seleccionar...</option>
                <option value="gaming">Solo Gaming</option>
                <option value="minado">Minería de Criptomonedas</option>
                <option value="oficina">Uso de Oficina / Diseño</option>
                <option value="otro">Otro</option>
              </select>
              {errors.uso && <p className={errorClass}>{errors.uso.message}</p>}
            </div>
            
            <div>
              <label className={labelClass}>Temperatura en Carga (Celcius)</label>
              <input type="number" className={inputClass} placeholder="Ej: 75" {...register("tempCarga", { valueAsNumber: true })} />
              {errors.tempCarga && <p className={errorClass}>{errors.tempCarga.message}</p>}
            </div>

            <div className="flex items-center gap-4 bg-surface border border-on-surface/10 p-4">
              <input type="checkbox" id="tieneCaja" className="w-5 h-5 accent-primary-fixed" {...register("tieneCaja")} />
              <label htmlFor="tieneCaja" className="text-xs font-black uppercase tracking-widest text-on-surface cursor-pointer select-none">Conservo la caja original</label>
            </div>

            <div className="flex items-center gap-4 bg-surface border border-on-surface/10 p-4">
              <input type="checkbox" id="tieneFactura" className="w-5 h-5 accent-primary-fixed" {...register("tieneFactura")} />
              <label htmlFor="tieneFactura" className="text-xs font-black uppercase tracking-widest text-on-surface cursor-pointer select-none">Tengo factura de compra</label>
            </div>
          </div>
        </div>

        {/* Evidence Group */}
        <div className="bg-surface border border-on-surface/10 p-8 space-y-6 brutal-shadow-sm">
          <div className="border-b border-on-surface/10 pb-4 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter text-on-surface">3. Evidencia Visual</h2>
          </div>
          
          <div>
            <label className={labelClass}>Fotos del Componente (Max 4)</label>
            <p className="text-[10px] font-mono opacity-50 mb-4 uppercase">Sugerencia: Frente, trasera (backplate), conectores y caja (si tiene).</p>
            
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={submitting || images.length >= 4}
              />
              <div className={`flex flex-col items-center justify-center gap-3 px-4 py-12 border-2 border-dashed border-on-surface/20 transition-colors ${images.length >= 4 ? 'bg-on-surface/5 opacity-50' : 'hover:bg-on-surface/5 bg-on-surface/[0.01]'}`}>
                <span className="material-symbols-outlined text-4xl opacity-40">add_photo_alternate</span>
                <span className="text-xs font-black uppercase tracking-widest opacity-80">
                  Click para subir fotos o arrastrar aquí
                </span>
              </div>
            </div>
            
            {imageError && <p className={errorClass}>{imageError}</p>}
            
            {images.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-4">
                {images.map((file, i) => (
                  <div key={i} className="relative w-24 h-24 border border-on-surface/10 bg-on-surface/5 group">
                    <img src={URL.createObjectURL(file)} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-error text-on-error rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity brutal-shadow hover:scale-110 z-20"
                    >
                      <span className="material-symbols-outlined text-[10px] block">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contact Group */}
        <div className="bg-surface border border-on-surface/10 p-8 space-y-6 brutal-shadow-sm">
          <div className="border-b border-on-surface/10 pb-4 mb-6">
            <h2 className="text-xl font-black uppercase tracking-tighter text-on-surface">4. Contacto de Oferta</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Tu Nombre / Apodo</label>
              <input type="text" className={inputClass} placeholder="Ej: Fede" {...register("sellerName")} />
              {errors.sellerName && <p className={errorClass}>{errors.sellerName.message}</p>}
            </div>

            <div>
              <label className={labelClass}>WhatsApp o Instagram</label>
              <input type="text" className={inputClass} placeholder="Ej: 1123456789 o @usuario" {...register("sellerContact")} />
              {errors.sellerContact && <p className={errorClass}>{errors.sellerContact.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Comentarios Adicionales (Opcional)</label>
              <textarea className={`${inputClass} h-24 resize-none`} placeholder="Algún detalle estético, pasta térmica cambiada, etc..." {...register("descripcion")}></textarea>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-4 px-10 py-5 bg-primary-fixed text-on-primary-fixed font-black uppercase text-sm tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none brutal-shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <span className="material-symbols-outlined text-xl animate-spin">sync</span>
                {uploading ? "PROCESANDO ASSETS..." : "ENVIANDO EXPEDIENTE..."}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-xl">send</span>
                ENVIAR PROPUESTA TÉCNICA
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
