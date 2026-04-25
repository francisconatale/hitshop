"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { WhatsappLogo } from '@phosphor-icons/react';

const STEPS = [
  {
    id: '01',
    title: 'SELECCIÓN_DE_ACTIVOS',
    description: 'Explora el registro de hardware y selecciona los activos técnicos necesarios para la operación de tu nodo.'
  },
  {
    id: '02',
    title: 'VALIDACIÓN_DE_IDENTIDAD',
    description: 'Proporciona tus datos de receptor y coordenadas logísticas para inicializar el protocolo de adquisición.'
  },
  {
    id: '03',
    title: 'REGISTRO_DEL_SISTEMA',
    description: 'Tu solicitud se sincroniza con nuestro registro central. Se generará un ID de Adquisición.'
  },
  {
    id: '04',
    title: 'ESTABLECER_COMUNICACIÓN',
    description: 'Se establecerá comunicación directa vía Comm_Link, o puedes activar manualmente la Transmisión por WhatsApp.'
  }
];

export default function HowToBuy() {
  return (
    <section className="bg-on-surface text-surface border-y-2 border-on-surface overflow-hidden w-full">
      <div className="w-full">
        <header className="py-20 md:py-32 px-4 sm:px-10 border-b-2 border-surface/10">
          <div className="max-w-[1440px] mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-1 bg-primary-fixed" />
              <span className="font-mono text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-primary-fixed">
                PROTOCOLO_DE_ADQUISICIÓN_V1.0
              </span>
            </div>
            <h2 className="text-5xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter italic leading-none">
              Cómo_Asegurar_Activos
            </h2>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
          {STEPS.map((step) => (
            <div 
              key={step.id} 
              className="border-r border-b border-surface/10 p-10 md:p-16 lg:p-20 flex flex-col gap-12 group hover:bg-surface/[0.03] transition-colors"
            >
              <span className="font-mono text-5xl md:text-6xl font-black text-primary-fixed opacity-40 group-hover:opacity-100 transition-opacity">
                {step.id}
              </span>
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm font-mono uppercase leading-relaxed opacity-60 tracking-wider max-w-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-stretch w-full border-t-2 border-surface/10">
          <div className="flex-1 p-10 md:p-16 lg:p-20 bg-primary-fixed/5">
            <div className="max-w-2xl ml-auto lg:mr-20">
              <h4 className="text-3xl md:text-4xl font-black uppercase mb-6 tracking-tighter">Link_De_Acceso_Directo</h4>
              <p className="font-mono text-xs md:text-sm uppercase opacity-70 leading-relaxed tracking-wide">
                Salte la validación del registro y establece un canal encriptado directo con un agente de adquisiciones vía WhatsApp para una adquisición inmediata de activos.
              </p>
            </div>
          </div>
          <a 
            href="https://api.whatsapp.com/send?text=SOLICITUD_DE_INICIALIZACIÓN_DE_PROTOCOLO"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-6 bg-primary-fixed text-on-surface p-10 md:p-16 lg:p-20 font-black uppercase text-base md:text-xl lg:text-2xl tracking-[0.3em] transition-all hover:bg-surface hover:text-on-surface"
          >
            <WhatsappLogo size={48} weight="fill" />
            <span>Iniciar_Transmisión_WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
