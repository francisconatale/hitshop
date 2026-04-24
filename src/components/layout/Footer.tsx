"use client";

import { usePathname } from "next/navigation";
import Marquee from "@/components/ui/Marquee";
import { Text } from "@/components/ui/Text";
import ClientOnly from "../utils/ClientOnly";

export default function Footer() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer 
      suppressHydrationWarning 
      className={`${isHome ? 'mt-16 md:mt-24' : 'mt-8 md:mt-12'} bg-on-surface text-surface py-12 md:py-20 px-0 overflow-hidden`}
    >
      <ClientOnly>
        {isHome && (
          <div className="flex flex-col space-y-2 md:space-y-4 mb-16 md:mb-20">
            <Text path="productTexts.footerBigText.0">
              {(text) => (
                <Marquee 
                  text={text} 
                  className="text-[6rem] md:text-[12rem] font-black uppercase leading-[0.75] tracking-tighter opacity-10" 
                />
              )}
            </Text>
            <Text path="productTexts.footerBigText.1">
              {(text) => (
                <Marquee 
                  text={text} 
                  className="text-[6rem] md:text-[12rem] font-black uppercase leading-[0.75] tracking-tighter text-primary-container" 
                  reverse 
                />
              )}
            </Text>
            <Text path="productTexts.footerBigText.2">
              {(text) => (
                <Marquee 
                  text={text} 
                  className="text-[6rem] md:text-[12rem] font-black uppercase leading-[0.75] tracking-tighter opacity-10" 
                />
              )}
            </Text>
          </div>
        )}
      </ClientOnly>
      
      <div 
        suppressHydrationWarning
        className={`px-4 md:px-8 flex flex-col sm:flex-row items-start sm:items-end justify-between border-t border-surface/20 pt-8 font-bold uppercase tracking-widest text-[8px] sm:text-xs ${isHome ? 'mt-16 md:mt-20' : 'mt-0'}`}
      >
        <span>© <Text path="productTexts.copyright" /></span>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-12 mt-4 sm:mt-0">
          <a className="hover:text-primary-container" href="#">
            <Text path="productTexts.footerLinks.terms" />
          </a>
          <a className="hover:text-primary-container" href="#">
            <Text path="productTexts.footerLinks.shipping" />
          </a>
          <a className="hover:text-primary-container" href="#">
            <Text path="productTexts.footerLinks.instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
}
