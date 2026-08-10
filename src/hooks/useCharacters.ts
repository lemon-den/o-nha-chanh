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

// HÀM "ÉP CÂN" TỰ ĐỘNG
const compressImage = (base64Str: string | undefined): Promise<string | undefined> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) return resolve(base64Str);
    
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 400; 
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.7)); 
    };
    img.onerror = () => resolve(base64Str);
  });
};

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'characters'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const charData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as Character[];
      setCharacters(charData);
    }, (error) => {
      console.error("Lỗi tải danh sách: ", error);
    });
    return () => unsubscribe();
  }, []);

  const addCharacter = async (char: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // BỘ LỌC THÔNG MINH: Vứt hết các trường undefined trước khi gửi
      const cleanChar = Object.fromEntries(
        Object.entries(char).filter(([_, v]) => v !== undefined)
      );

      const compressedPortrait = await compressImage(cleanChar.portrait as string | undefined);
      
      await addDoc(collection(db, 'characters'), {
        ...cleanChar,
        ...(compressedPortrait ? { portrait: compressedPortrait } : {}),
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
      if (!id) return;

      // BỘ LỌC THÔNG MINH: Xóa sạch undefined để Firebase không giãy nảy
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );

      // Ép cân ảnh nếu Chủ Ổ có thay avatar mới lúc edit
      const compressedPortrait = cleanUpdates.portrait 
        ? await compressImage(cleanUpdates.portrait as string) 
        : cleanUpdates.portrait;

      const charDocRef = doc(db, 'characters', id);
      await updateDoc(charDocRef, {
        ...cleanUpdates,
        ...(compressedPortrait ? { portrait: compressedPortrait } : {}),
        updatedAt: Date.now()
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật bé chanh: ", error);
      alert("Lỗi mạng rồi, không cập nhật được!");
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      if (!id) return;
      await deleteDoc(doc(db, 'characters', id));
    } catch (error) {
      console.error("Lỗi khi xóa bé chanh: ", error);
    }
  };

  return { characters, addCharacter, updateCharacter, deleteCharacter };
}
