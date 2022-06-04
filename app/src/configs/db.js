import { getFirestore } from "firebase/firestore";
import { app } from './firebase';

// Get a Firestore instance
export const db = getFirestore(app);