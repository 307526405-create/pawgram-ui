import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usePageTransition } from "../hooks/usePageTransition";

export function BowlRewards() {
  const navigate = useNavigate();
  const { animClass, handleBack } = usePageTransition();
  const { t } = useTranslation();

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = 2 / 3;
  const strokeDashoffset = circumference * (1 - progress);

  const rewards = [
    { id: 2, title: t('bowl.bowlNumber', { n: 2 }), date: "5/10" },
    { id: 1, title: t('bowl.bowlNumber', { n: 1 }), date: "4/20" },
  ];

  return (
    <div className={`h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col ${animClass}`}>
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={handleBack} className="text-[#333333] dark:text-gray-100 active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#333333] dark:text-gray-100 text-[17px] font-bold tracking-wider">{t('bowl.title')}</h1>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

        <div className="flex flex-col items-center pt-6 pb-6">
          <div className="text-[60px] leading-none mb-4">🥣</div>

          <div className="relative flex flex-col items-center justify-center mb-3">
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

            <div className="absolute flex flex-col items-center">
              <span className="text-[28px] font-bold text-[#333333] dark:text-gray-100 leading-none mt-1">2/3</span>
            </div>
          </div>

          <p className="text-[#999999] dark:text-gray-400 text-[14px]">{t('bowl.progress', { n: 1 })}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[16px] mx-4 p-5 shadow-sm border border-[#EEEEEE] dark:border-gray-700 mb-8">
          <p className="text-[14px] text-[#333333] dark:text-gray-100 font-medium text-center">
            {t('bowl.rule')}
          </p>
        </div>

        <div className="px-4 mb-4">
          <h3 className="text-[14px] font-bold text-[#333333] dark:text-gray-100 mb-4">{t('bowl.myRewards')}</h3>
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div key={reward.id} className="bg-white dark:bg-gray-900 rounded-[16px] p-4 flex items-center justify-between shadow-sm border border-[#EEEEEE] dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-[#333333] dark:text-gray-100">{reward.title}</span>
                  <span className="text-[14px] text-[#999999] dark:text-gray-400 ml-1">{reward.date}</span>
                </div>
                <div className="bg-[#FFF3E6] dark:bg-orange-900/30 text-[#FF8C42] text-[12px] font-bold px-2.5 py-1 rounded-[6px]">
                  {t('bowl.claimed')}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
