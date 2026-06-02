import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { ChevronLeft } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { users } from "../data/mockData";

export function FollowList() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 通过路由 state 初始化 tab，默认为 'following'
  const initialTab = location.state?.tab === 'followers' ? 'followers' : 'following';
  const [activeTab, setActiveTab] = useState<'following' | 'followers'>(initialTab);

  // 模拟数据：关注列表
  const followingList = [
    { id: 101, name: "柯基小王子", avatar: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150", bio: "每天分享快乐柯基，是个大胃王", status: "mutual" },
    { id: 102, name: "喵星人日记", avatar: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&q=80&w=150", bio: "佛系养猫，随缘更新", status: "followed" },
    { id: 103, name: "大金毛的日常", avatar: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150", bio: "记录大金毛的成长点滴", status: "followed" },
    { id: 104, name: "哈士奇不拆家", avatar: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&q=80&w=150", bio: "可能是全网最乖的二哈", status: "mutual" },
  ];

  // 模拟数据：粉丝列表
  const followersList = [
    { id: 101, name: "柯基小王子", avatar: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150", bio: "每天分享快乐柯基，是个大胃王", status: "mutual" },
    { id: 105, name: "铲屎官老王", avatar: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=150", bio: "专业遛狗二十年", status: "none" },
    { id: 104, name: "哈士奇不拆家", avatar: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&q=80&w=150", bio: "可能是全网最乖的二哈", status: "mutual" },
    { id: 106, name: "爱猫的小仙女", avatar: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=150", bio: "家有三只神仙主子", status: "none" },
    { id: 107, name: "柴犬多多", avatar: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150", bio: "多多的搞笑日常", status: "none" },
  ];

  const currentList = activeTab === 'following' ? followingList : followersList;

  const renderActionButton = (status: string) => {
    switch (status) {
      case 'mutual':
        return (
          <button className="text-[#FF8C42] text-[13px] font-bold px-3 py-1.5 active:opacity-70 transition-opacity">
            互相关注
          </button>
        );
      case 'followed':
        return (
          <button className="text-[#999999] text-[13px] font-bold px-3.5 py-1.5 rounded-full border border-[#CCCCCC] active:scale-95 transition-transform">
            已关注
          </button>
        );
      case 'none':
      default:
        return (
          <button className="bg-[#FF8C42] text-white text-[13px] font-bold px-4 py-1.5 rounded-full active:scale-95 transition-transform shadow-sm">
            关注
          </button>
        );
    }
  };

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      {/* 顶部导航栏：高度对齐，标题和返回 */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-40 border-b border-transparent">
        <div className="w-16 flex justify-start">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-70 transition-opacity">
            <ChevronLeft className="w-6 h-6 text-[#333333]" />
          </button>
        </div>
        <h1 className="text-[#333333] text-[17px] font-bold tracking-wider">关注列表</h1>
        <div className="w-16 flex justify-end"></div>
      </div>

      {/* Tab 切换 */}
      <div className="flex h-[var(--app-nav-height)] items-center justify-center gap-16 bg-[#FAFAFA] shrink-0 border-b border-[#EEEEEE] z-30 relative">
        <button 
          onClick={() => setActiveTab('following')} 
          className={`relative h-full flex items-center text-[15px] font-bold transition-colors ${activeTab === 'following' ? 'text-[#333333]' : 'text-[#999999]'}`}
        >
          关注
          {activeTab === 'following' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-[#FF8C42] rounded-t-full" />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('followers')} 
          className={`relative h-full flex items-center text-[15px] font-bold transition-colors ${activeTab === 'followers' ? 'text-[#333333]' : 'text-[#999999]'}`}
        >
          粉丝
          {activeTab === 'followers' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[3px] bg-[#FF8C42] rounded-t-full" />
          )}
        </button>
      </div>

      {/* 列表内容，预留底部84px空间 */}
      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="pt-2">
          {currentList.map((user, index) => (
            <div key={user.id} className={`flex items-center justify-between px-4 py-3 bg-white ${index !== currentList.length - 1 ? 'border-b border-[#EEEEEE]' : ''}`}>
              <div className="flex items-center gap-3 overflow-hidden">
                <ImageWithFallback 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-[36px] h-[36px] rounded-full object-cover shrink-0" 
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-[#333333] truncate">{user.name}</span>
                  <span className="text-[12px] text-[#999999] truncate mt-0.5">{user.bio}</span>
                </div>
              </div>
              <div className="shrink-0 ml-3">
                {renderActionButton(user.status)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}