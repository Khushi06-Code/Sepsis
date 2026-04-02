import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

let pendingAuthPromise = null;

export const waitForAuth = () => {
  if (auth.currentUser) {
    return Promise.resolve(auth.currentUser);
  }

  if (pendingAuthPromise) {
    return pendingAuthPromise;
  }

  pendingAuthPromise = new Promise((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      unsubscribe();
      pendingAuthPromise = null;
      reject(new Error("Authentication session not ready"));
    }, 10000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (!user) {
          return;
        }

        window.clearTimeout(timeoutId);
        unsubscribe();
        pendingAuthPromise = null;
        resolve(user);
      },
      (error) => {
        window.clearTimeout(timeoutId);
        unsubscribe();
        pendingAuthPromise = null;
        reject(error);
      }
    );
  });

  return pendingAuthPromise;
};
