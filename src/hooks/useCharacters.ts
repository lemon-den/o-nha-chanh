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
  orderBy,
  getDocs 
} from 'firebase/firestore';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'characters'), orderBy('createdAt', 'desc'));
    
    // Kiểm tra và tự động đẩy dữ liệu từ LocalStorage lên Firebase nếu Firebase đang trống
    const checkAndSyncLocalData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'characters'));
        if (querySnapshot.empty) {
          const localSaved = localStorage.getItem('rp-characters');
          if (localSaved) {
            const oldChars = JSON.parse(localSaved);
            if (Array.isArray(oldChars) && oldChars.length > 0) {
              console.log(`Đang tự động đẩy ${oldChars.length} bé chanh cũ lên Firebase...`);
              for (const c of oldChars) {
                const { id, ...data } = c;
                await addDoc(collection(db, 'characters'), {
                  ...data,
                  createdAt: data.createdAt || Date.now(),
                  updatedAt: data.updatedAt || Date.now(),
                  views: data.views || 1,
                  clicks: data.clicks || 0,
                  feedbacks: data.feedbacks || []
                });
              }
              console.log("Đẩy dữ liệu cũ lên mây thành công!");
            }
          }
        }
      } catch (err) {
        console.error("Lỗi đồng bộ dữ liệu cũ:", err);
      }
    };

    checkAndSyncLocalData();

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
