"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requireAdmin?: boolean;
  inverse?: boolean; // Para login/register: si hay usuario, redirige a home
}

export default function AuthGuard({ children, requireAdmin = false, inverse = false }: AuthGuardProps) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (inverse && user) {
        router.push("/");
      } else if (!inverse && !user) {
        router.push("/login");
      } else if (requireAdmin && userData?.role !== 'admin') {
        router.push("/");
      }
    }
  }, [user, userData, loading, router, requireAdmin, inverse]);

  // Si está cargando, o las condiciones no se cumplen, suspendemos visualmente
  // (El loading.tsx de Next.js se encargará de mostrar el spinner si envolvemos la página)
  if (loading) return null;

  // Verificaciones de seguridad antes de renderizar el contenido
  if (inverse && user) return null;
  if (!inverse && !user) return null;
  if (requireAdmin && userData?.role !== 'admin') return null;

  return <>{children}</>;
}
