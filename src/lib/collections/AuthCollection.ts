import { doc, setDoc, getDoc, Firestore } from "firebase/firestore";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null | undefined;
  role?: "admin" | "user";
  createdAt?: string;
  name?: string;
}

export class AuthCollection {
  async createUser(db: Firestore, data: UserData) {
    const userRef = doc(db, "users", data.uid);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) return;

    await setDoc(userRef, {
      name: data.displayName || "Anonymous User",
      email: data.email,
      uid: data.uid,
      role: "user",
      createdAt: new Date().toISOString(),
    });
  }

  async getUser(db: Firestore, uid: string): Promise<UserData | null> {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return null;
    return snapshot.data() as UserData;
  }
}

export default new AuthCollection();