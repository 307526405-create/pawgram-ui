import { ChevronLeft, Heart, Share2, Send, MoreHorizontal, Trash2, Lock, Eye, Edit3 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { BottomNav } from "../components/BottomNav";
import { postsApi } from "../api/client";

function formatTime(iso: string): string {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return '刚刚';
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}天前`;
  return new Date(iso).toLocaleDateString('zh-CN');
}

interface Comment {
  id: number;
  user: { id?: number; name: string; avatar?: string };
  content: string;
  created_at: string;
  parent_id?: number | null;
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

function flattenComments(comments: Comment[], depth: number = 0): FlatComment[] {
  const result: FlatComment[] = [];
  for (const c of comments) {
    result.push({
      id: c.id,
      user: c.user,
      text: c.content,
      time: formatTime(c.created_at),
      likes: 0,
      isLiked: false,
      parentId: c.parent_id || null,
      depth,
      replies: c.replies ? flattenComments(c.replies, depth + 1) : [],
    });
  }
  return result;
}

export function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [comments, setComments] = useState<FlatComment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyTarget, setReplyTarget] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [showHeart, setShowHeart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const lastTap = useRef(0);

  const fetchComments = useCallback(async () => {
    if (!id) return;
    try {
      const data = await postsApi.comments(Number(id));
      setComments(flattenComments(data || []));
    } catch {
      // fallback to empty
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    postsApi.detail(Number(id)).then(p => { setPost(p); setIsPrivate(p.is_private||false); setLoading(false); }).catch(() => setLoading(false));
    fetchComments();
  }, [id, fetchComments]);

  const handleLike = () => setIsLiked(!isLiked);
  const handleShare = () => {
    if (!post) return;
    const text = `爪印 PawGram\n${post.user?.name}: ${post.content}`;
    if (navigator.share) navigator.share({ title: '爪印', text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) { setShowHeart(true); setTimeout(() => setShowHeart(false), 800); handleLike(); }
    lastTap.current = now;
  };

  const handleSendComment = async () => {
    if (!commentText.trim() || !id) return;
    try {
      await postsApi.addComment(Number(id), commentText.trim());
      setCommentText("");
      fetchComments();
    } catch {
      // ignore
    }
  };

  const handleSendReply = async (parentId: number) => {
    if (!replyText.trim() || !id) return;
    try {
      await postsApi.addComment(Number(id), replyText.trim(), parentId);
      setReplyText("");
      setReplyTarget(null);
      fetchComments();
    } catch {
      // ignore
    }
  };

  const toggleCommentLike = (cid: number) => {
    setComments(prev => {
      if (prev.some(c => c.id === cid)) {
        return prev.map(c => c.id === cid ? {...c, isLiked:!c.isLiked, likes: c.isLiked ? c.likes-1 : c.likes+1} : c);
      }
      return prev.map(c => ({
        ...c,
        replies: c.replies.map(r => r.id === cid ? {...r, isLiked:!r.isLiked, likes: r.isLiked ? r.likes-1 : r.likes+1} : r),
      }));
    });
  };

  const handleDelete = async () => {
    if (!post) return;
    await fetch(`http://192.168.3.52:3000/api/posts/${post.id}`, { method: 'DELETE' });
    setShowMenu(false);
    navigate(-1);
  };
  const togglePrivacy = () => {
    setIsPrivate(!isPrivate);
    setShowMenu(false);
  };

  const isOwner = post?.user?.id === 1;

  const renderCommentItem = (c: FlatComment) => {
    const isReply = c.depth > 0;
    const indentClass = isReply ? 'ml-4 pl-3 border-l-2 border-[#E8E8E8]' : '';

    return (
      <div key={c.id}>
        <div className={`flex gap-2.5 ${indentClass}`}>
          <ImageWithFallback src={c.user.avatar} className="w-7 h-7 rounded-full object-cover shrink-0 bg-gray-200 mt-0.5"/>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="text-[12px] font-bold text-[#666]">{c.user.name}</span>
                <p className="text-[14px] text-[#333] mt-0.5 leading-snug">{c.text}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-[#999]">{c.time}</span>
                  <button
                    onClick={() => { setReplyTarget(c.id); setReplyText(""); }}
                    className="text-[10px] font-medium text-[#FF8C42]"
                  >
                    回复
                  </button>
                </div>
              </div>
              <button onClick={() => toggleCommentLike(c.id)}
                className={`flex flex-col items-center gap-0.5 shrink-0 ${c.isLiked ? 'text-[#FF4D4F]' : 'text-[#CCC]'}`}>
                <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-current' : ''}`}/>
                <span className="text-[10px]">{c.likes||''}</span>
              </button>
            </div>
          </div>
        </div>
        {/* Inline reply input */}
        {replyTarget === c.id && (
          <div className={`flex items-center gap-2 mt-2 ${indentClass}`}>
            <input
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendReply(c.id)}
              placeholder={`回复 ${c.user.name}...`}
              autoFocus
              className="flex-1 bg-[#F5F5F5] rounded-lg px-3 h-8 outline-none text-[13px] placeholder:text-[#999]"
            />
            <button onClick={() => handleSendReply(c.id)}
              className="w-8 h-8 bg-[#FF8C42] text-white rounded-lg flex items-center justify-center active:bg-[#E67A35] shrink-0">
              <Send className="w-3.5 h-3.5"/>
            </button>
          </div>
        )}
        {/* Render nested replies inline */}
        {c.replies.map(r => renderCommentItem(r))}
      </div>
    );
  };

  if (loading) return (
    <div className="h-full bg-[#FAFAFA] flex items-center justify-center">
      <div className="text-[14px] text-[#999]">加载中...</div>
    </div>
  );
  if (!post) return (
    <div className="h-full bg-[#FAFAFA] flex flex-col items-center justify-center gap-3">
      <p className="text-[14px] text-[#999]">帖子不存在</p>
      <button onClick={() => navigate(-1)} className="text-[#FF8C42] text-[14px]">返回</button>
    </div>
  );

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      {/* Top Nav */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#333] p-1 -ml-1"><ChevronLeft className="w-6 h-6"/></button>
        <h1 className="text-[17px] font-bold text-[#333]">帖子详情</h1>
        <div className="flex items-center gap-1">
          {isOwner && (
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-1"><MoreHorizontal className="w-5 h-5 text-[#333]"/></button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)}/>
                  <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-[#F0F0F0] py-1 z-50 min-w-[140px]">
                    <button onClick={() => { navigate(`/post/edit/${post.id}`); setShowMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] active:bg-[#F9F9F9]">
                      <Edit3 className="w-4 h-4"/>编辑
                    </button>
                    <button onClick={togglePrivacy} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#333] active:bg-[#F9F9F9]">
                      {isPrivate ? <><Eye className="w-4 h-4"/>设为公开</> : <><Lock className="w-4 h-4"/>设为私密</>}
                    </button>
                    <button onClick={handleDelete} className="w-full flex items-center gap-2 px-4 py-2.5 text-[13px] text-[#FF4D4F] active:bg-[#F9F9F9]">
                      <Trash2 className="w-4 h-4"/>删除
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
          <button onClick={handleShare} className="p-1 text-[#666]"><Share2 className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[150px] [&::-webkit-scrollbar]:hidden">
        {/* User Info */}
        <div className="flex items-center justify-between px-4 py-3 bg-white">
          <div className="flex items-center gap-3">
            <ImageWithFallback src={post.user?.avatar} className="w-9 h-9 rounded-full object-cover"/>
            <span className="text-[14px] font-bold text-[#333]">{post.user?.name || '用户'}</span>
          </div>
          <button onClick={() => setIsFollowing(!isFollowing)}
            className={`text-[13px] font-bold px-3 py-1 rounded-full ${isFollowing ? 'text-[#999] bg-[#F5F5F5]' : 'text-[#FF8C42] bg-[#FFF3E6]'}`}>
            {isFollowing ? '已关注' : '关注'}
          </button>
        </div>

        {/* Image Carousel */}
        <div className="w-full aspect-square bg-gray-50 overflow-hidden" onClick={handleDoubleTap}>
          <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
            {(post.images||[]).map((img: string, idx: number) => (
              <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                <ImageWithFallback src={img} className="w-full h-full object-cover"/>
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
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{marginTop:'-60%'}}>
              <Heart className="w-24 h-24 text-white fill-white opacity-80 animate-ping"/>
            </div>
          )}
          {isPrivate && (
            <div className="absolute top-4 left-4 bg-black/50 text-white text-[11px] px-2 py-1 rounded-full flex items-center gap-1">
              <Lock className="w-3 h-3"/>私密
            </div>
          )}
        </div>

        {/* Content */}
        <div className="bg-white px-4 pt-4 pb-2">
          <p className="text-[14px] text-[#333] leading-relaxed mb-3">{post.content}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {post.breed && <span className="bg-[#FFF3E6] text-[#FF8C42] px-2.5 py-1 rounded-md text-[12px] font-medium">#{post.breed}</span>}
            {post.location && <span className="bg-[#F5F5F5] text-[#666] px-2.5 py-1 rounded-md text-[12px]">📍{post.location}</span>}
          </div>
          <div className="text-[11px] text-[#BBB] mb-3">
            {post.created_at ? new Date(post.created_at).toLocaleString('zh-CN', {month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}) : ''}
            · {(post.view_count||0)+(post.id*7+3)%1000} 次浏览
          </div>
          <div className="flex items-center justify-between py-2 mb-2">
            <div className="flex items-center gap-6">
              <button onClick={handleLike} className={`flex items-center gap-1.5 ${isLiked ? 'text-[#FF4D4F]' : 'text-[#666]'}`}>
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}/>
                <span className="text-[14px] font-medium">{(post.like_count||0)+(isLiked?1:0)}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white mt-2 px-4 py-4 min-h-[200px]">
          <h3 className="text-[14px] font-bold text-[#333] mb-4">评论 {comments.length}</h3>
          <div className="space-y-4">
            {comments.map(c => renderCommentItem(c))}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="absolute bottom-[84px] left-0 right-0 bg-white border-t border-[#EEE] p-3 z-40 flex items-center gap-3">
        <input value={commentText} onChange={e => setCommentText(e.target.value)} onKeyDown={e => e.key==='Enter'&&handleSendComment()}
          placeholder="说点什么..." className="flex-1 bg-[#F5F5F5] rounded-lg px-3 h-9 outline-none text-[14px] placeholder:text-[#999]"/>
        <button onClick={handleSendComment} className="w-9 h-9 bg-[#FF8C42] text-white rounded-lg flex items-center justify-center active:bg-[#E67A35]">
          <Send className="w-4 h-4"/>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
