// Import required Firebase modules
import { initializeApp } from "firebase/app";
import { getFirestore, collection, writeBatch, doc } from "firebase/firestore";
// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDfa1McjlABequLyxQIvmasFvNU3IyQXbk",
    authDomain: "pharmacytools.firebaseapp.com",
    projectId: "pharmacytools",
    storageBucket: "pharmacytools.firebasestorage.app",
    messagingSenderId: "807028875436",
    appId: "1:807028875436:web:4b2dfa7cfc3a448f16bf09",
    measurementId: "G-04BW5CTRVC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample data structure (replace with your actual data)
// const data = require('D:\\Coding\\JS\\pharmacytools\\bleeps.json')

async function bulkImport() {
    try {
        // Use batched writes for better performance
        const batch = writeBatch(db);
        const collectionRef = collection(db, "contacts"); // Replace 'employees' with your collection name

        data.forEach((item) => {
            const docRef = doc(collectionRef);
            batch.set(docRef, item);
        });

        await batch.commit();
        console.log("Bulk import completed successfully!");
    } catch (error) {
        console.error("Error during bulk import:", error);
    }
}

// Run the import
bulkImport();
