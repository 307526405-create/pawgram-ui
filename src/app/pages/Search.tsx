import { ChevronLeft, Search as SearchIcon, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usePageTransition } from "../hooks/usePageTransition";
import { posts, users } from "../data/mockData";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const hotSearches = ["金毛", "柯基", "布偶猫", "新手养宠", "自制猫饭", "哈士奇", "泰迪"];

const recommendUsers = [
  { id:1, name:"大黄铲屎官", avatar:"https://images.unsplash.com/photo-1761933808230-9a2e78956daa?w=150", bio:"金毛&柯基铲屎官", followers:"2.3k" },
  { id:2, name:"橘猫日记", avatar:"https://images.unsplash.com/photo-1536548665027-b96d34a005ae?w=150", bio:"三只猫的日常", followers:"5.1k" },
  { id:3, name:"汪星人阿呆", avatar:"https://images.unsplash.com/photo-1615464670798-6e92fafa2a89?w=150", bio:"萨摩耶的快乐生活", followers:"8.7k" },
];

const mockTopics = [
  { id: 1, name: "新手养宠", postCount: 1204 },
  { id: 2, name: "狗狗日常", postCount: 856 },
  { id: 3, name: "宠物神仙颜值", postCount: 3420 },
  { id: 4, name: "自制猫饭", postCount: 521 },
  { id: 5, name: "金毛寻回犬", postCount: 204 },
];

const getMediaUrl = (item: any) => typeof item === 'string' ? item : item?.poster || item?.url || '';

export function Search() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { className, handleBack } = usePageTransition();
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState(["柯基", "狗粮推荐", "宠物洗澡"]);
  const [activeTab, setActiveTab] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const filteredUsers = query
    ? Object.values(users).filter(u => u.name.includes(query) || u.bio.includes(query))
    : [];

  const filteredPosts = query
    ? posts.filter(p => p.description.includes(query) || p.breed.includes(query) || p.location?.includes(query))
    : [];

  const filteredTopics = query
    ? mockTopics.filter(t => t.name.includes(query))
    : [];

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center pt-24 pb-10">
      <p className="text-[14px] text-[#999] dark:text-gray-400">{t('common.noResults')}</p>
    </div>
  );

  const tabs = [t('common.users'), t('common.posts'), t('common.topics')];

  return (
    <div className={`h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col ${className}`}>
      <div className="absolute top-0 w-full pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center pl-3 pr-4 z-40 bg-[#FAFAFA] dark:bg-gray-950 border-b border-transparent">
        <button onClick={() => handleBack(() => navigate(-1))} className="p-2 -ml-1 text-[#333] dark:text-gray-100 active:opacity-70 shrink-0">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-white dark:bg-gray-900 rounded-full h-[32px] flex items-center px-3 shadow-sm border border-[#EEEEEE] dark:border-gray-700">
          <SearchIcon className="w-4 h-4 text-[#999] dark:text-gray-400 mr-1.5 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.search') + '...'}
            className="w-full h-full bg-transparent border-none outline-none text-[14px] text-[#333] dark:text-gray-100 placeholder:text-[#999] dark:placeholder:text-gray-400"
          />
          {query && (
            <button onClick={() => setQuery("")} className="shrink-0 p-1 -mr-1 active:opacity-70">
              <X className="w-3.5 h-3.5 text-[#999] dark:text-gray-400" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-[var(--app-header-height)] pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {!query ? (
          <div className="px-5 pt-4">
            {history.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100">{t('common.searchHistory')}</h3>
                  <button onClick={() => setHistory([])} className="text-[12px] text-[#999] dark:text-gray-400 active:opacity-70">
                    {t('common.clear')}
  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {history.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(tag)}
                      className="bg-white dark:bg-gray-900 px-3.5 py-1.5 rounded-full text-[13px] text-[#666] dark:text-gray-400 border border-[#EEEEEE] dark:border-gray-700 shadow-sm active:scale-95 transition-transform"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('common.hotSearch')}</h3>
              <div className="flex flex-wrap gap-2.5">
                {hotSearches.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(tag)}
                    className="bg-white dark:bg-gray-900 px-3.5 py-1.5 rounded-full text-[13px] text-[#666] dark:text-gray-400 border border-[#EEEEEE] dark:border-gray-700 shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    {idx < 3 && <span className="text-[#FF8C42] font-bold text-[13px]">{idx + 1}</span>}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('common.recommendedFollows')}</h3>
              <div className="space-y-3">
                {recommendUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl p-3 border border-[#EEEEEE] dark:border-gray-700">
                    <ImageWithFallback src={u.avatar} onClick={() => navigate(`/user/${u.id}`)} className="w-11 h-11 rounded-full object-cover shrink-0 cursor-pointer active:opacity-70" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold text-[#333] dark:text-gray-100">{u.name}</div>
                      <div className="text-[11px] text-[#999] dark:text-gray-400">{t('common.followersCount', { count: u.followers })} · {u.bio}</div>
                    </div>
                    <button onClick={() => alert(t('common.featureInDev'))} className="shrink-0 bg-[#FF8C42] text-white px-4 py-1.5 rounded-full text-[12px] font-bold active:bg-[#E67A35]">{t('common.follow')}</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-3">{t('common.hotTopics')}</h3>
              <div className="flex flex-wrap gap-2">
                {mockTopics.map(topic => (
                  <button key={topic.id} onClick={() => setQuery(topic.name)}
                    className="px-3.5 py-1.5 bg-[#FFF3E6] dark:bg-orange-900/30 text-[#FF8C42] text-[13px] font-medium rounded-full active:opacity-70">
                    #{topic.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex px-4 border-b border-[#EEEEEE] dark:border-gray-700 shrink-0">
              {tabs.map((tab, idx) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 text-center py-3 text-[15px] font-medium relative ${activeTab === idx ? "text-[#333] dark:text-gray-100" : "text-[#999] dark:text-gray-400"}`}
                >
                  {tab}
                  {activeTab === idx && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[24px] h-[3px] bg-[#FF8C42] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 flex-1">
              {activeTab === 0 && (
                <div>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div key={user.id} onClick={() => navigate(`/user/${user.id}`)} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-[16px] mb-3 border border-[#EEEEEE] dark:border-gray-700 shadow-sm active:opacity-70 transition-opacity cursor-pointer">
                        <ImageWithFallback src={user.avatar} alt={user.name} className="w-[48px] h-[48px] rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[15px] font-bold text-[#333] dark:text-gray-100 truncate">{user.name}</h4>
                          <p className="text-[12px] text-[#999] dark:text-gray-400 mt-0.5 truncate">{t('common.followersCount', { count: user.followers })}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); alert(t('common.featureInDev')); }} className="shrink-0 bg-transparent border border-[#FF8C42] text-[#FF8C42] px-4 py-1.5 rounded-full text-[13px] font-bold active:opacity-70 transition-opacity">
                          {t('common.follow')}
                        </button>
                      </div>
                    ))
                  ) : renderEmptyState()}
                </div>
              )}

              {activeTab === 1 && (
                <div>
                  {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => {
                      const author = users[post.userId as keyof typeof users];
                      return (
                        <div key={post.id} className="flex gap-3 p-3 bg-white dark:bg-gray-900 rounded-[16px] mb-3 border border-[#EEEEEE] dark:border-gray-700 shadow-sm active:opacity-70 transition-opacity cursor-pointer" onClick={() => navigate(`/post/${post.id}`)}>
                          {post.images && post.images.length > 0 && (
                            <ImageWithFallback src={getMediaUrl(post.images[0])} alt="帖子" className="w-[84px] h-[84px] rounded-[12px] object-cover shrink-0 bg-[#FAFAFA] dark:bg-gray-800" />
                          )}
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                            <p className="text-[14px] text-[#333] dark:text-gray-100 font-medium line-clamp-2 leading-relaxed">
                              {post.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[12px] text-[#999] dark:text-gray-400 truncate flex-1">{author?.name || t('common.user')}</span>
                              <span className="text-[12px] text-[#999] dark:text-gray-400 shrink-0 ml-2">{post.likes} 赞 · {post.comments} 评论</span>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : renderEmptyState()}
                </div>
              )}

              {activeTab === 2 && (
                <div>
                  {filteredTopics.length > 0 ? (
                    filteredTopics.map(topic => (
                      <div key={topic.id} className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-[16px] mb-3 border border-[#EEEEEE] dark:border-gray-700 shadow-sm active:opacity-70 transition-opacity">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#FAFAFA] dark:bg-gray-800 flex items-center justify-center text-[#FF8C42] font-bold text-[16px]">
                            #
                          </div>
                          <span className="text-[15px] font-bold text-[#333] dark:text-gray-100">{topic.name}</span>
                        </div>
                        <span className="text-[12px] text-[#999] dark:text-gray-400">{t('common.postsCount', { count: topic.postCount })}</span>
                      </div>
                    ))
                  ) : renderEmptyState()}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
