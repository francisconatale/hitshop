import { User } from "firebase/auth";

export type AuthProvider = 'email' | 'google';

export interface AuthCredentials {
  email?: string;
  password?: string;
}

export interface ILoginStrategy {
  login(credentials?: AuthCredentials): Promise<User>;
}

export interface IRegisterStrategy {
  register(credentials?: AuthCredentials): Promise<User>;
}
