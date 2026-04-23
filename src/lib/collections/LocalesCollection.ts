import { doc, getDoc, setDoc, Firestore } from "firebase/firestore";
import * as fallbackLocales from "@/locales/index";

export type AppLocales = typeof fallbackLocales;

export class LocalesCollection {
  /**
   * Obtiene los locales desde Firestore.
   * Si no existen, retorna null para que el hook use el fallback.
   */
  async getLocales(db: Firestore): Promise<AppLocales | null> {
    const snap = await getDoc(doc(db, "settings", "locales"));
    if (snap.exists()) {
      return snap.data() as AppLocales;
    }
    return null;
  }

  /**
   * Función de utilidad para inicializar/actualizar los textos en Firestore 
   * desde el archivo local (útil para el panel de admin).
   */
  async saveLocales(db: Firestore, locales: Partial<AppLocales>): Promise<void> {
    await setDoc(doc(db, "settings", "locales"), locales, { merge: true });
  }
}

export default new LocalesCollection();
