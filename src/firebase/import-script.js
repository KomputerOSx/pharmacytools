// Import required Firebase modules
const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    writeBatch,
    doc,
} = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

// Firebase configuration
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

// Read the JSON file
const dataFilePath = path.join(__dirname, "bleeps.json");
let data;

try {
    const rawData = fs.readFileSync(dataFilePath, "utf8");
    data = JSON.parse(rawData);
    console.log(`Successfully loaded ${data.length} records from bleeps.json`);
} catch (error) {
    console.error("Error reading JSON file:", error);
    process.exit(1);
}

async function bulkImport() {
    try {
        // Use batched writes for better performance
        const batch = writeBatch(db);
        const collectionRef = collection(db, "contacts");

        let count = 0;
        for (const item of data) {
            const docRef = doc(collectionRef);
            batch.set(docRef, item);
            count++;

            // Firebase has a limit of 500 operations per batch
            if (count >= 450) {
                console.log(`Committing batch of ${count} records...`);
                await batch.commit();
                console.log("Batch committed successfully");

                // Reset for next batch
                count = 0;
                batch = writeBatch(db);
            }
        }

        // Commit any remaining items in the batch
        if (count > 0) {
            console.log(`Committing final batch of ${count} records...`);
            await batch.commit();
            console.log("Final batch committed successfully");
        }

        console.log("Bulk import completed successfully!");
    } catch (error) {
        console.error("Error during bulk import:", error);
    }
}

// Run the import
bulkImport()
    .then(() => console.log("Import process finished"))
    .catch((err) => console.error("Import process failed:", err));
