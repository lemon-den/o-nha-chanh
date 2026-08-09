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
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFF9C4] rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-300 border-4 border-[#FDE047]">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/50 hover:bg-white text-[#3C5C1D] transition-colors backdrop-blur-md shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side */}
        <div className="w-full md:w-2/5 md:border-r-2 border-[#FDE047] flex flex-col p-6 bg-white/30">
          <div className="aspect-[3/4] w-full rounded-3xl bg-white/80 overflow-hidden relative shadow-inner border-2 border-[#FDE047]">
            {character.portrait ? (
              <img src={character.portrait} alt={character.name} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[#3C5C1D]/30 bg-white/50">
                <User className="w-24 h-24 opacity-40" />
              </div>
            )}
          </div>
          
          {character.ggaiLink && (
            <a 
              href={character.ggaiLink} 
              target="_blank" 
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-full bg-[#fde047] text-yellow-950 hover:bg-[#facc15] font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <ExternalLink className="w-4 h-4" />
              Go to Google AI Studio
            </a>
          )}

          <button 
            onClick={onEdit}
            className="mt-3 py-3 w-full rounded-full border-2 border-[#3C5C1D] text-[#3C5C1D] hover:bg-[#3C5C1D] hover:text-white font-bold transition-colors"
          >
            Edit Character
          </button>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-3/5 p-8 overflow-y-auto flex flex-col">
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3C5C1D] mb-6 drop-shadow-sm">
            {character.name}
          </h2>
          
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b-2 border-[#FDE047]">
            {character.tags.map(tag => (
              <span key={tag} className="px-4 py-1.5 rounded-full bg-[#E5EEDF] text-[#3C5C1D] border border-[#3C5C1D]/20 text-sm font-bold tracking-wide shadow-sm">
                {tag}
              </span>
            ))}
            {character.traits.map(trait => (
              <span key={trait} className="px-4 py-1.5 rounded-full bg-[#FDE047] text-[#3C5C1D] border border-[#3C5C1D]/20 text-sm font-bold tracking-wide shadow-sm">
                {trait}
              </span>
            ))}
          </div>

          <div className="flex-1">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#3C5C1D]/70 mb-4">Character Lore</h3>
            {character.biography ? (
              <div className="markdown-body max-w-none [&_p]:!text-stone-800 [&_h1]:!text-[#3C5C1D] [&_h2]:!text-[#3C5C1D] [&_h3]:!text-[#3C5C1D] [&_li]:!text-stone-800">
                <ReactMarkdown>{character.biography}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-[#3C5C1D]/70 italic">No lore written for this character yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
