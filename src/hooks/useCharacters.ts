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

// HÀM "ÉP CÂN" TỰ ĐỘNG: Thu nhỏ và giảm dung lượng ảnh xuống mức tối đa
const compressImage = (base64Str: string | undefined): Promise<string | undefined> => {
  return new Promise((resolve) => {
    // Nếu không có ảnh hoặc không phải ảnh base64 thì bỏ qua
    if (!base64Str || !base64Str.startsWith('data:image')) return resolve(base64Str);
    
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 400; // Giới hạn bề ngang avatar 400px là quá nét rồi
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
      
      // Ép ra định dạng JPEG với chất lượng 70% -> Dung lượng chỉ còn vài chục KB
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
      // Đưa ảnh qua máy ép cân trước khi lưu
      const compressedPortrait = await compressImage(char.portrait);
      
      await addDoc(collection(db, 'characters'), {
        ...char,
        portrait: compressedPortrait, // Dùng ảnh đã ép
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
      // Ép cân ảnh nếu có cập nhật ảnh mới
      const compressedPortrait = updates.portrait 
        ? await compressImage(updates.portrait) 
        : updates.portrait;

      const charDocRef = doc(db, 'characters', id);
      await updateDoc(charDocRef, {
        ...updates,
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
      await deleteDoc(doc(db, 'characters', id));
    } catch (error) {
      console.error("Lỗi khi xóa bé chanh: ", error);
    }
  };

  return { characters, addCharacter, updateCharacter, deleteCharacter };
}
