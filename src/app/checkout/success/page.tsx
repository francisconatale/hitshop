"use client";

import React, { useEffect, useState } from 'react';
import { useCheckout } from '@/context/CheckoutContext';
import { useCart } from '@/context/CartContext';
import PageLayout from '@/components/layout/PageLayout';
import Link from 'next/link';
import { Text } from '@/components/ui/Text';
import { useRouter } from 'next/navigation';
import { CheckCircle } from '@phosphor-icons/react';

export default function SuccessPage() {
  const { orderId, identity, payment, orderSummary, clearCheckout } = useCheckout();
  const { clearCart } = useCart();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  // 1. Asegurar el montaje y vaciar el carrito
  useEffect(() => {
    setHasMounted(true);
    
    // Si tenemos una orden confirmada, vaciamos el carrito inmediatamente
    // ya que el "orderSummary" en el CheckoutContext ya tiene la copia de los productos.
    if (orderId) {
      clearCart(true); 
    }
  }, [orderId, clearCart]);

  // 2. Redirección de seguridad si no hay orden
  useEffect(() => {
    if (hasMounted && !orderId) {
      const timer = setTimeout(() => {
        if (!orderId) router.push('/');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [orderId, router, hasMounted]);

  const handleWhatsAppShare = () => {
    if (!orderId) return;

    // Construir lista de productos desde el resumen guardado
    const itemsText = orderSummary 
      ? orderSummary.items.map(item => `• ${item.name} ($${item.price.toLocaleString()})`).join('\n')
      : 'Detalles pendientes';

    const totalText = orderSummary ? `$${orderSummary.total.toLocaleString()}` : 'Pendiente';

    const message = `🚀 *NUEVO PEDIDO HITSHOP*\n\n` +
      `🆔 *PEDIDO:* #${orderId}\n` +
      `👤 *NOMBRE:* ${identity.name}\n` +
      `📞 *TELÉFONO:* ${identity.phone}\n\n` +
      `📦 *PRODUCTOS:*\n${itemsText}\n\n` +
      `💰 *TOTAL:* ${totalText}\n` +
      `📍 *ENTREGA:* ${payment.pickup ? 'Retiro en persona' : 'Envío a: ' + (payment.address || 'A coordinar')}\n\n` +
      `_¡Hola! Te escribo para coordinar mi pedido._`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encodedMessage}`, '_blank');
  };

  if (!hasMounted || !orderId) return null;

  return (
    <PageLayout>
      <div className="max-w-[1440px] mx-auto py-2 md:py-4 px-6 lg:px-12">
        
        {/* Stepper - Final State */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="flex items-center gap-6 font-mono text-[9px] tracking-[0.4em]">
            <div className="flex items-center gap-2 opacity-20">
              <span className="w-1.5 h-1.5 bg-on-surface"></span>
              <Text path="cartTexts.steps.selection" />
            </div>
            <span className="opacity-10">/</span>
            <div className="flex items-center gap-2 opacity-20">
              <span className="w-1.5 h-1.5 bg-on-surface"></span>
              <Text path="cartTexts.steps.validation" />
            </div>
            <span className="opacity-10">/</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-fixed"></span>
              <span className="opacity-100 font-black text-on-surface">CONFIRMACIÓN</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-on-surface shadow-2xl overflow-hidden bg-surface max-h-[calc(100vh-200px)]">
          
          {/* Main Content - Left Column */}
          <div className="lg:col-span-8 p-0 flex flex-col border-b-2 lg:border-b-0 lg:border-r-2 border-on-surface overflow-hidden">
            <div className="bg-primary-fixed p-6 md:p-8 text-on-surface flex flex-col items-center text-center space-y-3 flex-shrink-0">
              <CheckCircle size={48} weight="fill" />
              <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter italic leading-none mb-1">¡Compra Confirmada!</h1>
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] opacity-80">Tu pedido fue registrado con éxito</p>
              </div>
            </div>

            <div className="p-6 md:p-10 space-y-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between md:items-end border-b-2 border-on-surface/10 pb-4 gap-3">
                  <div className="space-y-1">
                    <span className="text-[9px] md:text-[11px] font-mono font-black uppercase tracking-[0.4em] opacity-40">Número de Pedido</span>
                    <p className="text-xl md:text-2xl font-black tabular-nums tracking-tighter text-on-surface break-all uppercase">#{orderId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase opacity-60 text-primary-fixed">Estado: Aprobado</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[11px] font-mono font-black uppercase tracking-[0.4em] opacity-40">A nombre de</label>
                    <p className="text-base md:text-lg font-black uppercase leading-tight">{identity.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] md:text-[11px] font-mono font-black uppercase tracking-[0.4em] opacity-40">Teléfono de contacto</label>
                    <p className="text-base md:text-lg font-black uppercase leading-tight">{identity.phone}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-on-surface/5 border-l-4 md:border-l-8 border-primary-fixed space-y-4">
                <h3 className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em]">Próximos Pasos:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <li className="space-y-1">
                    <span className="text-[10px] font-mono font-black text-primary-fixed">Paso 01</span>
                    <p className="text-[10px] font-mono uppercase leading-tight opacity-70">Enviamos tu pedido por WhatsApp para coordinar el pago.</p>
                  </li>
                  <li className="space-y-1">
                    <span className="text-[10px] font-mono font-black text-primary-fixed">Paso 02</span>
                    <p className="text-[10px] font-mono uppercase leading-tight opacity-70">Validamos tu pago y preparamos los productos.</p>
                  </li>
                  <li className="space-y-1">
                    <span className="text-[10px] font-mono font-black text-primary-fixed">Paso 03</span>
                    <p className="text-[10px] font-mono uppercase leading-tight opacity-70">Despachamos tu pedido o coordinamos el retiro.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar Actions - Right Column */}
          <div className="lg:col-span-4 bg-on-surface text-surface p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-8">
              <header className="border-b border-surface/10 pb-4">
                <h3 className="text-lg font-black uppercase tracking-tight italic">Resumen de Compra</h3>
              </header>

              <div className="space-y-4">
                <p className="text-[10px] font-mono uppercase leading-relaxed opacity-60">
                  ¡Todo listo! Tu pedido ya está en nuestro sistema. Haz clic en el botón de abajo para enviarnos un mensaje y coordinar la entrega.
                </p>
                <div className="pt-4 border-t border-surface/10 space-y-2">
                  <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Entrega</span>
                  <p className="text-[10px] font-black uppercase">A coordinar por WhatsApp</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <button 
                onClick={handleWhatsAppShare}
                className="w-full bg-surface text-on-surface border-2 border-on-surface py-4 font-black uppercase text-xs tracking-[0.4em] text-center transition-all hover:bg-on-surface hover:text-surface flex items-center justify-center gap-2"
              >
                Enviar por WhatsApp
              </button>
              <Link 
                href="/" 
                onClick={() => clearCheckout()}
                className="w-full bg-primary-fixed text-on-surface border-2 border-primary-fixed py-5 font-black uppercase text-xs tracking-[0.4em] text-center transition-all brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none block"
              >
                SEGUIR COMPRANDO
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
