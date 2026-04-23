import { AppLocales } from "@/lib/collections/LocalesCollection";
import * as fallbackLocales from "@/locales/index";

const CACHE_KEY = "app_locales_cache";
const CACHE_TIME_MS = 1000 * 60 * 60 * 24; // 24 horas

interface LocalesCache {
  data: AppLocales;
  timestamp: number;
}

export function getCachedLocales(): AppLocales | null {
  if (typeof window === "undefined") return null;
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  try {
    const parsedCache: LocalesCache = JSON.parse(cached);
    if (Date.now() - parsedCache.timestamp < CACHE_TIME_MS) {
      return parsedCache.data;
    }
  } catch (error) {
    console.warn("Invalid locales cache:", error);
  }

  return null;
}

export function saveLocalesToCache(locales: AppLocales) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: locales,
    timestamp: Date.now()
  }));
}

export function mergeLocales(remoteLocales: AppLocales): AppLocales {
  return { ...fallbackLocales, ...remoteLocales };
}

export function setNestedValue(obj: any, path: string, value: any): any {
  const keys = path.split(".");
  const newObj = { ...obj };
  let current = newObj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    current[key] = { ...current[key] };
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;

  return newObj;
}
