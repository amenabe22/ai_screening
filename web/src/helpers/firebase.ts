import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
    apiKey: "AIzaSyCBqT2pAfuDTq0P6imQVJj9ovrp40KlmdE",
    authDomain: "spotteo-8bda0.firebaseapp.com",
    projectId: "spotteo-8bda0",
    storageBucket: "spotteo-8bda0.firebasestorage.app",
    messagingSenderId: "5407709492",
    appId: "1:5407709492:web:f9b3eee364eae77c87ed61"
};

const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);