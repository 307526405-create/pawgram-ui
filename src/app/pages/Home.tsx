import { Search, Bell, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { PostCard, PostCardSkeleton } from "../components/PostCard";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { postsApi } from "../api/client";
import { sendLikeNotification, sendFollowNotification, sendNewNotification } from "../utils/notifications";

const stories = [
  { id:1, name:"金毛阿福", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228fd2?w=120", pet:"金毛", images:["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600"] },
  { id:2, name:"柯基小短腿", avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120", pet:"柯基", images:["https://images.unsplash.com/photo-1615464670798-6e92fafa2a89?w=600"] },
  { id:3, name:"布偶汤圆", avatar:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120", pet:"布偶猫", images:["https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=600"] },
  { id:4, name:"萨摩耶球球", avatar:"https://images.unsplash.com/photo-1559190394-df5a28aab5c7?w=120", pet:"萨摩耶", images:["https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600"] },
  { id:5, name:"泰迪豆豆", avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120", pet:"泰迪", images:["https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600"] },
  { id:6, name:"橘猫滚滚", avatar:"https://images.unsplash.com/photo-1536548665027-b96d34a005ae?w=120", pet:"橘猫", images:["https://images.unsplash.com/photo-1536548665027-b96d34a005ae?w=600"] },
];

const recommendUsers = [
  { id:1, name:"大黄铲屎官", avatar:"https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=150", bio:"金毛&柯基的快乐生活", followers:"2.3k" },
  { id:2, name:"橘猫日记", avatar:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", bio:"三只猫的日常", followers:"5.1k" },
  { id:3, name:"汪星人阿呆", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228fd2?w=150", bio:"萨摩耶的快乐", followers:"8.7k" },
];

const notifications = [
  { id:1, text:"大黄铲屎官 赞了你的帖子", time:"3分钟前", avatar:"https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=80", unread:true },
  { id:2, text:"橘猫日记 关注了你", time:"15分钟前", avatar:"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80", unread:true },
  { id:3, text:"官方小助手 发布了新活动", time:"1小时前", avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80", unread:false },
];

export function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'hot' | 'following'>('hot');
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());
  const [viewedStories, setViewedStories] = useState<Set<number>>(new Set());
  const [notifViewed, setNotifViewed] = useState(false);
  const [activeStory, setActiveStory] = useState<any>(null);
  const [storyProgress, setStoryProgress] = useState(0);
  const storyTimer = useRef<any>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pullState, setPullState] = useState<'idle'|'pulling'|'ready'|'loading'>('idle');
  const [pullDist, setPullDist] = useState(0);
  const touchStartY = useRef(0);

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

  useEffect(() => {
    if (!activeStory) { setStoryProgress(0); return; }
    setStoryProgress(0);
    const duration = 3000;
    const interval = 30;
    storyTimer.current = setInterval(() => {
      setStoryProgress(prev => {
        if (prev >= 100) { clearInterval(storyTimer.current); setActiveStory(null); return 0; }
        return prev + (interval / duration) * 100;
      });
    }, interval);
    return () => clearInterval(storyTimer.current);
  }, [activeStory]);

  const handleOpenStory = (s: any) => {
    setActiveStory(s);
    setViewedStories(prev => new Set([...prev, s.id]));
  };
  const handleOpenNotifications = () => {
    setShowNotifications(true);
    setNotifViewed(true);
    const unread = notifications.filter(n => n.unread);
    if (unread.length > 0) sendNewNotification(unread[0].text);
  };
  const toggleLike = (postId: number, userName?: string) => {
    setLikedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) { next.delete(postId); }
      else { next.add(postId); if (userName) sendLikeNotification(userName); }
      return next;
    });
  };
  const toggleFollow = (userId: number, userName?: string) => {
    setFollowedUsers(prev => {
      const next = new Set(prev);
      if (next.has(userId)) { next.delete(userId); }
      else { next.add(userId); if (userName) sendFollowNotification(userName); }
      return next;
    });
  };
  const handleShare = (post: any) => {
    const text = `爪印 PawGram\n${post.user?.name ? post.user.name + ': ' : ''}${post.content}`;
    if (navigator.share) navigator.share({ title: '爪印', text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  const handleTouchStart = (e: React.TouchEvent) => { if (scrollRef.current?.scrollTop===0) touchStartY.current=e.touches[0].clientY; };
  const handleTouchMove = (e: React.TouchEvent) => { if (scrollRef.current?.scrollTop!==0||touchStartY.current===0) return; const d=e.touches[0].clientY-touchStartY.current; if(d>0){setPullDist(Math.min(d*.5,80));setPullState(d>60?'ready':'pulling');} };
  const handleTouchEnd = async () => {
    if(pullState==='ready'){setPullState('loading');setPullDist(40);await fetchPosts(1);setPullState('idle');setPullDist(0);}
    else{setPullState('idle');setPullDist(0);} touchStartY.current=0;
  };
  const handleScroll = () => {
    const el=scrollRef.current; if(!el)return;
    if(posts.length > 0 && el.scrollHeight-el.scrollTop-el.clientHeight<300&&hasMore&&!loadMoreLoading) fetchPosts();
  };

  const postsWithLike = posts.map(p => ({...p, is_liked: likedPosts.has(p.id), like_count: (p.like_count||0) + (likedPosts.has(p.id)?1:0), user: {...p.user, followed: followedUsers.has(p.user_id||p.user?.id)} }));

  const pullLabels: Record<string, string> = {
    pulling: t('common.pullRefresh'),
    ready: t('common.releaseRefresh'),
    loading: t('common.refreshing'),
  };

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      {activeStory && (
        <div className="fixed inset-0 z-[90] bg-black flex flex-col" onClick={() => setActiveStory(null)}>
          <div className="absolute top-2 left-4 right-4 z-10 h-0.5 bg-white/30 rounded-full" style={{top: 'calc(env(safe-area-inset-top) + 60px)'}}>
            <div className="h-full bg-white rounded-full transition-all duration-30 ease-linear" style={{width: `${storyProgress}%`}}/>
          </div>
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-3 px-4 pb-2" style={{paddingTop:'calc(env(safe-area-inset-top) + 8px)'}}>
            <ImageWithFallback src={activeStory.avatar} className="w-8 h-8 rounded-full object-cover border border-white/30" />
            <span className="text-white text-[14px] font-semibold flex-1">{activeStory.name}</span>
            <span className="text-white/60 text-[12px]">{activeStory.pet}</span>
            <button onClick={() => setActiveStory(null)} className="p-1"><X className="w-5 h-5 text-white" /></button>
          </div>
          <div className="flex-1 flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <ImageWithFallback src={activeStory.images[0]} className="w-full h-full object-contain max-h-[80vh]" />
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-end" onClick={() => setShowNotifications(false)}>
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-[20px] px-5 pt-4 pb-8 max-h-[60vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[17px] font-bold text-[#333] dark:text-gray-100">{t('home.notifications')}</h2>
              <button onClick={() => setShowNotifications(false)}><X className="w-5 h-5 text-[#999] dark:text-gray-400"/></button>
            </div>
            <div className="space-y-2">
              {notifications.map(n => (
                <div key={n.id} className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F8F8] dark:bg-gray-800">
                  <ImageWithFallback src={n.avatar} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-[#333] dark:text-gray-100 flex items-center gap-1.5">
                      {n.text}
                      {n.unread && <span className="w-2 h-2 rounded-full bg-[#FF8C42] shrink-0"/>}
                    </div>
                    <div className="text-[11px] text-[#999] dark:text-gray-400 mt-0.5">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowNotifications(false)} className="w-full h-10 mt-4 text-[#999] dark:text-gray-400 text-[13px]">{t('common.close')}</button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" ref={scrollRef}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onScroll={handleScroll}>

        {pullState!=='idle'&&(<div className="flex items-center justify-center text-[12px] text-[#999] dark:text-gray-400" style={{height:pullDist}}>
          {pullLabels[pullState]}
        </div>)}

        <div className="sticky top-0 bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md z-40 px-4 pt-[var(--app-safe-top)] pb-2">
          <div className="flex items-center justify-between h-[var(--app-nav-height)]">
            <h1 className="text-[17px] font-bold text-[#333] dark:text-gray-100">{t('home.brandName')}</h1>
            <div className="flex items-center gap-4">
              <Link to="/search" className="active:scale-95"><Search className="w-5 h-5 text-[#333] dark:text-gray-100" /></Link>
              <button onClick={handleOpenNotifications} className="active:scale-95 relative">
                <Bell className="w-5 h-5 text-[#333] dark:text-gray-100" />
                {!notifViewed && notifications.some(n => n.unread) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-1">
            <button onClick={()=>setActiveTab('hot')} className={`text-[17px] font-bold relative pb-2 ${activeTab==='hot'?'text-[#333] dark:text-gray-100':'text-[#999] dark:text-gray-400'}`}>
              {t('home.hot')}{activeTab==='hot'&&<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF8C42] rounded-full"/>}
            </button>
            <button onClick={()=>setActiveTab('following')} className={`text-[17px] font-bold relative pb-2 ${activeTab==='following'?'text-[#333] dark:text-gray-100':'text-[#999] dark:text-gray-400'}`}>
              {t('home.following')}{activeTab==='following'&&<span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF8C42] rounded-full"/>}
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-1 [&::-webkit-scrollbar]:hidden">
            <div onClick={() => navigate('/post')} className="shrink-0 flex flex-col items-center gap-1 cursor-pointer active:opacity-70">
              <div className="w-[62px] h-[62px] rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB380] p-[2px]">
                <div className="w-full h-full rounded-full bg-[#FAFAFA] dark:bg-gray-950 flex items-center justify-center">
                  <span className="text-xl dark:text-gray-100">+</span>
                </div>
              </div>
              <span className="text-[10px] text-[#999] dark:text-gray-400">{t('home.yourStory')}</span>
            </div>
            {stories.map(s => {
              const viewed = viewedStories.has(s.id);
              return (
              <div key={s.id} onClick={() => handleOpenStory(s)} className="shrink-0 flex flex-col items-center gap-1 cursor-pointer active:opacity-70">
                <div className={`w-[62px] h-[62px] rounded-full p-[2px] ${viewed ? 'bg-gray-300 dark:bg-gray-600' : 'bg-gradient-to-br from-[#FF8C42] to-[#FFB380]'}`}>
                  <ImageWithFallback src={s.avatar} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900" />
                </div>
                <span className="text-[10px] text-[#666] dark:text-gray-400 w-[62px] text-center truncate">{s.name}</span>
              </div>
            )})}
          </div>
        </div>

        <div className="px-4 mt-1">
          {(() => {
            if (activeTab === 'following') {
              const followedPosts = postsWithLike.filter(p => followedUsers.has(p.user_id || p.user?.id));
              if (followedPosts.length > 0) return followedPosts.map(post => (
                <PostCard key={post.id} post={post}
                  onLike={(e: any) => { e?.stopPropagation(); toggleLike(post.id, post.user?.name); }}
                  onShare={(e: any) => { e?.stopPropagation(); handleShare(post); }}
                  onFollow={(e: any) => { e?.stopPropagation(); toggleFollow(post.user_id||post.user?.id, post.user?.name); }}
                />
              ));
              return (
                <div className="mt-4">
                  <h2 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('home.recommendedForYou')}</h2>
                  <div className="space-y-3">
                    {recommendUsers.map(u => (
                      <div key={u.id} className="bg-white dark:bg-gray-900 rounded-2xl p-3 flex items-center gap-3 border border-[#EEE] dark:border-gray-700">
                        <ImageWithFallback src={u.avatar} className="w-12 h-12 rounded-full object-cover shrink-0" />
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
                <div className="w-16 h-16 rounded-full bg-[#FFF3E6] dark:bg-orange-900/30 flex items-center justify-center mb-4"><span className="text-2xl">🐾</span></div>
                <p className="text-[14px] text-[#999] dark:text-gray-400 mb-1">{t('home.noPostsYet')}</p>
                <p className="text-[12px] text-[#BBB] dark:text-gray-500 mb-4">{t('home.goExplore')}</p>
                <Link to="/discover" className="bg-[#FF8C42] text-white px-6 py-2 rounded-full text-[13px] font-bold active:bg-[#E67A35]">{t('home.goDiscover')}</Link>
              </div>
            );
            return postsWithLike.map(post => (
              <PostCard key={post.id} post={post}
                onLike={(e: any) => { e?.stopPropagation(); toggleLike(post.id, post.user?.name); }}
                onShare={(e: any) => { e?.stopPropagation(); handleShare(post); }}
                onFollow={(e: any) => { e?.stopPropagation(); toggleFollow(post.user_id||post.user?.id, post.user?.name); }}
              />
            ));
          })()}
        </div>

        {loadMoreLoading && <div className="text-center py-4 text-[12px] text-[#999] dark:text-gray-400">{t('common.loading')}</div>}
        {!loadMoreLoading && hasMore && activeTab !== 'following' && <div className="text-center py-3 text-[12px] text-[#BBB] dark:text-gray-500">{t('common.loadMore')}</div>}
      </div>

      <BottomNav />
    </div>
  );
}
