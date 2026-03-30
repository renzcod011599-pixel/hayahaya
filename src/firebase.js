import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBE7uSVn95LxIwBIUB2kV1vOxjytD7K_WE",
  authDomain: "apartment-finder-125c0.firebaseapp.com",
  projectId: "apartment-finder-125c0",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// 🔥 NEW (auth)
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();