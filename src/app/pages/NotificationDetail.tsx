import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const notifAvatars = [
  "https://images.unsplash.com/photo-1761933808230-9a2e78956daa?w=80",
  "https://images.unsplash.com/photo-1536548665027-b96d34a005ae?w=80",
  "https://images.unsplash.com/photo-1615464670798-6e92fafa2a89?w=80",
  "https://images.unsplash.com/photo-1608744882201-52a7f7f3dd60?w=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80",
];

const labelKeys: Record<string, string> = {
  likes: 'messages.receivedLikes',
  follows: 'messages.newFollowers',
  comments: 'messages.commentsAndAt',
};

export function NotificationDetail() {
  const navigate = useNavigate();
  const { type } = useParams();
  const { t, i18n } = useTranslation();

  const items = useMemo(() => {
    const bundle = i18n.getResourceBundle(i18n.language, 'translation');
    const mockNotifs = bundle?.mock?.notificationDetails?.[type || ''] || [];
    return mockNotifs.map((n: any, i: number) => ({
      ...n,
      avatar: notifAvatars[i % notifAvatars.length],
    }));
  }, [i18n.language, type]);

  const title = t(labelKeys[type || ''] || 'messages.title');

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#333] dark:text-gray-100 p-1 -ml-1 cursor-pointer active:opacity-70">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100 mr-8">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#FFF3E6] dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <p className="text-[14px] text-[#999] dark:text-gray-400">{t('messages.noMessagesTitle')}</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-[#F0F0F0] dark:border-gray-700 cursor-pointer active:opacity-80">
                <ImageWithFallback src={item.avatar} className="w-11 h-11 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-[#333] dark:text-gray-100 font-medium">{item.name}</div>
                  <div className="text-[12px] text-[#999] dark:text-gray-400 mt-0.5">{item.text}</div>
                </div>
                <span className="text-[11px] text-[#BBB] dark:text-gray-500 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
