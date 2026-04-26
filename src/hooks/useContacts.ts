"use client";

import { useState, useEffect } from "react";
import { collectionService } from "@/lib/collections/CollectionService";
import { Contact } from "@/types/contact";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        setLoading(true);
        const fetchedContacts = await collectionService.getContacts();
        setContacts(fetchedContacts);
      } catch (err) {
        console.error("Error fetching contacts:", err);
        setError("Error al cargar los contactos");
      } finally {
        setLoading(false);
      }
    }

    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
  };
}
