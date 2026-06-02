import { ChevronLeft, Heart, Share2, Send, MoreHorizontal, Trash2, Lock, Eye, Edit3 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { BottomNav } from "../components/BottomNav";
import { postsApi } from "../api/client";

const mockComments = [
  { id:1, user:{name:"小可",avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100"}, text:"金毛也太可爱了吧！", time:"10分钟前", likes:5, isLiked:false, replies:[
    { id:101, user:{name:"作者"}, text:"是呀，每天带它出来都很开心～", time:"5分钟前" }
  ]},
  { id:2, user:{name:"豆豆妈",avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"}, text:"这个公园在哪里呀？环境看起来真不错", time:"半小时前", likes:2, isLiked:true, replies:[] },
];

export function PostDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [comments, setComments] = useState(mockComments);
  const [commentText, setCommentText] = useState("");
  const [showHeart, setShowHeart] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const lastTap = useRef(0);

  useEffect(() => {
    if (!id) return;
    postsApi.detail(Number(id)).then(p => { setPost(p); setIsPrivate(p.is_private||false); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

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
  const handleSendComment = () => {
    if (!commentText.trim()) return;
    setComments([{ id: Date.now(), user:{name:"我",avatar:""}, text: commentText, time:"刚刚", likes:0, isLiked:false, replies:[] }, ...comments]);
    setCommentText("");
  };
  const toggleCommentLike = (cid: number) => {
    setComments(prev => prev.map(c => c.id===cid ? {...c, isLiked:!c.isLiked, likes: c.isLiked ? c.likes-1 : c.likes+1} : c));
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
            {comments.map(c => (
              <div key={c.id} className="flex gap-2.5">
                <ImageWithFallback src={c.user.avatar} className="w-7 h-7 rounded-full object-cover shrink-0 bg-gray-200 mt-0.5"/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <span className="text-[12px] font-bold text-[#666]">{c.user.name}</span>
                      <p className="text-[14px] text-[#333] mt-0.5 leading-snug">{c.text}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-[#999]">{c.time}</span>
                        <button className="text-[10px] font-medium text-[#FF8C42]">回复</button>
                      </div>
                    </div>
                    <button onClick={() => toggleCommentLike(c.id)}
                      className={`flex flex-col items-center gap-0.5 shrink-0 ${c.isLiked ? 'text-[#FF4D4F]' : 'text-[#CCC]'}`}>
                      <Heart className={`w-3.5 h-3.5 ${c.isLiked ? 'fill-current' : ''}`}/>
                      <span className="text-[10px]">{c.likes||''}</span>
                    </button>
                  </div>
                  {c.replies?.length > 0 && (
                    <div className="mt-2 bg-[#FAFAFA] rounded-md p-2 space-y-1.5">
                      {c.replies.map((r: any) => (
                        <div key={r.id} className="text-[12px] leading-snug">
                          <span className="font-bold text-[#666]">{r.user.name}：</span>
                          <span className="text-[#333]">{r.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
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
