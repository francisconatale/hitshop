import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { IRegisterStrategy, ILoginStrategy } from "../types";

const provider = new GoogleAuthProvider();

export class GoogleLoginStrategy implements ILoginStrategy {
  async login() {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }
}

export class GoogleRegisterStrategy implements IRegisterStrategy {
  async register() {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  }
}
