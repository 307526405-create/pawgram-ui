import { ChevronLeft, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageTransition } from "../hooks/usePageTransition";

export function CheckIn() {
  const navigate = useNavigate();
  const { animClass, handleBack } = usePageTransition();

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  
  // 生成 35 个格子的日历（假设1号是周五）
  const emptyDays = Array(5).fill(null); 
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const calendarCells = [...emptyDays, ...days];

  const today = 27;

  const renderStatus = (day: number | null) => {
    if (day === null) return null;

    if (day === today) {
      // 今天：橙色描边圆
      return <div className="w-[20px] h-[20px] rounded-full border-[2px] border-[#FF8C42] mt-1.5 flex-shrink-0"></div>;
    }
    if (day > today) {
      // 未来日期：空位占位
      return <div className="w-[20px] h-[20px] mt-1.5 flex-shrink-0"></div>;
    }
    // 过去未打卡
    if (day === 5 || day === 10 || day === 18) {
      return <div className="w-[20px] h-[20px] rounded-full border-[2px] border-[#CCCCCC] dark:border-gray-700 mt-1.5 flex-shrink-0"></div>;
    }
    // 已打卡：橙色实心圆20px + 白色对勾
    return (
      <div className="w-[20px] h-[20px] rounded-full bg-[#FF8C42] flex items-center justify-center mt-1.5 flex-shrink-0">
        <Check className="w-3 h-3 text-white" strokeWidth={4} />
      </div>
    );
  };

  const getDayTextColor = (day: number | null) => {
    if (day === null) return "";
    if (day > today) return "text-[#CCCCCC] dark:text-gray-400"; // 未来日期浅灰
    return "text-[#333333] dark:text-gray-100"; // 过去和今天深色
  };

  // 打卡记录数据
  const historyList = [
    {
      date: "5月26日",
      time: "09:30",
      img: "https://images.unsplash.com/photo-1708605712921-51528bab1f87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      date: "5月25日",
      time: "08:15",
      img: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
    {
      date: "5月24日",
      time: "18:20",
      img: "https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    },
  ];

  return (
    <div className={`h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col ${animClass}`}>
      {/* 顶部导航与首页完全一致 */}
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={handleBack} className="text-[#333333] dark:text-gray-100 active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#333333] dark:text-gray-100 text-[17px] font-bold tracking-wider">每日打卡</h1>
        <div className="w-6 h-6"></div> {/* 占位保持标题居中 */}
      </div>

      {/* 滚动区域 */}
      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* 中间浅橙色大卡片 */}
        <div className="bg-[#FFF3E6] dark:bg-orange-900/30 rounded-[16px] mx-4 mt-2 mb-6 py-6 flex flex-col items-center justify-center">
          <div className="text-[#FF8C42] text-[48px] font-bold leading-none mb-1">7</div>
          <div className="text-[#999999] dark:text-gray-400 text-[14px]">连续打卡天数</div>
        </div>

        {/* 本月打卡日历 */}
        <div className="bg-white dark:bg-gray-900 rounded-[16px] mx-4 p-5 shadow-sm border border-[#EEEEEE] dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[15px] font-bold text-[#333333] dark:text-gray-100">2026年5月</span>
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {/* 星期表头 */}
            {weekDays.map((day, idx) => (
              <div key={idx} className="text-[#999999] dark:text-gray-400 text-[12px] font-medium">
                {day}
              </div>
            ))}
            
            {/* 日期格子 */}
            {calendarCells.map((cell, idx) => (
              <div key={idx} className="flex flex-col items-center justify-start h-[44px]">
                {cell !== null && (
                  <span className={`text-[14px] font-medium leading-none ${getDayTextColor(cell)}`}>
                    {cell}
                  </span>
                )}
                {renderStatus(cell)}
              </div>
            ))}
          </div>
        </div>

        {/* 拍照打卡大按钮 */}
        <div className="px-4 mb-8">
          <button className="w-full h-[48px] bg-[#FF8C42] rounded-[12px] text-white text-[16px] font-bold active:bg-[#F27E36] transition-colors flex items-center justify-center gap-2">
            📸 拍照打卡
          </button>
        </div>

        {/* 打卡记录时间线 */}
        <div className="px-4 mb-4">
          <h3 className="text-[14px] font-bold text-[#333333] dark:text-gray-100 mb-4">打卡记录</h3>
          <div className="ml-2 pl-5 border-l-2 border-[#EEEEEE] dark:border-gray-700 space-y-6 relative">
            {historyList.map((item, idx) => (
              <div key={idx} className="relative flex items-start justify-between">
                {/* 时间线圆点 */}
                <div className="absolute w-[10px] h-[10px] rounded-full bg-[#FF8C42] border-[2px] border-white dark:border-gray-950 left-[-26px] top-[4px]"></div>
                
                <div className="flex-1 mt-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[14px] font-bold text-[#333333] dark:text-gray-100">{item.date}</span>
                    <span className="text-[12px] text-[#999999] dark:text-gray-400">{item.time}</span>
                  </div>
                </div>
                
                {/* 缩略图 */}
                <ImageWithFallback 
                  src={item.img} 
                  alt="打卡照片" 
                  className="w-[60px] h-[60px] rounded-[8px] object-cover shadow-sm border border-[#EEEEEE] dark:border-gray-700 shrink-0" 
                />
              </div>
            ))}
          </div>
        </div>
        
      </div>

    </div>
  );
}