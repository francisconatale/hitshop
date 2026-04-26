import { db } from "../firebase";
import authCollection, { UserData } from "./AuthCollection";
import ordersCollection, { Order } from "./OrdersCollection";
import productsCollection from "./ProductsCollection";
import sellRequestsCollection from "./SellRequestsCollection";
import contactsCollection from "./ContactsCollection";
import { Product, ProductAdminRequest, UpdateProductRequest } from "@/types/product";
import { ContactRequest, UpdateContactRequest } from "@/types/contact";
import { SellRequest } from "@/types/sell";

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
    return await ordersCollection.updateOrderStatus(db, orderId, status);
  }

  async deleteOrder(orderId: string) {
    return await ordersCollection.deleteOrder(db, orderId);
  }

  // Product Methods
  async getProducts(isAdmin: boolean) {
    return await productsCollection.getProducts(db, isAdmin);
  }

  async createProduct(request: ProductAdminRequest) {
    return await productsCollection.createProduct(db, request);
  }

  async updateProduct(id: string, request: UpdateProductRequest) {
    return await productsCollection.updateProduct(db, id, request);
  }

  async deleteProduct(id: string) {
    return await productsCollection.deleteProduct(db, id);
  }

  // Sell Request Methods
  async getSellRequests() {
    return await sellRequestsCollection.getSellRequests(db);
  }

  async getUserSellRequests(userId: string) {
    return await sellRequestsCollection.getUserSellRequests(db, userId);
  }

  async createSellRequest(request: any) {
    return await sellRequestsCollection.createSellRequest(db, request);
  }

  async updateSellRequest(id: string, data: Partial<SellRequest>) {
    return await sellRequestsCollection.updateSellRequest(db, id, data);
  }

  async deleteSellRequest(id: string) {
    return await sellRequestsCollection.deleteSellRequest(db, id);
  }

  // Contact Methods
  async getContacts() {
    return await contactsCollection.getContacts(db);
  }

  async getContactById(id: string) {
    return await contactsCollection.getContactById(db, id);
  }

  async createContact(request: ContactRequest) {
    return await contactsCollection.createContact(db, request);
  }

  async updateContact(id: string, request: UpdateContactRequest) {
    return await contactsCollection.updateContact(db, id, request);
  }

  async deleteContact(id: string) {
    return await contactsCollection.deleteContact(db, id);
  }
}

export const collectionService = new CollectionService();
