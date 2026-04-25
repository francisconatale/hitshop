import { db } from "../firebase";
import authCollection, { UserData } from "./AuthCollection";
import ordersCollection, { Order } from "./OrdersCollection";

export class CollectionService {
  // User Methods
  async createUser(data: UserData) {
    await authCollection.createUser(db, data);
  }

  async getUser(uid: string) {
    return await authCollection.getUser(db, uid);
  }

  async updateUser(uid: string, data: Partial<UserData>) {
    await authCollection.updateUser(db, uid, data);
  }

  async getAllUsers() {
    return await authCollection.getAllUsers(db);
  }

  async deleteUser(uid: string) {
    await authCollection.deleteUser(db, uid);
  }

  // Order Methods
  async createOrder(orderData: Omit<Order, 'createdAt'>) {
    return await ordersCollection.createOrder(db, orderData);
  }

  async getUserOrders(userId: string) {
    return await ordersCollection.getUserOrders(db, userId);
  }

  async getAllOrders() {
    return await ordersCollection.getAllOrders(db);
  }

  async updateOrderStatus(orderId: string, status: Order['status']) {
    await ordersCollection.updateOrderStatus(db, orderId, status);
  }

  async deleteOrder(orderId: string) {
    await ordersCollection.deleteOrder(db, orderId);
  }
}

export const collectionService = new CollectionService();