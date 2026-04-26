"use client";

import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import AuthGuard from "@/components/layout/AuthGuard";
import Link from "next/link";

export default function AdminPage() {
  const { user } = useAuth();

  const adminModules = [
    {
      title: "Registro_De_Pedidos",
      description: "Monitoreo de transacciones y procesamiento de entregas.",
      icon: "local_shipping",
      link: "/admin/orders",
      status: "Operativo"
    },
    {
      title: "Registro_De_Usuarios",
      description: "Permisos de nodos y registros de autenticación.",
      icon: "group",
      link: "/admin/users",
      status: "Asegurado"
    },
    {
      title: "Solicitudes_De_Hardware",
      description: "Evaluación de GPUs y expedientes de Trade-In.",
      icon: "memory",
      link: "/admin/solicitudes",
      status: "Operativo"
    }
  ];

  return (
    <AuthGuard requireAdmin>
      <PageLayout>
        <div className="max-w-7xl mx-auto py-12 px-4">
          <header className="mb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-3 h-3 bg-error rounded-full animate-pulse"></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-error">Terminal_Del_Sistema_En_Vivo</span>
                </div>
                <h1 className="text-6xl font-black uppercase tracking-tighter italic leading-none">
                  Panel_Admin
                </h1>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs opacity-50 uppercase tracking-widest">Operador: {user?.email}</p>
                <p className="font-mono text-xs opacity-50 uppercase tracking-widest">Nivel_De_Acceso: Root_Admin</p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adminModules.map((module) => (
              <Link 
                key={module.title}
                href={module.link}
                className="group bg-surface-variant border border-outline-variant p-8 hover:border-primary transition-all duration-300 flex flex-col justify-between h-64 relative overflow-hidden"
              >
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-4xl mb-6 block group-hover:scale-110 transition-transform">
                    {module.icon}
                  </span>
                  <h2 className="text-xl font-black uppercase tracking-tight mb-2 italic">
                    {module.title}
                  </h2>
                  <p className="text-xs opacity-60 leading-relaxed font-medium">
                    {module.description}
                  </p>
                </div>
                
                <div className="relative z-10 flex items-center justify-between mt-6">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">
                    Estado: {module.status}
                  </span>
                  <span className="material-symbols-outlined text-xl opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                    arrow_forward
                  </span>
                </div>

                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                   <span className="material-symbols-outlined text-[120px]">
                    {module.icon}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageLayout>
    </AuthGuard>
  );
}
