// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYq2gMg_kF07z9FQMHOMbB_Qvs7ar5otY",
    authDomain: "grade-calculator-3.firebaseapp.com",
    projectId: "grade-calculator-3",
    storageBucket: "grade-calculator-3.firebasestorage.app",
    messagingSenderId: "35484775534",
    appId: "1:35484775534:web:1ce8a1b16f98a85f6c227f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Set default persistence to local (30-90 days)
setPersistence(auth, browserLocalPersistence);

export { auth, db, setPersistence, browserLocalPersistence, browserSessionPersistence };
