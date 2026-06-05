import { ChevronLeft, Heart, Share2, Send, MoreHorizontal, Trash2, Lock, Eye, Edit3, Star, Footprints, Flag } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ShareCard } from "../components/ShareCard";
import { postsApi, usersApi } from "../api/client";
import { sendLikeNotification, sendCommentNotification, sendFollowNotification } from "../utils/notifications";
import { usePageTransition } from "../hooks/usePageTransition";

const getMediaUrl = (item: any) => typeof item === 'string' ? item : item?.url || item?.poster || '';

function formatTime(iso: string, t: any, lang: string): string {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return t('time.justNow');
  if (diff < 3600) return t('time.minAgo', { n: Math.floor(diff / 60) });
  if (diff < 86400) return t('time.hoursAgo', { n: Math.floor(diff / 3600) });
  if (diff < 604800) return t('time.daysAgo', { n: Math.floor(diff / 86400) });
  return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-US' : 'zh-CN');
}

interface Comment {
  id: number;
  user: { id?: number; name: string; avatar?: string };
  content: string;
  created_at: string;
  parent_id?: number | null;
  likes_count?: number;
  replies: Comment[];
}

interface FlatComment {
  id: number;
  user: { id?: number; name: string; avatar?: string };
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
  parentId: number | null;
  depth: number;
  replies: FlatComment[];
}

function flattenComments(comments: Comment[], t: any, lang: string, depth: number = 0): FlatComment[] {
  const result: FlatComment[] = [];
  for (const c of comments) {
    result.push({
      id: c.id,
      user: c.user,
      text: c.content,
      time: formatTime(c.created_at, t, lang),
      likes: c.likes_count || 0,
      isLiked: false,
      parentId: c.parent_id || null,
      depth,
      replies: c.replies ? flattenComments(c.replies, t, lang, depth + 1) : [],
    });
  }
  return result;
}

export function PostDetail() {
  const navigate = useNavigate();
  const { className, handleBack } = usePageTransition();
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFaved, setIsFaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [comments, setComments] = useState<FlatComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [totalComments, setTotalComments] = useState(0);
  const [hearts, setHearts] = useState<{id: number; x: number; y: number}[]>([]);
  const [showMeetup, setShowMeetup] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [pawShakeCount, setPawShakeCount] = useState(0);
  const [pawShakeBounce, setPawShakeBounce] = useState(false);
  const [showShareCard, setShowShareCard] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const lastTap = useRef(0);
  const heartIdRef = useRef(0);

  const fetchComments = useCallback(async (page: number = 1, append: boolean = false) => {
    if (!id) return;
    setLoadingComments(true);
    try {
      const data = await postsApi.comments(Number(id), page);
      const list = data?.list || [];
      const pagination = data?.pagination;
      const flat = flattenComments(list || [], t, i18n.language);
      if (append) {
        setComments(prev => [...prev, ...flat]);
      } else {
        setComments(flat);
      }
      setCommentPage(page);
      setHasMoreComments(pagination?.hasMore ?? false);
      setTotalComments(pagination?.total ?? 0);
    } catch {
      // fallback to empty
    } finally {
      setLoadingComments(false);
    }
  }, [id, t]);

  useEffect(() => {
    if (!id) return;
    postsApi.detail(Number(id)).then(p => { setPost(p); setIsLiked(p.is_liked||false); setLikeCount(p.like_count||0); setIsFollowing(p.user?.followed||false); setIsPrivate(p.is_private||false); setPawShakeCount(p.paw_shake_count||0); setLoading(false); }).catch(() => setLoading(false));
    fetchComments(1, false);
  }, [id, fetchComments]);

  const handleLike = async () => {
    const wasLiked = isLiked;
    const prevCount = likeCount;
    setIsLiked(!wasLiked);
    setLikeCount(wasLiked ? prevCount - 1 : prevCount + 1);
    if (!wasLiked && post?.user?.name) sendLikeNotification(post.user.name);
    try {
      if (wasLiked) await postsApi.unlike(post.id);
      else await postsApi.like(post.id);
    } catch {
      setIsLiked(wasLiked);
      setLikeCount(prevCount);
    }
  };
  const handleFavorite = async () => {
    const wasFaved = isFaved;
    setIsFaved(!wasFaved);
    try {
      await postsApi.favorite(post.id);
    } catch {
      setIsFaved(wasFaved);
    }
  };
  const handleShare = () => {
    if (!post) return;
    setShowShareCard(true);
  };
  const handleDoubleTap = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      lastTap.current = 0;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++heartIdRef.current;
      setHearts(prev => [...prev, { id, x, y }]);
      setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 1000);
      handleLike();
    }
    lastTap.current = now;
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !id) return;
    try {
      await postsApi.addComment(Number(id), commentText.trim());
      if (post?.user?.name) sendCommentNotification(post.user.name, commentText.trim());
      setCommentText("");
      fetchComments(1, false);
    } catch {
      // ignore
    }
  };

  const handleSendReply = async (parentId: number) => {
    if (!replyText.trim() || !id) return;
    try {
      await postsApi.addComment(Number(id), replyText.trim(), parentId);
      if (post?.user?.name) sendCommentNotification(post.user.name, replyText.trim());
      setReplyText("");
      setReplyTarget(null);
      fetchComments(1, false);
    } catch {
      // ignore
    }
  };

  const toggleCommentLike = async (cid: number) => {
    // Find current state
    let wasLiked = false;
    for (const c of comments) {
      if (c.id === cid) { wasLiked = c.isLiked; break; }
      for (const r of c.replies) {
        if (r.id === cid) { wasLiked = r.isLiked; break; }
      }
    }

    // Optimistic update
    setComments(prev => {
      if (prev.some(c => c.id === cid)) {
        return prev.map(c => c.id === cid ? {...c, isLiked:!c.isLiked, likes: c.likes + (c.isLiked ? -1 : 1)} : c);
      }
      return prev.map(c => ({
        ...c,
        replies: c.replies.map(r => r.id === cid ? {...r, isLiked:!r.isLiked, likes: r.likes + (r.isLiked ? -1 : 1)} : r),
      }));
    });

    // API call
    try {
      await postsApi.likeComment(Number(id!), cid);
    } catch {
      // Rollback
      setComments(prev => {
        if (prev.some(c => c.id === cid)) {
          return prev.map(c => c.id === cid ? {...c, isLiked:wasLiked, likes: c.likes + (wasLiked ? 1 : -1)} : c);
        }
        return prev.map(c => ({
          ...c,
          replies: c.replies.map(r => r.id === cid ? {...r, isLiked:wasLiked, likes: r.likes + (wasLiked ? 1 : -1)} : r),
        }));
      });
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    await postsApi.delete(post.id);
    setShowMenu(false);
    handleBack();
  };
  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
    setShowMenu(false);
  };

  const handlePawShake = async () => {
    if (!post) return;
    const prev = pawShakeCount;
    setPawShakeCount(prev + 1);
    setPawShakeBounce(true);
    setTimeout(() => setPawShakeBounce(false), 600);
    try {
      await postsApi.pawShake(post.id);
    } catch {
      setPawShakeCount(prev);
    }
  };

  const isOwner = post?.user?.id === 1;

  const renderCommentItem = (c: FlatComment) => {
    const isReply = c.depth > 0;
    const indentClass = isReply ? 'ml-4 pl-3 border-l-2 border-[#E8E8E8] dark:border-gray-700' : '';

    return (
      <div key={c.id}>
        <div className={`flex gap-2.5 ${indentClass}`}>
          <ImageWithFallback src={c.user.avatar} onClick={() => c.user.id && navigate(`/user/${c.user.id}`)} className="w-7 h-7 rounded-full object-cover shrink-0 bg-gray-200 dark:bg-gray-700 mt-0.5 cursor-pointer active:opacity-70"/>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="text-[12px] font-bold text-[#666] dark:text-gray-400">{c.user.name}</span>
                <p className="text-[14px] text-[#333] dark:text-gray-100 mt-0.5 leading-snug">{c.text}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-[#999] dark:text-gray-400">{c.time}</span>
                  <button
                    onClick={() => { setReplyTarget(c.id); setReplyText(""); }}
                    className="text-[10px] font-medium text-[#FF8C42]"
                  >
                    {t('postDetail.reply')}
                  </button>
                </div>
              </div>
              <button onClick={() => toggleCommentLike(c.id)}
                className={`flex flex-col items-center gap-0.5 shrink-0 ${c.isLiked ? 'text-[#FF4D4F]' : 'text-[#CCC] dark:text-gray-600'}`}>
                <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-current' : ''}`}/>
                <span className="text-[10px]">{c.likes||''}</span>
              </button>
            </div>
          </div>
        </div>
        {replyTarget === c.id && (
          <div className={`flex items-center gap-2 mt-2 ${indentClass}`}>
            <input
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendReply(c.id)}
              placeholder={`${t('postDetail.reply')} ${c.user.name}...`}
              autoFocus
              className="flex-1 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 h-8 outline-none text-[13px] placeholder:text-[#999] dark:placeholder:text-gray-400"
            />
            <button onClick={() => handleSendReply(c.id)}
              className="w-8 h-8 bg-[#FF8C42] text-white rounded-lg flex items-center justify-center active:bg-[#E67A35] shrink-0">
              <Send className="w-3.5 h-3.5"/>
            </button>
          </div>
        )}
        {c.replies.map(r => renderCommentItem(r))}
      </div>
    );
  };

  if (loading) return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 flex items-center justify-center">
      <div className="text-[14px] text-[#999] dark:text-gray-400">{t('common.loading')}</div>
    </div>
  );
  if (!post) return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 flex flex-col items-center justify-center gap-3">
      <p className="text-[14px] text-[#999] dark:text-gray-400">{t('common.postNotFound')}</p>
      <button onClick={() => handleBack(() => navigate(-1))} className="text-[#FF8C42] text-[14px]">{t('common.back')}</button>
    </div>
  );

  return (
    <div className={`h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col ${className}`}>
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 z-10">
        <button onClick={() => handleBack(() => navigate(-1))} className="text-[#333] dark:text-gray-100 p-1 -ml-1"><ChevronLeft className="w-6 h-6"/></button>
        <div className="w-6" />
        <div className="flex items-center gap-1">
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 text-[#666] dark:text-gray-400 cursor-pointer active:opacity-70"><MoreHorizontal className="w-5 h-5" /></button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-8 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-[#F0F0F0] dark:border-gray-700 py-1 min-w-[140px]">
                  <button onClick={() => { setShowMenu(false); handleShare(); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800"><Share2 className="w-4 h-4" />{t('postDetail.share')}</button>
                  {!isOwner && <button onClick={() => { setShowMenu(false); setShowReport(true); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800"><Flag className="w-4 h-4" />{t('postDetail.report')}</button>}
                  {isOwner && <button onClick={togglePrivacy} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] dark:text-gray-100 active:bg-[#F9F9F9] dark:active:bg-gray-800">{isPrivate ? <><Eye className="w-4 h-4" />{t('postDetail.setPublic')}</> : <><Lock className="w-4 h-4" />{t('postDetail.setPrivate')}</>}</button>}
                  {isOwner && <button onClick={handleDelete} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#FF4D4F] active:bg-[#F9F9F9] dark:active:bg-gray-800"><Trash2 className="w-4 h-4" />{t('common.delete')}</button>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[100px] [&::-webkit-scrollbar]:hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900">
          <div className="flex items-center gap-3">
            <ImageWithFallback src={post.user?.avatar} onClick={() => navigate(`/user/${post.user?.id}`)} className="w-9 h-9 rounded-full object-cover cursor-pointer active:opacity-70"/>
            <span className="text-[14px] font-bold text-[#333] dark:text-gray-100">{post.user?.name || t('common.user')}</span>
          </div>
          <button onClick={async () => {
            const wasFollowing = isFollowing;
            setIsFollowing(!wasFollowing);
            if (!wasFollowing && post?.user?.name) sendFollowNotification(post.user.name);
            try {
              if (wasFollowing) await usersApi.unfollow(post.user?.id);
              else await usersApi.follow(post.user?.id);
            } catch {
              setIsFollowing(wasFollowing);
            }
          }}
            className={`text-[13px] font-bold px-3 py-1.5 rounded-full cursor-pointer active:opacity-80 ${isFollowing ? 'text-[#999] dark:text-gray-400 bg-[#F5F5F5] dark:bg-gray-800' : 'text-[#FF8C42] bg-[#FFF3E6] dark:bg-orange-900/30'}`}>
            {isFollowing ? t('common.followed') : t('common.follow')}
          </button>
        </div>

        <div className="w-full aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden relative" onClick={handleDoubleTap}>
          <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
            {(post.images||[]).map((img: string, idx: number) => (
              <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                <ImageWithFallback src={getMediaUrl(img)} className="w-full h-full object-cover"/>
                {(post.images||[]).length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {(post.images||[]).map((_:string, di:number) => (
                      <div key={di} className={`w-1.5 h-1.5 rounded-full ${di===idx?'bg-white':'bg-white/40'}`}/>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {hearts.map(h => (
            <div
              key={h.id}
              className="absolute pointer-events-none z-50"
              style={{ left: h.x, top: h.y }}
            >
              <Heart
                className="w-24 h-24 text-[#FF4D4F] fill-current drop-shadow-lg"
                style={{ animation: 'float-heart 1s ease-out forwards' }}
              />
            </div>
          ))}
          {isPrivate && (
            <div className="absolute top-4 left-4 bg-black/50 text-white text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3"/>{t('postDetail.private')}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 px-4 pt-4 pb-2">
          <p className="text-[14px] text-[#333] dark:text-gray-100 leading-relaxed mb-3">{post.content}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.breed && <span className="bg-[#FFF3E6] dark:bg-orange-900/30 text-[#FF8C42] px-2.5 py-1 rounded-md text-[12px] font-medium">#{(t as any)('pet.breeds.' + post.breed, post.breed)}</span>}
            {post.location && <span className="bg-[#F5F5F5] dark:bg-gray-800 text-[#666] dark:text-gray-400 px-2.5 py-1 rounded-md text-[12px]">📍{post.location}</span>}
          </div>
          <div className="text-[11px] text-[#BBB] dark:text-gray-400 mb-3">
            {post.created_at ? new Date(post.created_at).toLocaleString(i18n.language === 'en' ? 'en-US' : 'zh-CN', {month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}) : ''}
            {isOwner && <span className="ml-1">· {(post.view_count||0)+(post.id*7+3)%1000} {t('postDetail.views')}</span>}
          </div>
          <div className="flex items-center justify-between py-2 mb-2">
            <div className="flex items-center gap-6">
              <button onClick={handleLike} className={`flex items-center gap-1.5 ${isLiked ? 'text-[#FF4D4F]' : 'text-[#666] dark:text-gray-400'}`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}/>
                <span className="text-[14px] font-medium">{likeCount}</span>
              </button>
              <button onClick={handleFavorite} className={`flex items-center gap-1.5 ${isFaved ? 'text-[#FF8C42]' : 'text-[#666] dark:text-gray-400'}`}>
                <Star className={`w-5 h-5 ${isFaved ? 'fill-current' : ''}`}/>
                <span className="text-[14px] font-medium">{isFaved ? 1 : 0}</span>
              </button>
              <button onClick={(e) => { e.stopPropagation(); setShowMeetup(true); setTimeout(()=>setShowMeetup(false),2000); }} className={`flex items-center gap-1.5 ${showMeetup?'text-[#FF8C42]':'text-[#666] dark:text-gray-400'}`}>
                <Footprints className="w-5 h-5"/><span className="text-[14px] font-medium">{showMeetup?'已发送':'约遛'}</span>
              </button>
              <button onClick={handlePawShake} className={`flex items-center gap-1.5 text-[#666] dark:text-gray-400 ${pawShakeBounce ? 'animate-bounce' : ''}`}>
                <span className="text-[16px]">🐾</span><span className="text-[14px] font-medium">{pawShakeCount > 0 ? pawShakeCount : '握爪'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 mt-2 px-4 py-4 min-h-[200px]">
          <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-4">{t('postDetail.commentsCount', { count: totalComments })}</h3>
          <div className="space-y-4">
            {comments.map(c => renderCommentItem(c))}
          </div>
          {hasMoreComments && (
            <div className="flex justify-center mt-4 pb-2">
              <button
                onClick={() => fetchComments(commentPage + 1, true)}
                disabled={loadingComments}
                className="text-[13px] font-medium text-[#FF8C42] bg-[#FFF3E6] dark:bg-orange-900/30 px-5 py-2 rounded-full active:bg-[#FFE4CC] disabled:opacity-50"
              >
                {loadingComments ? t('common.loading') : t('postDetail.loadMoreComments')}
              </button>
            </div>
          )}
        </div>
      </div>

      {!replyTarget && (
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-[#EEE] dark:border-gray-700 p-3 z-40 flex items-center gap-3" style={{paddingBottom: 'calc(12px + env(safe-area-inset-bottom))'}}>
        <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key==='Enter'&&handleSendComment()}
          placeholder={t('common.saySomething')} className="flex-1 bg-[#F5F5F5] dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 h-9 outline-none text-[14px] placeholder:text-[#999] dark:placeholder:text-gray-400"/>
        <button onClick={handleSendComment} className="w-9 h-9 bg-[#FF8C42] text-white rounded-lg flex items-center justify-center active:bg-[#E67A35]">
          <Send className="w-4 h-4"/>
        </button>
      </div>
      )}

      <ShareCard
        open={showShareCard}
        onClose={() => setShowShareCard(false)}
        post={post}
      />

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-[300px]">
            {reportSent ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-[#FFF3E6] dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Flag className="w-6 h-6 text-[#FF8C42]" />
                </div>
                <p className="text-[15px] font-bold text-[#333] dark:text-gray-100 mb-1">{t('postDetail.reportSent')}</p>
                <p className="text-[12px] text-[#999] dark:text-gray-400 mb-4">{t('postDetail.reportThanks')}</p>
                <button onClick={() => { setShowReport(false); setReportSent(false); }} className="w-full h-10 bg-[#FF8C42] text-white rounded-lg text-[14px] font-bold">{t('common.confirm')}</button>
              </div>
            ) : (
              <>
                <p className="text-[15px] font-bold text-[#333] dark:text-gray-100 mb-1">{t('postDetail.report')}</p>
                <p className="text-[12px] text-[#999] dark:text-gray-400 mb-4">{t('postDetail.reportReason')}</p>
                <div className="space-y-2 mb-4">
                  {[
                    { key: 'porn', label: t('postDetail.reportPorn') },
                    { key: 'harass', label: t('postDetail.reportHarass') },
                    { key: 'fake', label: t('postDetail.reportFake') },
                    { key: 'other', label: t('postDetail.reportOther') },
                  ].map(r => (
                    <button
                      key={r.key}
                      onClick={() => setReportReason(r.key)}
                      className={`w-full h-10 rounded-lg text-[14px] font-medium border ${reportReason === r.key ? 'bg-[#FFF3E6] dark:bg-orange-900/30 border-[#FF8C42] text-[#FF8C42]' : 'bg-[#F5F5F5] dark:bg-gray-800 border-[#EEE] dark:border-gray-700 text-[#333] dark:text-gray-100'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowReport(false)} className="flex-1 h-10 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg text-[14px] text-[#666] dark:text-gray-400">{t('common.cancel')}</button>
                  <button
                    onClick={async () => {
                      if (!reportReason || !id) return;
                      try {
                        await postsApi.report(Number(id), reportReason);
                        setReportSent(true);
                      } catch { setShowReport(false); }
                    }}
                    disabled={!reportReason}
                    className={`flex-1 h-10 rounded-lg text-[14px] font-bold ${reportReason ? 'bg-[#FF8C42] text-white' : 'bg-[#E5E5E5] dark:bg-gray-700 text-[#BBB] dark:text-gray-400'}`}
                  >
                    {t('common.submit')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
