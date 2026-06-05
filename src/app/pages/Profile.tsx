import { Settings, QrCode, Share2, Scan, Heart, MessageCircle, Eye, Smartphone } from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { postsApi, authApi } from "../api/client";
import { isLoggedIn, login as doLogin } from "../api/auth";
import { useScrollRestore } from "../hooks/useScrollRestore";

const myUserBase = {
  id:1, avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
  following:45, followers:1204, likes:1790,
};

const myPetsBase = [
  { id:1, avatar:"https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=120" },
  { id:2, avatar:"https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=120" },
];

const getMediaUrl = (item: any) => typeof item === 'string' ? item : item?.poster || item?.url || '';

export function Profile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [tab, setTab] = useState<'posts'|'liked'|'favs'|'drafts'>('posts');

  const mockData = useMemo(() => {
    const bundle = i18n.getResourceBundle(i18n.language, 'translation');
    return bundle?.mock || {};
  }, [i18n.language]);

  const myUser = useMemo(() => ({
    ...myUserBase,
    name: mockData.myUser?.name || '',
    bio: mockData.myUser?.bio || '',
  }), [mockData]);

  const myPets = useMemo(() =>
    (mockData.myPetsProfile || []).map((p: any, i: number) => ({
      ...p,
      avatar: myPetsBase[i]?.avatar || '',
    })),
  [mockData]);
  const [posts, setPosts] = useState<any[]>([]);
  const [favPosts, setFavPosts] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [showQR, setShowQR] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [bio, setBio] = useState(myUser.bio);
  const { containerRef: scrollRef, onScroll } = useScrollRestore();
  const [showAddPet, setShowAddPet] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef<number | null>(null);
  const hasAutoLoggedIn = useRef(false);

  useEffect(() => {
    const h = () => setLoggedIn(isLoggedIn());
    window.addEventListener('pawgram:auth-change', h);
    return () => window.removeEventListener('pawgram:auth-change', h);
  }, []);

  useEffect(() => { if (loggedIn) { postsApi.list(1).then(d => setPosts(d.list)).catch(() => {}); fetch('http://192.168.3.52:3000/api/posts/user/1').then(r=>r.json()).then(d=>setProfileData(d.data.user)).catch(()=>{}); } }, [loggedIn]);

  useEffect(() => { if (tab === 'favs' && loggedIn) { postsApi.favorites(1).then(d => setFavPosts(d.list)).catch(() => {}); } }, [tab, loggedIn]);

  const handleWechatLogin = async () => {
    setLoggedIn(false); // will be set to true after auth
    try {
      const result = await authApi.wechatLogin('mock_code_wechat');
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      doLogin(); // trigger auth-change event
    } catch (err: any) {
      console.error('WeChat login failed:', err);
    }
  };

  const handleAppleLogin = async () => {
    setLoggedIn(false);
    try {
      const result = await authApi.appleLogin('mock_apple_token');
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      doLogin();
    } catch (err: any) {
      console.error('Apple login failed:', err);
    }
  };

  const handleGoogleLogin = async () => {
    setLoggedIn(false);
    try {
      const result = await authApi.googleLogin('mock_google_token');
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      doLogin();
    } catch (err: any) {
      console.error('Google login failed:', err);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) return;
    setLoginLoading(true);
    try {
      const result = await authApi.emailLogin(email, password);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      doLogin();
    } catch (err: any) {
      console.error('Email login failed:', err);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleShare = () => {
    const text = `${t('common.brandName')} — ${myUser.name}\n${myUser.bio}\n${t('profile.following')}/${t('profile.followers')} ${myUser.following}/${myUser.followers}\n${mockData.shareProfileSuffix || ''}`;
    if (navigator.share) navigator.share({ title: myUser.name, text }).catch(() => {});
    else navigator.clipboard?.writeText(text);
  };

  if (!loggedIn) {
    navigate('/login', { replace: true });
    return null;
  }

  const myPosts = posts.filter(p => p.user?.id === myUser.id);
  const likedPosts = posts.filter((_, i) => i % 3 === 0);

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
          <button onClick={() => setShowQR(true)} className="p-2 cursor-pointer active:opacity-70"><QrCode className="w-5 h-5 text-[#666] dark:text-gray-400"/></button>
          <button onClick={() => navigate('/scan')} className="p-2 cursor-pointer active:opacity-70"><Scan className="w-5 h-5 text-[#666] dark:text-gray-400"/></button>
          <button onClick={handleShare} className="p-2 cursor-pointer active:opacity-70"><Share2 className="w-5 h-5 text-[#666] dark:text-gray-400"/></button>
        </div>
        <button onClick={() => navigate('/settings')} className="p-2 -mr-2"><Settings className="w-5 h-5 text-[#333] dark:text-gray-100"/></button>
      </div>

      <div className="flex-1 overflow-y-auto pt-[var(--app-header-height)] pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden" ref={scrollRef} onScroll={onScroll}>
        <div className="px-5 pt-2 pb-4">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative shrink-0">
              <ImageWithFallback src={myUser.avatar} className="w-16 h-16 rounded-full object-cover shrink-0 shadow-sm cursor-pointer" onClick={() => setShowAvatar(true)}/>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-bold text-[#333] dark:text-gray-100 mb-0.5">{myUser.name}</h2>
              {editingBio ? (
                <input autoFocus value={bio} onChange={e => setBio(e.target.value)} onBlur={() => setEditingBio(false)} className="text-[13px] text-[#666] dark:text-gray-400 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg px-2 py-1 outline-none w-full"/>
              ) : (
                <p className="text-[13px] text-[#666] dark:text-gray-400 leading-relaxed cursor-pointer active:opacity-70" onClick={() => setEditingBio(true)}>{bio || t('profile.addBio')}</p>
              )}
              {profileData && (
                <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#FFF3E0] text-[#FF8C42]">📍 {profileData.city || '广州'}</span>
                  {(typeof profileData.behavior_tags === 'string' ? JSON.parse(profileData.behavior_tags) : profileData.behavior_tags || []).map((t: string) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-[#F0F0F0] dark:bg-gray-700 text-[#666] dark:text-gray-300">{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-around mb-4">
            <div className="flex flex-col items-center cursor-pointer active:opacity-70" onClick={() => navigate('/follows')}>
              <span className="text-[18px] font-bold text-[#333] dark:text-gray-100">{myUser.following}</span><span className="text-[11px] text-[#999] dark:text-gray-400">{t('profile.following')}</span>
            </div>
            <div className="flex flex-col items-center cursor-pointer active:opacity-70" onClick={() => navigate('/follows', { state: { tab: 'followers' } })}>
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
                <ImageWithFallback src={getMediaUrl(p.images?.[0])} className="w-full h-full object-cover"/>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                  <div className="flex items-center gap-3 text-white text-[10px]"><span><Heart className="w-3 h-3 inline mr-0.5" />{p.like_count}</span><span><MessageCircle className="w-3 h-3 inline mr-0.5" />{p.comment_count}</span><span><Eye className="w-3 h-3 inline mr-0.5" />{(p.view_count||0)+(p.id*7+3)%100}</span></div>
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
