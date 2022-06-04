// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBXQMByC_McVaPW6FwuBiCOjK9H2iEzDjA",
    authDomain: "cstrikers-dev-ff691.firebaseapp.com",
    projectId: "cstrikers-dev-ff691",
    storageBucket: "cstrikers-dev-ff691.appspot.com",
    messagingSenderId: "328582704510",
    appId: "1:328582704510:web:4c72e56e6881768c17572f",
    measurementId: "G-KKYJW4NEL0"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);