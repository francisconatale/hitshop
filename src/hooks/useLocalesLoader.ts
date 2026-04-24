"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import localesCollection, { AppLocales } from "@/lib/collections/LocalesCollection";
import { productTexts, navItems, sidebar, ticker } from "@/locales/index";
import { getCachedLocales, saveLocalesToCache, mergeLocales } from "@/locales/localesCache";

const INITIAL_LOCALES: AppLocales = {
  productTexts,
  navItems,
  sidebar,
  ticker
};

export function useLocalesLoader() {
  const [locales, setLocales] = useState<AppLocales>(INITIAL_LOCALES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadLocales() {
      try {
        const cached = getCachedLocales();
        if (cached) {
          setLocales(cached);
          setLoading(false);
        }

        const remoteLocales = await localesCollection.getLocales(db);

        if (!isMounted) return;

        if (remoteLocales) {
          const mergedLocales = mergeLocales(remoteLocales);
          setLocales(mergedLocales);
          saveLocalesToCache(mergedLocales);
        }
      } catch (error) {
        console.error("Error fetching locales from Firestore:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadLocales();

    return () => {
      isMounted = false;
    };
  }, []);

  return { locales, setLocales, loading };
}
