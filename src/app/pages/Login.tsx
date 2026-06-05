import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usePageTransition } from "../hooks/usePageTransition";
import i18n from "../i18n";

export function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { className, handleBack } = usePageTransition();
  const splashImg = i18n.language === 'en' ? '/splash-en.png' : '/splash-zh.png';

  return (
    <div className={`h-full relative flex flex-col ${className}`}>
      <img src={splashImg} className="absolute inset-0 w-full h-full object-cover" alt="" />
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
          <p className="text-[11px] text-[#FF8C42]/50 mt-0.5">v1.1</p>
          <p className="text-[13px] text-[#999999] dark:text-gray-400 mt-1">{t('login.tagline')}</p>
        </div>

        <div className="w-full max-w-[320px] space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#333] dark:text-gray-100 font-medium border-r border-[#E5E5E5] dark:border-gray-700 pr-2">+86</span>
            <input
              type="tel"
              placeholder={t('login.enterPhone')}
              className="w-full h-[50px] rounded-[12px] border border-[#E5E5E5] dark:border-gray-700 pl-[52px] pr-3 text-[15px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] bg-white dark:bg-gray-900 placeholder:text-[#BBBBBB] transition-colors"
            />
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full h-[50px] bg-[#FF8C42] rounded-[12px] text-white text-[16px] font-bold active:bg-[#F27E36] transition-colors flex items-center justify-center shadow-md"
          >
            {t('login.title')}
          </button>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <div className="flex items-center gap-4 w-full max-w-[320px] mb-6">
            <div className="flex-1 h-[0.5px] bg-[#E5E5E5] dark:bg-gray-700"></div>
            <span className="text-[12px] text-[#BBBBBB] dark:text-gray-500">{t('login.otherLogin')}</span>
            <div className="flex-1 h-[0.5px] bg-[#E5E5E5] dark:bg-gray-700"></div>
          </div>

          <div className="flex items-center gap-8">
            <button className="w-[48px] h-[48px] rounded-full bg-[#07C160] flex items-center justify-center active:scale-95 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.004.142.04.198a.226.226 0 0 0 .321.045l2.126-1.364a.74.74 0 0 1 .497-.129 10.8 10.8 0 0 0 2.882.413c4.8 0 8.691-3.288 8.691-7.342 0-4.054-3.891-7.342-8.69-7.342zm-2.95 5.557a1.21 1.21 0 1 1 0 2.42 1.21 1.21 0 0 1 0-2.42zm5.897 0a1.21 1.21 0 1 1 0 2.42 1.21 1.21 0 0 1 0-2.42z"/>
              </svg>
            </button>
            <button className="w-[48px] h-[48px] rounded-full bg-black dark:bg-white flex items-center justify-center active:scale-95 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.38 15.98 2.85 9.75 7.88 9.5c1.24.06 2.12.7 2.92.72.8.02 2.06-.86 3.6-.72 1.24.12 2.18.5 2.84 1.08-2.56 1.54-2.12 4.98.42 6-.5 1.1-1.1 2.2-2.1 3.2-.12.12-.26.26-.5.5zM14.52 7.6c.22-2.66 2.14-4.34 4.2-4.1.32 2.66-2.14 4.72-4.2 4.1z"/>
              </svg>
            </button>
            <button className="w-[48px] h-[48px] rounded-full border-2 border-[#E5E5E5] dark:border-gray-600 flex items-center justify-center active:scale-95 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#333">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 12.5l-5-3-5 3v-7l5 3 5-3v7z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="text-[13px] text-[#FF8C42] font-medium active:opacity-70"
          >
            {t('login.register')}
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="text-[12px] text-[#999] dark:text-gray-400 active:opacity-70"
          >
            {t('login.privacy')}
          </button>
        </div>
      </div>
    </div>
  );
}
