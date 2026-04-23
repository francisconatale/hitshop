"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AppLocales } from "@/lib/collections/LocalesCollection";
import { useAuth } from "@/context/AuthContext";
import { useLocalesLoader } from "@/hooks/useLocalesLoader";
import { saveLocalesToCache, setNestedValue } from "@/locales/localesCache";
import { EditModeOverlay } from "@/components/ui/EditModeOverlay";
import localesCollection from "@/lib/collections/LocalesCollection";
import { db } from "@/lib/firebase";

type SavingState = 'idle' | 'saving' | 'saved';

interface LocalesContextType {
  locales: AppLocales;
  loading: boolean;
  isEditMode: boolean;
  updateLocale: (path: string, value: string) => Promise<void>;
}

const LocalesContext = createContext<LocalesContextType | undefined>(undefined);

export function LocalesProvider({ children }: { children: ReactNode }) {
  const { locales, setLocales, loading } = useLocalesLoader();
  const [isEditMode, setIsEditMode] = useState(false);
  const [savingState, setSavingState] = useState<SavingState>('idle');
  const { userData } = useAuth();

  // Escuchar atajo de teclado para Admin (Ctrl + Shift + E)
  useEffect(() => {
    if (userData?.role !== "admin") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setIsEditMode(prev => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [userData?.role]);

  const updateLocale = async (path: string, value: string) => {
    try {
      setSavingState('saving');
      const newLocales = setNestedValue(locales, path, value);
      setLocales(newLocales);
      saveLocalesToCache(newLocales);
      await localesCollection.saveLocales(db, newLocales);
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 2000);
    } catch (error) {
      console.error("Error saving locale:", error);
      setSavingState('idle');
      alert("Hubo un error al guardar el texto.");
    }
  };

  return (
    <LocalesContext.Provider value={{ locales, loading, isEditMode, updateLocale }}>
      {children}
      {isEditMode && <EditModeOverlay savingState={savingState} />}
    </LocalesContext.Provider>
  );
}

export function useLocalesContext() {
  const context = useContext(LocalesContext);
  if (!context) throw new Error("useLocalesContext must be used within a LocalesProvider");
  return context;
}
