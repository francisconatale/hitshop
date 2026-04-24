"use client";

import { motion } from "framer-motion";
import { useLocalesContext } from "@/context/LocalesContext";

export default function NewsTicker() {
  const { locales } = useLocalesContext();
  const tickerItems = locales.ticker || [];

  return (
    <div className="w-full bg-primary-fixed text-on-surface py-0.5 border-b border-on-surface overflow-hidden relative select-none">
      <div className="flex whitespace-nowrap">
        <motion.div 
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ 
            duration: 40, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex gap-16 items-center px-4"
        >
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3 font-mono text-[9px] font-bold uppercase tracking-widest">
              <span className="opacity-40">{item.label}:</span>
              <span className={item.color}>{item.value}</span>
              <span className="mx-6 text-on-surface/20 text-[8px]">/</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
