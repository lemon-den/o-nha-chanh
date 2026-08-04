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

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
    <div className="min-h-screen bg-custom-pattern text-stone-800 dark:text-stone-200 transition-colors duration-500 selection:bg-lime-200 dark:selection:bg-lime-800">
      
      {/* Navigation Bar */}
      <header className="border-b border-lime-200/60 dark:border-lime-900/60 bg-[#fefce8]/80 dark:bg-[#1a241a]/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <button 
            onClick={() => setView({ type: 'list' })}
            className="flex items-center gap-3 hover:opacity-70 transition-opacity"
          >
            <div className="bg-[#fde047] dark:bg-yellow-600 p-2.5 rounded-full shadow-sm">
              <Citrus className="w-6 h-6 text-yellow-950 dark:text-yellow-100" />
            </div>
            <span className="font-script font-bold text-3xl tracking-tight text-lime-900 dark:text-lime-100 hidden sm:inline-block">
              Ổ Roleplay nhà Chanh
            </span>
          </button>
          
          <button
            onClick={() => setView({ type: 'landing' })}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-stone-600 dark:text-stone-300 font-bold text-sm transition-all shadow-sm border border-lime-100/50 dark:border-lime-800/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Garden Gate
          </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
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
