import { initializeApp } from "firebase/app";


const firebaseConfig = {
    apiKey: "AIzaSyCnlEe9-N0sUYkC7tRrAD0nfURvUDaE7SI",
    authDomain: "test-a198b.firebaseapp.com",
    projectId: "test-a198b",
    storageBucket: "test-a198b.firebasestorage.app",
    messagingSenderId: "174914233926",
    appId: "1:174914233926:web:e8acebe8879c2942eecc47",
    measurementId: "G-RFDKLD2X5K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export function getFirebase() {
    return app
}

