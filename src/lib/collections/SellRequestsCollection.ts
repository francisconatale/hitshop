import { doc, setDoc, getDocs, deleteDoc, collection, Firestore, query, orderBy, Timestamp, where, updateDoc } from "firebase/firestore";
import { SellRequest } from "@/types/sell";

export class SellRequestsCollection {
  async createSellRequest(db: Firestore, request: Omit<SellRequest, 'id' | 'createdAt' | 'status'>): Promise<string> {
    const id = crypto.randomUUID();
    const docRef = doc(db, "sell_requests", id);
    
    const data: SellRequest = {
      ...request,
      id,
      status: 'pending',
      createdAt: new Date(),
    };

    await setDoc(docRef, data);
    return id;
  }

  async getSellRequests(db: Firestore): Promise<SellRequest[]> {
    const q = query(collection(db, "sell_requests"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as SellRequest;
    });
  }

  async getUserSellRequests(db: Firestore, userId: string): Promise<SellRequest[]> {
    const q = query(
      collection(db, "sell_requests"), 
      where("userId", "==", userId)
    );
    const snap = await getDocs(q);
    const requests = snap.docs.map(d => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        createdAt: (data.createdAt as Timestamp).toDate(),
      } as SellRequest;
    });

    // Sort in memory to avoid index requirement
    return requests.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateSellRequest(db: Firestore, id: string, data: Partial<SellRequest>): Promise<void> {
    const docRef = doc(db, "sell_requests", id);
    await updateDoc(docRef, data);
  }

  async deleteSellRequest(db: Firestore, id: string): Promise<void> {
    const docRef = doc(db, "sell_requests", id);
    await deleteDoc(docRef);
  }
}

export default new SellRequestsCollection();
