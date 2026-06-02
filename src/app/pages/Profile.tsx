import { Settings, QrCode, Share2, Scan } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { postsApi } from "../api/client";
import { isLoggedIn, login as doLogin } from "../api/auth";

const myUser = {
  id:1, name:"王丽丽", avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  bio:"金毛&布偶猫铲屎官 | 爱生活爱宠物", following:45, followers:1204, likes:1790,
};

const myPets = [
  { id:1, name:"贝利", avatar:"https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=120", type:"金毛" },
  { id:2, name:"咪咪", avatar:"https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=120", type:"布偶猫" },
];

export function Profile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [tab, setTab] = useState<'posts'|'liked'|'favs'|'drafts'>('posts');
  const [posts, setPosts] = useState<any[]>([]);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [showQR, setShowQR] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(myUser.bio);
  const [showAddPet, setShowAddPet] = useState(false);

  useEffect(() => {
    const h = () => setLoggedIn(isLoggedIn());
    window.addEventListener('pawgram:auth-change', h);
    return () => window.removeEventListener('pawgram:auth-change', h);
  }, []);

  useEffect(() => { if (loggedIn) postsApi.list(1).then(d => setPosts(d.list)).catch(() => {}); }, [loggedIn]);

  const handleShare = () => {
    const text = `爪印 PawGram — ${myUser.name}\n${myUser.bio}\n${t('profile.following')}/${t('profile.followers')} ${myUser.following}/${myUser.followers}\n来爪印看我和宠物的故事`;
    if (navigator.share) navigator.share({ title: myUser.name, text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  if (!loggedIn) return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col px-6">
      <div className="flex-1 flex flex-col items-center justify-center">
        <img src="/app-icon.png" className="w-20 h-20 rounded-2xl mb-5 shadow-lg" alt="爪印"/>
        <h1 className="text-[24px] font-bold text-[#333] dark:text-gray-100 mb-1">{t('common.brandName')}</h1>
        <p className="text-[13px] text-[#666] dark:text-gray-400">{t('profile.tagline')}</p>
      </div>
      <div className="pb-3">
        <div className="bg-[#F5F5F5] dark:bg-gray-800 rounded-xl h-12 flex items-center px-4 mb-3">
          <span className="text-[14px] text-[#999] dark:text-gray-400 mr-2">+86</span><div className="w-px h-5 bg-[#DDD] dark:bg-gray-600 mr-3"/>
          <input placeholder={t('profile.enterPhone')} className="flex-1 bg-transparent text-[15px] dark:text-gray-100 outline-none"/>
        </div>
        <button onClick={doLogin} className="w-full h-12 bg-[#FF8C42] text-white rounded-xl text-[16px] font-bold active:bg-[#E67A35]">{t('profile.login')}</button>
      </div>
      <div className="flex items-center gap-3 pb-4"><div className="flex-1 h-px bg-[#EEE] dark:bg-gray-700"/><span className="text-[12px] text-[#CCC] dark:text-gray-600">{t('profile.otherLogin')}</span><div className="flex-1 h-px bg-[#EEE] dark:bg-gray-700"/></div>
      <div className="flex justify-center gap-8 pb-10">
        <button onClick={doLogin} className="w-12 h-12 rounded-full bg-[#09BB07] flex items-center justify-center active:opacity-70 shadow-sm">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.045c.133 0 .241-.108.241-.245 0-.06-.024-.12-.04-.178l-.325-1.233a.49.49 0 0 1 .178-.554C23.028 18.48 24 16.82 24 14.98c0-3.21-2.931-5.952-7.062-6.122z"/></svg>
        </button>
        <button onClick={doLogin} className="w-12 h-12 rounded-full bg-black flex items-center justify-center active:opacity-70 shadow-sm">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
        </button>
        <button onClick={doLogin} className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border border-[#E5E5E5] dark:border-gray-600 flex items-center justify-center active:opacity-70 shadow-sm">
          <span className="text-[15px] font-bold text-[#4285F4]">G</span>
        </button>
      </div>
      <p className="text-center text-[11px] text-[#BBB] dark:text-gray-500 pb-8">{t('profile.loginAgreement')}<span className="text-[#FF8C42]">{t('common.termsOfService')}</span>和<span className="text-[#FF8C42]">{t('common.privacyPolicy')}</span></p>
      <BottomNav />
    </div>
  );

  const myPosts = posts.filter(p => p.user?.id === myUser.id);
  const likedPosts = posts.filter((_, i) => i % 3 === 0);
  const favPosts = posts.filter((_, i) => i % 4 === 0);

  return (
    <div className="h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col">
      {showQR && (
        <div className="fixed inset-0 z-[90] bg-black/60 flex items-center justify-center p-8" onClick={() => setShowQR(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center max-w-[280px]" onClick={e => e.stopPropagation()}>
            <div className="w-40 h-40 bg-[#F5F5F5] dark:bg-gray-800 rounded-xl mx-auto mb-3 flex items-center justify-center border-2 border-dashed border-[#DDD] dark:border-gray-600">
              <QrCode className="w-24 h-24 text-[#333] dark:text-gray-100"/>
            </div>
            <p className="text-[14px] font-bold text-[#333] dark:text-gray-100 mb-1">{t('profile.scanToFollow')}</p>
            <p className="text-[12px] text-[#999] dark:text-gray-400 mb-4">{t('profile.scanPrompt', { name: myUser.name })}</p>
            <button onClick={() => setShowQR(false)} className="w-full h-10 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg text-[14px] text-[#666] dark:text-gray-400">{t('common.close')}</button>
          </div>
        </div>
      )}

      {showAvatar && (
        <div className="fixed inset-0 z-[95] bg-black flex items-center justify-center" onClick={() => setShowAvatar(false)}>
          <img src={myUser.avatar} className="max-w-full max-h-full object-contain p-4"/>
        </div>
      )}

      {showAddPet && (
        <div className="fixed inset-0 z-[90] flex flex-col justify-end bg-black/40" onClick={() => setShowAddPet(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-t-[16px]" onClick={e => e.stopPropagation()}>
            <div className="text-center py-4 border-b border-[#F0F0F0] dark:border-gray-700">
              <div className="w-14 h-14 rounded-full bg-[#FFF3E6] dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-2">
                <span className="text-2xl">🐾</span>
              </div>
              <p className="text-[14px] font-bold text-[#333] dark:text-gray-100">{t('profile.addPet')}</p>
            </div>
            <button onClick={() => { setShowAddPet(false); navigate('/pet', { state: { new: true } }); }} className="w-full py-4 text-[15px] text-[#333] dark:text-gray-100 border-b border-[#F0F0F0] dark:border-gray-700 active:bg-[#F9F9F9] dark:active:bg-gray-800">{t('profile.createPetProfile')}</button>
            <button onClick={() => setShowAddPet(false)} className="w-full py-4 text-[15px] text-[#999] dark:text-gray-400 active:bg-[#F9F9F9] dark:active:bg-gray-800">{t('common.cancel')}</button>
          </div>
        </div>
      )}

      <div className="absolute top-0 w-full pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-1">
          <button onClick={() => setShowQR(true)} className="p-2"><QrCode className="w-5 h-5 text-[#666] dark:text-gray-400"/></button>
          <button onClick={() => navigate('/scan')} className="p-2"><Scan className="w-5 h-5 text-[#666] dark:text-gray-400"/></button>
          <button onClick={handleShare} className="p-2"><Share2 className="w-5 h-5 text-[#666] dark:text-gray-400"/></button>
        </div>
        <button onClick={() => navigate('/settings')} className="p-2 -mr-2"><Settings className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
      </div>

      <div className="flex-1 overflow-y-auto pt-[var(--app-header-height)] pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden">
        <div className="px-5 pt-2 pb-4">
          <div className="flex items-start gap-4 mb-4">
            <ImageWithFallback src={myUser.avatar} className="w-16 h-16 rounded-full object-cover shrink-0 shadow-sm" onClick={() => setShowAvatar(true)}/>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-bold text-[#333] dark:text-gray-100 mb-0.5">{myUser.name}</h2>
              {editingBio ? (
                <input autoFocus value={bio} onChange={e => setBio(e.target.value)} onBlur={() => setEditingBio(false)} className="text-[13px] text-[#666] dark:text-gray-400 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg px-2 py-1 outline-none w-full"/>
              ) : (
                <p className="text-[13px] text-[#666] dark:text-gray-400 leading-relaxed" onClick={() => setEditingBio(true)}>{bio || t('profile.addBio')}</p>
              )}
            </div>
          </div>

          <div className="flex justify-around mb-4">
            <div className="flex flex-col items-center" onClick={() => navigate('/follows')}>
              <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{myUser.following}</span><span className="text-[11px] text-[#999] dark:text-gray-400">{t('profile.following')}</span>
            </div>
            <div className="flex flex-col items-center" onClick={() => navigate('/follows')}>
              <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{myUser.followers}</span><span className="text-[11px] text-[#999] dark:text-gray-400">{t('profile.followers')}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{myUser.likes}</span><span className="text-[11px] text-[#999] dark:text-gray-400">{t('profile.likes')}</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="px-4 mb-3"><h3 className="text-[14px] font-bold text-[#333] dark:text-gray-100">{t('profile.myPets')}</h3></div>
          <div className="flex gap-4 px-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
            {myPets.map(p => (
              <div key={p.id} onClick={() => navigate('/pet', { state: { pet: p } })} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB380] p-[2px]">
                  <ImageWithFallback src={p.avatar} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900"/>
                </div><span className="text-[11px] text-[#666] dark:text-gray-400">{p.name}</span>
              </div>
            ))}
            <div onClick={() => navigate('/pet', { state: { new: true } })} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
              <div className="w-14 h-14 rounded-full border border-dashed border-[#DDD] dark:border-gray-600 flex items-center justify-center"><span className="text-xl text-[#CCC] dark:text-gray-600">+</span></div>
              <span className="text-[11px] text-[#CCC] dark:text-gray-600">{t('common.add')}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-t-2xl pt-4 min-h-[300px]">
          <div className="flex justify-around px-4 mb-3">
            {[{key:'posts',label:t('profile.posts')},{key:'liked',label:t('profile.liked')},{key:'favs',label:t('profile.favorites')},{key:'drafts',label:t('profile.drafts')}].map(tabItem => (
              <button key={tabItem.key} onClick={() => setTab(tabItem.key as any)} className={`text-[14px] font-bold relative pb-2 ${tab===tabItem.key?'text-[#333] dark:text-gray-100':'text-[#999] dark:text-gray-400'}`}>
                {tabItem.label}{tab===tabItem.key && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-[#FF8C42] rounded-full"/>}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-[2px]">
            {(tab==='posts'?myPosts:tab==='liked'?likedPosts:tab==='favs'?favPosts:[]).map(p => (
              <div key={p.id} className="aspect-square bg-[#F0F0F0] dark:bg-gray-800 relative" onClick={() => navigate(`/post/${p.id}`)}>
                <ImageWithFallback src={p.images?.[0]} className="w-full h-full object-cover"/>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                  <div className="flex items-center gap-3 text-white text-[10px]"><span>❤ {p.like_count}</span><span>💬 {p.comment_count}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
