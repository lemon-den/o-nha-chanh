import { Character } from '../types';
import { Lock, Eye, MousePointerClick, User } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  onClick: () => void;
}

export default function CharacterCard({ character, onClick }: CharacterCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-xl transition-all duration-300 border-2 border-yellow-200 cursor-pointer hover:-translate-y-1 flex flex-col"
    >
      <div className="aspect-[3/4] w-full rounded-2xl bg-stone-100 overflow-hidden relative mb-4 shadow-inner">
        {character.portrait ? (
          <img src={character.portrait} alt={character.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-stone-400">
            <User className="w-16 h-16 opacity-40" />
          </div>
        )}
        {character.isLocked && (
          <div className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-md">
            <Lock className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <h3 className="font-serif font-bold text-xl text-[#3C5C1D] mb-2 truncate">
        {character.name}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-4 flex-1">
        {character.tags.slice(0, 2).map(tag => (
          <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[#E5EEDF] text-[#3C5C1D] text-xs font-bold">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] font-bold text-stone-400 pt-2 border-t border-yellow-100">
        <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {character.views || 0}</span>
        <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3"/> {character.clicks || 0}</span>
      </div>
    </div>
  );
}
