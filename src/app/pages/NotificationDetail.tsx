import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { notificationsApi } from "../api/client";

const labellKeys: Record<string, string> = {
  likes: 'messages.receivedLikes',
  follows: 'messages.newFollowers',
  comments: 'messages.commentsAndAt',
  comment_like: 'messages.commentLikes',
};

const typeMap: Record<string, string> = {
  likes: 'likes',
  follows: 'follows',
  comments: 'comments',
  comment_like: 'likes',
};

function timeAgo(dateStr: string, t: any) {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (mins < 1) return t('time.justNow');
  if (mins < 60) return t('time.minAgo', { n: mins });
  if (hours < 24) return t('time.hoursAgo', { n: hours });
  return t('time.daysAgo', { n: Math.floor(hours / 24) });
}

export function NotificationDetail() {
  const navigate = useNavigate();
  const { type } = useParams();
  const { t } = useTranslation();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    notificationsApi.list(1).then((data: any[]) => {
      if (cancelled) return;
      const targetType = typeMap[type || ''] || type;
      const filtered = (data || []).filter((n: any) => n.type === targetType);
      setItems(filtered);
      setLoading(false);
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [type]);

  const handleClick = async (item: any) => {
    if (!item.is_read) {
      try { await notificationsApi.markRead(item.id); } catch {}
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, is_read: 1 } : i));
    }
    if (item.post_id) {
      navigate(`/post/${item.post_id}`);
    } else if (item.from_user_id) {
      navigate(`/user/${item.from_user_id}`);
    }
  };

  const title = t(labellKeys[type || ''] || 'messages.title');

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#333] dark:text-gray-100 p-1 -ml-1 cursor-pointer active:opacity-70">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100 mr-8">{title}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)]">
        {loading ? (
          <div className="p-4 space-y-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 animate-pulse">
                <div className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-[#FFF3E6] dark:bg-orange-900/30 flex items-center justify-center mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <p className="text-[14px] text-[#999] dark:text-gray-400">{t('messages.noMessagesTitle')}</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {items.map((item) => (
              <div key={item.id} onClick={() => handleClick(item)}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer active:opacity-80 ${item.is_read ? 'bg-white dark:bg-gray-900 border-[#F0F0F0] dark:border-gray-700' : 'bg-[#FFF8F0] dark:bg-orange-900/10 border-[#FFE0C0] dark:border-orange-800'}`}>
                <ImageWithFallback src={item.from_user_avatar || ''} className="w-11 h-11 rounded-full object-cover shrink-0 bg-gray-100 dark:bg-gray-700" />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] text-[#333] dark:text-gray-100 font-medium flex items-center gap-1.5">
                    {item.content || item.from_user_name}
                    {!item.is_read && <span className="w-2 h-2 rounded-full bg-[#FF8C42] shrink-0" />}
                  </div>
                  <div className="text-[12px] text-[#999] dark:text-gray-400 mt-0.5">{timeAgo(item.created_at, t)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
