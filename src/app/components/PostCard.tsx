import { Heart, MessageCircle, Share2, MapPin, Play } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function PostCard({ post, onLike, onShare, onFollow }: { post: any; onLike?: (e: any) => void; onShare?: (e: any) => void; onFollow?: (e: any) => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = post.user || { name: t('common.user'), avatar: '' };
  const followed = user.followed || false;
  const [showHeart, setShowHeart] = useState(false);
  const lastTap = useRef(0);

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 1) return t('time.justNow');
    if (mins < 60) return t('time.minAgo', { n: mins });
    if (hours < 24) return t('time.hoursAgo', { n: hours });
    return t('time.daysAgo', { n: Math.floor(hours / 24) });
  };

  const getMediaUrl = (item: any) => typeof item === 'string' ? item : item?.url || item?.poster || '';
  const isVideo = (item: any) => {
    if (typeof item === 'object' && item !== null) return item.type === 'video';
    if (typeof item === 'string') return item.match(/\.(mp4|mov|webm)/i) || item.includes('video');
    return false;
  };

  const handleDoubleTap = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      e.preventDefault(); e.stopPropagation();
      setShowHeart(true); setTimeout(() => setShowHeart(false), 800); onLike?.(e);
      lastTap.current = 0; return;
    }
    lastTap.current = now;
  }, [onLike]);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl mb-4 shadow-sm border border-gray-50 dark:border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-2">
          <ImageWithFallback src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-100 dark:border-gray-700"/>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</h3>
              {onFollow && (
                <button onClick={onFollow} className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${followed ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500' : 'bg-[#FFF3E6] dark:bg-orange-900/30 text-[#FF8C42]'}`}>
                  {followed ? t('common.followed') : t('common.follow')}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500">{timeAgo(post.created_at)}{post.user_id === 1 ? ` · ${(post.view_count||0)+(post.id*7+3)%100}${t('home.views')}` : ''}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs font-medium px-2 py-1 bg-orange-50 dark:bg-orange-900/20 text-[#FF8C42] rounded-md mb-1">{post.breed}</span>
          {post.location && (
            <a href={`http://maps.apple.com/?q=${encodeURIComponent(post.location)}`} onClick={e => e.stopPropagation()} className="flex items-center text-xs text-gray-400 dark:text-gray-500 active:text-[#FF8C42]">
              <MapPin className="w-3 h-3 mr-0.5" />{post.location}
            </a>
          )}
        </div>
      </div>

      <div onClick={(e) => { e.stopPropagation(); window.location.hash = `#/post/${post.id}`; }} className="block relative w-full aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden cursor-pointer">
        <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" onClick={handleDoubleTap}>
          {(post.images||[]).map((img: string, idx: number) => (
            <div key={idx} className="w-full h-full shrink-0 snap-center relative">
              <ImageWithFallback src={getMediaUrl(img)} className="w-full h-full object-cover"/>
              {isVideo(img) && (
                <div className="absolute bottom-2 left-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                  <Play className="w-3 h-3 text-white ml-0.5" />
                </div>
              )}
              {post.images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {post.images.map((_: string, di: number) => (
                    <div key={di} className={`w-1.5 h-1.5 rounded-full ${di===idx?'bg-white':'bg-white/40'}`}/>
                  ))}
                </div>
              )}
              {idx===0 && showHeart && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Heart className="w-20 h-20 text-white fill-white animate-ping opacity-80"/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between p-3 pb-2">
        <div className="flex items-center gap-4">
          <button onClick={onLike} className={`flex items-center gap-1.5 ${post.is_liked?'text-[#FF8C42]':'text-gray-600 dark:text-gray-400'}`}>
            <Heart className={`w-6 h-6 ${post.is_liked?'fill-current':''}`}/><span className="text-sm font-medium">{post.like_count}</span>
          </button>
          <div onClick={(e) => { e.stopPropagation(); window.location.hash = `#/post/${post.id}`; }} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 cursor-pointer">
            <MessageCircle className="w-6 h-6"/><span className="text-sm font-medium">{post.comment_count}</span>
          </div>
          <button onClick={onShare} className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400"><Share2 className="w-6 h-6"/></button>
        </div>
      </div>

      <div className="px-3 pb-4">
        <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed line-clamp-2">
          <span className="font-semibold mr-2">{user.name}</span>{post.content}
        </p>
      </div>
    </div>
  );
}

export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl mb-4 shadow-sm border border-gray-50 dark:border-gray-800 overflow-hidden animate-pulse">
      <div className="flex items-center gap-3 p-3"><div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"/><div className="flex-1"><div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-1"/><div className="h-2.5 w-16 bg-gray-100 dark:bg-gray-800 rounded"/></div><div className="h-4 w-12 bg-gray-100 dark:bg-gray-800 rounded"/></div>
      <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700"/>
      <div className="flex gap-6 p-3 pb-0"><div className="h-5 w-12 bg-gray-100 dark:bg-gray-800 rounded"/><div className="h-5 w-12 bg-gray-100 dark:bg-gray-800 rounded"/></div>
      <div className="p-3"><div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded mb-1"/><div className="h-3 w-1/2 bg-gray-100 dark:bg-gray-800 rounded"/></div>
    </div>
  );
}
