import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../firebase";
import { AuthCredentials, ILoginStrategy, IRegisterStrategy, AuthProvider } from "./types";
import { EmailLoginStrategy, EmailRegisterStrategy } from "./strategies/email";
import { GoogleLoginStrategy, GoogleRegisterStrategy } from "./strategies/google";

export class AuthService {
  private getLoginStrategy(provider: AuthProvider): ILoginStrategy {
    switch (provider) {
      case 'email':
        return new EmailLoginStrategy();
      case 'google':
        return new GoogleLoginStrategy();
      default:
        throw new Error(`Proveedor de login no soportado: ${provider}`);
    }
  }

  private getRegisterStrategy(provider: AuthProvider): IRegisterStrategy {
    switch (provider) {
      case 'email':
        return new EmailRegisterStrategy();
      case 'google':
        return new GoogleRegisterStrategy();
      default:
        throw new Error(`Proveedor de registro no soportado: ${provider}`);
    }
  }

  async login(provider: AuthProvider, credentials?: AuthCredentials): Promise<User> {
    try {
      const strategy = this.getLoginStrategy(provider);
      return await strategy.login(credentials);
    } catch (error) {
      console.error(`AuthService: Error en login con ${provider}:`, error);
      throw error;
    }
  }

  async register(provider: AuthProvider, credentials?: AuthCredentials): Promise<User> {
    try {
      const strategy = this.getRegisterStrategy(provider);
      return await strategy.register(credentials);
    } catch (error) {
      console.error(`AuthService: Error en registro con ${provider}:`, error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("AuthService: Error al cerrar sesión:", error);
      throw error;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  getCurrentUser(): User | null {
    return auth.currentUser;
  }
}
