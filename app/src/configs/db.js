import { getFirestore } from "firebase/firestore";
import { app } from "./firebase";

/**
 * Database object based on the Firebase config file
 * @readonly
 * @object
 */
export const db = getFirestore(app);
