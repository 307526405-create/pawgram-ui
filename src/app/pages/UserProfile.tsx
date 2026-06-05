import { useState, useRef, useEffect } from "react";
import { ChevronLeft, MapPin, Heart, MessageCircle, Plus, UserPlus, Send, Bookmark } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { usePageTransition } from "../hooks/usePageTransition";
import { useSwipeBack } from "../hooks/useSwipeBack";
import { users, posts } from "../data/mockData";
import { usersApi, postsApi } from "../api/client";

export function UserProfile({ userId: propId, onBack }: { userId?: number; onBack?: () => void } = {}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { handleBack } = usePageTransition();
  const userId = propId ?? Number(id);
  const user = users[userId as keyof typeof users];
  const swipeRef = useRef<HTMLDivElement>(null);
  useSwipeBack(swipeRef, onBack);
  const isOwnProfile = userId === 1;
  const [isFollowing, setIsFollowing] = useState(false);
  const [tab, setTab] = useState<'posts'|'favs'>('posts');
  const [favPosts, setFavPosts] = useState<any[]>([]);
  const [userPrivacy, setUserPrivacy] = useState<{ hide_favorites: number; hide_likes: number } | null>(null);
  const goBack = () => onBack ? onBack() : handleBack(() => navigate(-1));

  useEffect(() => {
    if (!isOwnProfile) {
      usersApi.get(userId).then(d => setUserPrivacy(d.user)).catch(() => {});
      postsApi.favorites(userId).then(d => setFavPosts(d.list || [])).catch(() => {});
    }
  }, [userId, isOwnProfile]);

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
  const pets = (user as any).pets || [];

  return (
    <div ref={swipeRef} className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 z-10">
        <button onClick={goBack} className="text-[#333] dark:text-gray-100 p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100 mr-8">{user.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden">
        {/* Big avatar + name + bio */}
        <div className="flex flex-col items-center pt-8 pb-4 px-4">
          <div className="relative">
            <ImageWithFallback
              src={user.avatar}
              alt={user.name}
              className="w-28 h-28 rounded-full object-cover border-[3px] border-white dark:border-gray-700 shadow-lg"
            />
          </div>
          <h2 className="text-[22px] font-bold text-[#333] dark:text-gray-100 mt-4">{user.name}</h2>
          <p className="text-[13px] text-[#999] dark:text-gray-400 mt-1.5 text-center px-6">{user.bio}</p>
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-10 py-3 border-y border-[#F0F0F0] dark:border-gray-800">
          <div className="flex flex-col items-center cursor-pointer active:opacity-70" onClick={() => navigate('/follows', { state: { tab: 'following' } })}>
            <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{user.following}</span>
            <span className="text-[11px] text-[#999] dark:text-gray-400 mt-0.5">{t('profile.following')}</span>
          </div>
          <div className="flex flex-col items-center cursor-pointer active:opacity-70" onClick={() => navigate('/follows', { state: { tab: 'followers' } })}>
            <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{user.followers}</span>
            <span className="text-[11px] text-[#999] dark:text-gray-400 mt-0.5">{t('profile.followers')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{likesReceived}</span>
            <span className="text-[11px] text-[#999] dark:text-gray-400 mt-0.5">{t('profile.likes')}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 py-3 flex gap-3">
          {isOwnProfile ? (
            <button onClick={() => navigate('/profile')} className="flex-1 h-10 rounded-xl bg-[#F0F0F0] dark:bg-gray-800 text-[14px] font-bold text-[#333] dark:text-gray-100 active:bg-[#E5E5E5]">
              {t('profile.editProfile')}
            </button>
          ) : (
            <>
              <button
                onClick={async () => {
                  const wasFollowing = isFollowing;
                  setIsFollowing(!wasFollowing);
                  try {
                    if (wasFollowing) await usersApi.unfollow(userId);
                    else await usersApi.follow(userId);
                  } catch {
                    setIsFollowing(wasFollowing);
                  }
                }}
                className={`flex-1 h-10 rounded-xl text-[14px] font-bold active:opacity-80 flex items-center justify-center gap-1.5 ${isFollowing ? 'bg-[#F0F0F0] dark:bg-gray-800 text-[#666] dark:text-gray-400' : 'bg-[#FF8C42] text-white'}`}
              >
                <UserPlus className="w-4 h-4" />
                {isFollowing ? t('common.followed') : t('common.follow')}
              </button>
              <button
                onClick={() => navigate(`/chat/${userId}`)}
                className="flex-1 h-10 rounded-xl border border-[#DDD] dark:border-gray-600 text-[14px] font-bold text-[#333] dark:text-gray-100 active:bg-[#F5F5F5] dark:active:bg-gray-800 flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                {t('profile.message')}
              </button>
            </>
          )}
        </div>

        {/* Pets horizontal scroll bar */}
        {pets.length > 0 && (
          <div className="py-4">
            <div className="flex gap-4 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {pets.map((pet: any, i: number) => (
                <div key={i} className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-[68px] h-[68px] rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB380] p-[2.5px]">
                    <img
                      src={pet.avatar}
                      alt={pet.name}
                      className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"
                    />
                  </div>
                  <span className="text-[12px] font-bold text-[#333] dark:text-gray-100">{pet.name}</span>
                  <span className="text-[10px] text-[#999] dark:text-gray-400 -mt-1.5">{pet.breed}</span>
                </div>
              ))}
              {isOwnProfile && (
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="w-[68px] h-[68px] rounded-full border-2 border-dashed border-[#DDD] dark:border-gray-600 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#CCC] dark:text-gray-400" />
                  </div>
                  <span className="text-[12px] text-[#999] dark:text-gray-400">{t('profile.addPet')}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab bar */}
        <div className="flex justify-around px-4 py-3 border-t border-[#F0F0F0] dark:border-gray-800">
          {[
            {key:'posts' as const, label:t('profile.posts')},
            {key:'favs' as const, label:t('profile.favorites')},
          ].map(tabItem => (
            <button key={tabItem.key} onClick={() => setTab(tabItem.key)} className={`text-[14px] font-bold relative pb-2 ${tab===tabItem.key?'text-[#333] dark:text-gray-100':'text-[#999] dark:text-gray-400'}`}>
              {tabItem.label}{tab===tabItem.key && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#FF8C42] rounded-full"/>}
            </button>
          ))}
        </div>

        {/* Posts tab */}
        {tab === 'posts' && (
        <div className="px-2">
          <h3 className="px-2 text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">
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
            <div className="grid grid-cols-3 gap-1">
              {userPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="relative cursor-pointer active:opacity-80"
                  style={{ aspectRatio: '1/1' }}
                >
                  {post.images && post.images[0] ? (
                    <img
                      src={typeof post.images[0] === 'string' ? post.images[0] : ''}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#F0F0F0] dark:bg-gray-800 flex items-center justify-center">
                      <span className="text-[#CCC] dark:text-gray-600 text-xl">🐾</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-[10px] text-white">
                        <Heart className="w-3 h-3 fill-white" />{post.like_count}
                      </span>
                      <span className="flex items-center gap-0.5 text-[10px] text-white">
                        <MessageCircle className="w-3 h-3" />{post.comment_count}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* Favorites tab */}
        {tab === 'favs' && (
        <div className="px-2">
          {userPrivacy?.hide_favorites === 1 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F5F5F5] dark:bg-gray-800 flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8 text-[#CCC] dark:text-gray-600" />
              </div>
              <p className="text-[14px] text-[#999] dark:text-gray-400">{t('profile.privacySet')}</p>
            </div>
          ) : favPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFF3E6] dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <Bookmark className="w-6 h-6 text-[#FF8C42]" />
              </div>
              <p className="text-[14px] text-[#999] dark:text-gray-400">{t('common.noData')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {favPosts.map((p: any) => (
                <div key={p.id} className="aspect-square bg-[#F0F0F0] dark:bg-gray-800 relative" onClick={() => navigate(`/post/${p.id}`)}>
                  <ImageWithFallback src={typeof p.images?.[0] === 'string' ? p.images[0] : (p.images?.[0]?.poster || p.images?.[0]?.url || '')} className="w-full h-full object-cover"/>
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}
