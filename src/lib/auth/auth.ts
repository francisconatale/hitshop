import { AuthService } from "./AuthService";

// Re-exportamos auth desde firebase para que siga estando disponible en este módulo
export { auth } from "../firebase";

// Exportamos todas las interfaces y las estrategias para que la app pueda usarlas
export * from "./types";
export * from "./strategies/email";
export * from "./strategies/google";
export * from "./AuthService";

// Instancia exportada por defecto lista para usar
export const authService = new AuthService();
