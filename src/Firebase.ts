// Firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { Blog } from "@/types"; // Create this type file separately

const firebaseConfig = {
    apiKey: "AIzaSyCnlEe9-N0sUYkC7tRrAD0nfURvUDaE7SI",
    authDomain: "test-a198b.firebaseapp.com",
    projectId: "test-a198b",
    storageBucket: "test-a198b.firebasestorage.app",
    messagingSenderId: "174914233926",
    appId: "1:174914233926:web:e8acebe8879c2942eecc47",
    measurementId: "G-RFDKLD2X5K"
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