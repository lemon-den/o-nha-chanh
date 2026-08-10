import { useState, useEffect } from 'react';
import { Character } from '../types';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);

  // Lắng nghe dữ liệu realtime từ Firebase Firestore
  useEffect(() => {
    const q = query(collection(db, 'characters'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const charData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Character[];
      setCharacters(charData);
    }, (error) => {
      console.error("Lỗi tải danh sách nhân vật từ Firebase: ", error);
    });

    return () => unsubscribe();
  }, []);

  // Thêm nhân vật mới lên Firebase
  const addCharacter = async (char: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await addDoc(collection(db, 'characters'), {
        ...char,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        views: 1,
        clicks: 0,
        feedbacks: []
      });
    } catch (error) {
      console.error("Lỗi khi thêm bé chanh: ", error);
      alert("Lỗi mạng rồi, không lưu được nhân vật lên mây!");
    }
  };

  // Cập nhật nhân vật
  const updateCharacter = async (id: string, updates: Partial<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const charDocRef = doc(db, 'characters', id);
      await updateDoc(charDocRef, {
        ...updates,
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật bé chanh: ", error);
      alert("Lỗi mạng rồi, không cập nhật được!");
    }
  };

  // Xóa nhân vật
  const deleteCharacter = async (id: string) => {
    try {
      const charDocRef = doc(db, 'characters', id);
      await deleteDoc(charDocRef);
    } catch (error) {
      console.error("Lỗi khi xóa bé chanh: ", error);
    }
  };

  return {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  };
}
