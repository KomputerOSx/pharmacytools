// Firebase.ts
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy,
} from "firebase/firestore";
import { Contact } from "@/firebase/types"; // Create this type file separately

const firebaseConfig = {
    apiKey: "AIzaSyDfa1McjlABequLyxQIvmasFvNU3IyQXbk",
    authDomain: "pharmacytools.firebaseapp.com",
    projectId: "pharmacytools",
    storageBucket: "pharmacytools.firebasestorage.app",
    messagingSenderId: "807028875436",
    appId: "1:807028875436:web:4b2dfa7cfc3a448f16bf09",
    measurementId: "G-04BW5CTRVC",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const firebaseService = {
    // Get all contacts
    getContacts: async (): Promise<Contact[]> => {
        const colRef = collection(db, "contacts");
        const q = query(colRef, orderBy("name"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
            number: doc.data().number,
            site: doc.data().site,
            department: doc.data().department,
        }));
    },

    // Add new contact
    addContact: async (contact: Omit<Contact, "id">): Promise<string> => {
        const colRef = collection(db, "contacts");
        const docRef = await addDoc(colRef, contact);
        return docRef.id;
    },

    // Update contact
    updateContact: async (
        id: string,
        contact: Partial<Omit<Contact, "id">>
    ): Promise<void> => {
        const docRef = doc(db, "contacts", id);
        await updateDoc(docRef, contact);
    },

    // Delete blog
    deleteContact: async (id: string): Promise<void> => {
        const docRef = doc(db, "contacts", id);
        await deleteDoc(docRef);
    },
};

export function getFirebase() {
    return app;
}
