"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderActions from "./HeaderActions";
import { useSystem } from "@/context/SystemContext";
import ClientOnly from "../utils/ClientOnly";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const pathname = usePathname();
  const { categories } = useSystem();
  const { toggleCart } = useCart();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 w-full bg-surface/98 z-50 transition-all duration-300 shadow-[0_10px_40px_rgba(27,38,1,0.06)] border-b border-on-surface/[0.08] print:hidden">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center gap-4 md:gap-12">
          {/* Burger Menu Button (Mobile) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-on-surface hover:bg-on-surface/5 transition-colors"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-3xl">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <Link href="/">
            <h1 className="font-black uppercase tracking-tighter text-2xl md:text-3xl leading-none transition-transform hover:-rotate-1 text-on-surface">
              <span className="text-primary-fixed">HIT</span><span className="opacity-70">SHOP</span>
            </h1>
          </Link>
          
          <nav className="hidden lg:flex gap-10 items-center">
            {categories.map((cat) => {
              const isActive = pathname === `/${cat}` || pathname.includes(`/${cat}/`) || (cat === 'products' && pathname.includes('/products/'));
              return (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  suppressHydrationWarning
                  className={`font-black uppercase text-sm tracking-widest transition-colors relative pb-1 ${
                    isActive 
                      ? "text-primary-fixed after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-primary-fixed" 
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
            {/* Trade-In Link */}
            <Link
              href="/vender/hardware"
              className={`font-black uppercase text-xs tracking-widest transition-all relative px-3 py-1.5 border-2 ${
                pathname.includes('/vender')
                  ? "border-primary-fixed bg-primary-fixed/10 text-primary-fixed" 
                  : "border-on-surface/20 text-on-surface hover:border-primary-fixed hover:text-primary-fixed hover:bg-primary-fixed/5"
              }`}
            >
              VENDENOS TU GPU
            </Link>
          </nav>
        </div>
        <ClientOnly>
          <div className="hidden lg:block">
            <HeaderActions />
          </div>
        </ClientOnly>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[60px] md:top-[72px] z-40 lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <nav className="relative bg-surface border-b-4 border-on-surface p-6 flex flex-col gap-6 shadow-2xl overflow-y-auto max-h-[calc(100vh-72px)]">
            {/* Cart & Profile Quick Actions (Top of Mobile Menu) */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-on-surface/10">
              <Link
                href="/profile"
                className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-on-surface hover:bg-on-surface hover:text-surface transition-all brutal-shadow-sm"
              >
                <span className="material-symbols-outlined text-3xl">account_circle</span>
                <span className="font-black uppercase text-[10px] tracking-widest">Perfil</span>
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  toggleCart();
                }}
                className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-on-surface hover:bg-on-surface hover:text-surface transition-all brutal-shadow-sm"
              >
                <span className="material-symbols-outlined text-3xl">shopping_cart</span>
                <span className="font-black uppercase text-[10px] tracking-widest">Carrito</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Navegación</span>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className={`font-black uppercase text-xl tracking-tighter italic transition-all ${
                    pathname.includes(`/${cat}`) ? "text-primary-fixed pl-4 border-l-4 border-primary-fixed" : "text-on-surface hover:pl-2"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
            
            <div className="flex flex-col gap-4 pt-6 border-t border-on-surface/10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 mb-2">Servicios</span>
              <Link
                href="/vender/hardware"
                className={`font-black uppercase text-sm tracking-widest p-4 border-2 flex items-center justify-between ${
                  pathname.includes('/vender')
                    ? "border-primary-fixed bg-primary-fixed/10 text-primary-fixed" 
                    : "border-on-surface text-on-surface hover:bg-on-surface hover:text-surface"
                } brutal-shadow-sm`}
              >
                VENDENOS TU GPU
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
