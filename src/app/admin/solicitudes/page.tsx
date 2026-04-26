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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [quotationInput, setQuotationInput] = useState("");

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

  const openQuotationModal = (id: string, currentQuotation?: number) => {
    setSelectedRequestId(id);
    setQuotationInput(currentQuotation?.toString() || "");
    setShowModal(true);
  };

  const handleSaveQuotation = async () => {
    if (!selectedRequestId) return;
    
    const quoteNum = parseFloat(quotationInput);
    if (isNaN(quoteNum)) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    setUpdatingId(selectedRequestId);
    try {
      await collectionService.updateSellRequest(selectedRequestId, { 
        quotation: quoteNum,
        status: 'completed'
      });
      
      setRequests(prev => prev.map(req => 
        req.id === selectedRequestId 
          ? { ...req, quotation: quoteNum, status: 'completed' } 
          : req
      ));
      
      setShowModal(false);
      setSelectedRequestId(null);
      setQuotationInput("");
      alert("Cotización guardada y expediente completado.");
    } catch (error) {
      console.error("Error updating quotation:", error);
      alert("Error al guardar la cotización.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: SellRequest['status']) => {
    // Si elige COMPLETED, abrimos el modal en lugar de actualizar directo
    if (newStatus === 'completed') {
      const req = requests.find(r => r.id === id);
      openQuotationModal(id, req?.quotation);
      return;
    }

    setUpdatingId(id);
    try {
      const updateData: Partial<SellRequest> = { status: newStatus };
      
      // Si se vuelve a PENDING, se limpia la cotización
      if (newStatus === 'pending') {
        updateData.quotation = null;
      }

      await collectionService.updateSellRequest(id, updateData);
      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, ...updateData } : req
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error al actualizar el estado.");
    } finally {
      setUpdatingId(null);
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
                <div className="flex justify-end items-start mb-4">
                  <span className="font-mono text-[9px] opacity-40">{format(req.createdAt, "dd MMM yyyy, HH:mm", { locale: es })}</span>
                </div>
                
                <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{req.marca} {req.modelo}</h3>
                <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest">CAT: {req.categoria}</span>
                
                {req.quotation && req.status !== 'pending' && (
                   <div className="mt-4 p-3 bg-primary-fixed/10 border-l-4 border-primary-fixed">
                      <span className="text-[9px] font-black uppercase tracking-widest opacity-60 block">Oferta_Actual</span>
                      <span className="text-lg font-black tabular-nums">${req.quotation.toLocaleString()}</span>
                   </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-on-surface/10">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-50 block mb-2">Contacto</span>
                <p className="font-mono text-xs">Vendedor: {req.sellerName}</p>
                <p className="font-mono text-xs">Red: {req.sellerContact}</p>
              </div>
            </div>

            {/* Detalles Técnicos */}
            <div className="p-6 md:w-2/3 flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-fixed bg-on-surface px-2 py-1 self-start mb-4 inline-block">
                Ficha Técnica
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 font-mono text-xs">
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
                <div className="p-4 bg-on-surface/5 border border-on-surface/10 font-mono text-[10px] leading-relaxed mb-6">
                  <span className="opacity-40 block text-[9px] mb-2 uppercase">Notas del Vendedor:</span>
                  {req.descripcion}
                </div>
              )}

              {/* Imágenes y Acciones */}
              <div className="flex justify-between items-end mt-auto pt-6 border-t border-on-surface/10">
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

                <div className="flex gap-4 items-center">
                  <select 
                    value={req.status}
                    onChange={(e) => handleStatusUpdate(req.id, e.target.value as SellRequest['status'])}
                    disabled={updatingId === req.id}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-2 outline-none border border-on-surface/20 hover:border-on-surface cursor-pointer transition-all brutal-shadow-sm h-[38px] bg-on-surface text-surface"
                  >
                    <option value="pending">PENDING</option>
                    <option value="accepted">ACCEPTED</option>
                    <option value="completed">COMPLETED</option>
                  </select>

                  <button 
                    onClick={() => openQuotationModal(req.id, req.quotation)}
                    className="flex items-center gap-2 px-4 py-2 bg-on-surface text-surface hover:opacity-80 transition-all font-black uppercase text-[10px] tracking-[0.2em] brutal-shadow-sm h-[38px]"
                  >
                    <span className="material-symbols-outlined text-sm">payments</span>
                    COTIZAR
                  </button>
                  <button 
                    onClick={() => handleDelete(req.id)}
                    disabled={deletingId === req.id}
                    className="flex items-center gap-2 px-4 py-2 border border-error/50 text-error hover:bg-error hover:text-on-error transition-colors font-black uppercase text-[10px] tracking-widest brutal-shadow-sm disabled:opacity-50 disabled:cursor-not-allowed h-[38px]"
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

      {/* Quotation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/80 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-md border-2 border-on-surface p-8 brutal-shadow-primary animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tighter italic">Respuesta Administrativa</h2>
                <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest mt-1">Establecer oferta final para el componente</p>
              </div>
              <button onClick={() => setShowModal(false)} className="opacity-50 hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 block mb-2">Monto Oferta ($)</label>
                <input 
                  type="number" 
                  autoFocus
                  value={quotationInput}
                  onChange={(e) => setQuotationInput(e.target.value)}
                  placeholder="Ej: 180000"
                  className="w-full bg-on-surface/[0.05] border-2 border-on-surface/10 outline-none px-4 py-3 text-lg font-mono tracking-widest focus:border-primary-fixed transition-colors"
                />
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  onClick={handleSaveQuotation}
                  disabled={updatingId !== null || !quotationInput}
                  className="w-full bg-on-surface text-surface py-4 font-black uppercase text-xs tracking-[0.2em] hover:bg-primary-fixed hover:text-on-surface transition-all border-2 border-on-surface brutal-shadow-primary disabled:opacity-50"
                >
                  {updatingId ? 'PROCESANDO...' : 'GUARDAR COTIZACIÓN'}
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full py-3 font-black uppercase text-[10px] tracking-widest opacity-50 hover:opacity-100 transition-opacity"
                >
                  CANCELAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
