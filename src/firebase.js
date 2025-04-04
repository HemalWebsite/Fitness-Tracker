






import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  


const firebaseConfig = {
  apiKey: "AIzaSyDDsYzuUBDQq1h-VBf8zliZZJOyMsw70lU",
  authDomain: "fitness-tracker-a5714.firebaseapp.com",
  projectId: "fitness-tracker-a5714",
  storageBucket: "fitness-tracker-a5714.firebasestorage.app",
  messagingSenderId: "506498589471",
  appId: "1:506498589471:web:68bbea2f6ec25b353d462a"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };  




