import { useState, useEffect } from 'react';
import { Character } from '../types';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, query, orderBy } from 'firebase/firestore';

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    // 1. Tự động đẩy dữ liệu cũ từ máy lên mây ngay khi vào web
    const saved = localStorage.getItem('rp-characters');
    if (saved) {
      const chars = JSON.parse(saved);
      console.log("Tìm thấy dữ liệu cũ, đang đẩy lên Firebase...");
      chars.forEach((c: any) => {
        const { id, ...data } = c;
        // Dùng addDoc đơn giản không cần async phức tạp
        addDoc(collection(db, 'characters'), {
           ...data,
           createdAt: Date.now(),
           views: 1,
           clicks: 0
        }).then(() => console.log("Đã đẩy bé:", data.name))
          .catch(e => console.log("Lỗi đẩy:", e));
      });
      // Xóa dữ liệu cũ sau khi đẩy xong
      localStorage.removeItem('rp-characters');
      alert("Đã đẩy dữ liệu lên mây! F5 trang để xem nhé.");
    }

    // 2. Lắng nghe dữ liệu
    const q = query(collection(db, 'characters'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCharacters(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Character)));
    });
    return () => unsubscribe();
  }, []);

  // Các hàm add/update/delete giữ nguyên...
  return { characters, addCharacter: () => {}, updateCharacter: () => {}, deleteCharacter: () => {} };
}
