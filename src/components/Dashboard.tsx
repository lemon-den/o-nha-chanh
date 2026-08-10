import { useState } from 'react';
import { Character } from '../types';
import { Plus, Search, Sparkles } from 'lucide-react';
import CharacterCard from './CharacterCard';
import CharacterModal from './CharacterModal';

interface DashboardProps {
  characters: Character[];
  onCreate: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  isDark: boolean;
}

export default function Dashboard({ characters, onCreate, onEdit, onDelete, isAdmin, isDark }: DashboardProps) {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [showAllTags, setShowAllTags] = useState(false);

  const allTags = ['All', ...Array.from(new Set(characters.flatMap(c => c.tags)))];

  const filteredCharacters = characters.filter(char => {
    // Chặn luôn mấy con rác không có tên
    if (!char.name) return false;
    const matchesTag = selectedTag === 'All' || char.tags.includes(selectedTag);
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          char.traits.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  const liveSelectedCharacter = characters.find(c => c.id === selectedCharacterId);

  const handleOpenCharacter = (char: Character) => {
  setSelectedCharacterId(char.id);
};
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-4xl md:text-5xl font-serif font-bold mb-3 drop-shadow-sm transition-colors ${isDark ? 'text-lime-50' : 'text-[#3C5C1D]'}`}>
            Characters in the Den
          </h1>
          <p className={`text-lg transition-colors ${isDark ? 'text-stone-300' : 'text-[#3C5C1D]/80'}`}>
            Chọn tag để lọc - Nhấn để xem thông tin và link ggai
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input 
              type="text" 
              placeholder="Tìm tên, trait..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-11 pr-4 py-3 rounded-full border text-sm font-medium focus:outline-none shadow-sm transition-colors ${isDark ? 'bg-black/30 border-lime-900 text-stone-200 focus:border-lime-500' : 'bg-white/80 border-yellow-200 text-stone-800 focus:border-[#3C5C1D]'}`}
            />
          </div>

          {isAdmin && (
            <button
              onClick={onCreate}
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#3C5C1D] text-white hover:bg-lime-800 font-bold text-sm transition-all shadow-md hover:scale-105 shrink-0"
            >
              <Plus className="w-4 h-4" /> Thêm Bé Chanh
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {(showAllTags ? allTags : allTags.slice(0, 8)).map(tag => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-5 py-2.5 rounded-full text-sm transition-all shadow-sm ${
              selectedTag === tag 
                ? 'bg-[#3C5C1D] text-white font-bold scale-105' 
                : isDark 
                  ? 'bg-black/30 text-lime-200 border border-lime-900/60 hover:bg-lime-900/50 font-medium' 
                  : 'bg-white/80 text-[#3C5C1D] border border-[#3C5C1D]/20 hover:bg-[#FDE047] font-medium backdrop-blur-sm'
            }`}
          >
            {tag}
          </button>
        ))}

        {!showAllTags && allTags.length > 8 && (
          <button onClick={() => setShowAllTags(true)} className="px-5 py-2.5 rounded-full text-sm font-bold bg-[#FFF9C4] text-[#3C5C1D] hover:bg-[#FDE047] transition-all shadow-sm border border-[#FDE047] border-dashed">
            +{allTags.length - 8} tags nữa...
          </button>
        )}

        {showAllTags && allTags.length > 8 && (
          <button onClick={() => setShowAllTags(false)} className="px-5 py-2.5 rounded-full text-sm font-bold bg-white/60 text-[#3C5C1D] hover:bg-white transition-all shadow-sm border border-[#3C5C1D]/20">
            Thu gọn lại 🍋
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCharacters.map(char => (
          <CharacterCard 
            key={char.id} 
            character={char} 
            onClick={() => handleOpenCharacter(char)} 
          />
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 mx-auto text-yellow-500 mb-3 opacity-60" />
          <p className="text-stone-500 font-medium text-lg">Không tìm thấy bé chanh nào phù hợp với tag này cả!</p>
        </div>
      )}

      {liveSelectedCharacter && (
        <CharacterModal 
          character={liveSelectedCharacter}
          isAdmin={isAdmin}
          onClose={() => setSelectedCharacterId(null)}
          onEdit={() => {
            setSelectedCharacterId(null);
            if (liveSelectedCharacter.id) onEdit(liveSelectedCharacter.id);
          }}
          onDelete={(id) => {
            if (window.confirm("Bà có chắc chắn muốn tiễn bé chanh này bay màu không?")) {
              onDelete(id);
              setSelectedCharacterId(null);
            }
          }}
        />
      )}

    </div>
  );
}
