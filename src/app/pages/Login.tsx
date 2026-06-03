import { ChevronLeft, MessageCircle } from "lucide-react";
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
            <button className="absolute right-3 text-[#FF8C42] text-[14px] font-medium bg-transparent active:opacity-70 transition-opacity">
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

        <div className="mt-12 flex flex-col items-center shrink-0">
          <p className="text-[12px] text-[#999999] dark:text-gray-400 mb-5">{t('login.otherLogin')}</p>

          <button className="w-[44px] h-[44px] rounded-full bg-[#07C160] flex items-center justify-center active:scale-95 transition-transform shadow-sm">
            <MessageCircle className="w-6 h-6 text-white fill-current" />
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
