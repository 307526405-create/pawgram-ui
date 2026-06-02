import { Search, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router";
import { PostCard } from "../components/PostCard";
import { BottomNav } from "../components/BottomNav";
import { postsApi } from "../api/client";

export function Home() {
  const [activeTab, setActiveTab] = useState<'hot' | 'following'>('hot');
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    postsApi.list().then(d => setPosts(d.list)).catch(() => {});
  }, []);

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Header: iOS App 全屏布局，59pt 安全区 + 44pt 导航栏 */}
        <div className="sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md z-40 px-4 pt-[var(--app-safe-top)] pb-2">
          <div className="flex items-center justify-between h-[var(--app-nav-height)]">
            <h1 className="text-[17px] font-bold text-[#333333] tracking-wider">爪印 PawGram</h1>
            <div className="flex items-center gap-4 text-[#333333]">
              <Link to="/search" className="active:scale-95 transition-transform"><Search className="w-6 h-6" /></Link>
              <button className="active:scale-95 transition-transform relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex items-center gap-6 mt-1">
            <button 
              className={`text-[17px] font-bold transition-colors relative pb-2 ${activeTab === 'hot' ? 'text-gray-900' : 'text-gray-400 font-medium'}`}
              onClick={() => setActiveTab('hot')}
            >
              热门
              {activeTab === 'hot' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF8C42] rounded-full"></span>
              )}
            </button>
            <button 
              className={`text-[17px] font-bold transition-colors relative pb-2 ${activeTab === 'following' ? 'text-gray-900' : 'text-gray-400 font-medium'}`}
              onClick={() => setActiveTab('following')}
            >
              关注
              {activeTab === 'following' && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF8C42] rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="px-4 mt-2">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
