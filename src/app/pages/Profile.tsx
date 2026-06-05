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
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [smsLoading, setSmsLoading] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout>();

  const handleSendCode = async () => {
    if (!phone || countdown > 0) return;
    setSmsLoading(true);
    try {
      await authApi.sendCode(phone);
      setCountdown(60);
      countdownRef.current = setInterval(() => {
        setCountdown(prev => { if (prev <= 1) { clearInterval(countdownRef.current); return 0; } return prev - 1; });
      }, 1000);
    } catch {}
    setSmsLoading(false);
  };

  const handlePhoneLogin = async () => {
    if (code.length !== 6) return;
    try {
      const result = await authApi.login(phone, code);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      doLogin();
    } catch {}
  };

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

  if (!loggedIn) return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col items-center justify-center px-8">
      <div className="flex flex-col items-center mb-10">
        <img src="/app-icon.png" className="w-[72px] h-[72px] rounded-2xl mb-4 shadow-lg shadow-[#FF8C42]/30" alt={t('common.brandName')}/>
        <h1 className="text-[22px] font-bold text-[#FF8C42] mb-1">{t('common.brandName')}</h1>
        <p className="text-[13px] text-[#999] dark:text-gray-400">{t('profile.tagline')}</p>
      </div>

      <div className="w-full max-w-[320px] space-y-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#333] dark:text-gray-100 font-medium border-r border-[#E5E5E5] dark:border-gray-700 pr-2">+86</span>
          <input type="tel" placeholder={t('profile.enterPhone')} value={phone} onChange={(e) => setPhone(e.target.value)}
            className="w-full h-[50px] rounded-[12px] border border-[#E5E5E5] dark:border-gray-700 pl-[52px] pr-3 text-[15px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] bg-white dark:bg-gray-900 placeholder:text-[#BBBBBB] dark:placeholder:text-gray-400 transition-colors" />
        </div>
        <div className="flex gap-2">
          <input type="tel" maxLength={6} pattern="[0-9]*" inputMode="numeric" placeholder="验证码" value={code}
            onChange={(e) => { const v = e.target.value.replace(/\\D/g, ''); setCode(v); if (v.length === 6) handlePhoneLogin(); }}
            className="flex-1 h-[50px] rounded-[12px] border border-[#E5E5E5] dark:border-gray-700 px-3 text-[15px] text-center tracking-[8px] font-bold text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] bg-white dark:bg-gray-900 placeholder:text-[#BBBBBB] dark:placeholder:text-gray-400 transition-colors" />
          <button onClick={handleSendCode} disabled={countdown > 0 || smsLoading || !phone}
            className="h-[50px] px-5 bg-[#FF8C42] rounded-[12px] text-white text-[14px] font-bold active:bg-[#F27E36] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
            {countdown > 0 ? `${countdown}s` : '获取验证码'}
          </button>
        </div>
      </div>

      <div className="mt-10 w-full max-w-[320px]">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-[0.5px] bg-[#E5E5E5] dark:bg-gray-700"/>
          <span className="text-[12px] text-[#BBB] dark:text-gray-400">{t('profile.otherLogin')}</span>
          <div className="flex-1 h-[0.5px] bg-[#E5E5E5] dark:bg-gray-700"/>
        </div>
        <div className="flex justify-center gap-8">
          <button onClick={handleWechatLogin} className="w-[48px] h-[48px] rounded-full bg-[#07C160] flex items-center justify-center active:scale-95 transition-transform shadow-sm">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white"><path d="M18.575 13.711a.91.91 0 0 0 .898-.898.895.895 0 0 0-.898-.898.894.894 0 0 0-.898.898c0 .5.4.898.898.898m-4.425 0a.91.91 0 0 0 .898-.898c0-.498-.4-.898-.898-.898a.894.894 0 0 0-.898.898c0 .5.399.898.898.898m6.567 5.04a.35.35 0 0 0-.172.37c0 .048 0 .098.025.147.098.417.294 1.081.294 1.106 0 .073.025.122.025.172a.22.22 0 0 1-.221.22c-.05 0-.074-.024-.123-.048l-1.449-.836a.8.8 0 0 0-.344-.098c-.073 0-.147 0-.196.024-.688.197-1.4.295-2.161.295-3.66 0-6.607-2.457-6.607-5.505s2.947-5.505 6.607-5.505c3.659 0 6.606 2.458 6.606 5.505 0 1.647-.884 3.146-2.284 4.154M16.674 8.099a9 9 0 0 0-.28-.005c-4.174 0-7.606 2.86-7.606 6.505 0 .554.08 1.09.228 1.6h-.089a10 10 0 0 1-2.584-.368c-.074-.025-.148-.025-.222-.025a.83.83 0 0 0-.419.123l-1.747 1.005a.35.35 0 0 1-.148.05.273.273 0 0 1-.27-.27c0-.074.024-.123.049-.197.024-.024.246-.834.369-1.324 0-.05.024-.123.024-.172a.56.56 0 0 0-.221-.441C2.059 13.376 1 11.586 1 9.599 1.001 5.944 4.571 3 8.951 3c3.765 0 6.93 2.169 7.723 5.098m-5.154.418c.573 0 1.026-.477 1.026-1.026s-.453-1.026-1.026-1.026-1.026.453-1.026 1.026.453 1.026 1.026 1.026m-5.26 0c.573 0 1.027-.477 1.027-1.026s-.454-1.026-1.027-1.026c-.572 0-1.026.453-1.026 1.026s.454 1.026 1.026 1.026"/></svg>
          </button>
          <button onClick={handleAppleLogin} className="w-[48px] h-[48px] rounded-full bg-black flex items-center justify-center active:scale-95 transition-transform shadow-sm">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
          </button>
          <button onClick={handleGoogleLogin} className="w-[48px] h-[48px] rounded-full bg-white dark:bg-gray-800 border-2 border-[#E5E5E5] dark:border-gray-600 flex items-center justify-center active:scale-95 transition-transform shadow-sm">
            <span className="text-[18px] font-bold text-[#4285F4]">G</span>
          </button>
        </div>
      </div>

      <p className="mt-12 text-center text-[11px] text-[#BBB] dark:text-gray-400">{t('profile.loginAgreement')}<span className="text-[#FF8C42]">{t('common.termsOfService')}</span>{t('common.and')}<span className="text-[#FF8C42]">{t('common.privacyPolicy')}</span></p>
      <BottomNav />
    </div>
  );

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
