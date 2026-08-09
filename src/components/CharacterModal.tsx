import { Character } from '../types';
import { X, ExternalLink, User, Lock, Eye, MousePointerClick } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

interface CharacterModalProps {
  character: Character;
  onClose: () => void;
  onEdit: () => void;
  isAdmin: boolean; // Nhận diện chủ ổ
}

export default function CharacterModal({ character, onClose, onEdit, isAdmin }: CharacterModalProps) {
  // Trạng thái mở khóa pass
  const [passInput, setPassInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!character.isLocked);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUnlock = () => {
    if (passInput === character.password) {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Sai mật khẩu rồi! Trượt rồi nha~');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFF9C4] dark:bg-[#1a201c] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border-4 border-[#FDE047] dark:border-lime-900">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/50 dark:bg-black/50 hover:bg-white text-[#3C5C1D] dark:text-lime-200 transition-colors shadow-sm">
          <X className="w-5 h-5" />
        </button>

        {/* Cột trái: Ảnh & Pass */}
        <div className="w-full md:w-2/5 md:border-r-2 border-[#FDE047] dark:border-lime-900/50 flex flex-col p-6 bg-white/30 dark:bg-black/20">
          <div className="aspect-[3/4] w-full rounded-3xl bg-white/80 dark:bg-stone-900 overflow-hidden relative shadow-inner border-2 border-[#FDE047] dark:border-lime-900">
            {character.portrait ? (
              <img src={character.portrait} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#3C5C1D]/30"><User className="w-24 h-24 opacity-40" /></div>
            )}
          </div>
          
          {/* Hệ thống Khóa Pass */}
          {character.ggaiLink && (
            <div className="mt-6">
              {!isUnlocked ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold justify-center mb-1">
                    <Lock className="w-4 h-4" /> Bị niêm phong
                  </div>
                  <input 
                    type="password" 
                    placeholder="Nhập mật khẩu..." 
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 dark:border-lime-800 bg-white dark:bg-black/40 text-center font-bold focus:outline-none focus:border-lime-500"
                  />
                  {errorMsg && <p className="text-red-500 text-xs text-center">{errorMsg}</p>}
                  <button onClick={handleUnlock} className="w-full py-3 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-bold transition-colors">
                    Mở Khóa
                  </button>
                </div>
              ) : (
                <a href={character.ggaiLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-full bg-[#fde047] text-yellow-950 hover:bg-[#facc15] font-bold transition-all shadow-md">
                  <ExternalLink className="w-4 h-4" /> Vào Google AI Studio
                </a>
              )}
            </div>
          )}

          {/* CHỈ CHỦ Ổ MỚI THẤY NÚT EDIT */}
          {isAdmin && (
            <button onClick={onEdit} className="mt-4 py-3 w-full rounded-full border-2 border-[#3C5C1D] dark:border-lime-500 text-[#3C5C1D] dark:text-lime-400 hover:bg-[#3C5C1D] dark:hover:bg-lime-500 hover:text-white dark:hover:text-black font-bold transition-colors">
              Edit Character
            </button>
          )}
        </div>

        {/* Cột phải: Lore & Views */}
        <div className="w-full md:w-3/5 p-8 overflow-y-auto flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3C5C1D] dark:text-lime-50 drop-shadow-sm">
              {character.name}
            </h2>
            {/* Lượt Xem & Click tượng trưng */}
            <div className="flex flex-col items-end text-[11px] font-bold text-[#3C5C1D]/60 dark:text-lime-200/60">
              <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {character.views || 0} views</span>
              <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3"/> {character.clicks || 0} clicks</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b-2 border-[#FDE047] dark:border-lime-900">
            {character.tags.map(tag => <span key={tag} className="px-4 py-1.5 rounded-full bg-[#E5EEDF] dark:bg-lime-900 text-[#3C5C1D] dark:text-lime-200 text-sm font-bold shadow-sm">{tag}</span>)}
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#3C5C1D]/70 dark:text-lime-500 mb-4">Character Lore</h3>
            {character.biography ? (
              <div className="markdown-body max-w-none [&_p]:!text-stone-800 dark:[&_p]:!text-stone-300 [&_h1]:!text-[#3C5C1D] dark:[&_h1]:!text-lime-400">
                <ReactMarkdown>{character.biography}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-[#3C5C1D]/70 dark:text-stone-500 italic">No lore written for this character yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
