import { useState, useEffect, useRef } from 'react';
import { Character } from '../types';
import { X, ExternalLink, User, Lock, Eye, MousePointerClick, Send, MessageSquare, BookOpen, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { db } from '../firebase'; // <--- Thêm dòng này
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'; // <--- Thêm doc, updateDoc, increment

interface CharacterModalProps {
  character: Character;
  onClose: () => void;
  onEdit: () => void;
  isAdmin: boolean;
  onDelete?: (id: string) => void;
}

export default function CharacterModal({ character, onClose, onEdit, isAdmin, onDelete }: CharacterModalProps) {
  const [passInput, setPassInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!character.isLocked);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'lore' | 'feedback'>('lore');
  const [viewCount, setViewCount] = useState(character.views ?? 0);
const [clickCount, setClickCount] = useState(character.clicks ?? 0);

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [nickname, setNickname] = useState('');
  const [content, setContent] = useState('');

  const hasViewedRef = useRef(false);

useEffect(() => {
  if (!character.id || hasViewedRef.current) return;

  hasViewedRef.current = true;

  const charRef = doc(db, 'characters', character.id);

  updateDoc(charRef, {
    views: increment(1),
  }).catch((error) => {
    console.error('Lỗi đếm view:', error);
  });
}, [character.id]);
  
  const handleTrackClick = async () => {
  if (!character.id) return;

  try {
    const charRef = doc(db, 'characters', character.id);

    await updateDoc(charRef, {
      clicks: increment(1),
    });
  } catch (error) {
    console.error('Lỗi đếm click:', error);
  }
};
  
  useEffect(() => {
    const q = query(collection(db, `feedbacks_${character.id}`), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fbData = snapshot.docs.map(docSnap => ({
        id: docSnap.id, ...docSnap.data()
      }));
      setFeedbacks(fbData);
    });
    return () => unsubscribe();
  }, [character.id]);

  const handleSendFeedback = async () => {
    if (content.length < 3) {
      alert("Feedback ngắn quá! Viết ít nhất 3 ký tự nha Chủ Ổ ơi.");
      return;
    }
    try {
      await addDoc(collection(db, `feedbacks_${character.id}`), {
        nickname: nickname.trim() || 'Ẩn danh',
        content: content,
        date: new Date().toLocaleDateString('vi-VN'),
        createdAt: serverTimestamp()
      });
      setContent('');
      setNickname('');
    } catch (error) {
      alert("Lỗi mạng rồi, không gửi được feedback!");
    }
  };

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
      
      <div className="relative w-full max-w-5xl max-h-[90vh] md:h-[85vh] bg-[#FFF9C4] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-4 border-[#FDE047]">
        
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
          <div className="bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-yellow-200 flex items-center gap-3 text-[11px] font-bold text-[#3C5C1D]">
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5"/> {viewCount} views</span>
            <span className="flex items-center gap-1"><MousePointerClick className="w-3.5 h-3.5"/> {clickCount} clicks</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/80 hover:bg-white text-[#3C5C1D] transition-colors shadow-sm border border-yellow-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row w-full flex-1 overflow-y-auto md:overflow-hidden min-h-0">
          
          <div className="w-full md:w-2/5 md:border-r-2 border-[#FDE047] flex flex-col p-6 bg-white/30 h-max md:h-full md:overflow-y-auto">
            <div className="aspect-[3/4] w-full rounded-3xl bg-white/80 overflow-hidden relative shadow-inner border-2 border-[#FDE047] mt-8 md:mt-0 shrink-0">
              {character.portrait ? (
                <img src={character.portrait} alt={character.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-[#3C5C1D]/30"><User className="w-24 h-24 opacity-40" /></div>
              )}
            </div>
            
            {(character.googleAiLink || character.googleAiLink2 || character.ggaiLink) && (
              <div className="mt-6 shrink-0">
                {character.isLocked && !isUnlocked ? (
                  <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-red-50 border-2 border-red-200 shadow-inner">
                    <div className="flex items-center gap-2 text-red-600 font-bold justify-center mb-0.5 text-sm">
                      <Lock className="w-4 h-4" /> Bị niêm phong mật khẩu
                    </div>
                    
                    {character.passwordHint && (
                      <p className="flex items-center gap-1.5 text-xs text-stone-600 italic font-medium justify-center">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> <b>Gợi ý:</b> {character.passwordHint}
                      </p>
                    )}

                    <input type="password" placeholder="Nhập pass mở link..." value={passInput} onChange={(e) => setPassInput(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border-2 border-yellow-300 bg-white text-center font-bold text-sm focus:outline-none focus:border-lime-500 shadow-inner" />
                    {errorMsg && <p className="text-red-500 text-xs text-center font-medium">{errorMsg}</p>}
                    <button onClick={handleUnlock} className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-sm">
                      Mở Khóa Link
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {character.ggaiLink && !character.googleAiLink && (
                      <a href={character.ggaiLink} target="_blank" rel="noreferrer" onClick={handleTrackClick} className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-[#fde047] text-yellow-950 hover:bg-[#facc15] font-bold transition-all shadow-md hover:-translate-y-0.5 text-xs">
                        <ExternalLink className="w-4 h-4" /> Vào Google AI Studio
                      </a>
                    )}
                    {character.googleAiLink && (
                      <a href={character.googleAiLink} target="_blank" rel="noreferrer" onClick={handleTrackClick} className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-[#3C5C1D] text-white hover:bg-lime-800 font-bold transition-all shadow-md hover:-translate-y-0.5 text-xs">
                        <ExternalLink className="w-4 h-4" /> {character.googleAiLabel || 'Google AI Link 1'}
                      </a>
                    )}
                    {character.googleAiLink2 && (
                      <a href={character.googleAiLink2} target="_blank" rel="noreferrer" onClick={handleTrackClick} className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full bg-lime-700 text-white hover:bg-lime-900 font-bold transition-all shadow-md hover:-translate-y-0.5 text-xs">
                        <ExternalLink className="w-4 h-4" /> {character.googleAiLabel2 || 'Google AI Link 2'}
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {isAdmin && (
              <div className="flex flex-col gap-2 mt-6 md:mt-4 shrink-0">
                <button onClick={onEdit} className="py-3 w-full rounded-full border-2 border-[#3C5C1D] text-[#3C5C1D] hover:bg-[#3C5C1D] hover:text-white font-bold transition-colors text-sm shadow-sm">
                  Edit Character (Chủ Ổ)
                </button>
                {onDelete && (
                  <button onClick={() => onDelete(character.id)} className="py-3 w-full rounded-full bg-red-100 border-2 border-red-400 text-red-700 hover:bg-red-500 hover:text-white font-bold transition-colors text-sm shadow-sm">
                    Xóa Bé Chanh 🗑️
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="w-full md:w-3/5 flex flex-col p-6 pt-8 h-max md:h-full md:overflow-y-auto pb-12 md:pb-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#3C5C1D] mb-4 drop-shadow-sm shrink-0">
              {character.name}
            </h2>
            
            <div className="flex items-center gap-3 mb-6 border-b-2 border-[#FDE047] pb-4 shrink-0">
              <button onClick={() => setActiveTab('lore')} className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm ${activeTab === 'lore' ? 'bg-[#3C5C1D] text-white scale-105' : 'bg-white/60 text-[#3C5C1D] hover:bg-white'}`}>
                <BookOpen className="w-4 h-4" /> Cốt Truyện (Lore)
              </button>
              <button onClick={() => setActiveTab('feedback')} className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all shadow-sm relative ${activeTab === 'feedback' ? 'bg-[#3C5C1D] text-white scale-105' : 'bg-white/60 text-[#3C5C1D] hover:bg-white'}`}>
                <MessageSquare className="w-4 h-4" /> Góc Góp Ý 
                <span className="bg-[#FDE047] text-[#3C5C1D] px-2 py-0.5 rounded-full text-xs font-bold ml-1">{feedbacks.length}</span>
              </button>
            </div>

            {activeTab === 'lore' && (
              <div className="animate-in fade-in duration-300 flex-1">
                <div className="flex flex-wrap gap-2 mb-6 shrink-0">
                  {character.tags.map(tag => <span key={tag} className="px-3.5 py-1 rounded-full bg-[#E5EEDF] text-[#3C5C1D] text-xs font-bold shadow-sm">{tag}</span>)}
                  {character.traits.map(trait => <span key={trait} className="px-3.5 py-1 rounded-full bg-[#FDE047] text-[#3C5C1D] text-xs font-bold shadow-sm">{trait}</span>)}
                </div>
                {character.biography ? (
                  <div className="markdown-body max-w-none [&_p]:!text-stone-800 [&_h1]:!text-[#3C5C1D] text-sm leading-relaxed pb-8">
                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>{character.biography}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-[#3C5C1D]/70 italic text-sm">Chưa có cốt truyện nào được viết cho bé chanh này.</p>
                )}
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="animate-in fade-in duration-300 flex-1 flex flex-col pb-8">
                <div className="bg-[#E5EEDF] p-5 rounded-2xl border border-[#3C5C1D]/20 mb-6 shadow-inner shrink-0">
                  <input type="text" placeholder="Nickname của bạn (tuỳ chọn)..." value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full bg-white border border-yellow-200 rounded-xl px-4 py-2.5 text-xs font-medium text-stone-800 focus:outline-none focus:border-lime-500 mb-3 shadow-sm" />
                  <div className="relative">
                    <textarea placeholder="Gửi lời tâm tình, cảm nhận về bé chanh này..." maxLength={500} value={content} onChange={(e) => setContent(e.target.value)} className="w-full bg-white border border-yellow-200 rounded-xl px-4 py-2.5 min-h-[90px] text-xs text-stone-800 focus:outline-none shadow-sm resize-y pb-9" />
                    <div className="absolute bottom-2.5 right-3 flex items-center gap-3">
                      <span className="text-[10px] text-stone-400 font-medium">{content.length}/500</span>
                      <button onClick={handleSendFeedback} className="bg-[#dca484] hover:bg-[#c28e70] text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm">
                        Gửi <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {feedbacks.map((fb) => (
                    <div key={fb.id} className="bg-white/90 border border-white p-3.5 rounded-xl shadow-sm shrink-0">
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-[#b45c61] text-xs">{fb.nickname}</span>
                        <span className="text-[10px] text-stone-400 font-medium">{fb.date}</span>
                      </div>
                      <p className="text-xs text-stone-700 whitespace-pre-wrap leading-relaxed">{fb.content}</p>
                    </div>
                  ))}
                  {feedbacks.length === 0 && (
                    <p className="text-center text-xs text-stone-500 italic py-6">Chưa có feedback nào. Hãy là người đầu tiên bóc tem nhé!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
