"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderActions from "./HeaderActions";
import { useSystem } from "@/context/SystemContext";
import ClientOnly from "../utils/ClientOnly";

export default function Header() {
  const pathname = usePathname();
  const { categories } = useSystem();

  return (
    <header className="sticky top-0 w-full bg-surface/98 z-50 transition-all duration-300 shadow-[0_10px_40px_rgba(27,38,1,0.06)] border-b border-on-surface/[0.08] print:hidden">
      <div className="max-w-[1440px] mx-auto flex justify-between items-center px-4 md:px-8 py-3 md:py-4">
        <div className="flex items-center gap-8 md:gap-12">
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
          <HeaderActions />
        </ClientOnly>
      </div>
    </header>
  );
}
