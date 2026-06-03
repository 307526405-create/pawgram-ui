import { useNavigate } from "react-router";
import { ChevronLeft, UserPen, Shield, Lock, Bell, Info, Trash2, ChevronRight, X, MessageSquare, Moon, Sun, Monitor, Globe } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { logout } from "../api/auth";
import { useDarkMode } from "../hooks/useDarkMode";
import { usePageTransition } from "../hooks/usePageTransition";

function FeedbackForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);
  const allHooksDone = true;

  if (!allHooksDone) return null;

  if (sent) return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      <div className="w-16 h-16 bg-[#FFF3E6] dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">✓</span>
      </div>
      <p className="text-[17px] font-bold text-[#333] dark:text-gray-100 mb-2">{t('settings.thanksFeedback')}</p>
      <p className="text-[13px] text-[#999] dark:text-gray-400 text-center">{t('settings.feedbackDesc')}</p>
      <button onClick={onDone} className="mt-8 w-full h-11 bg-[#FF8C42] text-white rounded-xl text-[15px] font-bold">{t('common.back')}</button>
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder={t('settings.feedbackPlaceholder')}
        rows={5}
        className="w-full bg-[#F5F5F5] dark:bg-gray-800 rounded-xl px-4 py-3 text-[14px] dark:text-gray-100 outline-none resize-none"
      />
      <div className="bg-[#F5F5F5] dark:bg-gray-800 rounded-xl p-4 text-center">
        <div className="w-12 h-12 rounded-lg bg-[#E5E5E5] dark:bg-gray-700 flex items-center justify-center mx-auto mb-2">
          <span className="text-2xl text-[#CCC] dark:text-gray-600">+</span>
        </div>
        <p className="text-[12px] text-[#999] dark:text-gray-400">{t('settings.addScreenshot')}</p>
      </div>
      <input value={contact} onChange={e => setContact(e.target.value)}
        placeholder={t('settings.contactOptional')}
        className="w-full h-11 bg-[#F5F5F5] dark:bg-gray-800 rounded-xl px-4 text-[14px] dark:text-gray-100 outline-none"
      />
      <p className="text-[11px] text-[#BBB] dark:text-gray-500">{t('settings.feedbackNotice')}</p>
      <button onClick={() => { if (text.trim()) { setSent(true); setTimeout(onDone, 2000); } }}
        disabled={!text.trim()}
        className={`w-full h-11 rounded-xl text-[15px] font-bold ${text.trim() ? 'bg-[#FF8C42] text-white' : 'bg-[#E5E5E5] dark:bg-gray-700 text-[#BBB] dark:text-gray-500'}`}>
        {t('common.submitFeedback')}
      </button>
    </div>
  );
}

function SubPage({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex flex-col">
      <div className="pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 border-b border-[#F0F0F0] dark:border-gray-700">
        <button onClick={onClose} className="p-1 -ml-1"><ChevronLeft className="w-6 h-6 text-[#333] dark:text-gray-100"/></button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100 mr-8">{title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

const themeLabels: Record<string, string> = { system: 'settings.darkModeSystem', light: 'settings.darkModeLight', dark: 'settings.darkModeDark' };
const themeIcons: Record<string, React.ReactNode> = { system: <Monitor className="w-4 h-4" />, light: <Sun className="w-4 h-4" />, dark: <Moon className="w-4 h-4" /> };

export function Settings() {
  const navigate = useNavigate();
  const { animClass, handleBack } = usePageTransition();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useDarkMode();
  const [showLogout, setShowLogout] = useState(false);
  const [showCache, setShowCache] = useState(false);
  const [showTheme, setShowTheme] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [page, setPage] = useState<string | null>(null);

  const languages = [
    { code: 'zh-CN', label: t('settings.languageZh') },
    { code: 'en', label: t('settings.languageEn') },
  ];

  const renderPage = () => {
    switch(page) {
      case 'profile': return (
        <SubPage title={t('settings.editProfilePage')} onClose={() => setPage(null)}>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F5F5F5] dark:bg-gray-800"/>
              <div><button className="text-[#FF8C42] text-[13px]">{t('settings.changeAvatar')}</button></div>
            </div>
            <div>
              <label className="text-[12px] text-[#999] dark:text-gray-400 mb-1 block">{t('settings.nickname')}</label>
              <input className="w-full h-10 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg px-3 text-[14px] dark:text-gray-100 outline-none" defaultValue="王丽丽"/>
            </div>
            <div>
              <label className="text-[12px] text-[#999] dark:text-gray-400 mb-1 block">{t('settings.bio')}</label>
              <textarea className="w-full h-20 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg px-3 py-2 text-[14px] dark:text-gray-100 outline-none resize-none" defaultValue="金毛&布偶猫铲屎官 | 爱生活爱宠物"/>
            </div>
            <button className="w-full h-11 bg-[#FF8C42] text-white rounded-xl text-[15px] font-bold">{t('common.save')}</button>
          </div>
        </SubPage>
      );
      case 'security': return (
        <SubPage title={t('settings.accountSecurity')} onClose={() => setPage(null)}>
          <div className="divide-y divide-[#F5F5F5] dark:divide-gray-700">
            {[{label:t('settings.changePassword'),desc:'******'},{label:t('settings.bindPhone'),desc:'138****8888'},{label:t('settings.wechatBinding'),desc:t('settings.bound')}].map((m,i) => (
              <div key={i} className="px-4 py-4 flex items-center justify-between">
                <div><div className="text-[14px] text-[#333] dark:text-gray-100">{m.label}</div><div className="text-[12px] text-[#999] dark:text-gray-400">{m.desc}</div></div>
                <ChevronRight className="w-4 h-4 text-[#CCC] dark:text-gray-600"/>
              </div>
            ))}
          </div>
        </SubPage>
      );
      case 'privacy': return (
        <SubPage title={t('settings.privacySettings')} onClose={() => setPage(null)}>
          <div className="divide-y divide-[#F5F5F5] dark:divide-gray-700">
            {[{label:t('settings.blockList'),desc:t('settings.blockListCount', { count: 0 })},{label:t('settings.whoCanSee'),desc:t('settings.everyone')},{label:t('settings.hideLocation'),desc:t('settings.off')}].map((m,i) => (
              <div key={i} className="px-4 py-4 flex items-center justify-between">
                <div><div className="text-[14px] text-[#333] dark:text-gray-100">{m.label}</div><div className="text-[12px] text-[#999] dark:text-gray-400">{m.desc}</div></div>
                <ChevronRight className="w-4 h-4 text-[#CCC] dark:text-gray-600"/>
              </div>
            ))}
          </div>
        </SubPage>
      );
      case 'notification': return (
        <SubPage title={t('settings.notificationSettings')} onClose={() => setPage(null)}>
          <div className="divide-y divide-[#F5F5F5] dark:divide-gray-700">
            {[{label:t('settings.pushNotifications'),on:true},{label:t('settings.interactionReminder'),on:true},{label:t('settings.systemNotification'),on:true},{label:t('settings.sound'),on:false}].map((m,i) => (
              <div key={i} className="px-4 py-4 flex items-center justify-between">
                <span className="text-[14px] text-[#333] dark:text-gray-100">{m.label}</span>
                <div className={`w-11 h-6 rounded-full relative transition-colors ${m.on ? 'bg-[#FF8C42]' : 'bg-[#E5E5E5] dark:bg-gray-700'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${m.on ? 'left-[22px]' : 'left-0.5'}`}/>
                </div>
              </div>
            ))}
          </div>
        </SubPage>
      );
      case 'about': return (
        <SubPage title={t('settings.aboutPawgram')} onClose={() => setPage(null)}>
          <div className="p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#FF8C42] mx-auto flex items-center justify-center"><span className="text-2xl">🐾</span></div>
            <div className="text-[17px] font-bold text-[#333] dark:text-gray-100">{t('settings.brandName')}</div>
            <div className="text-[13px] text-[#999] dark:text-gray-400">{t('common.version')} 1.0.0</div>
            <div className="text-[12px] text-[#BBB] dark:text-gray-500 pt-4">{t('settings.copyright')}</div>
          </div>
        </SubPage>
      );
      case 'feedback': return (
        <SubPage title={t('settings.feedback')} onClose={() => setPage(null)}>
          <FeedbackForm onDone={() => setPage(null)} />
        </SubPage>
      );
      default: return null;
    }
  };

  return (
    <div className={`h-full bg-[#FAFAFA] dark:bg-gray-950 relative flex flex-col ${animClass}`}>
      {page && renderPage()}

      <div className="bg-[#FAFAFA]/90 dark:bg-gray-950/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0">
        <button onClick={handleBack} className="p-1 -ml-1"><ChevronLeft className="w-6 h-6 text-[#333] dark:text-gray-100"/></button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] dark:text-gray-100 mr-8">{t('settings.title')}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden">
        <div className="mx-4 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-[#F0F0F0] dark:border-gray-700">
          {[
            { icon:UserPen, label:t('settings.editProfile'), page:'profile' },
            { icon:Shield, label:t('settings.accountSecurity'), page:'security' },
            { icon:Lock, label:t('settings.privacySettings'), page:'privacy' },
            { icon:Bell, label:t('settings.notificationSettings'), page:'notification' },
            { icon:MessageSquare, label:t('settings.feedback'), page:'feedback' },
            { icon:Info, label:t('settings.aboutPawgram'), page:'about' },
          ].map((m, i) => (
            <div key={i} onClick={() => setPage(m.page)} className={`px-4 h-14 flex items-center justify-between ${i<5?'border-b border-[#F5F5F5] dark:border-gray-700':''} cursor-pointer active:bg-[#F9F9F9] dark:active:bg-gray-800`}>
              <div className="flex items-center gap-3">
                <m.icon className="w-4 h-4 text-[#666] dark:text-gray-400"/>
                <span className="text-[14px] text-[#333] dark:text-gray-100 font-medium">{m.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CCC] dark:text-gray-600"/>
            </div>
          ))}
        </div>

        {/* Dark Mode */}
        <div className="mx-4 mt-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-[#F0F0F0] dark:border-gray-700">
          <div onClick={() => setShowTheme(!showTheme)} className="px-4 h-14 flex items-center justify-between cursor-pointer active:bg-[#F9F9F9] dark:active:bg-gray-800">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-[#666] dark:text-gray-400"/>
              <span className="text-[14px] text-[#333] dark:text-gray-100 font-medium">{t('settings.darkMode')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] text-[#999] dark:text-gray-400">{t(themeLabels[theme])}</span>
              <ChevronRight className="w-4 h-4 text-[#CCC] dark:text-gray-600"/>
            </div>
          </div>
          {showTheme && (
            <div className="border-t border-[#F5F5F5] dark:border-gray-700">
              {(['system','light','dark'] as const).map((mode, i) => (
                <div key={mode} onClick={() => { setTheme(mode); setShowTheme(false); }}
                  className={`px-4 h-12 flex items-center justify-between cursor-pointer active:bg-[#F9F9F9] dark:active:bg-gray-800 ${i<2?'border-b border-[#F5F5F5] dark:border-gray-700':''}`}>
                  <div className="flex items-center gap-3">
                    {themeIcons[mode]}
                    <span className={`text-[14px] ${theme === mode ? 'text-[#FF8C42] font-medium' : 'text-[#333] dark:text-gray-100'}`}>{t(themeLabels[mode])}</span>
                  </div>
                  {theme === mode && <div className="w-5 h-5 rounded-full bg-[#FF8C42] flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Language */}
        <div className="mx-4 mt-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-[#F0F0F0] dark:border-gray-700">
          <div onClick={() => setShowLang(!showLang)} className="px-4 h-14 flex items-center justify-between cursor-pointer active:bg-[#F9F9F9] dark:active:bg-gray-800">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-[#666] dark:text-gray-400"/>
              <span className="text-[14px] text-[#333] dark:text-gray-100 font-medium">{t('settings.language')}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] text-[#999] dark:text-gray-400">{languages.find(l => l.code === i18n.language)?.label || t('settings.languageZh')}</span>
              <ChevronRight className="w-4 h-4 text-[#CCC] dark:text-gray-600"/>
            </div>
          </div>
          {showLang && (
            <div className="border-t border-[#F5F5F5] dark:border-gray-700">
              {languages.map((lang, i) => (
                <div key={lang.code} onClick={() => { i18n.changeLanguage(lang.code); setShowLang(false); }}
                  className={`px-4 h-12 flex items-center justify-between cursor-pointer active:bg-[#F9F9F9] dark:active:bg-gray-800 ${i<languages.length-1?'border-b border-[#F5F5F5] dark:border-gray-700':''}`}>
                  <span className={`text-[14px] ${i18n.language === lang.code || (i18n.language === 'zh-CN' && lang.code === 'zh-CN') ? 'text-[#FF8C42] font-medium' : 'text-[#333] dark:text-gray-100'}`}>{lang.label}</span>
                  {(i18n.language === lang.code || (lang.code === 'zh-CN' && !['zh-CN','en'].includes(i18n.language))) && <div className="w-5 h-5 rounded-full bg-[#FF8C42] flex items-center justify-center"><span className="text-white text-[10px]">✓</span></div>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mx-4 mt-3 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-[#F0F0F0] dark:border-gray-700">
          <div onClick={() => setShowCache(true)} className="px-4 h-14 flex items-center justify-between cursor-pointer active:bg-[#F9F9F9] dark:active:bg-gray-800 border-b border-[#F5F5F5] dark:border-gray-700">
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-[#666] dark:text-gray-400"/>
              <span className="text-[14px] text-[#333] dark:text-gray-100 font-medium">{t('settings.clearCache')}</span>
            </div>
            <div className="flex items-center gap-1"><span className="text-[13px] text-[#999] dark:text-gray-400">23.5MB</span><ChevronRight className="w-4 h-4 text-[#CCC] dark:text-gray-600"/></div>
          </div>
          <div onClick={() => setShowLogout(true)} className="px-4 h-14 flex items-center justify-center cursor-pointer active:bg-[#F9F9F9] dark:active:bg-gray-800">
            <span className="text-[14px] text-[#FF4D4F] font-medium">{t('settings.logout')}</span>
          </div>
        </div>
      </div>

      {showLogout && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-[280px] text-center">
            <p className="text-[15px] text-[#333] dark:text-gray-100 mb-2">{t('settings.confirmLogout')}</p><p className="text-[12px] text-[#999] dark:text-gray-400 mb-6">{t('settings.logoutTip')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 h-10 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg text-[14px] text-[#666] dark:text-gray-400">{t('common.cancel')}</button>
              <button onClick={() => { setShowLogout(false); logout(); }} className="flex-1 h-10 bg-[#FF4D4F] text-white rounded-lg text-[14px] font-bold">{t('settings.logout')}</button>
            </div>
          </div>
        </div>
      )}

      {showCache && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-[280px] text-center">
            <p className="text-[15px] text-[#333] dark:text-gray-100 mb-2">{t('settings.clearCache')}</p><p className="text-[12px] text-[#999] dark:text-gray-400 mb-6">{t('settings.clearCacheTip')}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCache(false)} className="flex-1 h-10 bg-[#F5F5F5] dark:bg-gray-800 rounded-lg text-[14px] text-[#666] dark:text-gray-400">{t('common.cancel')}</button>
              <button onClick={() => setShowCache(false)} className="flex-1 h-10 bg-[#FF8C42] text-white rounded-lg text-[14px] font-bold">{t('common.confirm')}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
