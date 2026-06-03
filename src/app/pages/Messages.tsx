import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { MoreHorizontal, ChevronRight, CheckCheck, Settings, Ban, Search, X } from "lucide-react";
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
  const [deletedConvIds, setDeletedConvIds] = useState<Set<number>>(new Set());
  const [allRead, setAllRead] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [activeNotifGroup, setActiveNotifGroup] = useState<string | null>(null);

  const notifDetails: Record<string, { name: string; avatar: string; time: string; text: string }[]> = {
    likes: [
      { name: '大黄铲屎官', avatar: 'https://images.unsplash.com/photo-1761933808230-9a2e78956daa?w=80', time: '3分钟前', text: '赞了你的帖子' },
      { name: '橘猫日记', avatar: 'https://images.unsplash.com/photo-1536548665027-b96d34a005ae?w=80', time: '15分钟前', text: '收藏了你的帖子' },
      { name: '柯基小短腿', avatar: 'https://images.unsplash.com/photo-1615464670798-6e92fafa2a89?w=80', time: '1小时前', text: '赞了你的帖子' },
    ],
    follows: [
      { name: '橘猫日记', avatar: 'https://images.unsplash.com/photo-1536548665027-b96d34a005ae?w=80', time: '15分钟前', text: '关注了你' },
      { name: '汪星人阿呆', avatar: 'https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?w=80', time: '2小时前', text: '关注了你' },
    ],
    comments: [
      { name: '柯基小短腿', avatar: 'https://images.unsplash.com/photo-1615464670798-6e92fafa2a89?w=80', time: '30分钟前', text: '评论了你：好可爱！' },
      { name: '大黄铲屎官', avatar: 'https://images.unsplash.com/photo-1761933808230-9a2e78956daa?w=80', time: '1小时前', text: '@了你' },
      { name: '萨摩耶球球', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80', time: '2小时前', text: '评论了你：在哪里拍的？' },
      { name: '橘猫日记', avatar: 'https://images.unsplash.com/photo-1536548665027-b96d34a005ae?w=80', time: '3小时前', text: '评论了你：好可爱的小狗！' },
      { name: '布偶汤圆', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80', time: '昨天', text: '@了你' },
    ],
  };

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

      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden" ref={scrollRef} onScroll={onScroll}>
        <div className="bg-white dark:bg-gray-900 mb-2">
          <div className="flex gap-3 px-4 py-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {newFriends.map(f => (
              <div key={f.id} className="shrink-0 flex flex-col items-center gap-1.5 w-[64px]">
                <ImageWithFallback src={f.avatar} className="w-[52px] h-[52px] rounded-full object-cover cursor-pointer active:opacity-70"/>
                <span className="text-[11px] text-[#333] dark:text-gray-100 text-center leading-tight line-clamp-2">{f.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 mb-2">
          {notifs.map(g => (
            <div key={g.key} onClick={() => setActiveNotifGroup(g.key)} className="flex items-center gap-3 px-4 py-3 border-b border-[#F5F5F5] dark:border-gray-700 last:border-b-0 active:bg-[#F9F9F9] dark:active:bg-gray-800 cursor-pointer">
              <ImageWithFallback src={g.avatar} className="w-11 h-11 rounded-full object-cover shrink-0 cursor-pointer active:opacity-70"/>
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
              <div key={c.id} className="relative group">
                <div onClick={() => navigate(`/chat/${c.id}`)} className="flex items-center gap-3 px-4 py-3 border-b border-[#F5F5F5] dark:border-gray-700 last:border-b-0 active:bg-[#F9F9F9] dark:active:bg-gray-800 cursor-pointer">
                  <div className="relative shrink-0">
                    <ImageWithFallback src={c.avatar} className="w-12 h-12 rounded-full object-cover cursor-pointer active:opacity-70"/>
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
                <button
                  onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(c.id); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#F0F0F0] dark:bg-gray-700 flex items-center justify-center opacity-0 group-hover:opacity-100 active:opacity-100 transition-opacity"
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

      {activeNotifGroup && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setActiveNotifGroup(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative w-full bg-white dark:bg-gray-900 rounded-t-[20px] px-5 pt-4 pb-8 max-h-[60vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-[#333] dark:text-gray-100">
                {notifs.find(g => g.key === activeNotifGroup)?.label}
              </h2>
              <button onClick={() => setActiveNotifGroup(null)}><X className="w-5 h-5 text-[#999] dark:text-gray-400" /></button>
            </div>
            <div className="space-y-2">
              {(notifDetails[activeNotifGroup] || []).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F8F8] dark:bg-gray-800">
                  <ImageWithFallback src={item.avatar} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#333] dark:text-gray-100 font-medium">{item.name}</div>
                    <div className="text-[12px] text-[#999] dark:text-gray-400 mt-0.5">{item.text}</div>
                  </div>
                  <span className="text-[10px] text-[#BBB] dark:text-gray-500 shrink-0">{item.time}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setActiveNotifGroup(null)} className="w-full h-10 mt-4 text-[#999] dark:text-gray-400 text-[13px]">{t('common.close')}</button>
          </div>
        </div>
      )}

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
