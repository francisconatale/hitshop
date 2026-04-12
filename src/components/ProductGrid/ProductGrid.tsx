import { apparelProducts, prints } from './types';
import { texts } from './texts';

function ProductCard({ product }: { product: import('./types').Product }) {
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

function PrintCard({ print }: { print: import('./types').Print }) {
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

export default function ProductGrid() {
  return (
    <>
      <div className="p-8">
        <div className="mb-16">
          <h1 className="text-huge font-black uppercase tracking-tighter border-b-[16px] border-on-surface pb-4">
            {texts.heroTitle}
          </h1>
          <div className="flex justify-between items-end mt-4">
            <p className="max-w-xl font-medium text-lg leading-tight">
              {texts.heroDescription}
            </p>
            <span className="text-xs font-black bg-on-surface text-surface px-4 py-2 uppercase">{texts.dropLabel}</span>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {apparelProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        <section className="border-t-[16px] border-on-surface pt-16">
          <div className="flex justify-between items-start mb-12">
            <h2 className="text-huge font-black uppercase tracking-tighter leading-none">{texts.peripheralsTitle}</h2>
            <div className="text-right">
              <p className="font-bold text-2xl uppercase italic">{texts.peripheralsSubtitle}</p>
              <p className="text-sm font-medium">{texts.peripheralsDescription}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {prints.map((print) => (
              <PrintCard key={print.id} print={print} />
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-24 bg-on-surface text-surface py-20 px-8 overflow-hidden">
        <div className="flex flex-col space-y-4">
          <div className="text-[12rem] font-black uppercase leading-[0.75] tracking-tighter whitespace-nowrap opacity-10 -ml-20">
            {texts.footerBigText[0]}
          </div>
          <div className="text-[12rem] font-black uppercase leading-[0.75] tracking-tighter whitespace-nowrap text-primary-container">
            {texts.footerBigText[1]}
          </div>
          <div className="text-[12rem] font-black uppercase leading-[0.75] tracking-tighter whitespace-nowrap opacity-10 ml-40">
            {texts.footerBigText[2]}
          </div>
        </div>
        <div className="mt-20 flex justify-between items-end border-t border-surface/20 pt-8 font-bold uppercase tracking-widest text-xs">
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