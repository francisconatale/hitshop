export interface Contact {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ContactRequest {
    name: string;
    phone?: string;
    email?: string;
    whatsapp?: string;
}

export type UpdateContactRequest = Partial<ContactRequest>;
