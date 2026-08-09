import { Character } from '../types';
import { X, ExternalLink, User, Lock, Eye, MousePointerClick, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

interface CharacterModalProps {
  character: Character;
  onClose: () => void;
  onEdit: () => void;
  isAdmin: boolean;
}

export default function CharacterModal({ character, onClose, onEdit, isAdmin }: CharacterModalProps) {
  const [passInput, setPassInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!character.isLocked);
  const [errorMsg, setErrorMsg] = useState('');

  // --- HỆ THỐNG FEEDBACK (Lưu tạm Local) ---
  const [feedbacks, setFeedbacks] = useState<{id: string, nickname: string, content: string, date: string}[]>(() => {
    const saved = localStorage.getItem(`fb_${character.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');

  const handleUnlock = () => {
    if (passInput === character.password) {
      setIsUnlocked(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Sai mật khẩu rồi! Trượt rồi nha~');
    }
  };

  const handleSendFeedback = () => {
    if (content.length < 3) {
      alert("Feedback ngắn quá! Viết ít nhất 3 ký tự nha Chủ Ổ ơi.");
      return;
    }
    const newFb = {
      id: Date.now().toString(),
      nickname: nickname.trim() || 'Ẩn danh',
      content: content,
      date: new Date().toLocaleDateString('vi-VN')
    };
    const updatedList = [newFb, ...feedbacks];
    setFeedbacks(updatedList);
    localStorage.setItem(`fb_${character.id}`, JSON.stringify(updatedList));
    setContent('');
    setNickname('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-[#FFF9C4] dark:bg-[#1a201c] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden border-4 border-[#FDE047] dark:border-lime-900">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/50 dark:bg-black/50 hover:bg-white text-[#3C5C1D] dark:text-lime-200 transition-colors shadow-sm">
          <X className="w-5 h-5" />
        </button>

        {/* Cột trái: Ảnh & Link (Giữ nguyên) */}
        <div className="w-full md:w-2/5 md:border-r-2 border-[#FDE047] dark:border-lime-900/50 flex flex-col p-6 bg-white/30 dark:bg-black/20">
          <div className="aspect-[3/4] w-full rounded-3xl bg-white/80 dark:bg-stone-900 overflow-hidden relative shadow-inner border-2 border-[#FDE047] dark:border-lime-900">
            {character.portrait ? (
              <img src={character.portrait} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#3C5C1D]/30"><User className="w-24 h-24 opacity-40" /></div>
            )}
          </div>
          
          {character.ggaiLink && (
            <div className="mt-6">
              {!isUnlocked ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold justify-center mb-1">
                    <Lock className="w-4 h-4" /> Bị niêm phong
                  </div>
                  <input type="password" placeholder="Nhập mật khẩu..." value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-yellow-300 dark:border-lime-800 bg-white dark:bg-black/40 text-center font-bold focus:outline-none focus:border-lime-500" />
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

          {isAdmin && (
            <button onClick={onEdit} className="mt-4 py-3 w-full rounded-full border-2 border-[#3C5C1D] dark:border-lime-500 text-[#3C5C1D] dark:text-lime-400 hover:bg-[#3C5C1D] dark:hover:bg-lime-500 hover:text-white dark:hover:text-black font-bold transition-colors">
              Edit Character
            </button>
          )}
        </div>

        {/* Cột phải: Lore & Feedback */}
        <div className="w-full md:w-3/5 overflow-y-auto flex flex-col p-0">
          
          {/* Phần Header & Lore */}
          <div className="p-8 pb-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3C5C1D] dark:text-lime-50 drop-shadow-sm">
                {character.name}
              </h2>
              <div className="flex flex-col items-end text-[11px] font-bold text-[#3C5C1D]/60 dark:text-lime-200/60">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {character.views || Math.floor(Math.random() * 500) + 50} views</span>
                <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3"/> {character.clicks || Math.floor(Math.random() * 200)} clicks</span>
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

          {/* HỆ THỐNG FEEDBACK GIỐNG ẢNH */}
          <div className="bg-[#E5EEDF] dark:bg-[#111612] p-8 mt-4 border-t-2 border-[#FDE047] dark:border-lime-900">
            <h3 className="flex items-center gap-2 font-bold text-[#3C5C1D] dark:text-lime-400 mb-4">
              💬 Feedback <span className="bg-[#FDE047] dark:bg-lime-900 text-[#3C5C1D] dark:text-lime-100 px-2 py-0.5 rounded-full text-xs">{feedbacks.length}</span>
            </h3>
            
            {/* Form nhập Feedback */}
            <div className="flex flex-col gap-3 mb-8">
              <input 
                type="text" 
                placeholder="Nickname (tuỳ chọn)" 
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-white/70 dark:bg-white/5 border border-transparent focus:border-lime-400 rounded-xl px-4 py-3 text-sm font-medium text-stone-800 dark:text-stone-200 focus:outline-none shadow-inner"
              />
              <div className="relative">
                <textarea 
                  placeholder="Feedback ngắn về bé chanh này (3-500 ký tự)..." 
                  maxLength={500}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-white/70 dark:bg-white/5 border border-transparent focus:border-lime-400 rounded-xl px-4 py-3 min-h-[100px] text-sm text-stone-800 dark:text-stone-200 focus:outline-none shadow-inner resize-y pb-10"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-4">
                  <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                    {content.length}/500
                  </span>
                  <button 
                    onClick={handleSendFeedback}
                    className="bg-[#dca484] hover:bg-[#c28e70] text-white px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
                  >
                    Gửi <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Danh sách Feedback đã gửi */}
            <div className="flex flex-col gap-3">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="bg-white/80 dark:bg-[#1a201c] border border-white dark:border-lime-900/40 p-4 rounded-xl shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-[#b45c61] dark:text-[#dca484] text-sm">
                      {fb.nickname}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">{fb.date}</span>
                  </div>
                  <p className="text-sm text-stone-700 dark:text-stone-300 whitespace-pre-wrap leading-relaxed">
                    {fb.content}
                  </p>
                </div>
              ))}
              {feedbacks.length === 0 && (
                <p className="text-center text-sm text-stone-500 italic py-4">Chưa có lời tâm tình nào. Gửi ngay đi bạn ơi!</p>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
