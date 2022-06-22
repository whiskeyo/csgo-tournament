import { initializeApp } from "firebase/app";

/**
 * Object storing config used to connect with Firestore Database
 * @readonly
 * @object
 */
const firebaseConfig = {
  apiKey: "PLACEHOLDER",
  authDomain: "PLACEHOLDER",
  projectId: "PLACEHOLDER",
  storageBucket: "PLACEHOLDER",
  messagingSenderId: "PLACEHOLDER",
  appId: "PLACEHOLDER",
  measurementId: "PLACEHOLDER",
};

export const app = initializeApp(firebaseConfig);
