import { useState, useEffect } from 'react';
import { ViewState } from './types';
import { useCharacters } from './hooks/useCharacters';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CharacterEditor from './components/CharacterEditor';
import { Citrus, ArrowLeft, Moon, Sun, Music } from 'lucide-react';

export default function App() {
  const { characters, addCharacter, updateCharacter } = useCharacters();
  const [view, setView] = useState<ViewState>({ type: 'landing' });
  const [isDark, setIsDark] = useState(false);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('bossChanh') === 'true');

  useEffect(() => {
    let sequence = '';
    const secretCode = 'adminlemonden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      sequence += e.key.toLowerCase();
      sequence = sequence.slice(-secretCode.length);

      if (sequence === secretCode) {
        setIsAdmin((prev) => {
          const newState = !prev;
          if (newState) {
            localStorage.setItem('bossChanh', 'true');
            alert("✨ Đã kích hoạt quyền Chủ Ổ! Khóa Edit đã mở.");
          } else {
            localStorage.removeItem('bossChanh');
            alert("🔒 Đã khóa Ổ! Giấu nút thành công.");
          }
          return newState;
        });
        sequence = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (view.type === 'landing') {
    return (
      <LandingPage 
        onEnter={() => setView({ type: 'list' })} 
        isDark={isDark} 
        toggleDark={() => setIsDark(!isDark)} 
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-lime-200 ${isDark ? 'bg-[#111612] text-stone-200' : 'bg-custom-pattern text-stone-800'}`}>
      
      <header className={`border-b-2 backdrop-blur-md sticky top-0 z-20 shadow-sm transition-colors ${isDark ? 'border-lime-900 bg-[#1a241a]/95' : 'border-[#FDE047] bg-[#FFF9C4]/95'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-3 !cursor-default">
            <div className={`p-2.5 rounded-full shadow-sm border pointer-events-none ${isDark ? 'bg-lime-900 border-lime-700' : 'bg-[#fde047] border-yellow-300'}`}>
              <Citrus className={`w-6 h-6 ${isDark ? 'text-lime-300' : 'text-[#3C5C1D]'}`} />
            </div>
            <span className={`font-script font-bold text-3xl tracking-tight hidden sm:inline-block pointer-events-none drop-shadow-sm ${isDark ? 'text-lime-100' : 'text-[#3C5C1D]'}`}>
              Ổ Roleplay nhà Chanh
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-full transition-all shadow-sm border ${isDark ? 'bg-black/40 hover:bg-black/60 border-lime-800' : 'bg-white/60 hover:bg-white border-yellow-200'}`}>
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-[#3C5C1D]" />}
            </button>

            <button
              onClick={() => setView({ type: 'landing' })}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm border-2 ${isDark ? 'bg-[#111612] hover:bg-black/50 text-lime-200 border-lime-900' : 'bg-white hover:bg-[#FDE047] text-[#3C5C1D] border-[#FDE047]'}`}
            >
              <ArrowLeft className="w-4 h-4" /> Back to Gate
            </button>
          </div>
        </div>
      </header>

{/* WIDGET NHẠC YOUTUBE - CÓ TIÊU ĐỀ BÀI HÁT */}
      <div className={`fixed bottom-6 left-6 z-40 p-3 rounded-3xl shadow-2xl border-2 flex items-center gap-3 transition-colors ${isDark ? 'bg-[#1a241a] border-lime-800' : 'bg-[#FFF9C4] border-[#FDE047]'}`}>
        
        {/* Icon nhạc */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0 ${isDark ? 'bg-lime-900 text-lime-300' : 'bg-[#fde047] text-[#3C5C1D]'}`}>
          <Music className="w-5 h-5 animate-pulse" />
        </div>
        
        {/* Khung YouTube Player: Để rộng 300px để nó hiện tên bài hát */}
        <div className="overflow-hidden rounded-2xl border border-yellow-200/50 bg-black/10">
          <iframe 
            width="300" 
            height="50" 
            src="https://www.youtube.com/embed/videoseries?list=PLt3H1oOlIahYgaD1IaTa2fKYGyk2HWDcX" 
            title="Music" 
            className="opacity-95 hover:opacity-100 transition-opacity border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {view.type === 'list' && (
          <Dashboard 
            characters={characters} 
            isAdmin={isAdmin}
            isDark={isDark}
            onCreate={() => setView({ type: 'create' })}
            onEdit={(id) => setView({ type: 'edit', characterId: id })}
          />
        )}
        {view.type === 'create' && <CharacterEditor onSave={(char) => { addCharacter(char); setView({ type: 'list' }); }} onCancel={() => setView({ type: 'list' })} />}
        {view.type === 'edit' && <CharacterEditor character={characters.find(c => c.id === view.characterId)} onSave={(char) => { updateCharacter(view.characterId, char); setView({ type: 'list' }); }} onCancel={() => setView({ type: 'list' })} />}
      </main>
    </div>
  );
}
