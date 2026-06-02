import { ChevronLeft, MapPin, Hash, AtSign } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { postsApi } from "../api/client";

const myPets = [
  { id:1, name:"旺财", avatar:"https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=80", type:"金毛" },
  { id:2, name:"咪咪", avatar:"https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=80", type:"布偶猫" },
  { id:3, name:"大黑", avatar:"https://images.unsplash.com/photo-1489924034176-2e678c29d4c6?w=80", type:"泰迪" },
];

export function PostCreate() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mediaType, setMediaType] = useState<"none" | "image" | "video">("none");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [petId, setPetId] = useState<number | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loc, setLoc] = useState("");
  const [showPets, setShowPets] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showLocation, setShowLocation] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [publishing, setPublishing] = useState(false);

  const pickFromAlbum = async () => {
    setShowPicker(false);
    try {
      const limit = mediaType === "video" ? 1 : mediaType === "image" ? 9 - images.length : 9;
      const result = await Camera.pickImages({ quality: 90, limit });
      for (const photo of result.photos) {
        if (photo.webPath) {
          const response = await fetch(photo.webPath);
          const blob = await response.blob();
          const dataUrl = await new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          if (mediaType === "video") { setImages([dataUrl]); }
          else { setMediaType("image"); setImages(prev => [...prev, dataUrl]); }
        }
      }
    } catch {}
  };

  const takePhoto = async () => {
    setShowPicker(false);
    if (mediaType === "video") return;
    try {
      const photo = await Camera.getPhoto({ resultType: CameraResultType.Base64, source: CameraSource.Camera, quality: 90 });
      if (photo.base64String) {
        const url = `data:image/jpeg;base64,${photo.base64String}`;
        if (mediaType === "none") setMediaType("image");
        setImages(prev => prev.length < 9 ? [...prev, url] : prev);
      }
    } catch {}
  };

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx));
  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) { setTags(prev => [...prev, tag]); setTagInput(""); }
  };
  const removeTag = (tag: string) => setTags(prev => prev.filter(x => x !== tag));
  const onDragStart = (idx: number) => setDragIdx(idx);
  const onDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...images];
    const [item] = next.splice(dragIdx, 1);
    next.splice(idx, 0, item);
    setImages(next);
    setDragIdx(idx);
  };
  const onDragEnd = () => setDragIdx(null);
  const selectedPet = myPets.find(p => p.id === petId);

  const handlePublish = async () => {
    if (!content.trim() && images.length === 0) return;
    setPublishing(true);
    try {
      await postsApi.create({
        content: content.trim(),
        images,
        tags,
        breed: selectedPet?.type || '',
        location: loc,
      });
      navigate("/");
    } catch {
      setPublishing(false);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 relative flex flex-col">
      {showPicker && (
        <div className="fixed inset-0 z-[90] flex flex-col justify-end bg-black/40" onClick={() => setShowPicker(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-t-[16px]" onClick={e => e.stopPropagation()}>
            <button onClick={takePhoto} className="w-full py-4 text-[15px] text-[#333] dark:text-gray-100 border-b border-[#F0F0F0] dark:border-gray-700 active:bg-[#F9F9F9] dark:active:bg-gray-800">{t('post.takePhoto')}</button>
            <button onClick={pickFromAlbum} className="w-full py-4 text-[15px] text-[#333] dark:text-gray-100 border-b border-[#F0F0F0] dark:border-gray-700 active:bg-[#F9F9F9] dark:active:bg-gray-800">{t('post.chooseFromAlbum')}</button>
            <button onClick={() => setShowPicker(false)} className="w-full py-4 text-[15px] text-[#999] dark:text-gray-400 active:bg-[#F9F9F9] dark:active:bg-gray-800">{t('common.cancel')}</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 pt-[var(--app-safe-top)] h-[var(--app-header-height)] shrink-0 border-b border-[#F0F0F0] dark:border-gray-700">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ChevronLeft className="w-6 h-6 text-[#333] dark:text-gray-100" /></button>
        <h1 className="text-[17px] font-bold text-[#333] dark:text-gray-100">{t('common.publish')}</h1>
        <button onClick={handlePublish} disabled={publishing || (!content.trim() && images.length === 0)}
          className={`text-[14px] font-bold px-4 py-1.5 rounded-full ${content.trim() || images.length > 0 ? 'bg-[#FF8C42] text-white' : 'bg-[#F0F0F0] dark:bg-gray-700 text-[#BBB] dark:text-gray-500'}`}>
          {publishing ? t('common.publishing') : t('common.publish')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder={t('post.thoughts')}
          className="w-full px-4 py-4 text-[15px] leading-relaxed outline-none resize-none min-h-[120px] placeholder:text-[#CCC] dark:placeholder:text-gray-600 dark:text-gray-100 dark:bg-gray-900" />

        {/* media type auto-detected from picked content */}

        <div className="px-4 pb-3">
          <div className="grid grid-cols-3 gap-1.5">
            {images.map((img, i) => (
              <div key={i} draggable onDragStart={() => onDragStart(i)} onDragOver={(e) => onDragOver(e, i)} onDragEnd={onDragEnd}
                className={`aspect-square rounded overflow-hidden bg-[#F5F5F5] dark:bg-gray-800 relative ${dragIdx === i ? 'opacity-40' : ''}`}>
                <img src={img} className="w-full h-full object-cover" />
                <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center text-white text-[10px]">✕</button>
              </div>
            ))}
            {(mediaType !== "video" ? images.length < 9 : images.length < 1) && (
              <button onClick={() => setShowPicker(true)} className="aspect-square rounded border border-[#E5E5E5] dark:border-gray-600 flex items-center justify-center active:bg-[#F9F9F9] dark:active:bg-gray-800">
                <span className="text-[32px] text-[#CCC] dark:text-gray-600 font-light">+</span>
              </button>
            )}
          </div>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pb-2">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-0.5 bg-[#FFF3E6] dark:bg-orange-900/30 text-[#FF8C42] px-2 py-0.5 rounded-full text-[11px]">
                #{tag}
                <button onClick={() => removeTag(tag)} className="w-3.5 h-3.5 flex items-center justify-center text-[10px]">✕</button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 px-4 py-3 border-t border-[#F0F0F0] dark:border-gray-700">
          <button onClick={() => { setShowPets(!showPets); setShowTags(false); setShowLocation(false); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] ${petId ? 'bg-[#FFF3E6] dark:bg-orange-900/30 text-[#FF8C42]' : 'bg-[#F5F5F5] dark:bg-gray-800 text-[#999] dark:text-gray-400'}`}>
            {selectedPet ? (
              <><img src={selectedPet.avatar} className="w-4 h-4 rounded-full object-cover" />{selectedPet.name}</>
            ) : t('post.myPet')}
          </button>
          <button onClick={() => { setShowTags(!showTags); setShowPets(false); setShowLocation(false); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] ${tags.length > 0 ? 'bg-[#FFF3E6] dark:bg-orange-900/30 text-[#FF8C42]' : 'bg-[#F5F5F5] dark:bg-gray-800 text-[#999] dark:text-gray-400'}`}>
            <Hash className="w-3.5 h-3.5" />{tags.length > 0 ? t('post.topicsCount', { count: tags.length }) : t('post.topics')}
          </button>
          <button onClick={() => { setShowLocation(!showLocation); setShowPets(false); setShowTags(false); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] ${loc ? 'bg-[#FFF3E6] dark:bg-orange-900/30 text-[#FF8C42]' : 'bg-[#F5F5F5] dark:bg-gray-800 text-[#999] dark:text-gray-400'}`}>
            <MapPin className="w-3.5 h-3.5" />{loc || t('post.location')}
          </button>
          <button onClick={() => setContent(prev => prev + '@')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] bg-[#F5F5F5] dark:bg-gray-800 text-[#999] dark:text-gray-400">
            <AtSign className="w-3.5 h-3.5" />
          </button>
        </div>

        {showPets && (
          <div className="px-4 pb-3">
            <div className="flex gap-3">
              <button onClick={() => { setPetId(null); setShowPets(false); }}
                className={`shrink-0 flex flex-col items-center gap-1 ${!petId ? 'opacity-100' : 'opacity-40'}`}>
                <div className="w-12 h-12 rounded-full bg-[#F5F5F5] dark:bg-gray-800 flex items-center justify-center border-2 border-[#E5E5E5] dark:border-gray-600">
                  <span className="text-lg">🐾</span>
                </div>
                <span className="text-[10px] text-[#999] dark:text-gray-400">{t('post.noSelection')}</span>
              </button>
              {myPets.map(p => (
                <button key={p.id} onClick={() => { setPetId(p.id); setShowPets(false); }}
                  className={`shrink-0 flex flex-col items-center gap-1 ${petId === p.id ? 'opacity-100' : 'opacity-60'}`}>
                  <div className={`w-12 h-12 rounded-full p-[2px] ${petId === p.id ? 'bg-[#FF8C42]' : 'bg-transparent'}`}>
                    <img src={p.avatar} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900" />
                  </div>
                  <span className={`text-[10px] ${petId === p.id ? 'text-[#FF8C42] font-bold' : 'text-[#666] dark:text-gray-400'}`}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showTags && (
          <div className="px-4 pb-3 flex items-center gap-2">
            <input autoFocus value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTag()}
              placeholder={t('post.enterTopic')}
              className="flex-1 h-10 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 text-[14px] outline-none" />
            <button onClick={addTag} className="h-10 px-4 bg-[#FF8C42] text-white text-[13px] rounded-lg font-medium">{t('common.add')}</button>
          </div>
        )}

        {showLocation && (
          <div className="px-4 pb-3">
            <input autoFocus value={loc} onChange={e => setLoc(e.target.value)}
              onBlur={() => setShowLocation(false)}
              placeholder={t('post.enterLocation')}
              className="w-full h-10 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 text-[14px] outline-none" />
          </div>
        )}
      </div>
    </div>
  );
}
