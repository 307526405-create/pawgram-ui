import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronRight, Check, PawPrint, Compass, Heart } from "lucide-react";
import { usePageTransition } from "../hooks/usePageTransition";

type Step = 1 | 2 | 3;

const STEPS = [
  {
    icon: PawPrint,
    title: "欢迎加入 Pawgram",
    subtitle: "你已成功注册，开始探索宠物社交新世界",
    desc: "在这里，你可以记录毛孩子的日常、分享可爱瞬间，与万千铲屎官交流心得。",
  },
  {
    icon: Compass,
    title: "发现精彩",
    subtitle: "首页有更多有趣内容等你探索",
    desc: "浏览动态、发现同品种萌宠、点赞评论互动，找到属于你和毛孩子的小圈子。",
  },
  {
    icon: Heart,
    title: "创建宠物档案",
    subtitle: "让更多人认识你的毛孩子",
    desc: "完善宠物信息后，可以发布动态参与社区，还能解锁品种专属内容和福利。",
  },
];

export function WelcomeGuide() {
  const navigate = useNavigate();
  const { className } = usePageTransition();
  const [step, setStep] = useState<Step>(1);

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as Step);
  };

  const handleDone = () => {
    navigate("/", { replace: true });
  };

  const currentStep = STEPS[step - 1];
  const Icon = currentStep.icon;

  return (
    <div className={`h-full bg-white dark:bg-gray-900 relative flex flex-col ${className}`}>
      {/* Progress bar */}
      <div className="flex items-center gap-2 px-8 pt-[var(--app-safe-top)] pt-safe mt-4 mb-6 shrink-0">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${
                s <= step ? "bg-[#FF8C42]" : "bg-[#E5E5E5] dark:bg-gray-700"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
        <div className="flex flex-col items-center text-center max-w-[300px]">
          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-[#FFF3E6] dark:bg-orange-900/20 flex items-center justify-center mb-8 shadow-lg shadow-[#FF8C42]/10">
            <Icon className="w-12 h-12 text-[#FF8C42]" />
          </div>

          {/* Title */}
          <h1 className="text-[22px] font-bold text-[#333] dark:text-gray-100 mb-3">
            {currentStep.title}
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] text-[#FF8C42] font-medium mb-4">
            {currentStep.subtitle}
          </p>

          {/* Description */}
          <p className="text-[14px] text-[#999] dark:text-gray-400 leading-relaxed">
            {currentStep.desc}
          </p>
        </div>
      </div>

      {/* Bottom action */}
      <div className="px-8 pb-12 shrink-0">
        {step < 3 ? (
          <button
            onClick={handleNext}
            className="w-full flex items-center justify-center gap-1.5 h-12 rounded-full bg-[#FF8C42] text-white text-[15px] font-bold active:bg-[#E67A35] transition-colors shadow-md"
          >
            下一步
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={handleDone}
            className="w-full flex items-center justify-center gap-1.5 h-12 rounded-full bg-[#FF8C42] text-white text-[15px] font-bold active:bg-[#E67A35] transition-colors shadow-md"
          >
            <Check className="w-5 h-5" />
            开始探索
          </button>
        )}
      </div>
    </div>
  );
}
