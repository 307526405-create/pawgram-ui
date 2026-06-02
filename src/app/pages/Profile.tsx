import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { users, posts, breeds } from "../data/mockData";
import { Settings as SettingsIcon } from "lucide-react";

export function Profile() {
  const navigate = useNavigate();
  // 当前登录用户，固定选取mockData中的1号用户（王丽丽）
  const currentUser = users[1];
  
  // 计算获赞总数
  const totalLikes = posts.filter(p => p.userId === currentUser.id).reduce((sum, p) => sum + p.likes, 0);
  
  // 筛选属于当前用户的帖子
  const userPosts = posts.filter(p => p.userId === currentUser.id);

  // 模拟属于该用户的宠物数据
  const myPets = [
    { id: 1, name: "贝利", avatar: breeds[0].icon },
    { id: 2, name: "主子", avatar: breeds[2].icon },
  ];

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      
      {/* 顶部导航：仅保留右侧设置按钮，通过 absolute 定位悬浮 */}
      <div className="absolute top-0 w-full pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-end px-4 z-40 pointer-events-none">
        <button onClick={() => navigate('/settings')} className="p-2 -mr-2 active:opacity-70 transition-opacity text-[#333333] pointer-events-auto">
          <SettingsIcon className="w-[22px] h-[22px]" />
        </button>
      </div>

      {/* 中间滚动区域，顶部补齐98px，底部预留84px空间（50pxTabBar + 34px安全区） */}
      <div className="flex-1 overflow-y-auto pt-[var(--app-header-height)] pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* 用户信息区 */}
        <div className="px-5 pt-2 pb-6">
          <div className="flex items-center gap-4 mb-6">
            <ImageWithFallback 
              src={currentUser.avatar} 
              alt="用户头像" 
              className="w-[60px] h-[60px] rounded-full object-cover shrink-0 bg-[#EEEEEE] shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-[18px] font-bold text-[#333333] truncate">{currentUser.name}</h2>
              <p className="text-[12px] text-[#999999] mt-1 truncate">{currentUser.bio}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-12 px-2">
            <div 
              className="flex flex-col items-center cursor-pointer active:opacity-70 transition-opacity"
              onClick={() => navigate('/follows', { state: { tab: 'following' } })}
            >
              <span className="text-[18px] font-bold text-[#333333] leading-none">{currentUser.following}</span>
              <span className="text-[10px] text-[#999999] mt-1.5 leading-none">关注</span>
            </div>
            <div 
              className="flex flex-col items-center cursor-pointer active:opacity-70 transition-opacity"
              onClick={() => navigate('/follows', { state: { tab: 'followers' } })}
            >
              <span className="text-[18px] font-bold text-[#333333] leading-none">{currentUser.followers}</span>
              <span className="text-[10px] text-[#999999] mt-1.5 leading-none">粉丝</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#333333] leading-none">{totalLikes}</span>
              <span className="text-[10px] text-[#999999] mt-1.5 leading-none">获赞</span>
            </div>
          </div>
        </div>

        {/* 打卡进度条卡片 */}
        <div 
          className="mx-4 mb-6 bg-white rounded-[16px] p-4 shadow-sm border border-[#EEEEEE] flex flex-col justify-center cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => navigate('/bowl')}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-[12px] font-bold text-[#333333]">2/3 次打卡得食盆</span>
            <span className="text-[16px] leading-none">🥣</span>
          </div>
          <div className="h-[6px] bg-[#EEEEEE] rounded-full overflow-hidden w-full">
            <div className="h-full bg-[#FF8C42] w-[66%] rounded-full transition-all duration-500 ease-out" />
          </div>
        </div>

        {/* 我的宠物（横向滚动） */}
        <div className="mb-6">
          <div className="px-4 mb-3 flex items-center justify-between">
            <h3 className="text-[16px] font-bold text-[#333333]">我的宠物</h3>
          </div>
          <div className="flex gap-4 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {myPets.map(pet => (
               <div key={pet.id} className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70 transition-opacity" onClick={() => navigate('/pet')}>
                 <ImageWithFallback 
                   src={pet.avatar} 
                   alt={pet.name}
                   className="w-[56px] h-[56px] rounded-full object-cover border border-[#EEEEEE] shadow-sm" 
                 />
                 <span className="text-[12px] text-[#333333] font-medium">{pet.name}</span>
               </div>
            ))}
            {/* 添加宠物按钮 */}
            <div className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70 transition-opacity shrink-0">
               <div className="w-[56px] h-[56px] rounded-full bg-white border border-[#EEEEEE] flex items-center justify-center text-[#FF8C42] text-[24px] shadow-sm">
                 +
               </div>
               <span className="text-[12px] text-[#999999] font-medium">添加</span>
            </div>
          </div>
        </div>

        {/* 帖子网格区 */}
        <div className="bg-white rounded-t-[24px] pt-4 min-h-[400px] border-t border-[#EEEEEE] shadow-sm flex flex-col">
          <div className="px-4 mb-3 flex gap-6 shrink-0">
             <span className="text-[15px] font-bold text-[#333333] relative">
               动态
               <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-1 bg-[#FF8C42] rounded-full"></div>
             </span>
             <span className="text-[15px] font-medium text-[#999999]">收藏</span>
          </div>
          
          <div className="grid grid-cols-3 gap-[2px]">
            {userPosts.map(post => (
              <div key={post.id} className="aspect-square bg-[#EEEEEE] cursor-pointer active:opacity-80 transition-opacity" onClick={() => navigate(`/post/${post.id}`)}>
                <ImageWithFallback src={post.images[0]} alt="帖子" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

      </div>

      <BottomNav />
    </div>
  );
}