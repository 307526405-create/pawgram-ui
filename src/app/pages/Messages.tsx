import { useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { MoreHorizontal, ChevronRight, CheckCheck, Settings, Ban, Search } from "lucide-react";

const newFriendBase = [
  { id:1, name:"Alice Wang", avatar:"https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=120" },
  { id:2, name:"Bob Chen", avatar:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120" },
  { id:3, name:"Diana Wu", avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120" },
  { id:4, name:"Eric Liu", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120" },
];

const notifGroupBase = [
  { key:"likes", count:3, avatar:"https://images.unsplash.com/photo-1761933808230-9a2e78956daa?w=80" },
  { key:"follows", count:2, avatar:"https://images.unsplash.com/photo-1536548665027-b96d34a005ae?w=80" },
  { key:"comments", count:5, avatar:"https://images.unsplash.com/photo-1615464670798-6e92fafa2a89?w=80" },
];

const conversationBase = [
  { id:1, name:"Alice Wang", avatar:"https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150", unread:2 },
  { id:2, name:"Charlie Lee", avatar:"https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150", unread:0 },
  { id:3, name:"Bob Chen", avatar:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", unread:0 },
  { id:4, name:"Diana Wu", avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", unread:1 },
];

export function Messages() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const mockData = useMemo(() => {
    const bundle = i18n.getResourceBundle(i18n.language, 'translation');
    return bundle?.mock || {};
  }, [i18n.language]);

  const newFriends = useMemo(() =>
    newFriendBase.map((f, i) => ({
      ...f,
      bio: mockData.newFriends?.[i]?.bio || '',
    })),
  [mockData]);

  const notifGroups = useMemo(() =>
    notifGroupBase.map((g, i) => ({
      ...g,
      label: mockData.notifGroups?.[i]?.label || '',
      desc: mockData.notifGroups?.[i]?.desc || '',
    })),
  [mockData]);

  const conversations = useMemo(() =>
    conversationBase.map((c, i) => ({
      ...c,
      lastMsg: mockData.conversations?.[i]?.lastMsg || '',
      time: mockData.conversations?.[i]?.time || '',
    })),
  [mockData]);

  const [deletedConvIds, setDeletedConvIds] = useState<Set<number>>(new Set());
  const [allRead, setAllRead] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const convs = useMemo(() =>
    conversations
      .filter(c => !deletedConvIds.has(c.id))
      .map(c => ({ ...c, unread: allRead ? 0 : c.unread })),
  [conversations, deletedConvIds, allRead]);

  const notifs = useMemo(() =>
    notifGroups.map(g => ({ ...g, count: allRead ? 0 : g.count })),
  [notifGroups, allRead]);

  const totalUnread = notifs.reduce((s, g) => s + g.count, 0) + convs.reduce((s, c) => s + c.unread, 0);
  const deleteConv = (id: number) => setDeletedConvIds(prev => new Set([...prev, id]));
  const markAllRead = () => {
    setAllRead(true);
    setShowMenu(false);
  };

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0">
        {showSearch ? (
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 bg-[#F0F0F0] dark:bg-gray-800 rounded-full flex items-center px-3 h-8">
              <Search className="w-4 h-4 text-[#999] dark:text-gray-400 mr-1.5"/>
              <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder={t('messages.searchChats')} className="flex-1 bg-transparent text-[14px] dark:text-gray-100 outline-none"/>
            </div>
            <button onClick={() => { setShowSearch(false); setSearchQuery(""); }} className="text-[14px] text-[#FF8C42] shrink-0">{t('common.cancel')}</button>
          </div>
        ) : (
          <>
            <h1 className="text-[17px] font-bold text-[#333] dark:text-gray-100">
              {t('messages.title')}
              {totalUnread > 0 && <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full bg-[#FF4D4F] text-white text-[10px] font-bold px-1 ml-2 align-middle">{totalUnread}</span>}
            </h1>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowSearch(true)} className="p-1.5"><Search className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1"><MoreHorizontal className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}/>
                    <div className="absolute right-0 top-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-[#F0F0F0] dark:border-gray-700 py-1 z-50 min-w-[150px]">
                      <button onClick={markAllRead} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800">
                        <CheckCheck className="w-4 h-4"/>{t('messages.markAllRead')}
                      </button>
                      <button onClick={() => setShowMenu(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800">
                        <Settings className="w-4 h-4"/>{t('messages.messageSettings')}
                      </button>
                      <button onClick={() => setShowMenu(false)} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800">
                        <Ban className="w-4 h-4"/>{t('messages.blockSettings')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden">
        <div className="bg-white dark:bg-gray-900 mb-2">
          <div className="flex gap-3 px-4 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {newFriends.map(f => (
              <div key={f.id} className="shrink-0 flex flex-col items-center gap-1.5 w-[64px]">
                <ImageWithFallback src={f.avatar} className="w-[52px] h-[52px] rounded-full object-cover"/>
                <span className="text-[11px] text-[#333] dark:text-gray-100 text-center leading-tight line-clamp-2">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 mb-2">
          {notifs.map(g => (
            <div key={g.key} className="flex items-center gap-3 px-4 py-3 border-b border-[#F5F5F5] dark:border-gray-700 last:border-b-0 active:bg-[#F9F9F9] dark:active:bg-gray-800">
              <ImageWithFallback src={g.avatar} className="w-11 h-11 rounded-full object-cover shrink-0"/>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-[#333] dark:text-gray-100">{g.label}</div>
                <div className="text-[12px] text-[#999] dark:text-gray-400 truncate mt-0.5">{g.desc}</div>
              </div>
              {g.count > 0 && (
                <div className="min-w-[20px] h-5 bg-[#FF4D4F] rounded-full flex items-center justify-center px-1.5">
                  <span className="text-[10px] text-white font-bold">{g.count > 99 ? '99+' : g.count}</span>
                </div>
              )}
              <ChevronRight className="w-4 h-4 text-[#CCC] dark:text-gray-600 shrink-0"/>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900">
          <div className="px-4 py-3 border-b border-[#F5F5F5] dark:border-gray-700">
            <span className="text-[13px] font-bold text-[#333] dark:text-gray-100">{t('messages.privateMessages')}</span>
          </div>
          {convs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFF3E6] dark:bg-orange-900/30 flex items-center justify-center mb-3">
                <span className="text-2xl">🐾</span>
              </div>
              <p className="text-[14px] text-[#999] dark:text-gray-400 mb-1">{t('messages.noMessagesTitle')}</p>
              <p className="text-[12px] text-[#BBB] dark:text-gray-500 mb-4">{t('messages.goMeetFriends')}</p>
              <Link to="/discover" className="bg-[#FF8C42] text-white px-6 py-2 rounded-full text-[13px] font-bold active:bg-[#E67A35]">
                {t('home.goDiscover')}
              </Link>
            </div>
          ) : (
            convs.map(c => (
              <SwipeDelete key={c.id} onDelete={() => deleteConv(c.id)}>
                <div onClick={() => navigate(`/chat/${c.id}`)} className="flex items-center gap-3 px-4 py-3 border-b border-[#F5F5F5] dark:border-gray-700 last:border-b-0 active:bg-[#F9F9F9] dark:active:bg-gray-800">
                  <div className="relative shrink-0">
                    <ImageWithFallback src={c.avatar} className="w-12 h-12 rounded-full object-cover"/>
                    {c.unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#FF4D4F] border-2 border-white dark:border-gray-900"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#333] dark:text-gray-100">{c.name}</span>
                      <span className="text-[10px] text-[#BBB] dark:text-gray-500 shrink-0 ml-2">{c.time}</span>
                    </div>
                    <span className="text-[12px] text-[#999] dark:text-gray-400 block truncate mt-0.5">{c.lastMsg}</span>
                  </div>
                  {c.unread > 0 && (
                    <div className="shrink-0 min-w-[20px] h-5 bg-[#FF4D4F] rounded-full flex items-center justify-center px-1.5">
                      <span className="text-[10px] text-white font-bold">{c.unread > 99 ? '99+' : c.unread}</span>
                    </div>
                  )}
                </div>
              </SwipeDelete>
            ))
          )}
        </div>

        <div className="h-6"/>
      </div>

      <BottomNav />
    </div>
  );
}

/* ─── Swipe to delete ─── */
function SwipeDelete({ children, onDelete }: { children: React.ReactNode; onDelete: () => void }) {
  const { t } = useTranslation();
  const [offset, setOffset] = useState(0);
  const startX = useRef(0);
  const swiping = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; swiping.current = true; };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!swiping.current) return;
    const dx = e.touches[0].clientX - startX.current;
    if (dx < 0) setOffset(Math.max(dx, -80));
    else setOffset(Math.min(offset + dx * 0.3, 0));
  };
  const onTouchEnd = () => {
    swiping.current = false;
    setOffset(offset < -40 ? -80 : 0);
  };

  return (
    <div className="relative overflow-hidden">
      <button onClick={() => { setOffset(0); onDelete(); }} className="absolute right-0 top-0 bottom-0 w-20 bg-[#FF4D4F] flex items-center justify-center text-white text-[13px] font-medium">{t('common.delete')}</button>
      <div className="relative bg-white dark:bg-gray-900" style={{ transform: `translateX(${offset}px)`, transition: swiping.current ? 'none' : 'transform 0.2s' }}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {children}
      </div>
    </div>
  );
}
