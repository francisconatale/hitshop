"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import PageLayout from '@/components/layout/PageLayout';
import Link from 'next/link';
import { Text } from '@/components/ui/Text';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
  const { items, total } = useCart();
  const { identity, payment, setPayment, confirmOrder, isConfirming, orderId } = useCheckout();
  const router = useRouter();
  const isNavigatingToSuccess = useRef(false);

  const [form, setForm] = useState(payment);

  // Redirección de seguridad
  useEffect(() => {
    // Si estamos navegando al éxito o ya tenemos un ID, abortar cualquier redirección a selección
    if (isNavigatingToSuccess.current || orderId) return;

    if (items.length === 0 && !isConfirming) {
      console.warn("PaymentPage: Carrito vacío detectado, redirigiendo a selección...");
      router.push('/checkout/selection');
    }
  }, [items.length, isConfirming, orderId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isConfirming) return;

    try {
      console.log("PaymentPage: Iniciando ejecución de protocolo...");
      isNavigatingToSuccess.current = true; // Bloqueamos la redirección automática a selección
      setPayment(form);
      await confirmOrder(form);
      
      console.log("PaymentPage: Protocolo ejecutado, forzando ruta de éxito.");
      router.push('/checkout/success');
    } catch (error) {
      isNavigatingToSuccess.current = false;
      console.error("PaymentPage: Error fatal durante la ejecución:", error);
      alert("ERROR_CRÍTICO: FALLO_EN_LA_EJECUCIÓN. Revisar logs.");
    }
  };

  // Si no hay nada que mostrar y no estamos procesando, no renderizar (esperando redirect)
  if (items.length === 0 && !isConfirming && !orderId && !isNavigatingToSuccess.current) {
    return null;
  }

  const inputStyles = "w-full bg-on-surface/[0.03] border-b-2 border-on-surface/10 focus:border-on-surface outline-none px-0 py-3 text-xs font-mono uppercase tracking-widest placeholder:opacity-20 transition-all";

  return (
    <PageLayout>
      <div className="max-w-[1440px] mx-auto py-2 md:py-4 px-6 lg:px-12">
        
        {/* Stepper */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="flex items-center gap-6 font-mono text-[9px] tracking-[0.4em]">
            <Link href="/checkout/selection" className="flex items-center gap-2 group">
              <span className="w-1.5 h-1.5 bg-on-surface group-hover:bg-primary-fixed transition-colors"></span>
              <Text path="cartTexts.steps.selection" />
            </Link>
            <span className="opacity-10">/</span>
            <Link href="/checkout/validation" className="flex items-center gap-2 group">
              <span className="w-1.5 h-1.5 bg-on-surface group-hover:bg-primary-fixed transition-colors"></span>
              <Text path="cartTexts.steps.validation" />
            </Link>
            <span className="opacity-10">/</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-fixed"></span>
              <Text path="cartTexts.steps.procurement" className="opacity-100 font-black text-on-surface" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-on-surface shadow-2xl overflow-hidden bg-surface max-h-[calc(100vh-200px)] lg:max-h-none">
          
          {/* Payment & Logistics Form */}
          <div className="lg:col-span-7 xl:col-span-8 p-6 md:p-8 space-y-8 border-b-2 lg:border-b-0 lg:border-r-2 border-on-surface overflow-y-auto">
            <header className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-2 h-2 bg-on-surface"></span>
                Protocolo_De_Adquisición
              </h2>
              <p className="text-[8px] font-mono opacity-40 uppercase tracking-widest">Seleccionar parámetros de liquidación y logística</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Payment Method */}
              <div className="space-y-4">
                <label className="text-[9px] font-mono font-black uppercase tracking-[0.4em] opacity-40 border-b border-on-surface/10 block pb-1">Método_De_Liquidación</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: 'transfer', label: 'TRANSFERENCIA', desc: 'Transferencia Directa de Nodo' },
                    { id: 'cash', label: 'EFECTIVO', desc: 'Liquidación en Mano' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      disabled={isConfirming}
                      onClick={() => setForm({ ...form, method: method.id })}
                      className={`p-3 border-2 text-left transition-all ${
                        form.method === method.id 
                          ? 'border-on-surface bg-on-surface text-surface' 
                          : 'border-on-surface/10 hover:border-on-surface/40'
                      } disabled:opacity-50`}
                    >
                      <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">{method.label}</p>
                      <p className="text-[7px] font-mono opacity-40 uppercase tracking-tighter">{method.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logistics */}
              <div className="space-y-6">
                <label className="text-[9px] font-mono font-black uppercase tracking-[0.4em] opacity-40 border-b border-on-surface/10 block pb-1">Terminal_Logística</label>
                
                <div className="flex flex-col sm:flex-row gap-6">
                   <button
                      type="button"
                      disabled={isConfirming}
                      onClick={() => setForm({ ...form, pickup: true, address: '' })}
                      className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${form.pickup ? 'opacity-100' : 'opacity-20'}`}
                    >
                      <span className={`w-2.5 h-2.5 border-2 border-on-surface ${form.pickup ? 'bg-primary-fixed' : ''}`}></span>
                      En_Mano (A coordinar)
                    </button>
                    <button
                      type="button"
                      disabled={isConfirming}
                      onClick={() => setForm({ ...form, pickup: false })}
                      className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${!form.pickup ? 'opacity-100' : 'opacity-20'}`}
                    >
                      <span className={`w-2.5 h-2.5 border-2 border-on-surface ${!form.pickup ? 'bg-primary-fixed' : ''}`}></span>
                      Envío_Estándar
                    </button>
                </div>

                {!form.pickup && (
                  <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[8px] font-mono font-black uppercase tracking-[0.4em] opacity-40">Dirección_De_Entrega</label>
                    <input 
                      type="text" 
                      disabled={isConfirming}
                      value={form.address || ''}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="CALLE, NÚMERO, CIUDAD, CP"
                      className={`${inputStyles} py-2`}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="pt-4">
                 <button 
                  type="submit"
                  disabled={isConfirming}
                  className="w-full md:w-auto bg-primary-fixed text-on-surface border-2 border-on-surface px-8 py-3 font-black uppercase text-[10px] tracking-[0.4em] transition-all brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                  {isConfirming ? 'Ejecutando_Protocolo...' : 'Confirmar_Ejecución_De_Pedido'}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column Summary */}
          <div className="lg:col-span-5 xl:col-span-4 bg-on-surface text-surface p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-8">
              <header className="border-b border-surface/10 pb-4">
                <h3 className="text-lg font-black uppercase tracking-tight italic">Valuación_Final</h3>
              </header>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Identidad</span>
                  <span className="text-[10px] font-black uppercase">{identity.name}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Comm_Link</span>
                  <span className="text-[10px] font-black uppercase">{identity.phone}</span>
                </div>
                <div className="flex justify-between items-end pt-3 border-t border-surface/10">
                  <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Activos_Totales</span>
                  <span className="text-2xl font-black tabular-nums tracking-tighter text-primary-fixed">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 border-2 border-primary-fixed/20 bg-primary-fixed/5 space-y-2">
               <p className="text-[7px] font-mono uppercase leading-relaxed opacity-60">
                Aviso: Al ejecutar este nodo, usted acepta los términos de adquisición. Los activos serán asegurados tras la verificación de la liquidación.
               </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
