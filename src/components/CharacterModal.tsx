import { useState } from 'react';
import { Character } from '../types';
import { X, Lock, HelpCircle, Edit, MessageSquare, Send, BookOpen } from 'lucide-react';
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

  // State quản lý Tab bên phải ('story' hoặc 'feedback')
  const [activeTab, setActiveTab] = useState<'story' | 'feedback'>('story');

  // State cho Feedback
  const [feedbacks, setFeedbacks] = useState<string[]>(character.feedbacks || []);
  const [newFeedback, setNewFeedback] = useState('');

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;
    const updated = [newFeedback.trim(), ...feedbacks];
    setFeedbacks(updated);
    character.feedbacks = updated;
    setNewFeedback('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#FFF9C4] dark:bg-[#1a201c] rounded-[2.5rem] shadow-2xl border-4 border-[#FDE047] dark:border-lime-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
        
        {/* Nút đóng */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 rounded-full bg-white/60 dark:bg-black/40 hover:bg-white text-[#3C5C1D] dark:text-lime-300 transition-colors shadow-sm z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row gap-8">
          
          {/* CỘT TRÁI: ẢNH + GIẢI PASS / LINK GOOGLE AI + NÚT EDIT */}
          <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-4">
            <div className="aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-md border-2 border-yellow-200 dark:border-lime-900">
              <img src={character.portrait} alt={character.name} className="w-full h-full object-cover" />
            </div>

            {/* PHẦN GIẢI PASS & LINK GOOGLE AI DỜI QUA TRÁI */}
            <div className="bg-white/40 dark:bg-black/20 p-4 rounded-2xl border border-yellow-200/60 dark:border-lime-900 flex flex-col gap-3">
              {character.isLocked && !isUnlocked ? (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-xs">
                    <Lock className="w-3.5 h-3.5" /> Khóa Link Google AI
                  </div>
                  
                  {character.passwordHint && (
                    <p className="flex items-center gap-1 text-[11px] text-stone-600 dark:text-stone-300 italic font-medium">
                      <HelpCircle className="w-3 h-3 text-amber-500 shrink-0" /> <b>Gợi ý:</b> {character.passwordHint}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 mt-1">
                    <input 
                      type="password" 
                      placeholder="Nhập mật khẩu..." 
                      value={inputPass}
                      onChange={(e) => setInputPass(e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-red-300 bg-white text-stone-800 text-xs focus:outline-none shadow-inner"
                    />
                    <button 
                      type="button"
                      onClick={() => {
                        if (inputPass === character.password) {
                          setIsUnlocked(true);
                        } else {
                          alert("Sai mật khẩu rồi Lottie ơi! Xem lại gợi ý kỹ nha.");
                        }
                      }}
                      className="py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-all shadow-sm"
                    >
                      Mở khóa
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3C5C1D] dark:text-lime-300">Trải nghiệm Google AI:</span>
                  {character.googleAiLink && (
                    <a 
                      href={character.googleAiLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 rounded-xl bg-[#3C5C1D] text-white hover:bg-lime-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      🔗 {character.googleAiLabel || 'Google AI Link 1'}
                    </a>
                  )}
                  {character.googleAiLink2 && (
                    <a 
                      href={character.googleAiLink2} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="px-4 py-2 rounded-xl bg-lime-700 text-white hover:bg-lime-900 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      🔗 {character.googleAiLabel2 || 'Google AI Link 2'}
                    </a>
                  )}
                  {!character.googleAiLink && !character.googleAiLink2 && (
                    <p className="text-xs text-stone-500 italic text-center">Chưa có link nào được cập nhật.</p>
                  )}
                </div>
              )}
            </div>

            {/* Nút Edit cho Chủ Ổ */}
            {isAdmin && (
              <button
                onClick={onEdit}
                className="py-2.5 w-full rounded-full border-2 border-[#3C5C1D] text-[#3C5C1D] hover:bg-[#3C5C1D] hover:text-white font-bold transition-colors text-xs flex items-center justify-center gap-2 shadow-sm bg-white/50 dark:bg-black/20"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Character (Chủ Ổ)
              </button>
            )}
          </div>

          {/* CỘT PHẢI: TÊN, TAGS VÀ TAB CHUYỂN ĐỔI (CỐT TRUYỆN <-> FEEDBACK) */}
          <div className="w-full md:w-2/3 flex flex-col gap-4">
            <div>
              <h2 className="text-3xl font-serif font-bold text-[#3C5C1D] dark:text-lime-300 mb-2">
                {character.name}
              </h2>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {character.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDE047]/60 dark:bg-lime-900/60 text-[#3C5C1D] dark:text-lime-200">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Traits */}
              <div className="flex flex-wrap gap-1.5">
                {character.traits.map(trait => (
                  <span key={trait} className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-black/5 dark:bg-white/5 text-stone-600 dark:text-stone-300">
                    #{trait}
                  </span>
                ))}
              </div>
            </div>

            {/* HỆ THỐNG TAB CHUYỂN ĐỔI (CỐT TRUYỆN / FEEDBACK) */}
            <div className="flex rounded-2xl bg-black/10 dark:bg-black/40 p-1 border border-yellow-200/50 dark:border-lime-900/40">
              <button
                type="button"
                onClick={() => setActiveTab('story')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'story'
                    ? 'bg-[#3C5C1D] text-white shadow-sm'
                    : 'text-[#3C5C1D] dark:text-lime-300 hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" /> Cốt truyện
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('feedback')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'feedback'
                    ? 'bg-[#3C5C1D] text-white shadow-sm'
                    : 'text-[#3C5C1D] dark:text-lime-300 hover:bg-white/40 dark:hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" /> Góc Feedback ({feedbacks.length})
              </button>
            </div>

            {/* NỘI DUNG HIỂN THỊ THEO TAB */}
            <div className="flex-1 min-h-[250px]">
              {activeTab === 'story' ? (
                /* TAB 1: CỐT TRUYỆN */
                <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 text-sm bg-white/50 dark:bg-black/20 p-5 rounded-2xl border border-yellow-200/50 dark:border-lime-900/40 max-h-[350px] overflow-y-auto">
                  <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                    {character.biography}
                  </ReactMarkdown>
                </div>
              ) : (
                /* TAB 2: FEEDBACK */
                <div className="flex flex-col gap-3 bg-white/50 dark:bg-black/20 p-5 rounded-2xl border border-yellow-200/50 dark:border-lime-900/40 max-h-[350px] overflow-y-auto">
                  <form onSubmit={handleAddFeedback} className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Để lại feedback hoặc cảm nhận về bé này..."
                      value={newFeedback}
                      onChange={(e) => setNewFeedback(e.target.value)}
                      className="px-4 py-2 rounded-xl border border-yellow-300 dark:border-lime-800 bg-white dark:bg-stone-900 text-xs flex-1 focus:outline-none text-stone-800 dark:text-stone-100 shadow-inner"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#3C5C1D] text-white hover:bg-lime-800 text-xs font-bold transition-all flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <Send className="w-3 h-3" /> Gửi
                    </button>
                  </form>

                  <div className="flex flex-col gap-2 mt-1">
                    {feedbacks.length === 0 ? (
                      <p className="text-xs text-stone-500 dark:text-stone-400 italic text-center py-6">Chưa có feedback nào. Hãy là người đầu tiên để lại lời nhắn!</p>
                    ) : (
                      feedbacks.map((fb, index) => (
                        <div key={index} className="p-3 rounded-xl bg-white dark:bg-black/40 text-xs text-stone-700 dark:text-stone-300 border border-yellow-200/40 dark:border-lime-900/40 shadow-sm">
                          {fb}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
