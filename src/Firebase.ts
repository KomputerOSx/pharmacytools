// Firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { Blog } from "@/types"; // Create this type file separately

const firebaseConfig =  {
    apiKey: "AIzaSyDfa1McjlABequLyxQIvmasFvNU3IyQXbk",
    authDomain: "pharmacytools.firebaseapp.com",
    projectId: "pharmacytools",
    storageBucket: "pharmacytools.firebasestorage.app",
    messagingSenderId: "807028875436",
    appId: "1:807028875436:web:4b2dfa7cfc3a448f16bf09",
    measurementId: "G-04BW5CTRVC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const firebaseService = {
    // Get all blogs
    getBlogs: async (): Promise<Blog[]> => {
        const colRef = collection(db, "blogs");
        const snapshot = await getDocs(colRef);
        return snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            content: doc.data().content,
        }));
    },

    // Add new blog
    addBlog: async (blog: Omit<Blog, 'id'>): Promise<string> => {
        const colRef = collection(db, "blogs");
        const docRef = await addDoc(colRef, blog);
        return docRef.id;
    },

    // Update blog
    updateBlog: async (id: string, blog: Partial<Blog>): Promise<void> => {
        const docRef = doc(db, "blogs", id);
        await updateDoc(docRef, blog);
    },

    // Delete blog
    deleteBlog: async (id: string): Promise<void> => {
        const docRef = doc(db, "blogs", id);
        await deleteDoc(docRef);
    }
};



export function getFirebase() {
    return app;
}