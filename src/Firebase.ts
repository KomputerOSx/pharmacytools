// Firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { Blog } from "@/types"; // Create this type file separately

const firebaseConfig = {
    apiKey: "AIzaSyDkX-oVmYk1KMVInuBMUPMxt5pvt0gpnEw",
    authDomain: "locum-guides.firebaseapp.com",
    projectId: "locum-guides",
    storageBucket: "locum-guides.firebasestorage.app",
    messagingSenderId: "1048727841562",
    appId: "1:1048727841562:web:543c12a6d73805ceb61aa3",
    measurementId: "G-986KFBNV0R"
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