import { ChevronLeft, MapPin, Heart, MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageTransition } from "../hooks/usePageTransition";
import { users, posts } from "../data/mockData";

export function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { handleBack } = usePageTransition();
  const userId = Number(id);
  const user = users[userId as keyof typeof users];

  if (!user) {
    return (
      <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 flex flex-col items-center justify-center gap-3">
        <p className="text-[14px] text-[#999] dark:text-gray-400">{t('common.userNotFound')}</p>
        <button onClick={() => navigate(-1)} className="text-[#FF8C42] text-[14px]">{t('common.back')}</button>
      </div>
    );
  }

  const userPosts = posts.filter(p => p.userId === userId).map(p => ({
    ...p,
    user: { name: user.name, avatar: user.avatar },
    created_at: p.time,
    is_liked: p.isLiked,
    like_count: p.likes,
    comment_count: p.comments,
    breedDisplay: p.breed,
    images: p.images,
    content: p.description,
    location: p.location,
  }));

  const likesReceived = userPosts.reduce((sum, p) => sum + (p.like_count || 0), 0);

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 z-10">
        <button onClick={() => handleBack(() => navigate(-1))} className="text-[#333] dark:text-gray-100 p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100 mr-8">{user.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col items-center pt-8 pb-6 px-4">
          <ImageWithFallback
            src={user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-md"
          />
          <h2 className="text-[20px] font-bold text-[#333] dark:text-gray-100 mt-4">{user.name}</h2>
          <p className="text-[14px] text-[#999] dark:text-gray-400 mt-1 text-center">{user.bio}</p>

          <div className="flex items-center gap-8 mt-6">
            <div className="flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{user.following}</span>
              <span className="text-[12px] text-[#999] dark:text-gray-400">{t('profile.following')}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{user.followers}</span>
              <span className="text-[12px] text-[#999] dark:text-gray-400">{t('profile.followers')}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{likesReceived}</span>
              <span className="text-[12px] text-[#999] dark:text-gray-400">{t('profile.likes')}</span>
            </div>
          </div>
        </div>

        <div className="px-4">
          <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">
            {t('profile.posts')} ({userPosts.length})
          </h3>

          {userPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFF3E6] dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <span className="text-2xl">🐾</span>
              </div>
              <p className="text-[14px] text-[#999] dark:text-gray-400">{t('home.noPostsYet')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm border border-gray-50 dark:border-gray-800 cursor-pointer active:opacity-80"
                >
                  {post.images && post.images[0] && (
                    <img src={typeof post.images[0] === 'string' ? post.images[0] : ''} className="w-full h-48 object-cover" />
                  )}
                  <div className="p-3">
                    <p className="text-[14px] text-[#333] dark:text-gray-100 leading-relaxed line-clamp-2">{post.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-[12px] text-[#999] dark:text-gray-400">
                        {post.location && <><MapPin className="w-3 h-3" />{post.location}</>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[12px] text-[#999] dark:text-gray-400">
                          <Heart className="w-3.5 h-3.5" />{post.like_count}
                        </span>
                        <span className="flex items-center gap-1 text-[12px] text-[#999] dark:text-gray-400">
                          <MessageCircle className="w-3.5 h-3.5" />{post.comment_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
