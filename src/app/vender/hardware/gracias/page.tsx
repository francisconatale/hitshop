import Link from "next/link";

export default function SellHardwareSuccessPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-xl w-full border-2 border-primary-fixed bg-surface p-8 md:p-12 brutal-shadow-primary">
        <span className="material-symbols-outlined text-6xl text-primary-fixed mb-6 block">task_alt</span>
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-on-surface mb-4">
          Expediente Recibido
        </h1>
        <p className="text-on-surface/60 font-mono text-sm uppercase tracking-widest leading-relaxed mb-8">
          Nuestro equipo técnico evaluará la propuesta. Nos pondremos en contacto por el medio indicado en menos de 48 horas hábiles con una respuesta u oferta.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-on-surface text-surface px-8 py-4 font-black uppercase text-xs tracking-widest hover:bg-primary-fixed hover:text-on-surface transition-colors brutal-shadow"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          VOLVER AL INVENTARIO
        </Link>
      </div>
    </div>
  );
}
