import SellHardwareForm from "@/components/product/SellHardwareForm";
import { CheckCircle, Clock, ShieldCheck, CurrencyDollar } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "Vendenos tu Hardware | HitShop",
  description: "Enviá los datos de tu placa de video u otro componente para que te hagamos una oferta.",
};

export default function SellHardwarePage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface pb-24">
      {/* Minimal Header */}
      <div className="border-b border-on-surface/10 bg-on-surface/[0.02]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
              Vendenos tu <span className="text-primary-fixed">Hardware</span>
            </h1>
            <p className="text-on-surface/60 font-mono text-sm uppercase tracking-widest leading-relaxed">
              Completá el expediente técnico de tu componente. Evaluamos el estado y te hacemos una oferta.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content: Asymmetric 2-Column Layout */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Process & Trust (Gestalt: Proximity & Similarity) */}
          <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-12">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b border-on-surface/10 pb-4">
                Cómo funciona
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-on-surface/5 flex items-center justify-center font-mono font-bold text-sm">01</div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-xs mb-2">Completá el expediente</h3>
                    <p className="text-on-surface/60 font-mono text-[10px] uppercase leading-relaxed">Detallá el estado técnico y adjuntá evidencia visual clara de tu componente.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-on-surface/5 flex items-center justify-center font-mono font-bold text-sm">02</div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-xs mb-2">Evaluación Técnica</h3>
                    <p className="text-on-surface/60 font-mono text-[10px] uppercase leading-relaxed">Nuestro equipo revisa las métricas (temperaturas, uso) y emite una cotización justa.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 shrink-0 bg-primary-fixed text-on-surface flex items-center justify-center font-mono font-bold text-sm brutal-shadow-sm">03</div>
                  <div>
                    <h3 className="font-black uppercase tracking-widest text-xs mb-2">Pago Inmediato</h3>
                    <p className="text-on-surface/60 font-mono text-[10px] uppercase leading-relaxed">Si aceptás la oferta, coordinamos la entrega y recibís tu dinero al instante o crédito a favor.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-on-surface/[0.02] border border-on-surface/10 p-8 space-y-6">
              <div className="flex items-center gap-3">
                <ShieldCheck size={24} weight="duotone" className="text-primary-fixed" />
                <span className="font-black uppercase tracking-widest text-sm">Proceso Seguro</span>
              </div>
              <p className="text-on-surface/60 font-mono text-[10px] uppercase leading-relaxed">
                Toda la información proporcionada es confidencial. Las cotizaciones se basan en el valor actual de mercado y el desgaste técnico reportado.
              </p>
            </div>
          </div>

          {/* Right Column: Form (Gestalt: Common Region) */}
          <div className="lg:col-span-8">
            <SellHardwareForm />
          </div>

        </div>
      </div>
    </div>
  );
}
