import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PostCard } from "../components/PostCard";
import { posts } from "../data/mockData";

export function PetProfile() {
  const navigate = useNavigate();
  
  // 筛选出金毛相关的帖子作为宠物动态
  const petPosts = posts.filter(p => p.breedId === 'golden-retriever');

  // 生成打卡记录数据 (30天)，模拟一些未打卡的天数
  const checkIns = Array.from({ length: 30 }).map((_, i) => ![5, 12, 14, 25, 28].includes(i));

  // 成长相册图片
  const albumImages = [
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 小金毛
    "https://images.unsplash.com/photo-1539692177343-b2b990faef15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080", // 玩耍
    "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"  // 微笑
  ];

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      {/* 顶部导航 */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => navigate(-1)} className="text-[#333333] active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#333333] text-[17px] font-bold tracking-wider">宠物档案</h1>
        <button className="text-[#FF8C42] text-[15px] font-medium active:opacity-80">编辑</button>
      </div>

      {/* 滚动内容区域 */}
      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* 头像与名字信息 */}
        <div className="flex flex-col items-center mt-2 mb-6">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1581285217236-a2355291f9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="豆豆"
            className="w-[80px] h-[80px] rounded-full object-cover border-[3px] border-white shadow-sm bg-gray-100"
          />
          <h2 className="text-[18px] font-bold text-[#333333] mt-3">豆豆</h2>
          <p className="text-[14px] text-[#999999] mt-0.5">金毛·2岁</p>
        </div>

        {/* 白色圆角卡片信息区 */}
        <div className="px-4 mb-6">
          <div className="bg-white rounded-[16px] p-5 shadow-sm border border-[#EEEEEE] space-y-4">
            <div className="flex items-center">
              <span className="w-6 text-center mr-2 text-[16px]">🎂</span>
              <span className="text-[#666666] text-[14px] w-[40px]">生日</span>
              <span className="text-[#333333] text-[14px] font-medium ml-auto">2024年3月15日</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 text-center mr-2 text-[16px]">⚖️</span>
              <span className="text-[#666666] text-[14px] w-[40px]">体重</span>
              <span className="text-[#333333] text-[14px] font-medium ml-auto">28kg</span>
            </div>
            <div className="flex items-center">
              <span className="w-6 text-center mr-2 text-[16px]">🏷️</span>
              <span className="text-[#666666] text-[14px] w-[40px]">品种</span>
              <span className="text-[#333333] text-[14px] font-medium ml-auto">金毛</span>
            </div>
            <div className="flex items-start pt-0.5">
              <span className="w-6 text-center mr-2 text-[16px] leading-tight mt-0.5">📝</span>
              <span className="text-[#666666] text-[14px] w-[40px] leading-tight mt-0.5">简介</span>
              <span className="text-[#333333] text-[14px] font-medium ml-auto text-right flex-1 leading-relaxed">
                爱笑的金毛大暖男
              </span>
            </div>
          </div>
        </div>

        {/* 成长相册 */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-[14px] font-bold text-[#333333]">成长相册</h3>
          </div>
          {/* 3列网格，图片80px */}
          <div className="grid grid-cols-[repeat(3,80px)] gap-3">
            {albumImages.map((img, idx) => (
              <div key={idx} className="w-[80px] h-[80px]">
                <ImageWithFallback 
                  src={img}
                  alt={`成长相册图片 ${idx + 1}`}
                  className="w-full h-full rounded-[8px] object-cover shadow-sm border border-[#EEEEEE]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 打卡记录 */}
        <div className="px-4 mb-8">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-[14px] font-bold text-[#333333]">打卡记录</h3>
            <span className="text-[12px] text-[#999999]">最近 30 天</span>
          </div>
          <div className="bg-white rounded-[16px] p-4 shadow-sm border border-[#EEEEEE]">
            <div className="flex flex-wrap gap-[6px]">
              {checkIns.map((isDone, idx) => (
                <div 
                  key={idx} 
                  className={`w-[16px] h-[16px] rounded-[4px] ${isDone ? 'bg-[#FF8C42]' : 'bg-[#E5E5E5]'}`} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* 相关动态列表 */}
        <div className="px-4 mb-4">
          <h3 className="text-[14px] font-bold text-[#333333] mb-4">相关动态</h3>
          <div className="space-y-4">
            {petPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

      </div>

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
