import Marquee from "@/components/ui/Marquee";
import { productTexts } from "@/locales";

export default function Footer() {
  return (
    <footer className="mt-24 bg-on-surface text-surface py-20 px-0 overflow-hidden">
      <div className="flex flex-col space-y-4">
        <Marquee 
          text={productTexts.footerBigText[0]} 
          className="text-[12rem] font-black uppercase leading-[0.75] tracking-tighter opacity-10" 
        />
        <Marquee 
          text={productTexts.footerBigText[1]} 
          className="text-[12rem] font-black uppercase leading-[0.75] tracking-tighter text-primary-container" 
          reverse 
        />
        <Marquee 
          text={productTexts.footerBigText[2]} 
          className="text-[12rem] font-black uppercase leading-[0.75] tracking-tighter opacity-10" 
        />
      </div>
      <div className="mt-20 px-8 flex justify-between items-end border-t border-surface/20 pt-8 font-bold uppercase tracking-widest text-xs">
        <span>© {productTexts.copyright}</span>
        <div className="flex gap-12">
          <a className="hover:text-primary-container" href="#">
            {productTexts.footerLinks.terms}
          </a>
          <a className="hover:text-primary-container" href="#">
            {productTexts.footerLinks.shipping}
          </a>
          <a className="hover:text-primary-container" href="#">
            {productTexts.footerLinks.instagram}
          </a>
        </div>
      </div>
    </footer>
  );
}
