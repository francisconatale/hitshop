import { doc, setDoc, updateDoc, getDocs, deleteDoc, getDoc, collection, Firestore } from "firebase/firestore";
import { Contact, ContactRequest, UpdateContactRequest } from "@/types/contact";

export class ContactsCollection {
    /**
     * Obtiene todos los contactos.
     */
    async getContacts(db: Firestore): Promise<Contact[]> {
        const snap = await getDocs(collection(db, "contacts"));
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Contact));
    }

    /**
     * Obtiene un contacto por su ID.
     */
    async getContactById(db: Firestore, id: string): Promise<Contact | null> {
        const snap = await getDoc(doc(db, "contacts", id));
        if (!snap.exists()) return null;
        return { ...snap.data(), id: snap.id } as Contact;
    }

    /**
     * Crea un nuevo contacto.
     */
    async createContact(db: Firestore, request: ContactRequest): Promise<string> {
        const id = crypto.randomUUID();
        const contactData = {
            ...request,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        await setDoc(doc(db, "contacts", id), contactData);
        return id;
    }

    /**
     * Actualiza un contacto existente.
     */
    async updateContact(db: Firestore, id: string, request: UpdateContactRequest): Promise<string> {
        const updates: any = { ...request, updatedAt: new Date() };
        await updateDoc(doc(db, "contacts", id), updates);
        return id;
    }

    /**
     * Elimina un contacto.
     */
    async deleteContact(db: Firestore, id: string): Promise<string> {
        await deleteDoc(doc(db, "contacts", id));
        return id;
    }
}

export default new ContactsCollection();
