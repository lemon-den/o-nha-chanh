import { useState } from 'react';
import { Character } from '../types';
import { Save, X, ImagePlus, Lock, Unlock, AlertCircle } from 'lucide-react';

interface CharacterEditorProps {
  character?: Character;
  onSave: (char: Character) => void;
  onCancel: () => void;
}

export default function CharacterEditor({ character, onSave, onCancel }: CharacterEditorProps) {
  const [name, setName] = useState(character?.name || '');
  const [portrait, setPortrait] = useState(character?.portrait || '');
  const [ggAiLink, setGgAiLink] = useState(character?.ggAiLink || '');
  
  // Tag và Trait nhập cách nhau bằng dấu phẩy cho lẹ
  const [tagsStr, setTagsStr] = useState(character?.tags.join(', ') || '');
  const [traitsStr, setTraitsStr] = useState(character?.traits.join(', ') || '');
  
  const [biography, setBiography] = useState(character?.biography || '');
  
  // Trạng thái Khóa pass
  const [isLocked, setIsLocked] = useState(character?.isLocked || false);
  const [password, setPassword] = useState(character?.password || '');

  // Xử lý up ảnh thành Base64 để lưu thẳng vào máy
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPortrait(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked && !password.trim()) {
      alert("Chủ Ổ ơi, bật khóa rồi thì phải nhập mật khẩu chứ!");
      return;
    }

    const newChar: Character = {
      id: character?.id || Date.now().toString(),
      name,
      portrait,
      ggAiLink,
      // Tự động cắt khoảng trắng và bỏ qua ô trống
      tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
      traits: traitsStr.split(',').map(t => t.trim()).filter(Boolean),
      biography,
      isLocked,
      password: isLocked ? password.trim() : '',
      createdAt: character?.createdAt || new Date().toISOString(),
      views: character?.views || 0,
      clicks: character?.clicks || 0,
    };
    onSave(newChar);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-[#FFF9C4] dark:bg-[#1a201c] rounded-[2rem] shadow-xl border-4 border-[#FDE047] dark:border-lime-900 overflow-hidden">
        
        {/* Header Form */}
        <div className="bg-[#FDE047] dark:bg-lime-900/50 px-8 py-6 flex items-center justify-between">
          <h2 className="text-3xl font-serif font-bold text-[#3C5C1D] dark:text-lime-400">
            {character ? 'Chỉnh sửa Bé Chanh' : 'Thêm Bé Chanh Mới'}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-full bg-white/50 hover:bg-white text-[#3C5C1D] transition-colors shadow-sm">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col md:flex-row gap-8">
          
          {/* Cột trái: Up ảnh */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <div className="aspect-[3/4] w-full rounded-3xl bg-white/80 dark:bg-black/40 overflow-hidden relative border-2 border-dashed border-[#FDE047] dark:border-lime-700 hover:bg-white transition-colors group">
              {portrait ? (
                <img src={portrait} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-[#3C5C1D]/50 dark:text-lime-500/50">
                  <ImagePlus className="w-12 h-12 mb-2" />
                  <span className="font-bold text-sm">Tải ảnh lên</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
            </div>
            
            {/* Nếu lỡ up nhầm, bấm nút này để xóa ảnh */}
            {portrait && (
              <button type="button" onClick={() => setPortrait('')} className="text-sm font-bold text-red-500 hover:text-red-700">
                Xóa ảnh
              </button>
            )}
          </div>

          {/* Cột phải: Nhập thông tin */}
          <div className="w-full md:w-2/3 flex flex-col gap-5">
            
            <div>
              <label className="block text-sm font-bold text-[#3C5C1D] dark:text-lime-500 mb-1">Tên nhân vật *</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-yellow-300 dark:border-lime-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:border-[#3C5C1D] dark:focus:border-lime-400 font-bold text-[#3C5C1D] dark:text-lime-100 shadow-inner" placeholder="VD: Ashton Calloway" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#3C5C1D] dark:text-lime-500 mb-1">Google AI Studio Link</label>
              <input type="url" value={ggAiLink} onChange={(e) => setGgAiLink(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-yellow-300 dark:border-lime-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:border-[#3C5C1D] dark:focus:border-lime-400 text-sm text-[#3C5C1D] dark:text-lime-100 shadow-inner" placeholder="https://aistudio.google.com/..." />
            </div>

            {/* LINK GOOGLE AI STUDIO THỨ HAI */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#3C5C1D] dark:text-lime-300">
              Google AI Studio Link 2 (Type 2)
            </label>
            <input 
              type="text" 
              name="googleAiLink2" // Đổi tên biến này cho link thứ 2
              placeholder="https://aistudio.google.com/..."
              // defaultValue={character?.googleAiLink2 || ''} 
              className="w-full px-4 py-2.5 rounded-xl border-2 border-yellow-200 dark:border-lime-900 bg-white/50 dark:bg-black/40 focus:outline-none focus:border-[#3C5C1D] dark:focus:border-lime-500 transition-all text-sm"
            />
          </div>

            {/* HỆ THỐNG CÀI PASS */}
            <div className="bg-[#E5EEDF] dark:bg-lime-900/30 p-4 rounded-xl border border-[#3C5C1D]/20 dark:border-lime-800">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-sm font-bold text-[#3C5C1D] dark:text-lime-400 cursor-pointer">
                  {isLocked ? <Lock className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4" />}
                  Khóa mật khẩu Link GG AI?
                </label>
                <button type="button" onClick={() => setIsLocked(!isLocked)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isLocked ? 'bg-red-500' : 'bg-stone-300 dark:bg-stone-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLocked ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              {isLocked && (
                <div className="animate-in slide-in-from-top-2">
                  <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nhập mật khẩu cho bé này..." className="w-full px-4 py-2 rounded-lg border border-red-300 bg-white text-red-600 font-bold text-sm focus:outline-none focus:border-red-500 shadow-inner" />
                  <p className="flex items-center gap-1 text-[11px] text-red-500 mt-2 font-medium"><AlertCircle className="w-3 h-3"/> Người xem phải nhập đúng pass này mới thấy được link.</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#3C5C1D] dark:text-lime-500 mb-1">Tags (Phân cách bằng dấu phẩy)</label>
                <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-yellow-300 dark:border-lime-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:border-[#3C5C1D] text-sm text-[#3C5C1D] dark:text-lime-100 shadow-inner" placeholder="VD: Hiện đại, Ngọt, 18+" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#3C5C1D] dark:text-lime-500 mb-1">Traits (Phân cách bằng dấu phẩy)</label>
                <input type="text" value={traitsStr} onChange={(e) => setTraitsStr(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-yellow-300 dark:border-lime-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:border-[#3C5C1D] text-sm text-[#3C5C1D] dark:text-lime-100 shadow-inner" placeholder="VD: FWB, Cheating, Yandere" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#3C5C1D] dark:text-lime-500 mb-1">Cốt truyện / Tiểu sử (Hỗ trợ Markdown)</label>
              <textarea value={biography} onChange={(e) => setBiography(e.target.value)} rows={6} className="w-full px-4 py-3 rounded-xl border border-yellow-300 dark:border-lime-800 bg-white/70 dark:bg-black/30 focus:outline-none focus:border-[#3C5C1D] text-sm text-[#3C5C1D] dark:text-lime-100 shadow-inner resize-y" placeholder="Viết vài dòng giới thiệu về nhân vật này..." />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button type="button" onClick={onCancel} className="px-6 py-3 rounded-full font-bold text-[#3C5C1D] dark:text-stone-300 hover:bg-white dark:hover:bg-black/50 transition-colors">
                Hủy
              </button>
              <button type="submit" className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#3C5C1D] text-white hover:bg-lime-800 font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <Save className="w-4 h-4" /> Lưu Bé Chanh
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
