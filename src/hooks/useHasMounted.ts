"use client";

import { useState, useEffect } from 'react';

/**
 * Hook para detectar si el componente se ha montado en el cliente.
 * Útil para evitar errores de hidratación en Next.js al renderizar contenido
 * que depende del navegador (window, localStorage, etc).
 */
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
