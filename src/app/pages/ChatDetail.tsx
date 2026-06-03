import { ChevronLeft, Search, MoreHorizontal, Send, Plus, Image, Camera, MapPin, Star, User, AlertTriangle, Trash2 } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageTransition } from "../hooks/usePageTransition";

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

  const [sentMessages, setSentMessages] = useState<{id:number; from:boolean; text:string; time:string}[]>([]);
  const [input, setInput] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = [...mockMessages, ...sentMessages];

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    setSentMessages(prev => [...prev, { id:Date.now(), from:false, text, time:`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}` }]);
    setInput("");
    setShowMore(false);
  };

  const moreActions = [
    { icon:Image, label:t('chat.photo'), onClick:(e: React.MouseEvent) => { e.stopPropagation(); setShowMore(false); alert(t('common.featureInDev')); } },
    { icon:Camera, label:t('chat.takePhoto'), onClick:(e: React.MouseEvent) => { e.stopPropagation(); setShowMore(false); alert(t('common.featureInDev')); } },
    { icon:MapPin, label:t('chat.location'), onClick:(e: React.MouseEvent) => { e.stopPropagation(); setShowMore(false); alert(t('common.featureInDev')); } },
    { icon:Star, label:t('chat.favorites'), onClick:(e: React.MouseEvent) => { e.stopPropagation(); setShowMore(false); alert(t('common.featureInDev')); } },
  ];

  return (
    <div className={`h-full bg-white dark:bg-gray-900 relative flex flex-col ${className}`}>
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
              <ImageWithFallback src={user.avatar} className="w-8 h-8 rounded-full object-cover cursor-pointer active:opacity-70"/>
              <span className="text-[16px] font-bold text-[#333] dark:text-gray-100">{user.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowSearch(true)} className="p-1.5"><Search className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1.5"><MoreHorizontal className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
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
              {showTime && <div className="text-center py-2"><span className="text-[11px] text-[#BBB] dark:text-gray-500">{m.time}</span></div>}
              <div className={`flex mb-3 items-end gap-2 ${m.from ? 'justify-start' : 'justify-end'}`}>
                {m.from && <ImageWithFallback src={user.avatar} className="w-8 h-8 rounded-full object-cover shrink-0 cursor-pointer active:opacity-70"/>}
                <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-[14px] leading-relaxed ${m.from ? 'bg-[#F5F5F5] dark:bg-gray-800 text-[#333] dark:text-gray-100 rounded-bl-sm' : 'bg-[#FF8C42] text-white rounded-br-sm'}`}>
                  {m.text}
                </div>
                {!m.from && <ImageWithFallback src={myAvatar} className="w-8 h-8 rounded-full object-cover shrink-0"/>}
              </div>
            </div>
          );
        })}
      </div>

      {showMore && (
        <div className="bg-[#F5F5F5] dark:bg-gray-800 border-t border-[#EEE] dark:border-gray-700 px-4 py-3">
          <div className="flex justify-around">
            {moreActions.map((a, i) => (
              <button key={i} onClick={a.onClick} className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-900 flex items-center justify-center shadow-sm">
                  <a.icon className="w-6 h-6 text-[#333] dark:text-gray-100"/>
                </div>
                <span className="text-[10px] text-[#666] dark:text-gray-400">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border-t border-[#EEE] dark:border-gray-700 px-3 py-2 flex items-center gap-2" style={{paddingBottom:'calc(env(safe-area-inset-bottom) + 8px)'}}>
        <button onClick={() => setShowMore(!showMore)} className={`p-1.5 rounded-full ${showMore ? 'bg-[#FF8C42] text-white' : 'text-[#666] dark:text-gray-400'}`}>
          <Plus className="w-5 h-5"/>
        </button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
          placeholder={t('common.sendMessage')}
          className="flex-1 h-9 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-full px-4 text-[14px] outline-none"/>
        <button onClick={send} disabled={!input.trim()} className={`w-9 h-9 rounded-full flex items-center justify-center ${input.trim() ? 'bg-[#FF8C42]' : 'bg-[#E5E5E5] dark:bg-gray-700'}`}>
          <Send className="w-4 h-4 text-white"/>
        </button>
      </div>
    </div>
  );
}
