import { ChevronLeft, Heart, Star, Share2 } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { BottomNav } from "../components/BottomNav";

export function PostDetail() {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const postImages = [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // Golden retriever
    "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // Dog playing
    "https://images.unsplash.com/photo-1544568100-847a948585b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"  // Dog happy
  ];

  const mockComments = [
    {
      id: 1,
      user: { name: "小可", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100" },
      text: "金毛也太可爱了吧！",
      time: "10分钟前",
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: 101,
          user: { name: "王丽丽" }, // Author reply
          text: "是呀，每天带它出来都很开心～",
          time: "5分钟前"
        }
      ]
    },
    {
      id: 2,
      user: { name: "豆豆妈", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100" },
      text: "这个公园在哪里呀？环境看起来真不错。",
      time: "半小时前",
      likes: 2,
      isLiked: true,
      replies: []
    }
  ];

  const [commentsData, setCommentsData] = useState(mockComments);

  const toggleCommentLike = (id: number) => {
    setCommentsData(commentsData.map(c => 
      c.id === id ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 } : c
    ));
  };

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      {/* Top Navigation */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => navigate(-1)} className="text-[#333333] active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#333333] text-[17px] font-bold tracking-wider">帖子详情</h1>
        <div className="w-6 h-6"></div> {/* Placeholder for balance */}
      </div>

      {/* Scrollable Content */}
      {/* 84px for BottomNav + ~56px for Input Bar = 140px total padding bottom */}
      <div className="flex-1 overflow-y-auto pb-[150px] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* User Info Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white">
          <div className="flex items-center gap-3">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100" 
              alt="王丽丽" 
              className="w-[36px] h-[36px] rounded-full object-cover"
            />
            <span className="text-[14px] font-bold text-[#333333]">王丽丽</span>
          </div>
          <button 
            onClick={() => setIsFollowing(!isFollowing)}
            className={`text-[14px] font-medium transition-colors px-3 py-1 rounded-full ${isFollowing ? 'text-[#999999] bg-[#F5F5F5]' : 'text-[#FF8C42] bg-[#FFF3E6]'}`}
          >
            {isFollowing ? '已关注' : '关注'}
          </button>
        </div>

        {/* Full-width Image Carousel */}
        <div className="w-full aspect-square overflow-x-auto snap-x snap-mandatory flex [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {postImages.map((img, idx) => (
            <div key={idx} className="w-full h-full shrink-0 snap-center relative">
              <ImageWithFallback 
                src={img} 
                alt={`帖子图片 ${idx + 1}`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/40 text-white text-[12px] px-2 py-0.5 rounded-full">
                {idx + 1} / {postImages.length}
              </div>
            </div>
          ))}
        </div>

        {/* Content Section */}
        <div className="bg-white px-4 pt-4 pb-2">
          {/* Text Content */}
          <p className="text-[14px] text-[#333333] leading-relaxed mb-4">
            今天天气特别好，带我家傻狗来 Sunny Park 晒太阳～
            跑了一下午终于累瘫了，乖乖趴在草地上休息。养金毛真的是治愈又耗体力的一件事啊哈哈！🐶✨
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[#FF8C42] bg-[#FFF3E6] px-2.5 py-1 rounded-[6px] text-[12px] font-medium">
              #金毛
            </span>
            <span className="text-[#666666] bg-[#F5F5F5] px-2.5 py-1 rounded-[6px] text-[12px] font-medium">
              📍 Sunny Park
            </span>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between py-2 mb-2">
            <div className="flex items-center gap-6">
              <button 
                className={`flex items-center gap-1.5 active:scale-95 transition-transform ${isLiked ? 'text-[#FF4D4F]' : 'text-[#666666]'}`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-[22px] h-[22px] ${isLiked ? 'fill-current' : ''}`} />
                <span className="text-[14px] font-medium">{isLiked ? 343 : 342}</span>
              </button>
              <button 
                className={`flex items-center gap-1.5 active:scale-95 transition-transform ${isSaved ? 'text-[#FFB800]' : 'text-[#666666]'}`}
                onClick={() => setIsSaved(!isSaved)}
              >
                <Star className={`w-[22px] h-[22px] ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
            <button className="flex items-center gap-1 text-[#666666] active:scale-95 transition-transform">
              <Share2 className="w-[22px] h-[22px]" />
            </button>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white mt-2 px-4 py-4 min-h-[300px]">
          <h3 className="text-[14px] font-bold text-[#333333] mb-4">评论 12</h3>
          
          <div className="space-y-5">
            {commentsData.map((comment) => (
              <div key={comment.id} className="flex gap-2.5">
                <ImageWithFallback 
                  src={comment.user.avatar} 
                  alt={comment.user.name} 
                  className="w-[28px] h-[28px] rounded-full object-cover shrink-0 bg-gray-200 mt-1" 
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[12px] font-bold text-[#666666]">{comment.user.name}</span>
                      <p className="text-[14px] text-[#333333] mt-1 leading-snug">{comment.text}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] text-[#999999]">{comment.time}</span>
                        <button className="text-[11px] font-medium text-[#FF8C42]">回复</button>
                      </div>
                    </div>
                    <button 
                      className={`flex flex-col items-center gap-0.5 active:scale-95 mt-1 ${comment.isLiked ? 'text-[#FF4D4F]' : 'text-[#CCCCCC]'}`}
                      onClick={() => toggleCommentLike(comment.id)}
                    >
                      <Heart className={`w-[14px] h-[14px] ${comment.isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 bg-[#FAFAFA] rounded-[6px] p-2 space-y-2">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="text-[13px] leading-snug">
                          <span className="font-bold text-[#666666]">{reply.user.name}：</span>
                          <span className="text-[#333333]">{reply.text}</span>
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

      {/* Fixed Bottom Input Bar - positioned above BottomNav (84px) */}
      <div className="absolute bottom-[84px] left-0 right-0 bg-white border-t border-[#EEEEEE] p-3 z-40 flex items-center gap-3 shadow-sm">
        <div className="flex-1 bg-[#F5F5F5] rounded-[8px] flex items-center px-3 h-[36px]">
          <input 
            type="text" 
            placeholder="说点什么..." 
            className="bg-transparent border-none outline-none w-full text-[14px] text-[#333333] placeholder:text-[#999999]"
          />
        </div>
        <button className="h-[36px] px-4 bg-[#FF8C42] text-white text-[14px] font-medium rounded-[8px] active:bg-[#F27E36] transition-colors shrink-0">
          发送
        </button>
      </div>

      {/* Fixed TabBar */}
      <BottomNav />
    </div>
  );
}