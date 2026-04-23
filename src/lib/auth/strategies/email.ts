import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { AuthCredentials, ILoginStrategy, IRegisterStrategy } from "../types";

export class EmailLoginStrategy implements ILoginStrategy {
  async login(credentials?: AuthCredentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("MISSING_CREDENTIALS");
    }
    const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return result.user;
  }
}

export class EmailRegisterStrategy implements IRegisterStrategy {
  async register(credentials?: AuthCredentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error("MISSING_CREDENTIALS");
    }
    const result = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
    return result.user;
  }
}
