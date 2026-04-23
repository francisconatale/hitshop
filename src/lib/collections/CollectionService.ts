import { db } from "../firebase";
import authCollection, { UserData } from "./AuthCollection";

export class CollectionService {
  async createUser(data: UserData) {
    await authCollection.createUser(db, data);
  }

  async getUser(uid: string) {
    return await authCollection.getUser(db, uid);
  }
}

export const collectionService = new CollectionService();