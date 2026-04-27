"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface NotificationType {
  message: string;
  type: 'add' | 'remove' | 'system' | 'error';
  id: number;
}

interface SystemUIContextType {
  notification: NotificationType | null;
  showNotification: (message: string, type?: NotificationType['type']) => void;
  hideNotification: () => void;
}

const SystemUIContext = createContext<SystemUIContextType | undefined>(undefined);

export function SystemUIProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<NotificationType | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const hideNotification = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setNotification(null);
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType['type'] = 'system') => {
    // Limpiar cualquier notificación previa inmediatamente
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const id = Date.now();
    setNotification({ message, type, id });

    timerRef.current = setTimeout(() => {
      setNotification(prev => prev?.id === id ? null : prev);
    }, 3000);
  }, []);

  return (
    <SystemUIContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </SystemUIContext.Provider>
  );
}

export function useSystemUI() {
  const context = useContext(SystemUIContext);
  if (!context) throw new Error('useSystemUI must be used within SystemUIProvider');
  return context;
}
