"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import PageLayout from '@/components/layout/PageLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle } from '@phosphor-icons/react';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function SuccessPage() {
  const { orderId, identity, payment, orderSummary, assignedContact, clearCheckout } = useCheckout();
  const { clearCart } = useCart();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Asegurar el montaje y vaciar el carrito
  useEffect(() => {
    setHasMounted(true);
    if (orderId) {
      clearCart(true); 
    }
  }, [orderId, clearCart]);

  // 2. Redirección de seguridad
  useEffect(() => {
    if (hasMounted && !orderId) {
      const timer = setTimeout(() => {
        if (!orderId) router.push('/');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [orderId, router, hasMounted]);

  // Entrance Animation
  useGSAP(() => {
    const sections = containerRef.current?.querySelectorAll(".success-section");
    if (sections) {
      gsap.fromTo(sections, 
        { opacity: 0, y: 15, filter: "blur(4px)" }, 
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          duration: 0.8, 
          stagger: 0.2, 
          ease: "power2.out",
          delay: 0.3 
        }
      );
    }
  }, { scope: containerRef, dependencies: [hasMounted] });

  const handleWhatsAppShare = () => {
    if (!orderId) return;
    const itemsText = orderSummary 
      ? orderSummary.items.map(item => `• ${item.name} ($${item.price.toLocaleString()})`).join('\n')
      : 'Detalles pendientes';
    const totalText = orderSummary ? `$${orderSummary.total.toLocaleString()}` : 'Pendiente';
    const message = `Hola! Te escribo para coordinar mi pedido.\n\n` +
      `PEDIDO: #${orderId}\n` +
      `NOMBRE: ${identity.name}\n` +
      `PRODUCTOS:\n${itemsText}\n\n` +
      `TOTAL: ${totalText}\n` +
      `ENTREGA: ${payment.pickup ? 'Retiro en persona' : (payment.address || 'A coordinar')}`;

    const encodedMessage = encodeURIComponent(message);
    const cleanPhone = assignedContact?.whatsapp.replace(/\D/g, '') || '';
    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
  };

  if (!hasMounted || !orderId) return null;

  return (
    <PageLayout>
      <div className="max-w-[1200px] mx-auto py-8 px-6 min-h-[calc(100vh-80px)] flex flex-col">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start flex-1 mt-8" ref={containerRef}>
          
          {/* Success Content */}
          <div className="lg:col-span-7 space-y-16">
            
            <header className="space-y-4 success-section">
              <div className="flex items-center gap-6">
                 <CheckCircle size={64} weight="fill" className="text-primary-fixed shrink-0" />
                 <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none">¡Gracias por tu compra!</h2>
                    <p className="font-mono text-[11px] opacity-40 uppercase tracking-[0.2em] mt-2">Hemos registrado tu pedido correctamente</p>
                 </div>
              </div>
            </header>

            {/* Info Grid - Approachable Labeling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pl-4 border-l border-on-surface/5 success-section">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Número de pedido</span>
                <p className="text-2xl font-black tabular-nums text-on-surface">#{orderId}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Estado del pedido</span>
                <p className="text-sm font-black text-primary-fixed uppercase tracking-widest bg-primary-fixed/5 px-3 py-1 inline-block">Pendiente de coordinar</p>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Forma de entrega</span>
                <p className="text-sm font-black uppercase opacity-70">
                  {payment.pickup ? 'Retiro en Local Oficial' : 'Envío a Domicilio'}
                </p>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-30">Te atenderá:</span>
                <p className="text-sm font-black uppercase opacity-70">{assignedContact?.name || 'Nuestro equipo de ventas'}</p>
              </div>
            </div>

            {/* How to follow - Conversational */}
            <section className="space-y-8 success-section">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">¿Cómo sigue tu pedido?</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pl-4">
                {[
                  { step: '01', title: 'ESCRIBIR', desc: 'Envía los detalles por WhatsApp.' },
                  { step: '02', title: 'CONFIRMAR', desc: 'Aseguramos el stock y el pago.' },
                  { step: '03', title: 'RECIBIR', desc: 'Coordinamos la entrega final.' }
                ].map((item) => (
                  <div key={item.step} className="space-y-2">
                    <span className="text-[10px] font-mono font-black text-primary-fixed">{item.step} // {item.title}</span>
                    <p className="text-[11px] leading-relaxed opacity-50 uppercase font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky Action Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 pl-8 border-l border-on-surface/5 pb-20">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-40">Resumen del pedido</h3>
            
            <div className="max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar space-y-4">
              {orderSummary?.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-on-surface/[0.02] border border-on-surface/5 p-2 flex-shrink-0">
                    {(typeof item.image === 'string' ? item.image : item.image?.[0]) ? (
                      <img 
                        src={typeof item.image === 'string' ? item.image : item.image![0]} 
                        alt={item.name}
                        className="w-full h-full object-contain mix-blend-multiply opacity-80"
                      />
                    ) : (
                      <div className="w-full h-full bg-on-surface/5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs opacity-20">image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase truncate leading-none">{item.name}</p>
                    <p className="text-xs font-mono font-black tabular-nums mt-1">${item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-on-surface space-y-8">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Total a pagar</span>
                <span className="text-4xl font-black tabular-nums tracking-tighter text-on-surface">
                  ${orderSummary?.total.toLocaleString()}
                </span>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleWhatsAppShare}
                  className="w-full bg-on-surface text-surface py-6 font-black uppercase text-sm tracking-[0.4em] transition-all hover:bg-primary-fixed hover:text-on-surface flex items-center justify-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                  <span className="material-symbols-outlined text-base">send</span>
                  Escribir por WhatsApp
                </button>
                
                <Link 
                  href="/" 
                  onClick={() => clearCheckout()}
                  className="w-full border border-on-surface/10 py-4 font-black uppercase text-[10px] tracking-[0.3em] text-center transition-all hover:bg-on-surface/5 block"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
