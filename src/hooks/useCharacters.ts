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

  useEffect(() => {
    const q = query(collection(db, 'characters'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const charData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Character[];

      // TỰ ĐỘNG ĐỒNG BỘ: Nếu trên mây chưa có gì nhưng máy tính (localStorage) đang có dữ liệu cũ
      if (charData.length === 0) {
        const localSaved = localStorage.getItem('rp-characters');
        if (localSaved) {
          try {
            const oldChars = JSON.parse(localSaved);
            if (Array.isArray(oldChars) && oldChars.length > 0) {
              console.log(`Phát hiện ${oldChars.length} bé chanh cũ trong máy. Đang tự động đưa lên Firebase...`);
              for (const c of oldChars) {
                // Lọc bỏ id cũ để Firebase tự tạo ID mới, tránh lỗi xung đột
                const { id, ...charWithoutId } = c;
                await addDoc(collection(db, 'characters'), {
                  ...charWithoutId,
                  createdAt: charWithoutId.createdAt || Date.now(),
                  updatedAt: charWithoutId.updatedAt || Date.now(),
                  views: charWithoutId.views || 1,
                  clicks: charWithoutId.clicks || 0,
                  feedbacks: charWithoutId.feedbacks || []
                });
              }
              console.log("Đồng bộ dữ liệu cũ lên mây thành công!");
              // Xóa localStorage cũ để không lặp lại lần sau
              localStorage.removeItem('rp-characters');
            }
          } catch (e) {
            console.error("Lỗi khi tự động đồng bộ:", e);
          }
        }
      }

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
