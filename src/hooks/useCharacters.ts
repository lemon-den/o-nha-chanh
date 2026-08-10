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

// HÀM ÉP CÂN TỰ ĐỘNG
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

// HÀM LỌC RÁC THÔNG MINH (Không dùng JSON nữa để bảo toàn ID)
const cleanUndefined = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
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

      await addDoc(collection(db, 'characters'), cleanUndefined(payload));
    } catch (error: any) {
      console.error("Lỗi khi thêm bé chanh: ", error);
      alert("Lỗi Firebase: " + (error.message || "Không xác định"));
    }
  };

  const updateCharacter = async (id: string, updates: Partial<Omit<Character, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      // Nếu không có ID thì dừng ngay, tránh đẻ thêm con
      if (!id) {
        throw new Error("Mất ID rồi, không tìm thấy nhân vật để sửa!");
      }

      const compressedPortrait = updates.portrait 
        ? await compressImage(updates.portrait as string) 
        : updates.portrait;

      const payload = {
        ...updates,
        ...(compressedPortrait ? { portrait: compressedPortrait } : {}),
        updatedAt: Date.now()
      };

      // Đảm bảo tuyệt đối không đẩy thuộc tính 'id' vào trong document data
      const cleanedPayload = cleanUndefined(payload);
      if ('id' in cleanedPayload) delete cleanedPayload.id;

      const charDocRef = doc(db, 'characters', id);
      
      // updateDoc chỉ sửa đúng dòng có ID đó, tuyệt đối không phân thân
      await updateDoc(charDocRef, cleanedPayload);

    } catch (error: any) {
      console.error("Lỗi khi cập nhật bé chanh: ", error);
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
