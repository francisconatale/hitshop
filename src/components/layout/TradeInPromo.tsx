"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TradeInPromo({ animated = false }: { animated?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !animated) return;

    const badge = containerRef.current.querySelector(".promo-badge");
    const title = containerRef.current.querySelector(".promo-title");
    const text = containerRef.current.querySelector(".promo-text");
    const button = containerRef.current.querySelector(".promo-button");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none none"
      }
    });

    // Reset initial state to ensure consistency
    gsap.set([badge, title, text, button], { 
      opacity: 0, 
      y: 60,
      rotationX: -15,
      transformPerspective: 1000
    });

    tl.to(badge, 
      { opacity: 1, y: 0, rotationX: 0, duration: 0.8, ease: "expo.out" }
    )
    .to(title, 
      { 
        opacity: 1, 
        y: 0, 
        rotationX: 0, 
        duration: 1.2, 
        ease: "expo.out"
      },
      "-=0.6"
    )
    .to(text, 
      { opacity: 1, y: 0, rotationX: 0, duration: 1, ease: "expo.out" },
      "-=0.8"
    )
    .to(button, 
      { 
        opacity: 1, 
        y: 0, 
        rotationX: 0, 
        scale: 1, 
        duration: 0.8, 
        ease: "back.out(2)" 
      },
      "-=0.6"
    );

  }, { scope: containerRef, dependencies: [animated] });

  return (
    <section ref={containerRef} className="border-t border-on-surface/10 bg-on-surface/[0.02] mt-0 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className={`promo-badge inline-block px-3 py-1 bg-primary-fixed text-on-surface text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 brutal-shadow-sm ${animated ? 'opacity-0' : ''}`}>
            TRADE-IN PROGRAM // STATUS: ACTIVE
          </div>
          <h2 className={`promo-title text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.95] sm:leading-[0.9] mb-6 ${animated ? 'opacity-0' : ''}`}>
            Convertí tu hardware usado en <span className="text-primary-fixed">efectivo</span> o crédito.
          </h2>
          <p className={`promo-text text-on-surface/60 font-mono text-xs sm:text-sm md:text-base uppercase tracking-widest leading-relaxed max-w-2xl mb-8 ${animated ? 'opacity-0' : ''}`}>
            Compramos GPUs, Procesadores y componentes en buen estado. Completá la ficha técnica y recibí una cotización oficial de nuestro equipo en menos de 48 horas.
          </p>
          <Link 
            href="/vender/hardware" 
            className={`promo-button w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-on-surface text-surface font-black uppercase text-sm tracking-widest hover:bg-primary-fixed hover:text-on-surface brutal-shadow transition-colors ${animated ? 'opacity-0' : ''}`}
          >
            VENDENOS TU GPU
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
