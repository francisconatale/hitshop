"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import { useContacts } from '@/hooks/useContacts';
import PageLayout from '@/components/layout/PageLayout';
import { useRouter } from 'next/navigation';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function ValidationPage() {
  const { items, total, removeFromCart } = useCart();
  const { 
    identity, setIdentity, 
    payment, setPayment,
    assignedContact, setAssignedContact,
    confirmOrder, isConfirming, orderId
  } = useCheckout();
  const { user, userData } = useAuth();
  const { contacts, loading: contactsLoading } = useContacts();
  const router = useRouter();
  const isNavigatingToSuccess = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [step, setStep] = useState(1);
  const [identityForm, setIdentityForm] = useState(identity);
  const [paymentForm, setPaymentForm] = useState(payment);
  const [contactId, setContactId] = useState(assignedContact?.id || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Auto-assign first available contact
  useEffect(() => {
    if (contacts.length > 0 && !contactId) {
      setContactId(contacts[0].id);
    }
  }, [contacts, contactId]);

  // GSAP Step Animation
  useGSAP(() => {
    const activeSection = containerRef.current?.querySelector(`.step-content-${step}`);
    if (activeSection) {
      gsap.fromTo(activeSection, 
        { opacity: 0, height: 0, y: -10 }, 
        { 
          opacity: 1, 
          height: "auto", 
          y: 0, 
          duration: 0.5, 
          ease: "power2.out"
        }
      );
    }
  }, [step]);

  // Redirección segura
  useEffect(() => {
    if (isNavigatingToSuccess.current || orderId) return;
    if (items.length === 0 && !isConfirming) {
      router.push('/');
    }
  }, [items.length, isConfirming, orderId, router]);

  const userName = userData?.name || user?.displayName || user?.email?.split('@')[0] || '';
  const userPhone = userData?.phone || '';

  // Pre-fill form when auth data arrives
  useEffect(() => {
    if (userName && !identityForm.name) {
      setIdentityForm(prev => ({ ...prev, name: userName }));
    }
    if (userPhone && !identityForm.phone) {
      setIdentityForm(prev => ({ ...prev, phone: userPhone }));
    }
  }, [userName, userPhone, identityForm.name, identityForm.phone]);

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (identityForm.name.length < 3) newErrors.name = "MIN 3 CARACTERES";
      if (!/^\d{10,}$/.test(identityForm.phone.replace(/\D/g, ''))) newErrors.phone = "TELÉFONO INVÁLIDO";
    }
    if (currentStep === 2) {
      if (!paymentForm.pickup && !paymentForm.address) newErrors.address = "LA DIRECCIÓN ES REQUERIDA";
    }
    if (currentStep === 3) {
      if (!paymentForm.method) newErrors.method = "SELECCIONE MÉTODO DE PAGO";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (currentStep: number) => {
    if (validateStep(currentStep)) {
      setStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (isConfirming) return;
    
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setStep(1);
      return;
    }

    try {
      const selectedContact = contacts.find(c => c.id === contactId);
      if (!selectedContact) {
        setGeneralError("ERROR_ASIGNACIÓN_AGENTE");
        return;
      }

      const contactData = {
        id: selectedContact.id,
        name: selectedContact.name,
        whatsapp: selectedContact.whatsapp || selectedContact.phone || ''
      };

      setIdentity(identityForm);
      setPayment(paymentForm);
      setAssignedContact(contactData);

      isNavigatingToSuccess.current = true;
      await confirmOrder(paymentForm, identityForm, contactData);
      router.push('/checkout/success');
    } catch (error) {
      isNavigatingToSuccess.current = false;
      setGeneralError("FALLO_CRÍTICO_EN_PROTOCOLO");
    }
  };

  const inputStyles = "w-full bg-on-surface/[0.03] border-b border-on-surface/20 focus:border-on-surface outline-none px-0 py-3 text-sm font-mono tracking-wider placeholder:opacity-20 transition-all";

  return (
    <PageLayout>
      <div className="max-w-[1200px] mx-auto py-8 px-6 min-h-[calc(100vh-80px)] flex flex-col">
        
        <div className="flex justify-between items-center mb-10 pb-4 border-b border-on-surface/5">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black uppercase tracking-tight text-on-surface">Finalizar_Compra</h1>
            <div className="flex items-center gap-2 bg-on-surface/5 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-pulse"></span>
              <span className="font-mono text-[9px] tracking-widest opacity-60 uppercase">Paso_{Math.min(step, 4)}_de_4</span>
            </div>
          </div>
          <p className="font-mono text-[9px] opacity-20 uppercase tracking-widest hidden sm:block italic text-primary-fixed">Compra_Segura_Activa</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-6" ref={containerRef}>
            
            {/* 01. TUS DATOS */}
            <section className={`border-b border-on-surface/5 pb-6 transition-all duration-500 ${step !== 1 ? 'opacity-40 hover:opacity-100' : ''}`}>
              <div 
                onClick={() => step > 1 && setStep(1)}
                className={`flex items-center justify-between gap-4 mb-4 ${step !== 1 ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black w-6 h-6 flex items-center justify-center border rounded-full transition-colors ${step === 1 ? 'bg-on-surface text-surface border-on-surface' : 'border-on-surface/20'}`}>1</span>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">Tus Datos</h3>
                </div>
                {step > 1 && <span className="material-symbols-outlined text-sm opacity-20">edit</span>}
              </div>
              
              {step === 1 ? (
                <div className="step-content-1 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pl-10">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Nombre y Apellido</label>
                    <input type="text" value={identityForm.name} onChange={(e) => setIdentityForm({...identityForm, name: e.target.value})} className={inputStyles} placeholder="Ej. Juan Pérez" />
                    {errors.name && <p className="text-[8px] font-mono text-error uppercase">{errors.name}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest opacity-30">WhatsApp de contacto</label>
                    <input type="tel" value={identityForm.phone} onChange={(e) => setIdentityForm({...identityForm, phone: e.target.value})} className={inputStyles} placeholder="+54..." />
                    {errors.phone && <p className="text-[8px] font-mono text-error uppercase">{errors.phone}</p>}
                  </div>
                  <div className="sm:col-span-2 pt-4">
                    <button onClick={() => handleNext(1)} className="bg-on-surface text-surface px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-primary-fixed hover:text-on-surface transition-colors">Continuar</button>
                  </div>
                </div>
              ) : (
                <div className="pl-10">
                  <p className="text-[10px] font-mono opacity-60 uppercase">{identityForm.name} // {identityForm.phone}</p>
                </div>
              )}
            </section>

            {/* 02. FORMA DE ENTREGA */}
            <section className={`border-b border-on-surface/5 pb-6 transition-all duration-500 ${step !== 2 ? 'opacity-40 hover:opacity-100' : ''}`}>
              <div 
                onClick={() => step > 2 && setStep(2)}
                className={`flex items-center justify-between gap-4 mb-4 ${step > 2 ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black w-6 h-6 flex items-center justify-center border rounded-full transition-colors ${step === 2 ? 'bg-on-surface text-surface border-on-surface' : 'border-on-surface/20'}`}>2</span>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">Forma de Entrega</h3>
                </div>
                {step > 2 && <span className="material-symbols-outlined text-sm opacity-20">edit</span>}
              </div>
              
              {step === 2 ? (
                <div className="step-content-2 space-y-6 pl-10">
                  <div className="grid grid-cols-2 gap-4">
                    {[{ id: 'pickup', label: 'Retiro en Local', active: paymentForm.pickup }, { id: 'ship', label: 'Envío a Domicilio', active: !paymentForm.pickup }].map(opt => (
                      <button key={opt.id} onClick={() => setPaymentForm({...paymentForm, pickup: opt.id === 'pickup', address: opt.id === 'pickup' ? '' : paymentForm.address})} className={`p-4 border transition-all text-center ${opt.active ? 'border-on-surface bg-on-surface/5' : 'border-on-surface/5 opacity-40 hover:opacity-100 hover:border-on-surface/20'}`}>
                        <p className="text-[10px] font-black uppercase tracking-widest">{opt.label}</p>
                      </button>
                    ))}
                  </div>
                  {!paymentForm.pickup && (
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-widest opacity-30">Dirección Completa</label>
                      <input type="text" value={paymentForm.address || ''} onChange={(e) => setPaymentForm({...paymentForm, address: e.target.value})} className={inputStyles} placeholder="Calle, Ciudad, CP" />
                      {errors.address && <p className="text-[8px] font-mono text-error uppercase">{errors.address}</p>}
                    </div>
                  )}
                  <div className="pt-4">
                    <button onClick={() => handleNext(2)} className="bg-on-surface text-surface px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-primary-fixed hover:text-on-surface transition-colors">Continuar</button>
                  </div>
                </div>
              ) : step > 2 ? (
                <div className="pl-10">
                  <p className="text-[10px] font-mono opacity-60 uppercase">{paymentForm.pickup ? 'RETIRO EN LOCAL' : paymentForm.address}</p>
                </div>
              ) : null}
            </section>

            {/* 03. MÉTODO DE PAGO */}
            <section className={`border-b border-on-surface/5 pb-6 transition-all duration-500 ${step !== 3 ? 'opacity-40 hover:opacity-100' : ''}`}>
              <div 
                onClick={() => step > 3 && setStep(3)}
                className={`flex items-center justify-between gap-4 mb-4 ${step > 3 ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black w-6 h-6 flex items-center justify-center border rounded-full transition-colors ${step === 3 ? 'bg-on-surface text-surface border-on-surface' : 'border-on-surface/20'}`}>3</span>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">Método de Pago</h3>
                </div>
                {step > 3 && <span className="material-symbols-outlined text-sm opacity-20">edit</span>}
              </div>
              
              {step === 3 ? (
                <div className="step-content-3 space-y-8 pl-10">
                  <div className="grid grid-cols-2 gap-4">
                    {[{ id: 'transfer', label: 'TRANSFERENCIA' }, { id: 'cash', label: 'EFECTIVO' }].map(method => (
                      <button key={method.id} onClick={() => setPaymentForm({...paymentForm, method: method.id})} className={`p-4 border transition-all text-center ${paymentForm.method === method.id ? 'border-on-surface bg-on-surface/5' : 'border-on-surface/5 opacity-40 hover:opacity-100 hover:border-on-surface/20'}`}>
                        <p className="text-[10px] font-black uppercase tracking-widest">{method.label}</p>
                      </button>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 py-3 px-4 bg-on-surface/[0.02] border border-on-surface/5">
                      <div className="w-1.5 h-1.5 bg-primary-fixed rounded-full animate-pulse"></div>
                      <p className="text-[9px] font-mono uppercase tracking-widest opacity-60 text-primary-fixed font-black">
                        Atención personalizada por: <span className="text-on-surface uppercase">{contacts.find(c => c.id === contactId)?.name || 'nuestro equipo'}</span>
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button onClick={() => handleNext(3)} className="bg-on-surface text-surface px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-primary-fixed hover:text-on-surface transition-colors disabled:opacity-20" disabled={!paymentForm.method}>Continuar</button>
                  </div>
                </div>
              ) : step > 3 ? (
                <div className="pl-10">
                  <p className="text-[10px] font-mono opacity-60 uppercase">{paymentForm.method === 'transfer' ? 'TRANSFERENCIA' : 'EFECTIVO'}</p>
                </div>
              ) : null}
            </section>

            {/* 04. ACLARACIONES */}
            <section className={`pb-6 transition-all duration-500 ${step !== 4 ? 'opacity-40 hover:opacity-100' : ''}`}>
              <div 
                onClick={() => step === 5 && setStep(4)}
                className={`flex items-center justify-between gap-4 mb-4 ${step === 5 ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-black w-6 h-6 flex items-center justify-center border rounded-full transition-colors ${step === 4 ? 'bg-on-surface text-surface border-on-surface' : 'border-on-surface/20'}`}>4</span>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em]">¿Alguna indicación?</h3>
                </div>
                {step === 5 && <span className="material-symbols-outlined text-sm opacity-20">edit</span>}
              </div>
              
              {step === 4 ? (
                <div className="step-content-4 space-y-6 pl-10">
                  <textarea rows={3} value={identityForm.notes} onChange={(e) => setIdentityForm({...identityForm, notes: e.target.value})} placeholder="Ej. Horarios de entrega, aclarar si retira otra persona..." className="w-full bg-on-surface/[0.03] border-b border-on-surface/20 focus:border-on-surface outline-none px-4 py-3 text-sm font-mono transition-all resize-none" />
                  <div className="pt-4">
                    <button onClick={() => setStep(5)} className="bg-on-surface text-surface px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-primary-fixed hover:text-on-surface transition-colors">Terminar</button>
                  </div>
                </div>
              ) : step > 4 ? (
                <div className="pl-10">
                  <p className="text-[10px] font-mono opacity-60 uppercase italic">{identityForm.notes ? identityForm.notes : 'SIN ACLARACIONES'}</p>
                </div>
              ) : null}
            </section>

          </div>

          {/* Right Column - Sticky Actions */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8 lg:pl-8 lg:border-l border-on-surface/5 pb-20">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 opacity-40">Resumen del Pedido</h3>
            
            <div className="max-h-[30vh] overflow-y-auto pr-4 custom-scrollbar space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 bg-on-surface/[0.02] border border-on-surface/5 p-2 flex-shrink-0">
                    <img 
                      src={typeof item.image === 'string' ? item.image : item.image[0]} 
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply opacity-80"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase truncate leading-none">{item.name}</p>
                    <p className="text-xs font-mono font-black tabular-nums mt-1">${item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="pt-8 border-t border-on-surface space-y-6">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black uppercase opacity-40 tracking-widest">Total Final</span>
                <span className="text-4xl font-black tabular-nums tracking-tighter text-on-surface">${total.toLocaleString()}</span>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleSubmit} 
                  disabled={isConfirming || step < 5} 
                  className={`w-full py-5 font-black uppercase text-sm tracking-[0.4em] transition-all ${step >= 5 ? 'bg-on-surface text-surface hover:bg-primary-fixed hover:text-on-surface shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-on-surface/5 text-on-surface/20 cursor-not-allowed'}`}
                >
                  {isConfirming ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
                <p className="text-[9px] font-mono uppercase text-center opacity-30 leading-relaxed tracking-wider italic">Sincronización segura activada.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
