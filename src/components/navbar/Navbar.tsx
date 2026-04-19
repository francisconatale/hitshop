"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebar } from "./locales";
import { useSystem } from "@/context/SystemContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { categories } = useSystem();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r-8 border-on-surface bg-surface flex flex-col justify-between z-50 overflow-hidden">
      <div>
        <div className="p-6 border-b-8 border-on-surface">
          <h1 className="font-black uppercase tracking-tighter text-3xl leading-none">{sidebar.title}</h1>
        </div>
        <nav className="flex flex-col p-2 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <Link
            href="/"
            className={`group flex items-center gap-4 p-4 font-bold hover:bg-primary-container/20 transition-all duration-75 ${
              pathname === "/"
                ? "bg-primary-container text-on-surface border-4 border-on-surface font-black"
                : ""
            }`}
          >
            <span className="material-symbols-outlined">home</span>
            <span className="uppercase">HOME</span>
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/${cat}`}
              className={`group flex items-center gap-4 p-4 font-bold hover:bg-primary-container/20 transition-all duration-75 ${
                pathname === `/${cat}`
                  ? "bg-primary-container text-on-surface border-4 border-on-surface font-black transition-transform active:translate-x-1 active:translate-y-1"
                  : ""
              }`}
            >
              <span className="material-symbols-outlined">
                {cat === 'cpus' ? 'developer_board' : cat === 'gpus' ? 'memory' : cat === 'peripherals' ? 'keyboard' : 'inventory_2'}
              </span>
              <span className="uppercase">{cat}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-2 border-t-8 border-on-surface">
        <button className="w-full flex items-center justify-between bg-on-surface text-surface p-4 font-black transition-all hover:bg-primary-container hover:text-on-surface">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined">shopping_cart</span>
            <span className="uppercase">{sidebar.cart}</span>
          </div>
          <span className="text-xs border-2 border-current px-2 py-0.5">3</span>
        </button>
      </div>
    </aside>
  );
}
