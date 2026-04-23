import { signOut, onAuthStateChanged, User, deleteUser } from "firebase/auth";
import { auth } from "../firebase";
import { AuthCredentials, ILoginStrategy, IRegisterStrategy, AuthProvider } from "./types";
import { EmailLoginStrategy, EmailRegisterStrategy } from "./strategies/email";
import { GoogleLoginStrategy, GoogleRegisterStrategy } from "./strategies/google";
import { collectionService } from "../collections/CollectionService";
import { UserData } from "../collections/AuthCollection";

export class AuthService {
  private getLoginStrategy(provider: AuthProvider): ILoginStrategy {
    switch (provider) {
      case 'email': return new EmailLoginStrategy();
      case 'google': return new GoogleLoginStrategy();
      default: throw new Error(`Proveedor de login no soportado: ${provider}`);
    }
  }

  private getRegisterStrategy(provider: AuthProvider): IRegisterStrategy {
    switch (provider) {
      case 'email': return new EmailRegisterStrategy();
      case 'google': return new GoogleRegisterStrategy();
      default: throw new Error(`Proveedor de registro no soportado: ${provider}`);
    }
  }

  async login(provider: AuthProvider, credentials?: AuthCredentials): Promise<User> {
    const strategy = this.getLoginStrategy(provider);
    return await strategy.login(credentials);
  }

  async register(provider: AuthProvider, credentials?: AuthCredentials): Promise<User> {
    const strategy = this.getRegisterStrategy(provider);
    const user = await strategy.register(credentials);
    const userData = this.mergeUserData(user, credentials);

    try {
      await collectionService.createUser(userData);
      return user;
    } catch (error) {
      console.error("AuthService: Error al crear usuario en DB. Ejecutando Rollback...");
      await deleteUser(user);
      throw new Error("REGISTRATION_FAILED_DATABASE_ERROR");
    }
  }

  private mergeUserData(user: User, credentials?: AuthCredentials): UserData {
    return {
      uid: user.uid,
      email: user.email ?? credentials?.email ?? null,
      displayName: credentials?.displayName ?? user.displayName,
    };
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
