"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { WhatsappLogo } from '@phosphor-icons/react';

const STEPS = [
  {
    id: '01',
    title: 'ELIGE TUS PRODUCTOS',
    description: 'Explora nuestro catálogo de hardware y agrega al carrito los componentes que necesitas para armar tu equipo.'
  },
  {
    id: '02',
    title: 'COMPLETA TUS DATOS',
    description: 'Ingresa tu nombre y teléfono de contacto en el checkout para que podamos registrar y preparar tu pedido.'
  },
  {
    id: '03',
    title: 'CONFIRMA LA ORDEN',
    description: 'Tu pedido se guardará en nuestro sistema de forma segura y te asignaremos un número de seguimiento.'
  },
  {
    id: '04',
    title: 'COORDINAMOS EL PAGO',
    description: 'Nos comunicaremos contigo por WhatsApp para coordinar el método de pago y el envío o retiro.'
  }
];

export default function HowToBuy() {
  return (
    <section className="bg-on-surface text-surface border-y-2 border-on-surface overflow-hidden w-full">
      <div className="w-full">
        <header className="py-12 md:py-16 px-4 sm:px-10 border-b-2 border-surface/10">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-1 bg-primary-fixed" />
              <span className="font-mono text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-primary-fixed">
                GUÍA RÁPIDA
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter italic leading-none">
              Tu equipo en 4 pasos
            </h2>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
          {STEPS.map((step) => (
            <div 
              key={step.id} 
              className="border-r border-b border-surface/10 p-6 md:p-8 lg:p-10 flex flex-col gap-6 group hover:bg-surface/[0.03] transition-colors"
            >
              <span className="font-mono text-3xl md:text-4xl font-black text-primary-fixed opacity-40 group-hover:opacity-100 transition-opacity">
                {step.id}
              </span>
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm font-mono uppercase leading-relaxed opacity-60 tracking-wider">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-stretch w-full border-t-2 border-surface/10">
          <div className="flex-1 p-8 md:p-10 lg:p-12 bg-primary-fixed/5">
            <div className="max-w-2xl ml-auto lg:mr-10">
              <h4 className="text-2xl md:text-3xl font-black uppercase mb-4 tracking-tighter">¿Prefieres Comprar Directo?</h4>
              <p className="font-mono text-xs md:text-sm uppercase opacity-70 leading-relaxed tracking-wide">
                Escríbenos directo a nuestro WhatsApp si tienes dudas, necesitas asesoramiento técnico o prefieres armar tu pedido hablando con un especialista.
              </p>
            </div>
          </div>
          <a 
            href="https://api.whatsapp.com/send?text=¡Hola! Me gustaría hacer una consulta o armar un pedido."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-4 bg-primary-fixed text-on-surface p-8 md:p-10 lg:p-12 font-black uppercase text-sm md:text-base lg:text-lg tracking-[0.3em] transition-all hover:bg-surface hover:text-on-surface"
          >
            <WhatsappLogo size={32} weight="fill" />
            <span>Hablar por WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
