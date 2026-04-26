"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TradeInPromo() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const badge = containerRef.current.querySelector(".promo-badge");
    const title = containerRef.current.querySelector(".promo-title");
    const text = containerRef.current.querySelector(".promo-text");
    const button = containerRef.current.querySelector(".promo-button");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none none"
      }
    });

    tl.fromTo(badge, 
      { opacity: 0, x: -20 }, 
      { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
    )
    .fromTo(title, 
      { opacity: 0, y: 30, skewY: 2 }, 
      { opacity: 1, y: 0, skewY: 0, duration: 0.8, ease: "power3.out" },
      "-=0.3"
    )
    .fromTo(text, 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .fromTo(button, 
      { opacity: 0, scale: 0.9, y: 10 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" },
      "-=0.3"
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="border-t border-on-surface/10 bg-on-surface/[0.02] mt-0 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-3xl">
          <div className="promo-badge inline-block px-3 py-1 bg-primary-fixed text-on-surface text-[10px] font-black uppercase tracking-[0.3em] mb-6 brutal-shadow-sm opacity-0">
            TRADE-IN PROGRAM // STATUS: ACTIVE
          </div>
          <h2 className="promo-title text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-6 opacity-0">
            Convertí tu hardware usado en <span className="text-primary-fixed">efectivo</span> o crédito.
          </h2>
          <p className="promo-text text-on-surface/60 font-mono text-sm md:text-base uppercase tracking-widest leading-relaxed max-w-2xl mb-8 opacity-0">
            Compramos GPUs, Procesadores y componentes en buen estado. Completá la ficha técnica y recibí una cotización oficial de nuestro equipo en menos de 48 horas.
          </p>
          <Link 
            href="/vender/hardware" 
            className="promo-button inline-flex items-center gap-3 px-8 py-4 bg-on-surface text-surface font-black uppercase text-sm tracking-widest hover:bg-primary-fixed hover:text-on-surface brutal-shadow transition-colors opacity-0"
          >
            VENDENOS TU GPU
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
