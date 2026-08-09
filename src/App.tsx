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
  
  // Biến đếm số lần click để mở khóa admin bí mật
  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        setIsAdmin((a) => {
          const newAdmin = !a;
          localStorage.setItem('bossChanh', String(newAdmin));
          if (newAdmin) {
            alert("✨ Đã kích hoạt quyền Chủ Ổ! Khóa Edit đã mở.");
          } else {
            alert("🔒 Đã khóa Ổ! Giấu nút thành công.");
          }
          return newAdmin;
        });
        return 0;
      }
      return next;
    });
  };

  if (view.type === 'landing') {
    return <LandingPage onEnter={() => setView({ type: 'list' })} isDark={isDark} toggleDark={() => setIsDark(!isDark)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-lime-200 ${isDark ? 'bg-[#111612] text-stone-200' : 'bg-custom-pattern text-stone-800'}`}>
      
      <header className={`border-b-2 backdrop-blur-md sticky top-0 z-20 shadow-sm transition-colors ${isDark ? 'border-lime-900 bg-[#1a241a]/95' : 'border-[#FDE047] bg-[#FFF9C4]/95'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* BẤM VÀO ĐÂY 5 LẦN LIÊN TỤC ĐỂ MỞ/KHÓA QUYỀN CHỦ Ổ */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title="Bấm 5 lần liên tiếp ở đây để bật/tắt quyền Chủ Ổ"
          >
            <div className={`p-2.5 rounded-full shadow-sm border transition-transform group-hover:scale-105 ${isDark ? 'bg-lime-900 border-lime-700' : 'bg-[#fde047] border-yellow-300'}`}>
              <Citrus className={`w-6 h-6 ${isDark ? 'text-lime-300' : 'text-[#3C5C1D]'}`} />
            </div>
            <span className={`font-script font-bold text-3xl tracking-tight hidden sm:inline-block drop-shadow-sm ${isDark ? 'text-lime-100' : 'text-[#3C5C1D]'}`}>
              Ổ Roleplay nhà Chanh
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setIsDark(!isDark)} className={`p-2.5 rounded-full border ${isDark ? 'bg-black/40 border-lime-800' : 'bg-white/60 border-yellow-200'}`}>
              {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-[#3C5C1D]" />}
            </button>
            <button onClick={() => setView({ type: 'landing' })} className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border-2 ${isDark ? 'bg-[#111612] text-lime-200 border-lime-900' : 'bg-white text-[#3C5C1D] border-[#FDE047]'}`}>
              <ArrowLeft className="w-4 h-4" /> Back to Gate
            </button>
          </div>
        </div>
      </header>

      {/* WIDGET PLAYLIST CHILL BÊN PHẢI */}
      <div className="fixed bottom-6 right-6 z-50 bg-[#FFF9C4]/95 dark:bg-[#1a241a]/95 backdrop-blur-md p-3 rounded-3xl shadow-2xl border-2 border-[#FDE047] flex flex-col gap-2.5 w-[240px]">
        <div className="flex items-center gap-2 px-1">
          <Music className="w-4 h-4 text-[#3C5C1D] dark:text-lime-300 animate-pulse" />
          <span className="text-xs font-bold text-[#3C5C1D] dark:text-lime-200 uppercase tracking-widest">Playlist Chill</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-yellow-200/60 bg-black/5 shadow-inner">
          <iframe 
            width="216" 
            height="120" 
            src="https://youtube.com/playlist?list=PLt3H1oOlIaha7S-_pnCqtvwFElaxPPaV1&si=JA_LMzzpmA2PPwYp&autoplay=1" 
            title="Playlist Chill" 
            className="border-0 w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
