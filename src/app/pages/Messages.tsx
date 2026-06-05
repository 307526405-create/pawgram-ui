import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { MoreHorizontal, ChevronRight, CheckCheck, Settings, Ban, Search, X, Heart, MessageCircle, UserPlus } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

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

const NOTIF_ICON_MAP: Record<string, { icon: (cls: string) => React.ReactNode; showAvatar?: boolean }> = {
  likes: { icon: (cls) => <Heart className={cls} fill="#FF4D4F" /> },
  comments: { icon: (cls) => <MessageCircle className={cls} fill="#FF8C42" /> },
  follows: { icon: (cls) => <UserPlus className={cls} fill="#FF8C42" />, showAvatar: true },
};

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

  const { containerRef: scrollRef, onScroll } = useScrollRestore();
  const [clearedUnreadIds, setClearedUnreadIds] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('pawgram_read_convs') || '[]')); } catch { return new Set(); }
  });
  const [deletedConvIds, setDeletedConvIds] = useState<Set<number>>(new Set());
  const [allRead, setAllRead] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setClearedUnreadIds(prev => {
        const next = new Set([...prev, detail]);
        try { localStorage.setItem('pawgram_read_convs', JSON.stringify([...next])); } catch {}
        return next;
      });
    };
    window.addEventListener('pawgram:clear-conv-unread', handler);
    return () => window.removeEventListener('pawgram:clear-conv-unread', handler);
  }, []);

  const convs = useMemo(() =>
    conversations
      .filter(c => !deletedConvIds.has(c.id))
      .map(c => ({ ...c, unread: allRead || clearedUnreadIds.has(c.id) ? 0 : c.unread })),
  [conversations, deletedConvIds, allRead, clearedUnreadIds]);

  const notifs = useMemo(() =>
    notifGroups.map(g => ({ ...g, count: allRead ? 0 : g.count })),
  [notifGroups, allRead]);

  const totalUnread = notifs.reduce((s, g) => s + g.count, 0) + convs.reduce((s, c) => s + c.unread, 0);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('pawgram:unread-count', { detail: totalUnread }));
  }, [totalUnread]);

  const deleteConv = (id: number) => setDeletedConvIds(prev => new Set([...prev, id]));
  const markAllRead = () => {
    setAllRead(true);
    setShowMenu(false);
  };

  const renderNotifIcon = (key: string) => {
    const cfg = NOTIF_ICON_MAP[key];
    const cls = "w-6 h-6 shrink-0";
    if (cfg) return cfg.icon(cls);
    return <MessageCircle className={cls + " text-[#FF8C42]"} />;
  };

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      {/* Header: centered title + search + more */}
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0">
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
            <div className="w-8 shrink-0" />
            <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100">{t('messages.title')}</h1>
            <div className="w-8 shrink-0 flex items-center justify-end gap-1">
              <button onClick={() => setShowSearch(true)} className="p-1.5 cursor-pointer active:opacity-70"><Search className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="p-1 cursor-pointer active:opacity-70"><MoreHorizontal className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}/>
                    <div className="absolute right-0 top-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-[#F0F0F0] dark:border-gray-700 py-1 z-50 min-w-[130px]">
                      <button onClick={markAllRead} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 cursor-pointer active:bg-[#F9F9F9] dark:active:bg-gray-800">
                        <CheckCheck className="w-4 h-4"/>{t('messages.markAllRead')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden" ref={scrollRef} onScroll={onScroll}>
        {/* 1. New Friends — horizontal scroll */}
        <div className="bg-white dark:bg-gray-900 mb-2">
          <div className="flex gap-3 px-4 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {newFriends.map(f => (
              <div key={f.id} className="shrink-0 flex flex-col items-center gap-1.5 w-[52px]">
                <ImageWithFallback src={f.avatar} onClick={() => navigate(`/user/${f.id}`)} className="w-[52px] h-[52px] rounded-full object-cover cursor-pointer active:opacity-70"/>
                <span className="text-[11px] text-[#333] dark:text-gray-100 text-center leading-tight line-clamp-2">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Notification Groups — white card */}
        <div className="bg-white dark:bg-gray-900 mb-2">
          {notifs.map(g => {
            const cfg = NOTIF_ICON_MAP[g.key];
            return (
              <div key={g.key} onClick={() => navigate(`/notifications/${g.key}`)} className="flex items-center gap-2.5 px-4 py-3 border-b border-[#F5F5F5] dark:border-gray-700 last:border-b-0 active:bg-[#F9F9F9] dark:active:bg-gray-800 cursor-pointer">
                {renderNotifIcon(g.key)}
                {g.count > 0 && (
                  <span className="text-[14px] font-bold text-[#FF4D4F] shrink-0">{g.count > 99 ? '99+' : g.count}</span>
                )}
                {cfg?.showAvatar && (
                  <ImageWithFallback src={g.avatar} className="w-6 h-6 rounded-full object-cover shrink-0" />
                )}
                <span className="flex-1 text-[12px] text-[#999] dark:text-gray-400 truncate min-w-0">{g.desc}</span>
                <ChevronRight className="w-4 h-4 text-[#CCC] dark:text-gray-600 shrink-0"/>
              </div>
            );
          })}
        </div>

        {/* 3. Chat List — white card */}
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
              <div key={c.id} className="relative group">
                <div onClick={() => navigate(`/chat/${c.id}`)} className="flex items-center gap-3 px-4 py-3 border-b border-[#F5F5F5] dark:border-gray-700 last:border-b-0 active:bg-[#F9F9F9] dark:active:bg-gray-800 cursor-pointer">
                  <ImageWithFallback
                    src={c.avatar}
                    onClick={(e) => { e.stopPropagation(); navigate(`/user/${c.id}`); }}
                    className="w-12 h-12 rounded-full object-cover shrink-0 cursor-pointer active:opacity-70"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#333] dark:text-gray-100 truncate">{c.name}</span>
                      <span className="text-[10px] text-[#BBB] dark:text-gray-500 shrink-0 ml-2">{c.time}</span>
                    </div>
                    <span className="text-[12px] text-[#999] dark:text-gray-400 block truncate mt-0.5">{c.lastMsg}</span>
                  </div>
                  {c.unread > 0 && (
                    <div className="shrink-0 min-w-[18px] h-[18px] bg-[#FF4D4F] rounded-full flex items-center justify-center px-1">
                      <span className="text-[10px] text-white font-bold leading-none">{c.unread > 99 ? '99+' : c.unread}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(c.id); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#F0F0F0] dark:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-[#999] dark:text-gray-400" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="h-6"/>
      </div>

      <BottomNav />

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDeleteId(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl px-6 py-6 mx-8 w-full max-w-[280px] shadow-xl">
            <p className="text-[15px] text-[#333] dark:text-gray-100 text-center font-medium mb-1">{t('messages.deleteConfirmTitle')}</p>
            <p className="text-[13px] text-[#999] dark:text-gray-400 text-center mb-5">{t('messages.deleteConfirmDesc')}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 h-10 rounded-full bg-[#F0F0F0] dark:bg-gray-800 text-[14px] font-medium text-[#333] dark:text-gray-100 active:bg-[#E5E5E5]">
                {t('common.cancel')}
              </button>
              <button onClick={() => { deleteConv(confirmDeleteId); setConfirmDeleteId(null); }} className="flex-1 h-10 rounded-full bg-[#FF4D4F] text-[14px] font-medium text-white active:bg-[#E04345]">
                {t('common.delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
