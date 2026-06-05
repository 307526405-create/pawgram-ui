import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usePageTransition } from "../hooks/usePageTransition";

export function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { className, handleBack } = usePageTransition();

  return (
    <div className={`h-full relative flex flex-col ${className}`}>
      <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => handleBack(() => navigate(-1))} className="text-[#333333] dark:text-gray-100 active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8">

        <div className="flex flex-col items-center mb-10">
          <div className="w-[72px] h-[72px] rounded-2xl bg-[#FF8C42] flex items-center justify-center mb-4 shadow-lg shadow-[#FF8C42]/30">
            <span className="text-[36px]">🐾</span>
          </div>
          <h2 className="text-[22px] font-bold text-[#FF8C42]">{t('login.brandName')}</h2>
          <p className="text-[13px] text-[#999999] dark:text-gray-400 mt-1">{t('login.tagline')}</p>
        </div>

        <div className="w-full max-w-[320px] space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#333] dark:text-gray-100 font-medium border-r border-[#E5E5E5] dark:border-gray-700 pr-2">+86</span>
            <input
              type="tel"
              placeholder={t('login.enterPhone')}
              className="w-full h-[50px] rounded-[12px] border border-[#E5E5E5] dark:border-gray-700 pl-[52px] pr-3 text-[15px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] bg-white dark:bg-gray-900 placeholder:text-[#BBBBBB] dark:placeholder:text-gray-400 transition-colors"
            />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder={t('register.enterCode')}
              className="w-full h-[50px] rounded-[12px] border border-[#E5E5E5] dark:border-gray-700 pl-3 pr-[100px] text-[15px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] bg-white dark:bg-gray-900 placeholder:text-[#BBBBBB] dark:placeholder:text-gray-400 transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF8C42] text-[14px] font-medium bg-transparent cursor-pointer active:opacity-70 transition-opacity">
              {t('register.getCode')}
            </button>
          </div>

          <button
            onClick={() => navigate('/welcome')}
            className="w-full h-[50px] bg-[#FF8C42] rounded-[12px] text-white text-[16px] font-bold active:bg-[#F27E36] transition-colors flex items-center justify-center shadow-md"
          >
            {t('register.registerBtn')}
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity">
          <div className="w-[16px] h-[16px] rounded-full bg-[#FF8C42] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-[10px] h-[10px] text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-[12px] text-[#999999] dark:text-gray-400">
            {t('register.agreement')} <span className="text-[#FF8C42]">{t('register.termsOfService')}</span>{t('register.and')}<span className="text-[#FF8C42]">{t('register.privacyPolicy')}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
