import { Search, Bell, X } from "lucide-react";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { PostCard, PostCardSkeleton } from "../components/PostCard";
import { BottomNav } from "../components/BottomNav";
import { Toast, toast } from "../components/Toast";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PetOnboarding } from "../components/PetOnboarding";
import { postsApi, usersApi, notificationsApi, petsApi } from "../api/client";
import { sendLikeNotification, sendFollowNotification } from "../utils/notifications";
import { useScrollRestore } from "../hooks/useScrollRestore";

const recommendUserAvatars = [
  "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=150",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
  "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=150",
];


export function Home() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'hot' | 'following'>('hot');

  const mockData = useMemo(() => {
    const bundle = i18n.getResourceBundle(i18n.language, 'translation');
    return bundle?.mock || {};
  }, [i18n.language]);

  const recommendUsers = useMemo(() =>
    (mockData.recommendUsers || []).map((u: any, i: number) => ({
      ...u,
      avatar: recommendUserAvatars[i],
    })),
  [mockData]);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const { count } = await notificationsApi.unreadCount(1);
      setUnreadCount(count);
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const data = await notificationsApi.list(1);
      setNotifications((data || []).slice(0, 10));
    } catch {}
  };

  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => { fetchUnreadCount(); fetchNotifications(); };
    window.addEventListener('pawgram:refresh-notifs', handler);
    return () => window.removeEventListener('pawgram:refresh-notifs', handler);
  }, []);
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [favedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());
  const [notifViewed, setNotifViewed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { containerRef: scrollRef, onScroll: saveScrollPos } = useScrollRestore(!loading);
  const [pullState, setPullState] = useState<'idle'|'pulling'|'ready'|'loading'>('idle');
  const [pullDist, setPullDist] = useState(0);
  const touchStartY = useRef(0);
  const pullRefreshing = useRef(false);
  const scrollTopBeforeRefresh = useRef(0);
  const [showPetOnboarding, setShowPetOnboarding] = useState(false);

  // Check if user needs pet onboarding
  useEffect(() => {
    const alreadyOnboarded = localStorage.getItem('pawgram_pet_created') === '1';
    if (alreadyOnboarded) return;
    usersApi.get(1).then((data) => {
      const user = data.user;
      if (!user.pet_breed) setShowPetOnboarding(true);
    }).catch(() => {});
  }, []);

  const fetchingRef = useRef(false);

  const fetchPosts = async (p?: number) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    if (p === 1) setLoading(true); else setLoadMoreLoading(true);
    try {
      const d = await postsApi.list(p || page);
      if (p === 1) { setPosts(d.list); setPage(2); }
      else { setPosts(prev => [...prev, ...d.list]); setPage(prev => prev + 1); }
      setHasMore(d.pagination.hasMore);
    } catch {}
    setLoading(false);
    setLoadMoreLoading(false);
    fetchingRef.current = false;
  };
  useEffect(() => { fetchPosts(1); }, []);

  const handleOpenNotifications = () => {
    fetchNotifications();
    setShowNotifications(true);
    setNotifViewed(true);
  };
  const toggleBookmark = (postId: number) => {
    setBookmarkedPosts(prev => { const next = new Set(prev); if (next.has(postId)) next.delete(postId); else next.add(postId); return next; });
  };

  const toggleLike = useCallback(async (postId: number, userName?: string) => {
    const wasLiked = likedPosts.has(postId);
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) { next.delete(postId); }
      else { next.add(postId); if (userName) sendLikeNotification(userName); }
      return next;
    });
    try {
      if (wasLiked) await postsApi.unlike(postId);
      else await postsApi.like(postId);
    } catch {
      setLikedPosts(prev => {
        const next = new Set(prev);
        wasLiked ? next.add(postId) : next.delete(postId);
        return next;
      });
      toast(wasLiked ? '取消点赞失败' : '点赞失败');
    }
  }, [likedPosts]);
  const toggleFollow = useCallback(async (userId: number, userName?: string) => {
    const wasFollowed = followedUsers.has(userId);
    setFollowedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) { next.delete(userId); }
      else { next.add(userId); if (userName) sendFollowNotification(userName); }
      return next;
    });
    try {
      if (wasFollowed) await usersApi.unfollow(userId);
      else await usersApi.follow(userId);
    } catch {
      setFollowedUsers(prev => {
        const next = new Set(prev);
        wasFollowed ? next.add(userId) : next.delete(userId);
        return next;
      });
      toast(wasFollowed ? '取消关注失败' : '关注失败');
    }
  }, [followedUsers]);
  const handleShare = (post: any) => {
    const text = `${t('common.brandName')}\n${post.user?.name ? post.user.name + ': ' : ''}${post.content}`;
    if (navigator.share) navigator.share({ title: t('common.brandName'), text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  const handleTouchStart = (e: React.TouchEvent) => { if (scrollRef.current?.scrollTop===0) touchStartY.current=e.touches[0].clientY; };
  const handleTouchMove = (e: React.TouchEvent) => { if (scrollRef.current?.scrollTop!==0||touchStartY.current===0) return; const d=e.touches[0].clientY-touchStartY.current; if(d>0){setPullDist(Math.min(d*.5,80));setPullState(d>60?'ready':'pulling');} };
  const handleTouchEnd = () => {
    if(pullState==='ready'){
      setPullState('loading');setPullDist(40);
      pullRefreshing.current = true;
      if (scrollRef.current) scrollTopBeforeRefresh.current = scrollRef.current.scrollTop;
      sessionStorage.setItem('pawgram_scroll_' + window.location.pathname, '0');
      fetchPosts(1);
    } else {
      setPullState('idle');setPullDist(0);
    }
    touchStartY.current=0;
  };

  useEffect(() => {
    if (!loading && pullRefreshing.current) {
      setPullState('idle');setPullDist(0);
      pullRefreshing.current = false;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (scrollRef.current) scrollRef.current.scrollTop = scrollTopBeforeRefresh.current;
        });
      });
    }
  }, [loading]);
  const handleScroll = () => {
    saveScrollPos();
    const el=scrollRef.current; if(!el)return;
    if(posts.length > 0 && el.scrollHeight-el.scrollTop-el.clientHeight<300&&hasMore&&!loadMoreLoading) fetchPosts();
  };

  const postsWithLike = posts.map(p => ({...p, is_liked: likedPosts.has(p.id), like_count: (p.like_count||0) + (likedPosts.has(p.id)?1:0), user: {...p.user, followed: followedUsers.has(p.user_id||p.user?.id)}, breedDisplay: p.breed ? (t('pet.breeds.' + p.breed, p.breed)) : '', is_faved: favedPosts.has(p.id) })).filter((p: any) => !p.images?.some((img: any) => typeof img === 'object' && img.type === 'video'));

  const pullLabels: Record<string, string> = {
    pulling: t('common.pullRefresh'),
    ready: t('common.releaseRefresh'),
    loading: t('common.refreshing'),
  };

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      {showNotifications && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={() => setShowNotifications(false)}>
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-[20px] px-5 pt-4 pb-8 max-h-[60vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-[#333] dark:text-gray-100">{t('home.notifications')}</h2>
              <button onClick={() => setShowNotifications(false)}><X className="w-5 h-5 text-[#999] dark:text-gray-400"/></button>
            </div>
            <div className="space-y-2">
              {notifications.length === 0 ? (
                <p className="text-center text-[13px] text-[#999] dark:text-gray-400 py-6">{t('messages.noMessagesTitle')}</p>
              ) : (
                notifications.map(n => (
                  <div key={n.id} onClick={() => {
                    if (!n.is_read) {
                      notificationsApi.markRead(n.id).then(() => fetchUnreadCount()).catch(() => {});
                      setNotifications(prev => prev.map(i => i.id === n.id ? { ...i, is_read: 1 } : i));
                    }
                    if (n.post_id) navigate(`/post/${n.post_id}`);
                    else if (n.from_user_id) navigate(`/user/${n.from_user_id}`);
                    setShowNotifications(false);
                  }} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer active:opacity-80 ${n.is_read ? 'bg-[#F8F8F8] dark:bg-gray-800' : 'bg-[#FFF8F0] dark:bg-orange-900/10'}`}>
                    <ImageWithFallback src={n.from_user_avatar || ''} className="w-10 h-10 rounded-full object-cover shrink-0 bg-gray-100 dark:bg-gray-700" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] text-[#333] dark:text-gray-100 flex items-center gap-1.5">
                        {n.content || n.from_user_name}
                        {!n.is_read && <span className="w-2 h-2 rounded-full bg-[#FF8C42] shrink-0"/>}
                      </div>
                      <div className="text-[11px] text-[#999] dark:text-gray-400 mt-0.5">
                        {(() => {
                          if (!n.created_at) return '';
                          const diff = Date.now() - new Date(n.created_at + 'Z').getTime();
                          const mins = Math.floor(diff / 60000);
                          if (mins < 1) return t('time.justNow');
                          if (mins < 60) return t('time.minAgo', { n: mins });
                          const hours = Math.floor(diff / 3600000);
                          if (hours < 24) return t('time.hoursAgo', { n: hours });
                          return t('time.daysAgo', { n: Math.floor(hours / 24) });
                        })()}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setShowNotifications(false)} className="w-full h-10 mt-4 text-[#999] dark:text-gray-400 text-[13px]">{t('common.close')}</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" ref={scrollRef}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onScroll={handleScroll}>

        {pullState!=='idle'&&(<div className="flex items-center justify-center gap-2 text-[12px] text-[#999] dark:text-gray-400" style={{height:pullDist}}>
          {pullState==='loading'&&<span className="w-3.5 h-3.5 border-2 border-[#FF8C42] border-t-transparent rounded-full animate-spin"/>}
          {pullLabels[pullState]}
        </div>)}

        <div className="sticky top-0 bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md z-40 px-4 pt-[var(--app-safe-top)] pb-2">
          <div className="flex items-center justify-between h-[var(--app-nav-height)]">
            <h1 className="text-[17px] font-bold text-[#333] dark:text-gray-100">{t('home.brandName')}</h1>
            <div className="flex items-center gap-4">
              <Link to="/search" className="active:scale-95"><Search className="w-5 h-5 text-[#333] dark:text-gray-100" /></Link>
              <button onClick={handleOpenNotifications} className="active:scale-95 relative">
                <Bell className="w-5 h-5 text-[#333] dark:text-gray-100" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 rounded-full flex items-center justify-center px-1 border border-white dark:border-gray-900">
                    <span className="text-[9px] text-white font-bold leading-none">{unreadCount > 99 ? '99+' : unreadCount}</span>
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-1">
            <button onClick={()=>setActiveTab('hot')} className={`text-[17px] font-bold relative pb-2 cursor-pointer active:opacity-70 ${activeTab==='hot'?'text-[#333] dark:text-gray-100':'text-[#999] dark:text-gray-400'}`}>
              {t('home.hot')}{activeTab==='hot'&&<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF8C42] rounded-full"/>}
            </button>
            <button onClick={()=>setActiveTab('following')} className={`text-[17px] font-bold relative pb-2 cursor-pointer active:opacity-70 ${activeTab==='following'?'text-[#333] dark:text-gray-100':'text-[#999] dark:text-gray-400'}`}>
              {t('home.following')}{activeTab==='following'&&<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF8C42] rounded-full"/>}
            </button>
          </div>
        </div>

        <div className="px-4 mt-1">
          {(() => {
            if (activeTab === 'following') {
              const followedPosts = postsWithLike.filter(p => followedUsers.has(p.user_id || p.user?.id));
              if (followedPosts.length > 0) return followedPosts.map(post => (
                <PostCard key={post.id} post={post}
                  onLike={(e: any) => { e?.stopPropagation(); toggleLike(post.id, post.user?.name); }}
                  onFollow={(e: any) => { e?.stopPropagation(); toggleFollow(post.user_id||post.user?.id, post.user?.name); }}
                  onBookmark={(e: any) => { e?.stopPropagation(); toggleBookmark(post.id); }}
                />
              ));
              return (
                <div className="mt-4">
                  <h2 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('home.recommendedForYou')}</h2>
                  <div className="space-y-3">
                    {recommendUsers.map(u => (
                      <div key={u.id} className="bg-white dark:bg-gray-900 rounded-2xl p-3 flex items-center gap-3 border border-[#EEE] dark:border-gray-700">
                        <ImageWithFallback src={u.avatar} onClick={() => navigate(`/user/${u.id}`)} className="w-12 h-12 rounded-full object-cover shrink-0 cursor-pointer active:opacity-70" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-bold text-[#333] dark:text-gray-100">{u.name}</div>
                          <div className="text-[11px] text-[#999] dark:text-gray-400">{u.bio} · {t('home.followers')} {u.followers}</div>
                        </div>
                        <button onClick={() => toggleFollow(u.id, u.name)} className={`shrink-0 px-4 py-1.5 rounded-full text-[12px] font-bold ${followedUsers.has(u.id) ? 'bg-gray-100 dark:bg-gray-800 text-[#999] dark:text-gray-400' : 'bg-[#FF8C42] text-white active:bg-[#E67A35]'}`}>
                          {followedUsers.has(u.id) ? t('common.followed') : t('common.follow')}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            if (posts.length === 0 && loading) return <>{[1,2,3].map(i => <PostCardSkeleton key={i} />)}</>;
            if (posts.length === 0 && !loading) return (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-[14px] text-[#999] dark:text-gray-400">还没有帖子，去发现有趣的毛孩子吧</p>
              </div>
            );
            return postsWithLike.map(post => (
              <PostCard key={post.id} post={post}
                onLike={(e: any) => { e?.stopPropagation(); toggleLike(post.id, post.user?.name); }}
                onFollow={(e: any) => { e?.stopPropagation(); toggleFollow(post.user_id||post.user?.id, post.user?.name); }}
              />
            ));
          })()}
        </div>

        {loadMoreLoading && <div className="text-center py-4 text-[12px] text-[#999] dark:text-gray-400">{t('common.loading')}</div>}
        {!loadMoreLoading && hasMore && activeTab !== 'following' && <div className="text-center py-3 text-[12px] text-[#BBB] dark:text-gray-400">{t('common.loadMore')}</div>}
      </div>

      <BottomNav />
      <Toast />
      {showPetOnboarding && <PetOnboarding onClose={() => setShowPetOnboarding(false)} />}
    </div>
  );
}
