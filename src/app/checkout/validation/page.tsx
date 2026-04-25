"use client";

import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useCheckout } from '@/context/CheckoutContext';
import { useAuth } from '@/context/AuthContext';
import PageLayout from '@/components/layout/PageLayout';
import Link from 'next/link';
import { Text } from '@/components/ui/Text';
import { useRouter } from 'next/navigation';

export default function ValidationPage() {
  const { items, total } = useCart();
  const { identity, setIdentity } = useCheckout();
  const { user, userData } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState(identity);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirección segura fuera del render
  useEffect(() => {
    if (items.length === 0) {
      router.push('/checkout/selection');
    }
  }, [items.length, router]);

  const userName = userData?.name || user?.displayName || user?.email?.split('@')[0] || '';
  const userPhone = userData?.phone || '';

  // Pre-fill form when auth data arrives
  useEffect(() => {
    if (userName && !form.name) {
      setForm(prev => ({ ...prev, name: userName }));
    }
    if (userPhone && !form.phone) {
      setForm(prev => ({ ...prev, phone: userPhone }));
    }
  }, [userName, userPhone, form.name, form.phone]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (form.name.length < 3) newErrors.name = "MIN_3_CARACTERES_REQUERIDOS";
    if (!/^\d{10,}$/.test(form.phone.replace(/\D/g, ''))) newErrors.phone = "FORMATO_TELÉFONO_INVÁLIDO";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIdentity(form);
      router.push('/checkout/payment');
    }
  };

  if (items.length === 0) {
    return null;
  }

  const inputStyles = "w-full bg-on-surface/[0.03] border-b-2 border-on-surface/10 focus:border-on-surface outline-none px-0 py-3 text-xs font-mono uppercase tracking-widest placeholder:opacity-20 transition-all";

  return (
    <PageLayout>
      <div className="max-w-[1440px] mx-auto py-2 md:py-4 px-4 sm:px-6 lg:px-12">
        
        {/* Stepper - Adaptive for Mobile */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="flex items-center gap-3 sm:gap-6 font-mono text-[8px] sm:text-[9px] tracking-[0.2em] sm:tracking-[0.4em]">
            <Link href="/checkout/selection" className="flex items-center gap-2 group">
              <span className="w-1.5 h-1.5 bg-on-surface group-hover:bg-primary-fixed transition-colors"></span>
              <span className="hidden sm:inline"><Text path="cartTexts.steps.selection" /></span>
              <span className="sm:hidden">01</span>
            </Link>
            <span className="opacity-10">/</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-fixed"></span>
              <span className="font-black text-on-surface">
                <span className="hidden sm:inline"><Text path="cartTexts.steps.validation" /></span>
                <span className="sm:hidden">02_VALIDACIÓN</span>
              </span>
            </div>
            <span className="opacity-10">/</span>
            <div className="flex items-center gap-2 opacity-20">
              <span className="w-1.5 h-1.5 bg-on-surface"></span>
              <span className="hidden sm:inline"><Text path="cartTexts.steps.procurement" /></span>
              <span className="sm:hidden">03</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-on-surface shadow-2xl overflow-hidden bg-surface">
          
          {/* Right Column Summary - Shown FIRST on Mobile */}
          <div className="lg:col-span-5 xl:col-span-4 bg-on-surface text-surface p-6 md:p-8 flex flex-col justify-between order-1 lg:order-2 border-b-2 lg:border-b-0 border-on-surface">
            <div className="space-y-6 md:space-y-8">
              <header className="border-b border-surface/10 pb-4">
                <h3 className="text-lg font-black uppercase tracking-tight italic">Resumen_De_Adquisición</h3>
              </header>

              <div className="space-y-3 max-h-40 lg:max-h-none overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-[9px] font-black uppercase tracking-tight leading-tight mb-1">{item.name}</p>
                      <p className="text-[7px] font-mono text-primary-fixed/60 uppercase tracking-widest">0x{item.id.substring(0,8)}</p>
                    </div>
                    <p className="text-xs font-black tabular-nums tracking-tighter">${item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-surface/10 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest">Valuación_Total</span>
                  <span className="text-2xl sm:text-3xl font-black tabular-nums tracking-tighter text-primary-fixed">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 hidden lg:block space-y-4">
              <div className="p-3 bg-surface/5 border border-surface/10 border-l-4 border-l-primary-fixed">
                <Text path="cartTexts.socialProof.log" className="text-[7px] font-mono uppercase opacity-50 block leading-relaxed" />
              </div>
              <div className="flex items-center gap-2 opacity-30">
                <span className="w-1.5 h-1.5 bg-primary-fixed animate-pulse"></span>
                <Text path="cartTexts.socialProof.status" className="text-[7px] font-mono uppercase tracking-[0.3em]" />
              </div>
            </div>
          </div>

          {/* Identity Form - Shown SECOND on Mobile */}
          <div className="lg:col-span-7 xl:col-span-8 p-6 md:p-12 space-y-8 order-2 lg:order-1 lg:border-r-2 border-on-surface bg-surface">
            <header className="space-y-1">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3">
                <span className="w-2 h-2 bg-on-surface"></span>
                {userName ? `Identidad_Verificada: ${userName}` : 'Validación_De_Identidad'}
              </h2>
              <p className="text-[8px] font-mono opacity-40 uppercase tracking-widest">
                {userName ? 'PARÁMETROS_BLOQUEADOS' : 'Esperando parámetros de autenticación'}
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono font-black uppercase tracking-[0.4em] opacity-40">
                    {userName ? 'Etiqueta_Identidad (Autorizado)' : 'Etiqueta_Identidad (Nombre Completo)'}
                  </label>
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="INGRESAR_NOMBRE"
                    readOnly={!!userName}
                    className={`${inputStyles} ${errors.name ? 'border-error' : ''} ${userName ? 'opacity-50 cursor-not-allowed' : ''} py-3 sm:py-4`}
                  />
                  {errors.name && <p className="text-[7px] font-mono text-error uppercase font-black tracking-widest">{errors.name}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono font-black uppercase tracking-[0.4em] opacity-40">
                    {userPhone ? 'Comm_Link (Autorizado)' : 'Comm_Link (Teléfono +54)'}
                  </label>
                  <input 
                    type="tel" 
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+54..."
                    readOnly={!!userPhone}
                    className={`${inputStyles} ${errors.phone ? 'border-error' : ''} ${userPhone ? 'opacity-50 cursor-not-allowed' : ''} py-3 sm:py-4`}
                  />
                  {errors.phone && <p className="text-[7px] font-mono text-error uppercase font-black tracking-widest">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono font-black uppercase tracking-[0.4em] opacity-40">Directivas_Especiales (Notas)</label>
                  <textarea 
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="NOTAS_DE_ADQUISICIÓN_OPCIONALES"
                    className="w-full bg-on-surface/[0.03] border-2 border-on-surface/10 focus:border-on-surface outline-none px-4 py-3 text-xs font-mono normal-case tracking-wider placeholder:opacity-20 transition-all resize-none h-28"
                  />
                </div>
              </div>

              <div className="pt-4">
                 <button 
                  type="submit"
                  className="w-full sm:w-auto bg-on-surface text-surface border-2 border-on-surface px-10 py-4 font-black uppercase text-[10px] tracking-[0.4em] transition-all brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:scale-95"
                >
                  Continuar_Al_Pago
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
