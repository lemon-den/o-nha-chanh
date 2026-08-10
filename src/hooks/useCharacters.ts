import { useState, useEffect } from 'react';
import { Character } from '../types';
import { db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  setDoc, 
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
      const compressedPortrait = await compressImage(char.portrait);
      
      const payload = {
        ...char,
        ...(compressedPortrait ? { portrait: compressedPortrait } : {}),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        views: 1,
        clicks: 0,
        feedbacks: []
      };

      // Tuyệt chiêu "bốc hơi" toàn bộ undefined ẩn sâu trong mảng
      const deepCleanPayload = JSON.parse(JSON.stringify(payload));

      await addDoc(collection(db, 'characters'), deepCleanPayload);
    } catch (error: any) {
      console.error("Lỗi khi thêm bé chanh: ", error);
      alert("Lỗi Firebase: " + (error.message || "Không xác định"));
    }
  };

  const updateCharacter = async (id: string, updates: Partial<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      if (!id) return;

      const compressedPortrait = updates.portrait 
        ? await compressImage(updates.portrait as string) 
        : updates.portrait;

      const payload = {
        ...updates,
        ...(compressedPortrait ? { portrait: compressedPortrait } : {}),
        updatedAt: Date.now()
      };

      // Cấm tuyệt đối việc đẩy trường "id" vào cập nhật
      delete (payload as any).id;

      // "Giặt sạch" toàn bộ cặn undefined trước khi gửi lên mây
      const deepCleanPayload = JSON.parse(JSON.stringify(payload));

      const charDocRef = doc(db, 'characters', id);
      // Dùng setDoc với tính năng merge để đè dữ liệu vô địch, không lo báo lỗi
      await setDoc(charDocRef, deepCleanPayload, { merge: true });

    } catch (error: any) {
      console.error("Lỗi khi cập nhật bé chanh: ", error);
      // Giờ thì nó sẽ báo thẳng lỗi tiếng Anh của Firebase ra màn hình!
      alert("Lỗi Firebase: " + (error.message || "Không xác định"));
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
