import { ChevronLeft, Search, MoreHorizontal, Send, Plus, Image, Camera, MapPin, User, AlertTriangle, Trash2 } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageTransition } from "../hooks/usePageTransition";
import { UserProfile } from "./UserProfile";
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from "@capacitor/camera";

const mockMessageBase = [
  { id:1, from:true, time:"10:30" },
  { id:2, from:false, time:"10:32" },
  { id:3, from:true, time:"10:33" },
  { id:4, from:false, time:"10:35" },
  { id:5, from:true, time:"10:36" },
  { id:6, from:false, time:"10:38" },
];

const users: Record<string, {name:string; avatar:string}> = {
  "1": { name:"Alice Wang", avatar:"https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150" },
  "2": { name:"Charlie Lee", avatar:"https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150" },
  "3": { name:"Bob Chen", avatar:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150" },
  "4": { name:"Diana Wu", avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" },
};

const myAvatar = "https://images.unsplash.com/photo-1761933808230-9a2e78956daa?w=80";

export function ChatDetail() {
  const navigate = useNavigate();
  const { className, handleBack } = usePageTransition();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const user = users[id || "1"] || { name:t('common.user'), avatar:"" };

  const mockData = useMemo(() => {
    const bundle = i18n.getResourceBundle(i18n.language, 'translation');
    return bundle?.mock || {};
  }, [i18n.language]);

  const mockMessages = useMemo(() =>
    mockMessageBase.map((m, i) => ({
      ...m,
      text: mockData.chatMessages?.[i]?.text || '',
    })),
  [mockData]);

  const [sentMessages, setSentMessages] = useState<{id:number; from:boolean; text:string; time:string; image?:string; type?:string; lat?:number; lng?:number}[]>([]);
  const [input, setInput] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [overlayUser, setOverlayUser] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayUser) return;
    const el = overlayRef.current;
    if (!el) return;
    const block = (e: TouchEvent) => e.preventDefault();
    el.addEventListener('touchstart', block, { passive: false });
    return () => el.removeEventListener('touchstart', block);
  }, [overlayUser]);

  const messages = [...mockMessages, ...sentMessages];

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const initialHeight = window.innerHeight;
    const handler = () => {
      const offset = initialHeight - vv.height;
      setKeyboardOffset(offset > 0 ? offset : 0);
    };
    vv.addEventListener('resize', handler);
    return () => vv.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const convId = Number(id);
    window.dispatchEvent(new CustomEvent('pawgram:clear-conv-unread', { detail: convId }));
    try {
      const key = 'pawgram_read_convs';
      const read: number[] = JSON.parse(localStorage.getItem(key) || '[]');
      if (!read.includes(convId)) {
        read.push(convId);
        localStorage.setItem(key, JSON.stringify(read));
      }
    } catch {}
  }, [id]);
  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages, keyboardOffset]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    setSentMessages(prev => [...prev, { id:Date.now(), from:false, text, time:`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}` }]);
    setInput("");
  };

  const sendImage = (src: string) => {
    const now = new Date();
    setSentMessages(prev => [...prev, { id:Date.now(), from:false, text:'', time:`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`, image:src }]);
  };

  const pickFromAlbum = async () => {
    setMenuVisible(false);
    try {
      const result = await CapacitorCamera.pickImages({ quality: 90, limit: 9 });
      for (const photo of result.photos) {
        if (photo.webPath) {
          const response = await fetch(photo.webPath);
          const blob = await response.blob();
          const dataUrl = await new Promise<string>(resolve => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          sendImage(dataUrl);
        }
      }
    } catch {}
  };

  const takePhoto = async () => {
    setMenuVisible(false);
    try {
      const photo = await CapacitorCamera.getPhoto({ resultType: CameraResultType.Base64, source: CameraSource.Camera, quality: 90 });
      if (photo.base64String) {
        const url = `data:image/jpeg;base64,${photo.base64String}`;
        sendImage(url);
      }
    } catch {}
  };

  const sendLocation = () => {
    setMenuVisible(false);
    setLocating(true);
    const tryLocate = (highAccuracy: boolean) => {
      navigator.geolocation?.getCurrentPosition(
        (pos) => {
          const { latitude: lat, longitude: lng } = pos.coords;
          const text = t('chat.location');
          const now = new Date();
          const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
          setSentMessages(prev => [...prev, { id: Date.now(), from: false, text, time: timeStr, type: 'location', lat, lng }]);
          setLocating(false);
        },
        () => {
          if (highAccuracy) tryLocate(false);
          else setLocating(false);
        },
        { enableHighAccuracy: highAccuracy, timeout: 8000 }
      );
    };
    tryLocate(true);
  };

  const openMap = (lat: number, lng: number) => {
    window.open(`https://maps.apple.com/?ll=${lat},${lng}&q=${lat},${lng}`, '_blank');
  };

  const moreActions = [
    { icon:Image, label:t('chat.photo'), onClick:pickFromAlbum },
    { icon:Camera, label:t('chat.takePhoto'), onClick:takePhoto },
  ];

  return (
    <div className={`h-full bg-[#EDEDED] dark:bg-gray-950 relative flex flex-col ${className}`}>
      <div className="bg-white dark:bg-gray-900 pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 border-b border-[#F0F0F0] dark:border-gray-700">
        {showSearch ? (
          <div className="flex-1 flex items-center gap-2">
            <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="p-1 -ml-1"><ChevronLeft className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
            <div className="flex-1 bg-[#F5F5F5] dark:bg-gray-800 rounded-full flex items-center px-3 h-8">
              <Search className="w-4 h-4 text-[#999] dark:text-gray-400 mr-1.5"/>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('messages.searchChats')} className="flex-1 bg-transparent text-[14px] dark:text-gray-100 outline-none"/>
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => handleBack(() => navigate(-1))} className="p-1 -ml-1"><ChevronLeft className="w-6 h-6 text-[#333] dark:text-gray-100"/></button>
            <div className="flex-1 flex items-center gap-2 ml-2">
              <ImageWithFallback src={user.avatar} onClick={() => setOverlayUser(Number(id))} className="w-8 h-8 rounded-full object-cover cursor-pointer active:opacity-70"/>
              <span className="text-[16px] font-bold text-[#333] dark:text-gray-100">{user.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowSearch(true)} className="p-1.5 cursor-pointer active:opacity-70"><Search className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1.5 cursor-pointer active:opacity-70"><MoreHorizontal className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}/>
                    <div className="absolute right-0 top-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-[#F0F0F0] dark:border-gray-700 py-1 z-50 min-w-[150px]">
                      <button onClick={() => { setOverlayUser(Number(id)); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800"><User className="w-4 h-4"/>{t('chat.viewProfile')}</button>
                      <button onClick={() => setShowMenu(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800"><AlertTriangle className="w-4 h-4"/>{t('chat.report')}</button>
                      <button onClick={() => { setSentMessages([]); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#FF4D4F] active:bg-[#F9F9F9] dark:active:bg-gray-800"><Trash2 className="w-4 h-4"/>{t('chat.clearChat')}</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 [&::-webkit-scrollbar]:hidden">
        {messages.map((m, i) => {
          const showTime = i === 0 || messages[i-1].time !== m.time;
          return (
            <div key={m.id}>
              {showTime && <div className="text-center py-2"><span className="text-[11px] text-[#BBB] dark:text-gray-400">{m.time}</span></div>}
              <div className={`flex mb-3 items-end gap-2 ${m.from ? 'justify-start' : 'justify-end'}`}>
                {m.from && <ImageWithFallback src={user.avatar} onClick={() => setOverlayUser(Number(id))} className="w-8 h-8 rounded-full object-cover shrink-0 cursor-pointer active:opacity-70"/>}
                <div className={`max-w-[70%] rounded-2xl text-[14px] leading-relaxed overflow-hidden shadow-sm ${m.from ? 'bg-white dark:bg-gray-800 text-[#333] dark:text-gray-100 rounded-bl-md border border-[#F0F0F0] dark:border-gray-700' : 'bg-[#E8E8E8] dark:bg-gray-700 text-[#333] dark:text-gray-100 rounded-br-md'}`}>
                  {m.image ? (
                    <img src={m.image} className="max-w-full max-h-[200px] object-cover" alt="" />
                  ) : m.type === 'location' ? (
                    <div className="w-[220px] overflow-hidden cursor-pointer" onClick={() => openMap(m.lat!, m.lng!)}>
                      <div className="w-full h-[100px] bg-[#F0F0F0] dark:bg-gray-600 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-[#FF8C42]" />
                      </div>
                      <div className="px-3 py-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#FF8C42]" />
                        <span className="text-[12px] text-[#666] dark:text-gray-300">{m.text}</span>
                      </div>
                    </div>
                  ) : m.text ? (
                    <div className="px-3 py-2">{m.text}</div>
                  ) : null}
                </div>
                {!m.from && <ImageWithFallback src={myAvatar} className="w-8 h-8 rounded-full object-cover shrink-0"/>}
              </div>
            </div>
          );
        })}
      </div>

      {menuVisible && (
        <>
          <div className="fixed inset-0 z-[80] bg-black/40" onClick={() => setMenuVisible(false)} />
          <div className="fixed inset-x-0 bottom-0 z-[90] animate-slide-up bg-white dark:bg-gray-900 rounded-t-[20px] shadow-2xl" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
            <div className="flex justify-center py-3">
              <div className="w-10 h-1 rounded-full bg-[#DDD] dark:bg-gray-600" />
            </div>
            <div className="flex justify-around px-6 pb-6">
              {moreActions.map((a, i) => (
                <button key={i} onClick={a.onClick} className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70 w-16">
                  <div className="w-14 h-14 rounded-2xl bg-[#F5F5F5] dark:bg-gray-800 flex items-center justify-center">
                    {locating && a.icon === MapPin ? <span className="w-5 h-5 border-2 border-[#FF8C42] border-t-transparent rounded-full animate-spin"/> : <a.icon className="w-6 h-6 text-[#333] dark:text-gray-100"/>}
                  </div>
                  <span className="text-[11px] text-[#666] dark:text-gray-400 whitespace-nowrap">{a.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setMenuVisible(false)} className="w-full h-12 flex items-center justify-center text-[14px] text-[#999] dark:text-gray-400 border-t border-[#F0F0F0] dark:border-gray-700 active:bg-[#F9F9F9] dark:active:bg-gray-800">
              {t('common.cancel')}
            </button>
          </div>
        </>
      )}

      <div className="bg-white dark:bg-gray-900 border-t border-[#EEE] dark:border-gray-700 px-3 py-2 flex items-center gap-2 shrink-0" style={{paddingBottom: `calc(env(safe-area-inset-bottom) + 8px + ${keyboardOffset}px)`}}>
        <button onClick={() => setMenuVisible(!menuVisible)} className={`p-1.5 rounded-full cursor-pointer active:opacity-70 transition-colors ${menuVisible ? 'bg-[#FF8C42] text-white' : 'text-[#666] dark:text-gray-400'}`}>
          <Plus className={`w-5 h-5 transition-transform duration-300 ${menuVisible ? 'rotate-45' : ''}`} />
        </button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
          placeholder={t('common.sendMessage')}
          className="flex-1 h-9 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-full px-4 text-[14px] outline-none"/>
        <button onClick={send} disabled={!input.trim()} className={`w-9 h-9 rounded-full flex items-center justify-center ${input.trim() ? 'bg-[#FF8C42]' : 'bg-[#E5E5E5] dark:bg-gray-700'}`}>
          <Send className="w-4 h-4 text-white"/>
        </button>
      </div>
      {overlayUser !== null && createPortal(
        <div ref={overlayRef} className="fixed inset-0 z-[2000]">
          <UserProfile userId={overlayUser} onBack={() => setOverlayUser(null)} />
        </div>,
        document.body
      )}
    </div>
  );
}
