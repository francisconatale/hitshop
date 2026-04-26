"use client";

import { useEffect, useState } from "react";
import { collectionService } from "@/lib/collections/CollectionService";
import { SellRequest } from "@/types/sell";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import PageLayout from "@/components/layout/PageLayout";

export default function SolicitudesAdminPage() {
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ... (useEffect and handleDelete logic remains the same)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await collectionService.getSellRequests();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este expediente? Esta acción no se puede deshacer.")) {
      setDeletingId(id);
      try {
        await collectionService.deleteSellRequest(id);
        setRequests(prev => prev.filter(req => req.id !== id));
      } catch (error) {
        console.error("Error deleting request:", error);
        alert("Error al eliminar el expediente.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="p-8 text-center font-mono text-sm uppercase tracking-widest opacity-50">
            CARGANDO EXPEDIENTES...
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin" className="text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center gap-2 transition-opacity">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              VOLVER_AL_PANEL
            </Link>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h1 className="text-5xl font-black uppercase tracking-tighter italic">Solicitudes_De_Hardware</h1>
            <p className="font-mono text-xs opacity-50 uppercase tracking-widest">
              {requests.length} expedientes encontrados
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6">
        {requests.map(req => (
          <div key={req.id} className="border border-on-surface/10 bg-surface flex flex-col md:flex-row brutal-shadow-sm">
            {/* Header / Info Básica */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-on-surface/10 md:w-1/3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 ${
                    req.status === 'pending' ? 'bg-primary-fixed text-on-surface' :
                    req.status === 'reviewing' ? 'bg-warning text-on-warning' :
                    req.status === 'accepted' ? 'bg-success text-surface' :
                    'bg-error text-surface'
                  }`}>
                    STATUS: {req.status}
                  </span>
                  <span className="font-mono text-[9px] opacity-40">{format(req.createdAt, "dd MMM yyyy, HH:mm", { locale: es })}</span>
                </div>
                
                <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{req.marca} {req.modelo}</h3>
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">CAT: {req.categoria}</span>
              </div>

              <div className="mt-6 pt-4 border-t border-on-surface/10">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 block mb-2">Contacto</span>
                <p className="font-mono text-xs">Vendedor: {req.sellerName}</p>
                <p className="font-mono text-xs">Red: {req.sellerContact}</p>
              </div>
            </div>

            {/* Detalles Técnicos */}
            <div className="p-6 md:w-2/3 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-fixed bg-on-surface px-2 py-1 self-start mb-4">
                Ficha Técnica
              </span>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 font-mono text-xs">
                <div>
                  <span className="opacity-40 block text-[9px] mb-1 uppercase">Uso Declarado</span>
                  <span className="uppercase">{req.uso}</span>
                </div>
                <div>
                  <span className="opacity-40 block text-[9px] mb-1 uppercase">Temp. Máxima</span>
                  <span>{req.tempCarga}°C</span>
                </div>
                <div>
                  <span className="opacity-40 block text-[9px] mb-1 uppercase">Caja Orig.</span>
                  <span>{req.tieneCaja ? 'SÍ' : 'NO'}</span>
                </div>
                <div>
                  <span className="opacity-40 block text-[9px] mb-1 uppercase">Factura</span>
                  <span>{req.tieneFactura ? 'SÍ' : 'NO'}</span>
                </div>
              </div>

              {req.descripcion && (
                <div className="mb-6 p-4 bg-on-surface/5 border border-on-surface/10 font-mono text-[10px] leading-relaxed">
                  <span className="opacity-40 block text-[9px] mb-2 uppercase">Notas del Vendedor:</span>
                  {req.descripcion}
                </div>
              )}

              {/* Imágenes y Acciones */}
              <div className="flex justify-between items-end mt-auto pt-6">
                <div>
                  <span className="opacity-40 block text-[9px] mb-2 font-mono uppercase">Evidencia Adjunta ({req.images.length})</span>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {req.images.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                        <img src={url} alt={`Evidencia ${i}`} className="w-16 h-16 object-cover border border-on-surface/20 hover:opacity-80 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => handleDelete(req.id)}
                  disabled={deletingId === req.id}
                  className="flex items-center gap-2 px-4 py-2 border border-error/50 text-error hover:bg-error hover:text-on-error transition-colors font-black uppercase text-[10px] tracking-widest brutal-shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === req.id ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                      DESCARTANDO...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">delete</span>
                      DESCARTAR
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="p-12 border-2 border-dashed border-on-surface/20 text-center flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-4xl opacity-20 mb-4">inbox</span>
            <span className="font-mono text-xs uppercase tracking-widest opacity-40">No hay expedientes pendientes</span>
          </div>
        )}
        </div>
      </div>
    </PageLayout>
  );
}
