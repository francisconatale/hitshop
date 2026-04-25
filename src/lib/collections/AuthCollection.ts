import { doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, collection, Firestore } from "firebase/firestore";

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null | undefined;
  role?: "admin" | "user";
  createdAt?: string;
  name?: string;
  phone?: string;
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

  async updateUser(db: Firestore, uid: string, data: Partial<UserData>) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data as any);
  }

  async getUser(db: Firestore, uid: string): Promise<UserData | null> {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    if (!snapshot.exists()) return null;
    return snapshot.data() as UserData;
  }

  async getAllUsers(db: Firestore): Promise<UserData[]> {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => doc.data() as UserData);
  }

  async deleteUser(db: Firestore, uid: string) {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
  }
}

export default new AuthCollection();