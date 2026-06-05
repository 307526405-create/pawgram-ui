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
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => handleBack(() => navigate(-1))} className="text-[#333333] dark:text-gray-100 active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#333333] dark:text-gray-100 text-[17px] font-bold tracking-wider">{t('login.title')}</h1>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col items-center">

        <div className="flex flex-col items-center mt-10 mb-8 shrink-0">
          <div className="text-[60px] leading-none mb-3">🐾</div>
          <h2 className="text-[24px] font-bold text-[#FF8C42] mb-1.5">{t('login.brandName')}</h2>
          <p className="text-[12px] text-[#999999] dark:text-gray-400">{t('login.tagline')}</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[16px] w-[calc(100%-32px)] mx-4 p-6 shadow-sm border border-[#EEEEEE] dark:border-gray-700 shrink-0">
          <div className="mb-4">
            <input
              type="tel"
              placeholder={t('login.enterPhone')}
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] dark:border-gray-700 px-3 text-[14px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] placeholder:text-[#999999] dark:placeholder:text-gray-500 transition-colors"
            />
          </div>

          <div className="mb-8 relative flex items-center">
            <input
              type="text"
              placeholder={t('login.enterCode')}
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] dark:border-gray-700 pl-3 pr-[90px] text-[14px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] placeholder:text-[#999999] dark:placeholder:text-gray-500 transition-colors"
            />
            <button className="absolute right-3 text-[#FF8C42] text-[14px] font-medium bg-transparent cursor-pointer active:opacity-70 transition-opacity">
              {t('login.getCode')}
            </button>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full h-[48px] bg-[#FF8C42] rounded-[12px] text-white text-[16px] font-bold active:bg-[#F27E36] transition-colors flex items-center justify-center shadow-sm"
          >
            {t('login.title')}
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center shrink-0">
          <p className="text-[12px] text-[#999999] dark:text-gray-400 mb-4">{t('login.otherLogin')}</p>

          <button className="w-[52px] h-[52px] rounded-full bg-[#07C160] flex items-center justify-center active:scale-95 transition-transform shadow-md">
            <svg viewBox="0 0 40 40" className="w-7 h-7" fill="white">
              <path d="M28.2 16.2c-1.2-3-4.5-5-8.2-5-5 0-9 3.6-9 8 0 2 .8 3.8 2.2 5.2l-1 3.2 3.5-1.8c1.3.6 2.8 1 4.3 1 .6 0 1.2 0 1.8-.2-1.2-1.5-1.8-3.3-1.8-5.2 0-2.8 1.6-5.3 4-6.7-.7-.3-1.5-.5-2.3-.5-2.7 0-4.8 1.8-4.8 4s2.1 4 4.8 4c.3 0 .7 0 1-.1-.5.6-.9 1.4-.9 2.2 0 .8.4 1.5.9 2H20c-1.8 0-3.4-.5-4.8-1.3l-4 2 1.1-3.8C10.7 24 9.3 22 9.3 19.7c0-5.2 4.8-9.5 10.7-9.5 5.5 0 10 3.8 10 8.5 0 .5 0 1-.1 1.5-.5-.3-1.1-.5-1.7-.7z"/>
              <circle cx="16.5" cy="18" r="1.2"/>
              <circle cx="21.5" cy="18" r="1.2"/>
            </svg>
          </button>
        </div>

        <div className="flex-1"></div>

        <div className="mb-6 mt-8 shrink-0 flex items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="text-[14px] text-[#FF8C42] font-medium active:opacity-70 transition-opacity"
          >
            {t('login.register')}
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="text-[12px] text-[#999] dark:text-gray-400 active:opacity-70 transition-opacity"
          >
            {t('login.privacy')}
          </button>
        </div>
      </div>

    </div>
  );
}
