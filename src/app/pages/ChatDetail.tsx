import { ChevronLeft, Search, MoreHorizontal, Send, Plus, Image, Camera, MapPin, Star, User, AlertTriangle, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const mockMessages = [
  { id:1, from:true, text:"周末去公园遛狗吗？", time:"10:30" },
  { id:2, from:false, text:"好呀！几点？", time:"10:32" },
  { id:3, from:true, text:"下午三点怎么样？带上你家金毛", time:"10:33" },
  { id:4, from:false, text:"没问题！上次它俩玩得可开心了", time:"10:35" },
  { id:5, from:true, text:"哈哈是的，这次我再带点零食", time:"10:36" },
  { id:6, from:false, text:"好的，老地方见！🐶", time:"10:38" },
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
  const { id } = useParams();
  const user = users[id || "1"] || { name:"用户", avatar:"" };
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight); }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    setMessages(prev => [...prev, { id:Date.now(), from:false, text, time:`${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}` }]);
    setInput("");
    setShowMore(false);
  };

  const moreActions = [
    { icon:Image, label:"照片", onClick:() => setShowMore(false) },
    { icon:Camera, label:"拍摄", onClick:() => setShowMore(false) },
    { icon:MapPin, label:"位置", onClick:() => setShowMore(false) },
    { icon:Star, label:"收藏", onClick:() => setShowMore(false) },
  ];

  return (
    <div className="h-full bg-white relative flex flex-col">
      {/* Header */}
      <div className="bg-white pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 border-b border-[#F0F0F0]">
        {showSearch ? (
          <div className="flex-1 flex items-center gap-2">
            <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="p-1 -ml-1"><ChevronLeft className="w-5 h-5 text-[#333]"/></button>
            <div className="flex-1 bg-[#F5F5F5] rounded-full flex items-center px-3 h-8">
              <Search className="w-4 h-4 text-[#999] mr-1.5"/>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="搜索聊天记录" className="flex-1 bg-transparent text-[14px] outline-none"/>
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ChevronLeft className="w-6 h-6 text-[#333]"/></button>
            <div className="flex-1 flex items-center gap-2 ml-2">
              <ImageWithFallback src={user.avatar} className="w-8 h-8 rounded-full object-cover"/>
              <span className="text-[16px] font-bold text-[#333]">{user.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowSearch(true)} className="p-1.5"><Search className="w-5 h-5 text-[#333]"/></button>
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1.5"><MoreHorizontal className="w-5 h-5 text-[#333]"/></button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}/>
                    <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-[#F0F0F0] py-1 z-50 min-w-[150px]">
                      <button onClick={() => setShowMenu(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] active:bg-[#F9F9F9]">
                        <User className="w-4 h-4"/>查看主页
                      </button>
                      <button onClick={() => setShowMenu(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] active:bg-[#F9F9F9]">
                        <AlertTriangle className="w-4 h-4"/>举报
                      </button>
                      <button onClick={() => { setMessages(mockMessages); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#FF4D4F] active:bg-[#F9F9F9]">
                        <Trash2 className="w-4 h-4"/>清空聊天
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 [&::-webkit-scrollbar]:hidden">
        {messages.map((m, i) => {
          const showTime = i === 0 || messages[i-1].time !== m.time;
          return (
            <div key={m.id}>
              {showTime && <div className="text-center py-2"><span className="text-[11px] text-[#BBB]">{m.time}</span></div>}
              <div className={`flex mb-3 items-end gap-2 ${m.from ? 'justify-start' : 'justify-end'}`}>
                {m.from && <ImageWithFallback src={user.avatar} className="w-8 h-8 rounded-full object-cover shrink-0"/>}
                <div className={`max-w-[70%] px-3 py-2 rounded-2xl text-[14px] leading-relaxed ${m.from ? 'bg-[#F5F5F5] text-[#333] rounded-bl-sm' : 'bg-[#FF8C42] text-white rounded-br-sm'}`}>
                  {m.text}
                </div>
                {!m.from && <ImageWithFallback src={myAvatar} className="w-8 h-8 rounded-full object-cover shrink-0"/>}
              </div>
            </div>
          );
        })}
      </div>

      {/* More panel */}
      {showMore && (
        <div className="bg-[#F5F5F5] border-t border-[#EEE] px-4 py-3">
          <div className="flex justify-around">
            {moreActions.map((a, i) => (
              <button key={i} onClick={a.onClick} className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <a.icon className="w-6 h-6 text-[#333]"/>
                </div>
                <span className="text-[10px] text-[#666]">{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="bg-white border-t border-[#EEE] px-3 py-2 flex items-center gap-2" style={{paddingBottom:'calc(env(safe-area-inset-bottom) + 8px)'}}>
        <button onClick={() => setShowMore(!showMore)} className={`p-1.5 rounded-full ${showMore ? 'bg-[#FF8C42] text-white' : 'text-[#666]'}`}>
          <Plus className="w-5 h-5"/>
        </button>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
          onFocus={() => setShowMore(false)}
          placeholder="发送消息..."
          className="flex-1 h-9 bg-[#F5F5F5] rounded-full px-4 text-[14px] outline-none"/>
        <button onClick={send} disabled={!input.trim()} className={`w-9 h-9 rounded-full flex items-center justify-center ${input.trim() ? 'bg-[#FF8C42]' : 'bg-[#E5E5E5]'}`}>
          <Send className="w-4 h-4 text-white"/>
        </button>
      </div>
    </div>
  );
}
