import { useState, useRef } from 'react';
import { Character } from '../types';
import { processImage } from '../utils/image';
import { Camera, Link, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CharacterEditorProps {
  character?: Character;
  onSave: (char: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export default function CharacterEditor({ character, onSave, onCancel }: CharacterEditorProps) {
  const [name, setName] = useState(character?.name || '');
  const [tagsInput, setTagsInput] = useState(character?.tags.join(', ') || '');
  const [traitsInput, setTraitsInput] = useState(character?.traits.join(', ') || '');
  const [biography, setBiography] = useState(character?.biography || '');
  const [portrait, setPortrait] = useState(character?.portrait || '');
  const [ggaiLink, setGgaiLink] = useState(character?.ggaiLink || '');
  const [isPreview, setIsPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await processImage(file);
      setPortrait(base64);
    } catch (err) {
      console.error('Failed to process image', err);
      alert('Could not process image.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onSave({
      name: name.trim(),
      tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean),
      traits: traitsInput.split(',').map(s => s.trim()).filter(Boolean),
      biography,
      portrait,
      ggaiLink: ggaiLink.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white/90 dark:bg-[#1a241a]/90 backdrop-blur-md p-8 sm:p-12 rounded-[3rem] shadow-xl border border-lime-100 dark:border-lime-900/50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between border-b border-lime-100/60 dark:border-lime-900/60 pb-6 mb-8">
        <h2 className="text-3xl font-serif font-bold text-lime-950 dark:text-lime-50 tracking-tight">
          {character ? 'Edit Character' : 'Create New Character'}
        </h2>
        <button 
          type="button" 
          onClick={onCancel}
          className="p-3 rounded-full hover:bg-lime-50 dark:hover:bg-lime-900/30 text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-10 lg:gap-16">
        <div className="space-y-3">
          <label className="block text-sm font-bold text-lime-800 dark:text-lime-300 uppercase tracking-widest">Avatar</label>
          <div 
            className="w-full aspect-square rounded-[2.5rem] bg-lime-50/50 dark:bg-black/20 border-2 border-dashed border-lime-300 dark:border-lime-800 flex flex-col items-center justify-center cursor-pointer hover:bg-lime-100 dark:hover:bg-lime-900/30 transition-all relative overflow-hidden group"
            onClick={() => fileInputRef.current?.click()}
          >
            {portrait ? (
              <>
                <img src={portrait} alt="Portrait preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm">
                  <Camera className="w-8 h-8" />
                </div>
              </>
            ) : (
              <div className="text-lime-600 dark:text-lime-500 flex flex-col items-center">
                <Camera className="w-8 h-8 mb-3 opacity-60" />
                <span className="text-xs font-bold uppercase tracking-wider">Upload Image</span>
              </div>
            )}
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden" 
          />
          {portrait && (
            <button 
              type="button"
              onClick={(e) => { e.preventDefault(); setPortrait(''); }}
              className="text-xs text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300 font-bold w-full text-center py-2 rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              Remove Image
            </button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-lime-800 dark:text-lime-300 uppercase tracking-widest mb-2">Name *</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 bg-white dark:bg-black/20 border border-lime-200 dark:border-lime-800 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 dark:focus:ring-lime-600 transition-all text-stone-800 dark:text-stone-100 text-lg font-bold shadow-sm"
              placeholder="e.g. Lemon Drop"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-lime-800 dark:text-lime-300 uppercase tracking-widest mb-2">Tags</label>
              <input 
                type="text" 
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-5 py-3 bg-white dark:bg-black/20 border border-lime-200 dark:border-lime-800 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 dark:focus:ring-lime-600 transition-all text-sm shadow-sm dark:text-stone-200"
                placeholder="Fantasy, Mage, Hero"
              />
              <p className="text-[11px] font-medium text-stone-400 mt-2 ml-2">Comma separated</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-lime-800 dark:text-lime-300 uppercase tracking-widest mb-2">Traits</label>
              <input 
                type="text" 
                value={traitsInput}
                onChange={(e) => setTraitsInput(e.target.value)}
                className="w-full px-5 py-3 bg-white dark:bg-black/20 border border-lime-200 dark:border-lime-800 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 dark:focus:ring-lime-600 transition-all text-sm shadow-sm dark:text-stone-200"
                placeholder="Brave, Stubborn, Loyal"
              />
              <p className="text-[11px] font-medium text-stone-400 mt-2 ml-2">Comma separated</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-lime-800 dark:text-lime-300 uppercase tracking-widest mb-2">GG AI Studio Link</label>
            <div className="relative">
              <Link className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input 
                type="url" 
                value={ggaiLink}
                onChange={(e) => setGgaiLink(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-white dark:bg-black/20 border border-lime-200 dark:border-lime-800 rounded-full focus:outline-none focus:ring-2 focus:ring-lime-400 dark:focus:ring-lime-600 transition-all text-sm shadow-sm dark:text-stone-200"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-lime-800 dark:text-lime-300 uppercase tracking-widest">Biography / Lore</label>
          <div className="flex bg-lime-50/50 dark:bg-lime-900/30 rounded-full p-1 border border-lime-100 dark:border-lime-800/50">
            <button
              type="button"
              onClick={() => setIsPreview(false)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${!isPreview ? 'bg-white dark:bg-black/40 shadow-sm text-lime-800 dark:text-lime-200' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setIsPreview(true)}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all ${isPreview ? 'bg-white dark:bg-black/40 shadow-sm text-lime-800 dark:text-lime-200' : 'text-stone-500 hover:text-stone-700 dark:hover:text-stone-300'}`}
            >
              Preview
            </button>
          </div>
        </div>
        
        {isPreview ? (
          <div className="min-h-[300px] p-6 bg-white dark:bg-black/20 border border-lime-100 dark:border-lime-800 rounded-[2rem] markdown-body max-w-none shadow-sm">
            {biography ? (
              <ReactMarkdown>{biography}</ReactMarkdown>
            ) : (
              <p className="text-stone-400 italic">No content to preview.</p>
            )}
          </div>
        ) : (
          <textarea 
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            className="w-full min-h-[300px] p-6 bg-white dark:bg-black/20 border border-lime-200 dark:border-lime-800 rounded-[2rem] focus:outline-none focus:ring-2 focus:ring-lime-400 dark:focus:ring-lime-600 transition-all resize-y font-mono text-sm leading-relaxed shadow-sm dark:text-stone-200"
            placeholder="Write their story here... Supports Markdown (## Headers, **Bold**, etc.)"
          />
        )}
      </div>

      <div className="flex justify-end gap-3 mt-10 pt-8 border-t border-lime-100/60 dark:border-lime-900/60">
        <button 
          type="button"
          onClick={onCancel}
          className="px-8 py-3 rounded-full text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800/50 font-bold transition-colors border border-transparent hover:border-stone-200 dark:hover:border-stone-700"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="px-10 py-3 rounded-full bg-lime-600 dark:bg-lime-500 text-white font-bold hover:bg-lime-700 dark:hover:bg-lime-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 focus:ring-4 focus:ring-lime-200 dark:focus:ring-lime-900"
        >
          Save Character
        </button>
      </div>
    </form>
  );
}
