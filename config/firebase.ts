import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyCrGRiPuKz1eixvYhZgZQ6nFud-wQqTCCw",
  authDomain: "mindmadeapp2.firebaseapp.com",
  projectId: "mindmadeapp2",
  storageBucket: "mindmadeapp2.firebasestorage.app",
  messagingSenderId: "173416491670",
  appId: "1:173416491670:web:c5d8046076a95fba6430b7",
  measurementId: "G-CGMNEKLJ8X"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// For web only: import { getAnalytics } from 'firebase/analytics';
// const analytics = getAnalytics(app); // Not used in React Native
export default app;