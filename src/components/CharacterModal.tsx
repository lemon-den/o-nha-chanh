import { Character } from '../types';
import { X, ExternalLink, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CharacterModalProps {
  character: Character;
  onClose: () => void;
  onEdit: () => void;
}

export default function CharacterModal({ character, onClose, onEdit }: CharacterModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm dark:bg-black/60 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#fdfbf7] dark:bg-[#1f2922] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300 border border-lime-100 dark:border-lime-900/50">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200 transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Avatar & Link */}
        <div className="w-full md:w-2/5 md:border-r border-lime-100 dark:border-lime-900/50 flex flex-col p-6 bg-lime-50/30 dark:bg-lime-900/10">
          <div className="aspect-[3/4] w-full rounded-3xl bg-stone-100 dark:bg-stone-800 overflow-hidden relative shadow-inner border border-lime-200/50 dark:border-lime-800/50">
            {character.portrait ? (
              <img src={character.portrait} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-stone-300 dark:text-stone-600 bg-lime-50/50 dark:bg-lime-900/20">
                <User className="w-24 h-24 opacity-40" />
              </div>
            )}
          </div>
          
          {character.ggaiLink && (
            <a 
              href={character.ggaiLink} 
              target="_blank" 
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-full bg-[#fde047] text-yellow-900 hover:bg-[#facc15] font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ExternalLink className="w-4 h-4" />
              Go to Google AI Studio
            </a>
          )}

          <button 
            onClick={onEdit}
            className="mt-3 py-3 w-full rounded-full border-2 border-lime-200 dark:border-lime-800 text-lime-700 dark:text-lime-400 hover:bg-lime-100 dark:hover:bg-lime-900/50 font-bold transition-colors"
          >
            Edit Character
          </button>
        </div>

        {/* Right Side: Details & Lore */}
        <div className="w-full md:w-3/5 p-8 overflow-y-auto flex flex-col">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-lime-950 dark:text-lime-50 mb-6 drop-shadow-sm">
            {character.name}
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-lime-100 dark:border-lime-900/50">
            {character.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-lime-100 dark:bg-lime-900/50 text-lime-800 dark:text-lime-200 text-sm font-bold tracking-wide shadow-sm">
                {tag}
              </span>
            ))}
            {character.traits.map(trait => (
              <span key={trait} className="px-4 py-1.5 rounded-full bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200 text-sm font-bold tracking-wide shadow-sm">
                {trait}
              </span>
            ))}
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-4">Character Lore</h3>
            {character.biography ? (
              <div className="markdown-body max-w-none">
                <ReactMarkdown>{character.biography}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-stone-400 dark:text-stone-600 italic">No lore written for this character yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
