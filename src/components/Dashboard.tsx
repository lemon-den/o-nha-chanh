import { useState, useEffect, useMemo } from 'react';
import { Character } from '../types';
import { User, Plus } from 'lucide-react';
import CharacterModal from './CharacterModal';

interface DashboardProps {
  characters: Character[];
  onCreate: () => void;
  onEdit: (id: string) => void;
}

export default function Dashboard({ characters, onCreate, onEdit }: DashboardProps) {
  // Khởi tạo trạng thái Chủ Ổ (nhớ luôn kể cả khi f5 tải lại trang)
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('bossChanh') === 'true');

  useEffect(() => {
    let sequence = '';
    const secretCode = 'admin'; // Mật mã của bà (phải viết thường hết nha, ví dụ: 'chanh' hoặc 'boss')

    const handleKeyDown = (e: KeyboardEvent) => {
      // Dòng này siêu quan trọng: Nếu bà đang gõ chữ trong ô nhập liệu (thêm tên, tuổi nv...) thì nó không tính, để khỏi bị loạn.
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      sequence += e.key.toLowerCase();
      // Chỉ giữ lại số lượng chữ cái bằng đúng độ dài mật mã
      sequence = sequence.slice(-secretCode.length);

      // Nếu chuỗi gõ vào khớp với mật mã
      if (sequence === secretCode) {
        setIsAdmin((prev) => {
          const newState = !prev;
          if (newState) {
            localStorage.setItem('bossChanh', 'true');
            alert("✨ Đã kích hoạt quyền Chủ Ổ! Mời sếp thêm nhân vật.");
          } else {
            localStorage.removeItem('bossChanh');
            alert("🔒 Đã khóa Ổ! Giấu nút thành công.");
          }
          return newState;
        });
        sequence = ''; // Nhập đúng xong thì xóa chuỗi đi chờ lần sau
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showAllTags, setShowAllTags] = useState(false);
  const [viewingCharId, setViewingCharId] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    characters.forEach(c => c.tags.forEach(t => tags.add(t)));
    return ['All', ...Array.from(tags).sort()];
  }, [characters]);

  const filtered = useMemo(() => {
    if (selectedTag === 'All') return characters;
    return characters.filter(c => c.tags.includes(selectedTag));
  }, [characters, selectedTag]);

  const viewingChar = characters.find(c => c.id === viewingCharId);

  return (
    <div className="animate-in fade-in duration-500">
      
      {/* Title & Filter Section */}
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-lime-950 dark:text-lime-50 mb-3 drop-shadow-sm">
            Characters in the Den
          </h1>
          <p className="text-stone-600 dark:text-stone-300 text-lg">
            Chọn tag để lọc - Nhấn để xem thông tin và link ggai
          </p>
        </div>
        
        {/* BƯỚC 3: GIẤU NÚT Ở ĐÂY NÈ */}
        {isAdmin && (
          <button
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 bg-lime-600 hover:bg-lime-700 dark:bg-lime-500 dark:hover:bg-lime-600 text-white px-6 py-3 rounded-full font-bold transition-all shadow-[0_4px_12px_rgba(101,163,13,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(101,163,13,0.4)] whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Add Character
          </button>
        )}
      </div>

      {/* Tags System */}
      <div className="flex flex-wrap gap-3 mb-6">
        
        {/* Chỉ hiển thị 8 tag đầu tiên, nếu bấm xem thêm thì mới show hết */}
        {(showAllTags ? allTags : allTags.slice(0, 8)).map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-5 py-2.5 rounded-full text-sm transition-all shadow-sm ${
              selectedTag === tag 
                ? 'bg-[#3C5C1D] text-white font-bold scale-105' 
                : 'bg-white/80 text-[#3C5C1D] border border-[#3C5C1D]/20 hover:bg-[#FDE047] font-medium backdrop-blur-sm'
            }`}
          >
            {tag}
          </button>
        ))}

        {/* Nút Xem thêm (Chỉ hiện khi chưa mở rộng và tổng số tag lớn hơn 8) */}
        {!showAllTags && allTags.length > 8 && (
          <button
            onClick={() => setShowAllTags(true)}
            className="px-5 py-2.5 rounded-full text-sm font-bold bg-[#FFF9C4] text-[#3C5C1D] hover:bg-[#FDE047] transition-all shadow-sm border border-[#FDE047] border-dashed"
          >
            +{allTags.length - 8} tags nữa...
          </button>
        )}

        {/* Nút Thu gọn (Chỉ hiện khi đang mở rộng) */}
        {showAllTags && allTags.length > 8 && (
          <button
            onClick={() => setShowAllTags(false)}
            className="px-5 py-2.5 rounded-full text-sm font-bold bg-white/60 text-[#3C5C1D] hover:bg-white transition-all shadow-sm border border-[#3C5C1D]/20"
          >
            Thu gọn lại 🍋
          </button>
        )}
      </div>

      {/* Counter */}
      <p className="text-sm font-bold text-lime-700 dark:text-lime-400 mb-8 ml-2">
        Currently {filtered.length} juicy lemon{filtered.length !== 1 && 's'}
      </p>

      {/* Character Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-white/60 dark:bg-black/30 rounded-[3rem] border border-lime-100/50 dark:border-lime-900/30 backdrop-blur-sm shadow-xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-lime-100 dark:bg-lime-900/50 text-lime-600 dark:text-lime-400 mb-6 shadow-sm">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-800 dark:text-stone-200 mb-3">No characters found</h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-sm mx-auto">Try selecting a different tag, or add a new character to your den.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(char => (
            <button 
  key={char.id}
  onClick={() => setViewingCharId(char.id)}
  className="group flex flex-col text-left bg-[#FFF9C4] rounded-[2rem] p-4 border-2 border-[#FDE047] shadow-md hover:shadow-xl hover:border-[#EAB308] hover:shadow-[#FDE047]/50 transition-all duration-300 hover:-translate-y-1.5"
>
              <div className="aspect-square w-full rounded-3xl bg-white/70 mb-5 overflow-hidden relative border border-yellow-200">
                {char.portrait ? (
                  <img src={char.portrait} alt={char.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-300 dark:text-stone-600">
                    <User className="w-16 h-16 opacity-50" />
                  </div>
                )}
              </div>
              
              <div className="px-3 pb-2">
                <h3 className="font-serif font-bold text-xl text-[#3C5C1D] mb-3 group-hover:text-lime-600 transition-colors line-clamp-1">
  {char.name}
</h3>
                
                <div className="flex flex-wrap gap-2">
                  {[...char.tags, ...char.traits].slice(0, 3).map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-lime-100/80 dark:bg-lime-900/40 text-lime-800 dark:text-lime-200 text-[11px] font-bold tracking-wide border border-lime-200/50 dark:border-lime-800/50 shadow-sm">
                      {tag}
                    </span>
                  ))}
                  {([...char.tags, ...char.traits].length > 3) && (
                    <span className="px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[11px] font-bold shadow-sm">
                      +{([...char.tags, ...char.traits].length - 3)}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {viewingChar && (
        <CharacterModal 
          character={viewingChar} 
          onClose={() => setViewingCharId(null)} 
          onEdit={() => onEdit(viewingChar.id)}
        />
      )}
    </div>
  );
}
