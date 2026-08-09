import { useState, useEffect } from 'react';
import { ViewState } from './types';
import { useCharacters } from './hooks/useCharacters';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CharacterEditor from './components/CharacterEditor';
import { Citrus, ArrowLeft, Moon, Sun, MessageSquareHeart } from 'lucide-react';

export default function App() {
  const { characters, addCharacter, updateCharacter } = useCharacters();
  const [view, setView] = useState<ViewState>({ type: 'landing' });
  const [isDark, setIsDark] = useState(false);
  
  // Dời tính năng Chủ Ổ ra cổng chính để truyền đi khắp nơi
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('bossChanh') === 'true');

  useEffect(() => {
    let sequence = '';
    const secretCode = 'adminlemonden'; // Đã đổi pass mới siêu bảo mật

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

  // Kích hoạt chế độ Sáng/Tối
  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

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
    <div className="min-h-screen bg-custom-pattern text-stone-800 dark:text-stone-200 transition-colors duration-500 selection:bg-lime-200">
      
      <header className="border-b border-lime-200 dark:border-lime-900/60 bg-[#FFF9C4]/90 dark:bg-[#1a241a]/90 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 !cursor-default">
            <div className="bg-[#fde047] dark:bg-yellow-600 p-2.5 rounded-full shadow-sm border border-yellow-300 pointer-events-none">
              <Citrus className="w-6 h-6 text-[#3C5C1D] dark:text-yellow-100" />
            </div>
            <span className="font-script font-bold text-3xl tracking-tight text-[#3C5C1D] dark:text-lime-100 hidden sm:inline-block pointer-events-none">
              Ổ Roleplay nhà Chanh
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Nút bật/tắt sáng tối */}
            <button onClick={() => setIsDark(!isDark)} className="p-2.5 rounded-full bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 transition-all shadow-sm">
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-lime-900" />}
            </button>
            <button
              onClick={() => setView({ type: 'landing' })}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-black/30 hover:bg-[#FDE047] dark:hover:bg-black/50 text-[#3C5C1D] dark:text-stone-300 font-bold text-sm transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Gate
            </button>
          </div>
        </div>
      </header>

      {/* Widget Góc Dưới: Nhạc & Feedback */}
      <div className="fixed bottom-6 left-6 z-40">
        <audio controls loop className="h-10 w-48 shadow-lg rounded-full opacity-60 hover:opacity-100 transition-opacity">
          {/* Bà có thể thay link mp3 này bằng link nhạc cover của bà */}
          <source src="https://www.soundhelix.com/architectureplay/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        </audio>
      </div>
      
      <a href="https://forms.gle/LINK_CUA_BA" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#fde047] text-[#3C5C1D] px-5 py-3 rounded-full font-bold shadow-[0_8px_20px_rgba(202,138,4,0.3)] hover:scale-105 transition-transform">
        <MessageSquareHeart className="w-5 h-5" /> Feedback ẩn danh
      </a>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {view.type === 'list' && (
          <Dashboard 
            characters={characters} 
            isAdmin={isAdmin} // Truyền quyền xuống cho Dashboard
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
