import { useState } from 'react';
import { Character } from '../types';
import { X, Lock, HelpCircle, Edit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

interface CharacterModalProps {
  character: Character;
  isAdmin: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function CharacterModal({ character, isAdmin, onClose, onEdit }: CharacterModalProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [inputPass, setInputPass] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#FFF9C4] dark:bg-[#1a201c] rounded-[2.5rem] shadow-2xl border-4 border-[#FDE047] dark:border-lime-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full bg-white/60 dark:bg-black/40 hover:bg-white text-[#3C5C1D] dark:text-lime-300 transition-colors shadow-sm z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Ảnh đại diện */}
          <div className="w-full md:w-1/3 shrink-0">
            <div className="aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-md border-2 border-yellow-200 dark:border-lime-900">
              <img src={character.portrait} alt={character.name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="w-full md:w-2/3 flex flex-col">
            <h2 className="text-3xl font-serif font-bold text-[#3C5C1D] dark:text-lime-300 mb-2">
              {character.name}
            </h2>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {character.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDE047]/60 dark:bg-lime-900/60 text-[#3C5C1D] dark:text-lime-200">
                  {tag}
                </span>
              ))}
            </div>

            {/* Traits */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {character.traits.map(trait => (
                <span key={trait} className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-black/5 dark:bg-white/5 text-stone-600 dark:text-stone-300">
                  #{trait}
                </span>
              ))}
            </div>

            {/* Cốt truyện / Tiểu sử với ReactMarkdown & remarkBreaks */}
            <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 text-sm mb-6 bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-yellow-200/50 dark:border-lime-900/40">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {character.biography}
              </ReactMarkdown>
            </div>

            {/* KHU VỰC LINK GOOGLE AI & KHÓA MẬT KHẨU */}
            <div className="mt-auto pt-4 border-t border-yellow-200 dark:border-lime-900">
              {character.isLocked && !isUnlocked ? (
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border-2 border-red-200 dark:border-red-900 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                    <Lock className="w-4 h-4" /> Bé này đang khóa link Google AI!
                  </div>
                  
                  {character.passwordHint && (
                    <p className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300 italic font-medium">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-500" /> <b>Gợi ý pass:</b> {character.passwordHint}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      placeholder="Nhập mật khẩu..." 
                      value={inputPass}
                      onChange={(e) => setInputPass(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-red-300 bg-white text-stone-800 text-sm flex-1 focus:outline-none shadow-inner"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (inputPass === character.password) {
                          setIsUnlocked(true);
                        } else {
                          alert("Sai mật khẩu rồi! Xem lại gợi ý kỹ nha.");
                        }
                      }}
                      className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all shadow-sm"
                    >
                      Mở khóa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {character.googleAiLink && (
                    <a 
                      href={character.googleAiLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-5 py-2.5 rounded-xl bg-[#3C5C1D] text-white hover:bg-lime-800 text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:scale-105"
                    >
                      🔗 {character.googleAiLabel || 'Google AI Link 1'}
                    </a>
                  )}
                  {character.googleAiLink2 && (
                    <a 
                      href={character.googleAiLink2} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-5 py-2.5 rounded-xl bg-lime-700 text-white hover:bg-lime-900 text-xs font-bold transition-all flex items-center gap-2 shadow-md hover:scale-105"
                    >
                      🔗 {character.googleAiLabel2 || 'Google AI Link 2'}
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Nút Edit cho Chủ Ổ */}
            {isAdmin && (
              <button
                onClick={onEdit}
                className="mt-4 py-3 w-full rounded-full border-2 border-[#3C5C1D] text-[#3C5C1D] hover:bg-[#3C5C1D] hover:text-white font-bold transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Edit className="w-4 h-4" /> Edit Character (Chủ Ổ)
              </button>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
