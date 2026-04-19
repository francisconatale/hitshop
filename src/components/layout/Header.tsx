"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderActions from "./HeaderActions";
import { sidebar } from "@/locales";
import { useSystem } from "@/context/SystemContext";

export default function Header() {
  const pathname = usePathname();
  const { categories } = useSystem();

  return (
    <header className="sticky top-0 w-full flex justify-between items-center px-12 py-8 bg-surface border-b-8 border-on-surface z-50">
      <div className="flex items-center gap-16">
        <Link href="/">
          <h1 className="font-black uppercase tracking-tighter text-4xl leading-none transition-transform hover:-rotate-1 text-on-surface">
            <span className="text-primary-fixed">HIT</span><span className="opacity-90">SHOP</span>
          </h1>
        </Link>
        <nav className="hidden lg:flex gap-10">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/${cat}`}
              className={`font-black uppercase text-sm tracking-widest transition-colors relative pb-1 ${
                pathname === `/${cat}` 
                  ? "text-primary-fixed after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-primary-fixed" 
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>
      <HeaderActions />
    </header>
  );
}
