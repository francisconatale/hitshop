"use client";

import React, { useEffect, useState } from 'react';
import PageLayout from "@/components/layout/PageLayout";
import { collectionService } from "@/lib/collections/CollectionService";
import { Order } from "@/lib/collections/OrdersCollection";
import { format } from 'date-fns';
import Link from 'next/link';
import { AdminSkeleton } from '@/components/ui/AdminSkeleton';
import { useSystemUI } from '@/context/SystemUIContext';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showNotification } = useSystemUI();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await collectionService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await collectionService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showNotification(`ESTADO_ACTUALIZADO: ${newStatus.toUpperCase()}`, 'add');
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("ACCIÓN_CRÍTICA: ¿ELIMINAR_PERMANENTEMENTE_EL_REGISTRO_DE_TRANSACCIÓN?")) return;
    
    setDeletingId(orderId);
    try {
      await collectionService.deleteOrder(orderId);
      setOrders(currentOrders => currentOrders.filter(o => o.id !== orderId));
      showNotification("NODO_PURGADO_EXITOSAMENTE", 'remove');
    } catch (error) {
      console.error("Error deleting order:", error);
      showNotification("ERROR: FALLO_EN_LA_ELIMINACIÓN_DEL_NODO", 'remove');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <PageLayout><AdminSkeleton /></PageLayout>;

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto py-12 px-4">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/admin" className="text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              VOLVER_AL_PANEL
            </Link>
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Registro_De_Pedidos</h1>
          <p className="font-mono text-xs opacity-50 uppercase tracking-[0.3em] mt-2">Monitoreo de transacciones y cumplimiento</p>
        </header>

        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="border-2 border-on-surface/10 p-20 text-center">
              <p className="font-mono text-sm opacity-30 uppercase tracking-[0.3em]">No_Se_Encontraron_Transacciones</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order) => (
                <div key={order.id} className="relative group bg-surface border-2 border-on-surface overflow-hidden brutal-shadow transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                  {/* Deleting Overlay */}
                  {deletingId === order.id && (
                    <div className="absolute inset-0 z-30 bg-on-surface/90 flex flex-col items-center justify-center text-primary-fixed animate-in fade-in duration-300">
                      <div className="w-12 h-1 bg-primary-fixed animate-pulse mb-4" />
                      <span className="font-mono text-xs font-black uppercase tracking-[0.5em] animate-pulse">Purgando_Datos...</span>
                      <span className="font-mono text-[8px] opacity-50 mt-2 uppercase">Desconexión_De_Nodo_En_Progreso</span>
                    </div>
                  )}

                  {/* Order Header */}
                  <div className="border-b-2 border-on-surface p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-on-surface/[0.02]">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deletingId === order.id}
                        className="text-error hover:bg-error hover:text-on-error p-1 transition-colors"
                        title="BORRAR_LOG"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                      <div className="flex items-baseline gap-4">
                        <span className="font-mono text-xs font-black text-primary-fixed">#{order.id}</span>
                        <span className="text-[10px] font-mono opacity-40 uppercase tracking-widest">
                          {order.createdAt?.toDate ? format(order.createdAt.toDate(), 'yyyy.MM.dd HH:mm') : 'PENDIENTE_TS'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className="bg-on-surface text-surface text-[10px] font-black uppercase tracking-widest px-2 py-1 outline-none cursor-pointer"
                      >
                        <option value="pending">PENDIENTE</option>
                        <option value="processing">PROCESANDO</option>
                        <option value="completed">COMPLETADO</option>
                        <option value="cancelled">CANCELADO</option>
                      </select>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="grid grid-cols-1 md:grid-cols-12">
                    <div className="md:col-span-4 p-6 border-b-2 md:border-b-0 md:border-r-2 border-on-surface space-y-4">
                      <div>
                        <label className="text-[8px] font-mono font-black uppercase tracking-widest opacity-40">Nodo_Identidad</label>
                        <p className="font-black uppercase text-sm">{order.identity.name || 'NOMBRE_NO_ASIGNADO'}</p>
                        <p className="font-mono text-xs opacity-60">{order.identity.phone || 'SIN_TELÉFONO'}</p>
                      </div>
                      <div>
                        <label className="text-[8px] font-mono font-black uppercase tracking-widest opacity-40">Terminal_Logística</label>
                        <p className="font-black uppercase text-xs">{order.payment.pickup ? 'EN_MANO' : 'ENVÍO_SEGURO'}</p>
                        {!order.payment.pickup && <p className="font-mono text-[10px] opacity-60 uppercase">{order.payment.address}</p>}
                      </div>
                      <div>
                        <label className="text-[8px] font-mono font-black uppercase tracking-widest opacity-40">Método_De_Liquidación</label>
                        <p className="font-black uppercase text-xs">{order.payment.method === 'transfer' ? 'TRANSFERENCIA' : 'EFECTIVO'}</p>
                      </div>
                      {order.identity.notes && (
                        <div>
                          <label className="text-[8px] font-mono font-black uppercase tracking-widest opacity-40">Directivas_Especiales</label>
                          <p className="text-[10px] font-mono italic opacity-60 leading-relaxed">{order.identity.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-8 p-6 flex flex-col justify-between">
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 border border-on-surface/10 p-1 flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black uppercase tracking-tight">{item.name}</p>
                              <p className="text-[8px] font-mono opacity-40 uppercase">SERIAL_{item.id.substring(0,8)}</p>
                            </div>
                            <p className="text-xs font-black tabular-nums">${item.price.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-4 border-t-2 border-on-surface flex justify-between items-end">
                        <span className="text-[10px] font-mono font-black uppercase tracking-widest opacity-40">Valuación_Total</span>
                        <span className="text-3xl font-black tracking-tighter tabular-nums text-primary-fixed">${order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
