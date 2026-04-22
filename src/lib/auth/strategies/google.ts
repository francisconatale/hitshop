import { GoogleAuthProvider, signInWithPopup, User } from "firebase/auth";
import { auth } from "../../firebase";
import { ILoginStrategy, IRegisterStrategy } from "../types";

const googleProvider = new GoogleAuthProvider();

export class GoogleLoginStrategy implements ILoginStrategy {
  async login(): Promise<User> {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
  }
}

export class GoogleRegisterStrategy implements IRegisterStrategy {
  async register(): Promise<User> {
    const userCredential = await signInWithPopup(auth, googleProvider);
    return userCredential.user;
  }
}
