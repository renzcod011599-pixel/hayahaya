// Import Firebase core
import { initializeApp } from "firebase/app";

// Firestore (database)
import { getFirestore } from "firebase/firestore";

// Authentication
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Storage (optional for images)
import { getStorage } from "firebase/storage";

// 🔥 Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDe5gw1jmuDMZcltULD9vYGg101CWIoJEc",
  authDomain: "hayahaya-7b8d6.firebaseapp.com",
  projectId: "hayahaya-7b8d6",
  storageBucket: "hayahaya-7b8d6.appspot.com",
  messagingSenderId: "45653520172",
  appId: "1:45653520172:web:9e08d7c4153f3c9a57c689"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firestore database
export const db = getFirestore(app);

// ✅ Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// ✅ Storage (for future image uploads)
export const storage = getStorage(app);

// (optional)
export default app;