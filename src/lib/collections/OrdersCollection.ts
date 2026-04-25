import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  where, 
  orderBy, 
  Firestore,
  serverTimestamp,
  writeBatch
} from "firebase/firestore";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export interface Order {
  id: string;
  userId: string | null;
  items: OrderItem[];
  total: number;
  identity: {
    name: string;
    phone: string;
    notes: string;
  };
  payment: {
    method: string;
    address: string | null;
    pickup: boolean;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: any;
}

export class OrdersCollection {
  private collectionName = "orders";

  async createOrder(db: Firestore, orderData: Omit<Order, 'createdAt'>) {
    const batch = writeBatch(db);

    // Referencia de la orden
    const orderRef = doc(db, this.collectionName, orderData.id);
    batch.set(orderRef, {
      ...orderData,
      createdAt: serverTimestamp()
    });

    // Marcar cada producto como vendido
    orderData.items.forEach(item => {
      const productRef = doc(db, "products", item.id);
      batch.update(productRef, { selled: true });
    });

    await batch.commit();
    return orderData.id;
  }

  async getOrder(db: Firestore, orderId: string): Promise<Order | null> {
    const orderRef = doc(db, this.collectionName, orderId);
    const snapshot = await getDoc(orderRef);
    if (!snapshot.exists()) return null;
    return snapshot.data() as Order;
  }

  async getUserOrders(db: Firestore, userId: string): Promise<Order[]> {
    const ordersRef = collection(db, this.collectionName);
    const q = query(
      ordersRef, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Order);
  }

  async getAllOrders(db: Firestore): Promise<Order[]> {
    const ordersRef = collection(db, this.collectionName);
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Order);
  }

  async updateOrderStatus(db: Firestore, orderId: string, status: Order['status']) {
    const batch = writeBatch(db);
    const orderRef = doc(db, this.collectionName, orderId);
    
    // Actualizamos el estado de la orden
    batch.update(orderRef, { status });

    // Si el estado es 'completed', marcamos los productos como vendidos
    if (status === 'completed') {
      const snapshot = await getDoc(orderRef);
      if (snapshot.exists()) {
        const orderData = snapshot.data() as Order;
        orderData.items.forEach(item => {
          const productRef = doc(db, "products", item.id);
          batch.update(productRef, { selled: true });
        });
      }
    }

    await batch.commit();
  }

  async deleteOrder(db: Firestore, orderId: string) {
    const orderRef = doc(db, this.collectionName, orderId);
    await deleteDoc(orderRef);
  }
}

export default new OrdersCollection();
