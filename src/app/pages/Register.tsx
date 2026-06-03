import { ChevronLeft, Camera, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="h-full bg-gradient-to-b from-[#FFF3E6] dark:from-orange-900/30 to-white dark:to-gray-900 relative flex flex-col">
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => navigate(-1)} className="text-[#333333] dark:text-gray-100 active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#333333] dark:text-gray-100 text-[17px] font-bold tracking-wider">{t('register.title')}</h1>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col items-center">

        <div className="mt-8 mb-8 shrink-0">
          <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform border-2 border-dashed border-[#CCCCCC] dark:border-gray-700 bg-white dark:bg-gray-900 relative">
            <Camera className="w-8 h-8 text-[#CCCCCC] dark:text-gray-400" />
            <div className="absolute -bottom-1 -right-1 bg-[#FF8C42] w-[26px] h-[26px] rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-sm">
              <span className="text-white text-[16px] leading-none mb-0.5 font-bold">+</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[16px] w-[calc(100%-32px)] mx-4 p-6 shadow-sm border border-[#EEEEEE] dark:border-gray-700 shrink-0">
          <div className="mb-4">
            <input
              type="text"
              placeholder={t('register.enterNickname')}
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] dark:border-gray-700 px-3 text-[14px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] placeholder:text-[#999999] dark:placeholder:text-gray-500 transition-colors"
            />
          </div>

          <div className="mb-4">
            <input
              type="tel"
              placeholder={t('register.enterPhone')}
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] dark:border-gray-700 px-3 text-[14px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] placeholder:text-[#999999] dark:placeholder:text-gray-500 transition-colors"
            />
          </div>

          <div className="mb-6 relative flex items-center">
            <input
              type="text"
              placeholder={t('register.enterCode')}
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] dark:border-gray-700 pl-3 pr-[90px] text-[14px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] placeholder:text-[#999999] dark:placeholder:text-gray-500 transition-colors"
            />
            <button className="absolute right-3 text-[#FF8C42] text-[14px] font-medium bg-transparent active:opacity-70 transition-opacity">
              {t('register.getCode')}
            </button>
          </div>

          <div className="flex items-center gap-2 mb-8 cursor-pointer active:opacity-70 transition-opacity">
            <div className="w-[16px] h-[16px] rounded-full bg-[#FF8C42] flex items-center justify-center shrink-0">
              <Check className="w-[10px] h-[10px] text-white" strokeWidth={3} />
            </div>
            <span className="text-[12px] text-[#999999] dark:text-gray-400">
              {t('register.agreement')} <span className="text-[#FF8C42]">{t('register.termsOfService')}</span>{t('register.and')}<span className="text-[#FF8C42]">{t('register.privacyPolicy')}</span>
            </span>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full h-[48px] bg-[#FF8C42] rounded-[12px] text-white text-[16px] font-bold active:bg-[#F27E36] transition-colors flex items-center justify-center shadow-sm"
          >
            {t('register.registerBtn')}
          </button>
        </div>

        <div className="flex-1"></div>
      </div>

    </div>
  );
}
