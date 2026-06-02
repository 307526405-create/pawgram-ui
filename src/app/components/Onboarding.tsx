import { useState, useRef } from "react";
import { PawPrint, Compass, Users } from "lucide-react";

const PAGES = [
  {
    icon: <PawPrint className="w-20 h-20 text-white" />,
    title: "记录每一个爪印",
    desc: "记录宠物生活的每一个精彩瞬间",
    bg: "bg-gradient-to-b from-[#FF8C42] to-[#FFB380]",
  },
  {
    icon: <Compass className="w-20 h-20 text-white" />,
    title: "发现附近宠友",
    desc: "找到身边的宠物友好地点和铲屎官",
    bg: "bg-gradient-to-b from-[#FF6B6B] to-[#FF8C42]",
  },
  {
    icon: <Users className="w-20 h-20 text-white" />,
    title: "加入爪印社区",
    desc: "分享照片视频，认识志同道合的宠友",
    bg: "bg-gradient-to-b from-[#FF8C42] to-[#FF6B6B]",
  },
];

interface OnboardingProps {
  onDone: () => void;
}

export function Onboarding({ onDone }: OnboardingProps) {
  const [page, setPage] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  const goNext = () => {
    if (page < PAGES.length - 1) {
      setPage(page + 1);
    } else {
      localStorage.setItem("pawgram_onboarding_done", "1");
      onDone();
    }
  };

  const goSkip = () => {
    localStorage.setItem("pawgram_onboarding_done", "1");
    onDone();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0 && page < PAGES.length - 1) setPage(page + 1);
      if (dx > 0 && page > 0) setPage(page - 1);
    }
  };

  const isLast = page === PAGES.length - 1;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* Skip button */}
      {!isLast && (
        <button
          onClick={goSkip}
          className="absolute top-[max(env(safe-area-inset-top),16px)] right-4 z-10 text-white/80 text-[14px] px-4 py-2 active:opacity-70"
        >
          跳过
        </button>
      )}

      {/* Page content with transition */}
      <div className="flex-1 overflow-hidden relative">
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {PAGES.map((p, i) => (
            <div key={i} className={`w-full h-full shrink-0 flex flex-col items-center justify-center ${p.bg} px-8`}>
              <div className="mb-8 animate-in">{p.icon}</div>
              <h2 className="text-[28px] font-bold text-white mb-3 text-center">{p.title}</h2>
              <p className="text-[15px] text-white/80 text-center leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom area: dots + button */}
      <div className="absolute bottom-0 left-0 right-0 pb-[max(env(safe-area-inset-bottom),32px)] pt-8 bg-gradient-to-t from-black/10 to-transparent">
        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {PAGES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === page ? "w-6 h-2 bg-white" : "w-2 h-2 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Button */}
        <div className="px-8">
          <button
            onClick={goNext}
            className={`w-full h-12 rounded-full text-[16px] font-bold active:scale-[0.98] transition-transform ${
              isLast
                ? "bg-white text-[#FF8C42]"
                : "bg-white/20 text-white border border-white/40"
            }`}
          >
            {isLast ? "开始探索" : "下一步"}
          </button>
        </div>
      </div>
    </div>
  );
}
