import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBOjdnF7crqIrMN_b8DPcqc-b9BKTkJohE",
  authDomain: "sepsis-61cfa.firebaseapp.com",
  projectId: "sepsis-61cfa",
  storageBucket: "sepsis-61cfa.firebasestorage.app",
  messagingSenderId: "323020438448",
  appId: "1:323020438448:web:71ab9b896d164680d2f475",
  measurementId: "G-RRS90SNF3X",
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
