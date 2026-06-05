import { useState, useRef, useEffect } from "react";
import { ChevronLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usePageTransition } from "../hooks/usePageTransition";
import { authApi } from "../api/client";
import i18n from "../i18n";

export function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { className, handleBack } = usePageTransition();
  const splashImg = i18n.language === 'en' ? '/splash-en.png' : '/splash-zh.png';

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);
  const hasAutoLoggedIn = useRef(false);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = window.setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [countdown > 0]);

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
    } catch (err: any) {
      setError(err.message || '发送失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (verificationCode?: string) => {
    const codeToUse = verificationCode ?? code;
    if (!phone) return;
    if (!codeToUse || codeToUse.length < 6) return;
    setError('');
    setLoading(true);
    try {
      const result = await authApi.login(phone, codeToUse);
      // Save token
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await authApi.appleLogin("mock_apple_token");
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Apple登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await authApi.googleLogin("mock_google_token");
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Google登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleWechatLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Generate a mock WeChat OAuth code for development
      // In production, this code comes from WeChat OAuth redirect
      const mockCode = 'mock_code_wechat';
      
      // Open WeChat OAuth page in production
      // For now, simulate the flow directly
      const result = await authApi.wechatLogin(mockCode);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/');
    } catch (err: any) {
      setError(err.message || '微信登录失败');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) return;
    setError('');
    setLoading(true);
    try {
      const result = await authApi.emailLogin(email, password);
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      navigate('/');
    } catch (err: any) {
      setError(err.message || '邮箱登录失败');
    } finally {
      setLoading(false);
    }
  };

  // Auto login when code reaches 6 digits
  useEffect(() => {
    if (code.length === 6 && !hasAutoLoggedIn.current) {
      hasAutoLoggedIn.current = true;
      handleLogin(code);
    }
    if (code.length < 6) {
      hasAutoLoggedIn.current = false;
    }
  }, [code]);

  return (
    <div className={`h-full relative flex flex-col ${className}`}>
      <img src={splashImg} className="absolute inset-0 w-full h-full object-cover" alt="" />
      <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => handleBack(() => navigate(-1))} className="text-[#333333] dark:text-gray-100 active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center px-8 pt-6 pb-4">

        <div className="flex flex-col items-center mb-10">
          <div className="w-[72px] h-[72px] rounded-2xl bg-[#FF8C42] flex items-center justify-center mb-4 shadow-lg shadow-[#FF8C42]/30">
            <span className="text-[36px]">🐾</span>
          </div>
          <h2 className="text-[22px] font-bold text-[#FF8C42]">{t('login.brandName')}</h2>
          <p className="text-[13px] text-[#999999] dark:text-gray-400 mt-1">{t('login.tagline')}</p>
        </div>

        <div className="w-full max-w-[320px] space-y-4">
          {/* Phone input */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-[#333] dark:text-gray-100 font-medium border-r border-[#E5E5E5] dark:border-gray-700 pr-2">+86</span>
            <input
              type="tel"
              placeholder={t('login.enterPhone')}
              value={phone}
              onChange={(e) => { setPhone(e.target.value); setError(''); }}
              className="w-full h-[50px] rounded-[12px] border border-[#E5E5E5] dark:border-gray-700 pl-[52px] pr-3 text-[15px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] bg-white dark:bg-gray-900 placeholder:text-[#BBBBBB] dark:placeholder:text-gray-400 transition-colors"
            />
          </div>

          {/* Verification code input */}
          <div className="relative">
            <input
              type="tel"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              placeholder={t('login.enterCode')}
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
              className="w-full h-[50px] rounded-[12px] border border-[#E5E5E5] dark:border-gray-700 pl-3 pr-[100px] text-[15px] text-[#333333] dark:text-gray-100 outline-none focus:border-[#FF8C42] bg-white dark:bg-gray-900 placeholder:text-[#BBBBBB] dark:placeholder:text-gray-400 transition-colors"
            />
            <button
              onClick={handleSendCode}
              disabled={countdown > 0 || loading}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-[14px] font-medium bg-transparent cursor-pointer active:opacity-70 transition-opacity ${
                countdown > 0 ? 'text-[#BBBBBB] dark:text-gray-500' : 'text-[#FF8C42]'
              }`}
            >
              {countdown > 0 ? `${t('login.resend') || '重新发送'}(${countdown}s)` : t('login.getCode')}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-[12px] text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={() => handleLogin()}
            disabled={loading || !phone || !code || code.length < 6}
            className="w-full h-[50px] bg-[#FF8C42] rounded-[12px] text-white text-[16px] font-bold active:bg-[#F27E36] transition-colors flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (t('common.loading')) : t('login.title')}
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-4 w-full max-w-[320px] mb-6">
            <div className="flex-1 h-[0.5px] bg-[#E5E5E5] dark:bg-gray-700"></div>
            <span className="text-[12px] text-[#BBBBBB] dark:text-gray-400">{t('login.otherLogin')}</span>
            <div className="flex-1 h-[0.5px] bg-[#E5E5E5] dark:bg-gray-700"></div>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={handleWechatLogin} className="w-[48px] h-[48px] rounded-full bg-[#07C160] flex items-center justify-center active:scale-95 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white"><path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.004.142.04.198a.226.226 0 0 0 .321.045l2.126-1.364a.74.74 0 0 1 .497-.129 10.8 10.8 0 0 0 2.882.413c4.8 0 8.691-3.288 8.691-7.342 0-4.054-3.891-7.342-8.69-7.342zm-2.95 5.557a1.21 1.21 0 1 1 0 2.42 1.21 1.21 0 0 1 0-2.42zm5.897 0a1.21 1.21 0 1 1 0 2.42 1.21 1.21 0 0 1 0-2.42z"/></svg>
            </button>
            <button onClick={handleAppleLogin} className="w-[48px] h-[48px] rounded-full bg-black flex items-center justify-center active:scale-95 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="white"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.38 15.98 2.85 9.75 7.88 9.5c1.24.06 2.12.7 2.92.72.8.02 2.06-.86 3.6-.72 1.24.12 2.18.5 2.84 1.08-2.56 1.54-2.12 4.98.42 6-.5 1.1-1.1 2.2-2.1 3.2-.12.12-.26.26-.5.5zM14.52 7.6c.22-2.66 2.14-4.34 4.2-4.1.32 2.66-2.14 4.72-4.2 4.1z"/></svg>
            </button>
            <button onClick={handleGoogleLogin} className="w-[48px] h-[48px] rounded-full border-2 border-[#E5E5E5] dark:border-gray-600 flex items-center justify-center active:scale-95 transition-transform shadow-sm">
              <svg viewBox="0 0 24 24" className="w-6 h-6"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            </button>
          </div>
        </div>

        <div className="mt-6 w-full max-w-[320px]">
          <div className="space-y-2">
            <input type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} className="w-full h-[44px] rounded-[10px] border border-[#E5E5E5] dark:border-gray-700 px-3 text-[14px] outline-none focus:border-[#FF8C42] bg-white dark:bg-gray-900" />
            <div className="flex gap-2">
              <input type="password" placeholder="Password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} className="flex-1 h-[44px] rounded-[10px] border border-[#E5E5E5] dark:border-gray-700 px-3 text-[14px] outline-none focus:border-[#FF8C42] bg-white dark:bg-gray-900" />
              <button onClick={handleEmailLogin} disabled={loading || !email || !password} className="h-[44px] px-5 bg-[#FF8C42] text-white rounded-[10px] text-[14px] font-bold disabled:opacity-50">Sign in</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="text-[13px] text-[#FF8C42] font-medium active:opacity-70"
          >
            {t('login.register')}
          </button>
          <button
            onClick={() => navigate('/privacy')}
            className="text-[12px] text-[#999] dark:text-gray-400 active:opacity-70"
          >
            {t('login.privacy')}
          </button>
        </div>
      </div>
  );
}
