import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSqqxYr2OAqCats9TvBWCJf5hGKZEpApo",
  authDomain: "o-roleplay-nha-chanh.firebaseapp.com",
  projectId: "o-roleplay-nha-chanh",
  storageBucket: "o-roleplay-nha-chanh.firebasestorage.app",
  messagingSenderId: "772035995866",
  appId: "1:772035995866:web:d5686aacb690fa7c069de3",
  measurementId: "G-JNTQYME8N6"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất db ra để file useCharacters.ts có thể xài được
export const db = getFirestore(app);
