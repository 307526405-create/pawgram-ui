import { ChevronLeft, Search, MoreHorizontal, Send, Plus, Image, Camera, MapPin, Star, User, AlertTriangle, Trash2 } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageTransition } from "../hooks/usePageTransition";
import { UserProfile } from "./UserProfile";

const FAVORITES_KEY = 'pawgram_chat_favorites';

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

  const [sentMessages, setSentMessages] = useState<{id:number; from:boolean; text:string; time:string; image?:string}[]>([]);
  const [input, setInput] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'); } catch { return []; }
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [overlayUser, setOverlayUser] = useState<number | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  // Block WKWebView gesture on overlay
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
    // persist so Messages can pick it up even after remount
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
    setShowMore(false);
  };

  const sendImage = (src: string) => {
    const now = new Date();
    setSentMessages(prev => [...prev, { id:Date.now(), from:false, text:'', time:`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`, image:src }]);
    setShowMore(false);
  };

  const handlePhotoPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (reader.result) sendImage(reader.result as string); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { if (reader.result) sendImage(reader.result as string); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const sendLocation = () => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const text = `📍 ${t('chat.location')}: ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        const now = new Date();
        setSentMessages(prev => [...prev, { id:Date.now(), from:false, text, time:`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}` }]);
        setLocating(false);
        setShowMore(false);
      },
      () => { setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const addToFavorites = () => {
    const convKey = `chat_${id}`;
    setFavorites(prev => {
      const next = prev.includes(convKey) ? prev : [...prev, convKey];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
    setShowMore(false);
  };

  const moreActions = [
    { icon:Image, label:t('chat.photo'), onClick:() => photoInputRef.current?.click() },
    { icon:Camera, label:t('chat.takePhoto'), onClick:() => cameraInputRef.current?.click() },
    { icon:MapPin, label:t('chat.location'), onClick:sendLocation },
    { icon:Star, label:t('chat.favorites'), onClick:addToFavorites },
  ];

  return (
    <div className={`h-full bg-[#EDEDED] dark:bg-gray-950 relative flex flex-col ${className}`}>
      <div className="bg-white dark:bg-gray-900 pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 border-b border-[#F0F0F0] dark:border-gray-700">
        {showSearch ? (
          <div className="flex-1 flex items-center gap-2">
            <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="p-1 -ml-1"><ChevronLeft className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
            <div className="flex-1 bg-[#F5F5F5] dark:bg-gray-800 rounded-full flex items-center px-3 h-8">
              <Search className="w-4 h-4 text-[#999] dark:text-gray-400 mr-1.5"/>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('messages.searchChats')} className="flex-1 bg-transparent text-[14px] dark:text-gray-100 outline-none"/>
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
                      <button onClick={() => setShowMenu(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800">
                        <User className="w-4 h-4"/>{t('chat.viewProfile')}
                      </button>
                      <button onClick={() => setShowMenu(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800">
                        <AlertTriangle className="w-4 h-4"/>{t('chat.report')}
                      </button>
                      <button onClick={() => { setSentMessages([]); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#FF4D4F] active:bg-[#F9F9F9] dark:active:bg-gray-800">
                        <Trash2 className="w-4 h-4"/>{t('chat.clearChat')}
                      </button>
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

      <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoPick} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCameraCapture} />

      {showMore && (
        <div className="bg-[#F5F5F5] dark:bg-gray-800 border-t border-[#EEE] dark:border-gray-700 px-4 py-3">
          <div className="flex justify-around">
            {moreActions.map((a, i) => (
              <button key={i} onClick={(e) => { e.stopPropagation(); a.onClick(); }} className="flex flex-col items-center gap-1.5 cursor-pointer active:opacity-70">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                  {locating && a.icon === MapPin ? <span className="w-5 h-5 border-2 border-[#FF8C42] border-t-transparent rounded-full animate-spin"/> : <a.icon className="w-6 h-6 text-[#333] dark:text-gray-100"/>}
                </div>
                <span className="text-[10px] text-[#666] dark:text-gray-400">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border-t border-[#EEE] dark:border-gray-700 px-3 py-2 flex items-center gap-2 shrink-0" style={{paddingBottom: `calc(env(safe-area-inset-bottom) + 8px + ${keyboardOffset}px)`}}>
        <button onClick={() => setShowMore(!showMore)} className={`p-1.5 rounded-full cursor-pointer active:opacity-70 ${showMore ? 'bg-[#FF8C42] text-white' : 'text-[#666] dark:text-gray-400'}`}>
          <Plus className="w-5 h-5"/>
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
