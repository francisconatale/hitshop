"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import localesCollection, { AppLocales } from "@/lib/collections/LocalesCollection";
import * as fallbackLocales from "@/locales/index";
import { getCachedLocales, saveLocalesToCache, mergeLocales } from "@/locales/localesCache";

export function useLocalesLoader() {
  const [locales, setLocales] = useState<AppLocales>(fallbackLocales);
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
