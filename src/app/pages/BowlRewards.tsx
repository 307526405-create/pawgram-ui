import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";

export function BowlRewards() {
  const navigate = useNavigate();

  // 进度环计算 (直径120, 半径52，周长约326.7)
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = 2 / 3;
  const strokeDashoffset = circumference * (1 - progress);

  const rewards = [
    { id: 2, title: "第2个食盆", date: "5月10日" },
    { id: 1, title: "第1个食盆", date: "4月20日" },
  ];

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      {/* 顶部导航与首页完全一致（浅色底+毛玻璃） */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => navigate(-1)} className="text-[#333333] active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#333333] text-[17px] font-bold tracking-wider">食盆奖励</h1>
        <div className="w-6 h-6"></div> {/* 占位保持居中 */}
      </div>

      {/* 滚动区域 */}
      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* 顶部食盆与进度环 */}
        <div className="flex flex-col items-center pt-6 pb-6">
          <div className="text-[60px] leading-none mb-4">🥣</div>
          
          <div className="relative flex flex-col items-center justify-center mb-3">
            {/* SVG 进度环 (直径120px) */}
            <svg className="w-[120px] h-[120px] transform -rotate-90">
              <circle 
                cx="60" cy="60" r={radius} 
                fill="none" 
                stroke="#EEEEEE" 
                strokeWidth="10" 
              />
              <circle 
                cx="60" cy="60" r={radius} 
                fill="none" 
                stroke="#FF8C42" 
                strokeWidth="10" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            
            {/* 中间大数字 */}
            <div className="absolute flex flex-col items-center">
              <span className="text-[28px] font-bold text-[#333333] leading-none mt-1">2/3</span>
            </div>
          </div>
          
          <p className="text-[#999999] text-[14px]">再打卡1天即可获得</p>
        </div>

        {/* 白色圆角卡片规则说明 */}
        <div className="bg-white rounded-[16px] mx-4 p-5 shadow-sm border border-[#EEEEEE] mb-8">
          <p className="text-[14px] text-[#333333] font-medium text-center">
            连续打卡3天可获得食盆奖励
          </p>
        </div>

        {/* 已获奖励列表 */}
        <div className="px-4 mb-4">
          <h3 className="text-[14px] font-bold text-[#333333] mb-4">已获奖励</h3>
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white rounded-[16px] p-4 flex items-center justify-between shadow-sm border border-[#EEEEEE]">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#333333]">{reward.title}</span>
                  <span className="text-[14px] text-[#999999] ml-1">{reward.date}</span>
                </div>
                <div className="bg-[#FFF3E6] text-[#FF8C42] text-[12px] font-bold px-2.5 py-1 rounded-[6px]">
                  已领取
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>

      {/* 底部固定 5 个 TabBar */}
      <BottomNav />
    </div>
  );
}