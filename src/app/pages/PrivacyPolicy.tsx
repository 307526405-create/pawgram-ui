import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usePageTransition } from "../hooks/usePageTransition";

export function PrivacyPolicy() {
  const navigate = useNavigate();
  const { className, handleBack } = usePageTransition();
  const { t } = useTranslation();

  return (
    <div className={`h-full bg-white dark:bg-gray-900 flex flex-col ${className}`}>
      <div className="flex items-center px-4 pt-[var(--app-safe-top)] h-[var(--app-header-height)] shrink-0 border-b border-[#F0F0F0] dark:border-gray-700">
        <button onClick={() => handleBack(() => navigate(-1))} className="p-1 -ml-1">
          <ChevronLeft className="w-6 h-6 text-[#333] dark:text-gray-100" />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100 mr-6">{t('privacy.title')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 [&::-webkit-scrollbar]:hidden">
        <p className="text-[12px] text-[#999] dark:text-gray-400 mb-6">{t('privacy.updateDate')}</p>

        <Section title={t('privacy.infoCollection')}>
          <p>{t('privacy.infoCollectionText')}</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>{t('privacy.infoCollectionItem1')}</li>
            <li>{t('privacy.infoCollectionItem2')}</li>
            <li>{t('privacy.infoCollectionItem3')}</li>
            <li>{t('privacy.infoCollectionItem4')}</li>
            <li>{t('privacy.infoCollectionItem5')}</li>
          </ul>
        </Section>

        <Section title={t('privacy.infoUse')}>
          <p>{t('privacy.infoUseText')}</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>{t('privacy.infoUseItem1')}</li>
            <li>{t('privacy.infoUseItem2')}</li>
            <li>{t('privacy.infoUseItem3')}</li>
            <li>{t('privacy.infoUseItem4')}</li>
            <li>{t('privacy.infoUseItem5')}</li>
          </ul>
          <p className="mt-2">{t('privacy.infoUseNoSell')}</p>
        </Section>

        <Section title={t('privacy.infoStorage')}>
          <p>{t('privacy.infoStorageText')}</p>
        </Section>

        <Section title={t('privacy.contactUs')}>
          <p>{t('privacy.contactUsText')}</p>
          <p className="mt-2">{t('privacy.contactEmail')}</p>
          <p className="mt-2 text-[#999] dark:text-gray-400 text-[11px]">{t('privacy.contactDisclaimer')}</p>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-[16px] font-bold text-[#333] dark:text-gray-100 mb-3">{title}</h2>
      <div className="text-[14px] text-[#666] dark:text-gray-300 leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
