import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from "firebase/auth";
import { auth } from "../../firebase";
import { AuthCredentials, ILoginStrategy, IRegisterStrategy } from "../types";

export class EmailLoginStrategy implements ILoginStrategy {
  async login(credentials?: AuthCredentials): Promise<User> {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Se requiere email y contraseña para iniciar sesión.");
    }
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return userCredential.user;
  }
}

export class EmailRegisterStrategy implements IRegisterStrategy {
  async register(credentials?: AuthCredentials): Promise<User> {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("Se requiere email y contraseña para registrarse.");
    }
    const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
    return userCredential.user;
  }
}
