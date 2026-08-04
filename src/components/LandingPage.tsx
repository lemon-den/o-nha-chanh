import { Citrus, Moon, Sun } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  isDark: boolean;
  toggleDark: () => void;
}

export default function LandingPage({ onEnter, isDark, toggleDark }: LandingPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-custom-pattern transition-colors duration-500 relative overflow-hidden">
      
      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
        
        <p className="text-sm font-bold tracking-[0.2em] uppercase text-lime-700 dark:text-lime-300 mb-6 drop-shadow-sm">
          Chào mừng bạn đến với
        </p>
        
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-script font-bold text-lime-900 dark:text-lime-50 mb-16 text-center drop-shadow-md">
          Ổ Roleplay nhà Chanh
        </h1>



        <button 
          onClick={onEnter} 
          className="group flex items-center gap-3 px-10 py-4 bg-[#fde047] hover:bg-[#facc15] text-yellow-950 rounded-full font-bold text-xl shadow-[0_8px_20px_rgba(202,138,4,0.3)] dark:shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(202,138,4,0.4)]"
        >
          <Citrus className="w-6 h-6 group-hover:rotate-12 transition-transform" /> 
          Vào Ổ Chanh
        </button>

        <a 
          href="https://www.facebook.com/profile.php?id=61591554733589" 
          target="_blank"
          rel="noreferrer"
          className="mt-8 text-lime-800 dark:text-lime-200 hover:text-lime-600 dark:hover:text-lime-400 transition-colors font-semibold px-6 py-2 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-sm"
        >
          Facebook
        </a>
      </div>

      {/* Theme Toggle */}
      <button 
        onClick={toggleDark} 
        className="absolute bottom-6 right-6 p-4 bg-white/70 dark:bg-black/50 backdrop-blur-md rounded-full shadow-lg text-lime-900 dark:text-lime-100 hover:scale-110 transition-all border border-lime-200/50 dark:border-lime-900/50"
        title="Toggle Light/Dark Mode"
      >
        {isDark ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
      </button>
    </div>
  );
}
