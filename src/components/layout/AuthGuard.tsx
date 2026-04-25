"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { AdminSkeleton } from "../ui/AdminSkeleton";
import PageLayout from "./PageLayout";

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

  // Mientras carga la sesión, mostramos el skeleton para no ver blanco
  if (loading) return <PageLayout><AdminSkeleton /></PageLayout>;

  // Verificaciones de seguridad antes de renderizar el contenido
  if (inverse && user) return <PageLayout><AdminSkeleton /></PageLayout>;
  if (!inverse && !user) return <PageLayout><AdminSkeleton /></PageLayout>;
  if (requireAdmin && userData?.role !== 'admin') return <PageLayout><AdminSkeleton /></PageLayout>;

  return <>{children}</>;
}
