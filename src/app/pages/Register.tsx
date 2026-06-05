import { ChevronLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usePageTransition } from "../hooks/usePageTransition";
import { authApi } from "../api/client";
import i18n from "../i18n";

export function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { className, handleBack } = usePageTransition();
  const splashImg = i18n.language === 'en' ? '/splash-en.png' : '/splash-zh.png';

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleSendCode = async () => {
    setError('');
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError(t('login.invalidPhone') || '请输入正确的手机号');
      return;
    }
    if (countdown > 0) return;
    setLoading(true);
    try {
      await authApi.sendCode(phone);
      setCountdown(60);
      timerRef.current = setInterval(() => {
        setCountdown(prev => { if (prev <= 1) { clearInterval(timerRef.current); return 0; } return prev - 1; });
      }, 1000);
    } catch (err: any) {
      setError(err.message || '发送失败，请稍后再试');
    }
    setLoading(false);
  };

  const handleCodeChange = (v: string) => {
    const clean = v.replace(/\D/g, '');
    setCode(clean);
    setError('');
  };

  const handleRegister = async () => {
    if (!phone || !password) return;
    if (!code || code.length < 6) return;
    setError('');
    setLoading(true);
    try {
      const result = await authApi.login(phone, code);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/welcome');
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  // Third-party login handlers
  const handleWechatLogin = async () => {
    try {
      const result = await authApi.wechatLogin('mock_code_wechat');
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/', { replace: true });
    } catch {}
  };

  const handleAppleLogin = async () => {
    try {
      const result = await authApi.appleLogin('mock_apple_token');
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/', { replace: true });
    } catch {}
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await authApi.googleLogin('mock_google_token');
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/', { replace: true });
    } catch {}
  };

  const [email, setEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  const handleEmailLogin = async () => {
    if (!email || !emailPassword) return;
    setLoading(true);
    try {
      const result = await authApi.emailLogin(email, emailPassword);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/', { replace: true });
    } catch (err: any) {
      setError(err.message || '邮箱登录失败');
    }
    setLoading(false);
  };

  return (
    <div className={`h-full relative flex flex-col ${className}`}>
      <img src={splashImg} className="absolute inset-0 w-full h-full object-cover" alt="" />
      <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 relative z-10">
        <button onClick={() => handleBack(() => navigate(-1))} className="text-[#333333] dark:text-gray-100 active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8">
        <div className="flex flex-col items-center mb-8">
          <img src="/app-icon.png" className="w-[72px] h-[72px] rounded-2xl mb-4 shadow-lg shadow-[#FF8C42]/30" alt={t('common.brandName')}/>
          <h2 className="text-[22px] font-bold text-[#FF8C42] mb-1">{t('register.title') || 'Create Account'}</h2>
          <p className="text-[13px] text-[#999] dark:text-gray-400">{t('login.tagline')}</p>
        </div>

        <div className="w-full max-w-[320px] space-y-4">
          {/* Phone */}
          <div className="bg-[#F5F5F5] dark:bg-gray-800 rounded-xl h-[50px] flex items-center px-4">
            <span className="text-[14px] text-[#999] dark:text-gray-400 mr-2">+86</span>
            <div className="w-px h-5 bg-[#DDD] dark:bg-gray-600 mr-3"/>
            <input type="tel" placeholder={t('login.enterPhone')} value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              className="flex-1 bg-transparent text-[15px] dark:text-gray-100 outline-none" />
          </div>

          {/* Code + Send button */}
          <div className="flex gap-2">
            <input type="tel" maxLength={6} pattern="[0-9]*" inputMode="numeric" placeholder={t('register.enterCode') || t('login.enterCode')} value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              className="flex-1 bg-[#F5F5F5] dark:bg-gray-800 rounded-xl h-[50px] px-4 text-[15px] dark:text-gray-100 outline-none" />
            <button onClick={handleSendCode} disabled={countdown > 0 || loading || !phone}
              className="min-w-[100px] h-[50px] bg-[#FF8C42] rounded-full text-white text-[14px] font-medium active:bg-[#E67A35] transition-colors disabled:opacity-50">
              {countdown > 0 ? `${countdown}s` : (t('login.getCode') || '获取验证码')}
            </button>
          </div>

          {/* Password */}
          <div className="bg-[#F5F5F5] dark:bg-gray-800 rounded-xl h-[50px] flex items-center px-4">
            <input type="password" placeholder={t('register.password') || '设置密码'} value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="flex-1 bg-transparent text-[15px] dark:text-gray-100 outline-none" />
          </div>

          {error && <p className="text-[12px] text-red-500 text-center">{error}</p>}

          {/* Register button */}
          <button
            onClick={handleRegister}
            disabled={loading || !phone || !code || code.length < 6 || !password}
            className="w-full h-[50px] bg-[#FF8C42] rounded-full text-white text-[16px] font-bold active:bg-[#E67A35] transition-colors disabled:opacity-50">
            {loading ? (t('common.loading')) : (t('register.registerBtn') || 'Create Account')}
          </button>
        </div>

        {/* Agreement checkbox */}
        <div className="mt-6 flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity">
          <div className="w-[16px] h-[16px] rounded-full bg-[#FF8C42] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-[10px] h-[10px] text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-[12px] text-[#999] dark:text-gray-400">
            {t('register.agreement')} <span className="text-[#FF8C42]">{t('register.termsOfService')}</span>{t('register.and')}<span className="text-[#FF8C42]">{t('register.privacyPolicy')}</span>
          </span>
        </div>

        {/* Third-party login divider */}
        <div className="mt-10 w-full max-w-[320px]">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-[0.5px] bg-[#E5E5E5] dark:bg-gray-700"/>
            <span className="text-[12px] text-[#BBB] dark:text-gray-400">{t('login.otherLogin')}</span>
            <div className="flex-1 h-[0.5px] bg-[#E5E5E5] dark:bg-gray-700"/>
          </div>
          <div className="flex justify-center gap-8">
            <button onClick={handleWechatLogin} className="w-[48px] h-[48px] rounded-full bg-[#07C160] flex items-center justify-center active:scale-95 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white"><path d="M18.575 13.711a.91.91 0 0 0 .898-.898.895.895 0 0 0-.898-.898.894.894 0 0 0-.898.898c0 .5.4.898.898.898m-4.425 0a.91.91 0 0 0 .898-.898c0-.498-.4-.898-.898-.898a.894.894 0 0 0-.898.898c0 .5.399.898.898.898m6.567 5.04a.35.35 0 0 0-.172.37c0 .048 0 .098.025.147.098.417.294 1.081.294 1.106 0 .073.025.122.025.172a.22.22 0 0 1-.221.22c-.05 0-.074-.024-.123-.048l-1.449-.836a.8.8 0 0 0-.344-.098c-.073 0-.147 0-.196.024-.688.197-1.4.295-2.161.295-3.66 0-6.607-2.457-6.607-5.505s2.947-5.505 6.607-5.505c3.659 0 6.606 2.458 6.606 5.505 0 1.647-.884 3.146-2.284 4.154M16.674 8.099a9 9 0 0 0-.28-.005c-4.174 0-7.606 2.86-7.606 6.505 0 .554.08 1.09.228 1.6h-.089a10 10 0 0 1-2.584-.368c-.074-.025-.148-.025-.222-.025a.83.83 0 0 0-.419.123l-1.747 1.005a.35.35 0 0 1-.148.05.273.273 0 0 1-.27-.27c0-.074.024-.123.049-.197.024-.024.246-.834.369-1.324 0-.05.024-.123.024-.172a.56.56 0 0 0-.221-.441C2.059 13.376 1 11.586 1 9.599 1.001 5.944 4.571 3 8.951 3c3.765 0 6.93 2.169 7.723 5.098m-5.154.418c.573 0 1.026-.477 1.026-1.026s-.453-1.026-1.026-1.026-1.026.453-1.026 1.026.453 1.026 1.026 1.026m-5.26 0c.573 0 1.027-.477 1.027-1.026s-.454-1.026-1.027-1.026c-.572 0-1.026.453-1.026 1.026s.454 1.026 1.026 1.026"/></svg>
            </button>
            <button onClick={handleAppleLogin} className="w-[48px] h-[48px] rounded-full bg-black flex items-center justify-center active:scale-95 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            </button>
            <button onClick={handleGoogleLogin} className="w-[48px] h-[48px] rounded-full border-2 border-[#E5E5E5] dark:border-gray-600 flex items-center justify-center active:scale-95 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </button>
          </div>
        </div>

        {/* Email login */}
        <div className="mt-6 w-full max-w-[320px]">
          <div className="flex gap-2">
            <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="flex-1 bg-[#F5F5F5] dark:bg-gray-800 rounded-xl h-[44px] px-3 text-[14px] dark:text-gray-100 outline-none" />
            <input type="password" placeholder="Password" value={emailPassword} onChange={(e) => { setEmailPassword(e.target.value); setError(''); }}
              className="flex-1 bg-[#F5F5F5] dark:bg-gray-800 rounded-xl h-[44px] px-3 text-[14px] dark:text-gray-100 outline-none" />
            <button onClick={handleEmailLogin} disabled={loading || !email || !emailPassword}
              className="h-[44px] px-4 bg-[#FF8C42] rounded-xl text-white text-[13px] font-bold active:bg-[#E67A35] transition-colors disabled:opacity-50 shrink-0">Sign in</button>
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-[#BBB] dark:text-gray-500">
          {t('profile.loginAgreement')}<span className="text-[#FF8C42]">{t('common.termsOfService')}</span>{t('common.and')}<span className="text-[#FF8C42]">{t('common.privacyPolicy')}</span>
        </p>
      </div>
    </div>
  );
}
