import { useState, useEffect } from 'react';
import { ViewState } from './types';
import { useCharacters } from './hooks/useCharacters';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import CharacterEditor from './components/CharacterEditor';
import { Citrus, ArrowLeft } from 'lucide-react';

export default function App() {
  const { characters, addCharacter, updateCharacter } = useCharacters();
  const [view, setView] = useState<ViewState>({ type: 'landing' });
  const [isDark, setIsDark] = useState(false);

  // Khóa vĩnh viễn Dark Mode để web luôn giữ màu vàng chanh pastel mộng mơ
  useEffect(() => {
    document.documentElement.classList.remove('dark');
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
    <div className="min-h-screen bg-custom-pattern text-stone-800 transition-colors duration-500 selection:bg-lime-200">
      
      {/* Navigation Bar - Đã dọn sạch màu tối và đổi thành Vàng Kem Bơ */}
      <header className="border-b-2 border-[#FDE047] bg-[#FFF9C4]/95 backdrop-blur-md sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <button 
  onClick={() => setView({ type: 'list' })}
  className="flex items-center gap-3 hover:opacity-70 transition-opacity"
>
  <div className="bg-[#fde047] p-2.5 rounded-full shadow-sm border border-yellow-300">
    <Citrus className="w-6 h-6 text-[#3C5C1D]" />
  </div>
  <span className="font-script font-bold text-3xl tracking-tight text-[#3C5C1D] hidden sm:inline-block drop-shadow-sm">
    Ổ Roleplay nhà Chanh
  </span>
</button>
          
          <button
            onClick={() => setView({ type: 'landing' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#FDE047] text-[#3C5C1D] font-bold text-sm transition-all shadow-sm border-2 border-[#FDE047]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Garden Gate
          </button>

        </div>
      </header>

      {/* MAIN CONTAINER: Đã xóa chữ 'relative z-10' để bảng nhân vật (Modal) không bị đè */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {view.type === 'list' && (
          <Dashboard 
            characters={characters} 
            onCreate={() => setView({ type: 'create' })}
            onEdit={(id) => setView({ type: 'edit', characterId: id })}
          />
        )}
        {view.type === 'create' && (
          <CharacterEditor 
            onSave={(char) => {
              addCharacter(char);
              setView({ type: 'list' });
            }}
            onCancel={() => setView({ type: 'list' })}
          />
        )}
        {view.type === 'edit' && (
          <CharacterEditor 
            character={characters.find(c => c.id === view.characterId)}
            onSave={(char) => {
              updateCharacter(view.characterId, char);
              setView({ type: 'list' });
            }}
            onCancel={() => setView({ type: 'list' })}
          />
        )}
      </main>
    </div>
  );
}
