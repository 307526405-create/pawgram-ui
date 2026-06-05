import { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usePageTransition } from "../hooks/usePageTransition";
import { authApi } from "../api/client";

export function Register() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { className, handleBack } = usePageTransition();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
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

  const handleRegister = async (verificationCode?: string) => {
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
      navigate('/welcome');
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  // Auto login when code reaches 6 digits
  useEffect(() => {
    if (code.length === 6 && !hasAutoLoggedIn.current) {
      hasAutoLoggedIn.current = true;
      handleRegister(code);
    }
    if (code.length < 6) {
      hasAutoLoggedIn.current = false;
    }
  }, [code]);

  return (
    <div className={`h-full relative flex flex-col ${className}`}>
      <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => handleBack(() => navigate(-1))} className="text-[#333333] dark:text-gray-100 active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-6 h-6"></div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8">

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
              placeholder={t('register.enterCode')}
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
              {countdown > 0 ? `${t('login.resend') || '重新发送'}(${countdown}s)` : t('register.getCode')}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <p className="text-[12px] text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={() => handleRegister()}
            disabled={loading || !phone || !code || code.length < 6}
            className="w-full h-[50px] bg-[#FF8C42] rounded-[12px] text-white text-[16px] font-bold active:bg-[#F27E36] transition-colors flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (t('common.loading')) : t('register.registerBtn')}
          </button>
        </div>

        <div className="mt-8 flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity">
          <div className="w-[16px] h-[16px] rounded-full bg-[#FF8C42] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-[10px] h-[10px] text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="text-[12px] text-[#999999] dark:text-gray-400">
            {t('register.agreement')} <span className="text-[#FF8C42]">{t('register.termsOfService')}</span>{t('register.and')}<span className="text-[#FF8C42]">{t('register.privacyPolicy')}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
