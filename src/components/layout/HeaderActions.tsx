"use client";

import { sidebar } from "@/locales";

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2">
          search
        </span>
        <span className="material-symbols-outlined text-3xl cursor-pointer hover:bg-primary-container transition-colors p-2">
          account_circle
        </span>
      </div>
      
      <button className="flex items-center gap-3 bg-on-surface text-surface px-6 py-3 font-black transition-all hover:bg-primary-container hover:text-on-surface border-4 border-on-surface">
        <span className="material-symbols-outlined">shopping_cart</span>
        <span className="uppercase hidden sm:inline">{sidebar.cart}</span>
        <span className="text-xs border-2 border-current px-2 py-0.5">3</span>
      </button>
    </div>
  );
}
