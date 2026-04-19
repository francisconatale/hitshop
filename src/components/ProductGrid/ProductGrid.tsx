"use client";

import Marquee from '../Marquee';
import ScrambleText from '../ScrambleText';
import { Product, Print } from './types';
import { texts } from './texts';
import { useSystem } from '@/context/SystemContext';

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border-8 border-on-surface bg-surface group cursor-pointer flex flex-col">
      <div className="aspect-[4/5] bg-surface-container overflow-hidden border-b-8 border-on-surface relative">
        <img
          alt={product.name}
          src={product.image}
          className="w-full h-full object-cover grayscale contrast-125 transition-all group-hover:grayscale-0 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-primary-container text-on-surface px-3 py-1 font-black text-xs uppercase border-4 border-on-surface">
          {product.badge}
        </div>
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-4xl font-black uppercase tracking-tighter leading-none mb-2">{product.name}</h3>
          <p className="text-on-surface-variant font-medium">{product.description}</p>
        </div>
        <div className="mt-8 flex justify-between items-center">
          <span className="text-3xl font-black">${product.price}</span>
          <button className="bg-primary-container text-on-surface border-4 border-on-surface px-6 py-2 font-black uppercase hover:invert transition-none">
            {texts.addButton}
          </button>
        </div>
      </div>
    </div>
  );
}

function PrintCard({ print }: { print: Print }) {
  return (
    <div className="relative">
      <div className="bg-surface-container p-8 border-4 border-on-surface mb-6 group overflow-hidden">
        <img
          alt={print.name}
          src={print.image}
          className="w-full grayscale contrast-150 transition-all group-hover:grayscale-0"
        />
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-2xl font-black uppercase leading-none">{print.name}</h4>
          <span className="text-xs font-bold bg-primary-container px-2 py-0.5">{print.series}</span>
        </div>
        <span className="text-xl font-bold">${print.price}</span>
      </div>
    </div>
  );
}

interface ProductGridProps {
  category?: 'cpus' | 'gpus' | 'apparel' | 'peripherals';
}

export default function ProductGrid({ category }: ProductGridProps) {
  const { productsData } = useSystem();

  if (category) {
    const categoryProducts = productsData[category] || [];
    
    // Si es peripherals, usamos el componente PrintCard, si no ProductCard
    const isPeripherals = category === 'peripherals';

    return (
      <div className="p-8">
        <div className="mb-16">
          <h1 className="text-huge font-black uppercase tracking-tighter border-b-[16px] border-on-surface pb-4">
            <ScrambleText text={category.toUpperCase()} />
          </h1>
        </div>
        {categoryProducts.length > 0 ? (
          <section className={`grid grid-cols-1 ${isPeripherals ? 'md:grid-cols-3 gap-12' : 'md:grid-cols-2 gap-8'} mb-24`}>
            {categoryProducts.map((item: any) => (
              isPeripherals 
                ? <PrintCard key={item.id} print={item} />
                : <ProductCard key={item.id} product={item} />
            ))}
          </section>
        ) : (
          <div className="py-20 border-8 border-dashed border-on-surface/20 flex flex-col items-center justify-center mb-24">
            <p className="text-2xl font-black uppercase opacity-30">No hardware detected in this node</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="p-8">
        <div className="mb-16">
          <h1 className="text-huge font-black uppercase tracking-tighter border-b-[16px] border-on-surface pb-4">
            <ScrambleText text={texts.heroTitle} />
          </h1>
          <div className="flex justify-between items-end mt-4">
            <p className="max-w-xl font-medium text-lg leading-tight">
              {texts.heroDescription}
            </p>
            <span className="text-xs font-black bg-on-surface text-surface px-4 py-2 uppercase">{texts.dropLabel}</span>
          </div>
        </div>
      </div>

      <footer className="mt-24 bg-on-surface text-surface py-20 px-0 overflow-hidden">
        <div className="flex flex-col space-y-4">
          <Marquee 
            text={texts.footerBigText[0]} 
            className="text-[12rem] font-black uppercase leading-[0.75] tracking-tighter opacity-10" 
          />
          <Marquee 
            text={texts.footerBigText[1]} 
            className="text-[12rem] font-black uppercase leading-[0.75] tracking-tighter text-primary-container" 
            reverse 
          />
          <Marquee 
            text={texts.footerBigText[2]} 
            className="text-[12rem] font-black uppercase leading-[0.75] tracking-tighter opacity-10" 
          />
        </div>
        <div className="mt-20 px-8 flex justify-between items-end border-t border-surface/20 pt-8 font-bold uppercase tracking-widest text-xs">
          <span>© {texts.copyright}</span>
          <div className="flex gap-12">
            <a className="hover:text-primary-container" href="#">
              {texts.footerLinks.terms}
            </a>
            <a className="hover:text-primary-container" href="#">
              {texts.footerLinks.shipping}
            </a>
            <a className="hover:text-primary-container" href="#">
              {texts.footerLinks.instagram}
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}