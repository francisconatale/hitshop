"use client";

import { ReactNode } from "react";
import { useHasMounted } from "@/hooks/useHasMounted";

/**
 * Wrapper para evitar errores de hidratación en Next.js.
 * Todo lo que esté dentro de este componente solo se renderizará en el cliente.
 */
export default function ClientOnly({ children }: { children: ReactNode }) {
  const hasMounted = useHasMounted();

  if (!hasMounted) return null;

  return <>{children}</>;
}
