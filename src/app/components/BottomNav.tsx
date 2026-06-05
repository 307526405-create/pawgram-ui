import { useState, useEffect } from "react";
import { Home, User, Compass, MessageSquare, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [msgUnread, setMsgUnread] = useState(0);

  useEffect(() => {
    const handler = (e: Event) => setMsgUnread((e as CustomEvent).detail ?? 0);
    window.addEventListener('pawgram:unread-count', handler);
    return () => window.removeEventListener('pawgram:unread-count', handler);
  }, []);

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-[#EEEEEE] dark:border-gray-700 pb-[var(--app-safe-bottom)] z-50">
        <div className="flex justify-around items-center h-[50px] relative px-2">
          <Link
            to="/"
            replace
            className={`flex flex-col items-center justify-center w-[20%] h-full cursor-pointer active:opacity-70 ${location.pathname === '/' ? 'text-[#FF8C42]' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Home className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">{t('bottomNav.home')}</span>
          </Link>

          <Link
            to="/discover"
            replace
            onClick={(e) => {
              if (location.pathname === '/discover') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('pawgram:discover-tab-click'));
              }
            }}
            className={`flex flex-col items-center justify-center w-[20%] h-full cursor-pointer active:opacity-70 ${location.pathname === '/discover' ? 'text-[#FF8C42]' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Compass className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/discover' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">{t('bottomNav.discover')}</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate("/post", { state: { from: location.pathname } })}
            className="flex flex-col items-center justify-center w-[20%] h-full relative cursor-pointer active:opacity-70"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full flex items-center justify-center shadow-sm z-10 bg-[#FF9A5C]">
              <Plus className="w-6 h-6 text-white" strokeWidth={2.75} />
            </div>
          </button>

          <Link
            to="/messages"
            replace
            className={`flex flex-col items-center justify-center w-[20%] h-full cursor-pointer active:opacity-70 ${location.pathname === '/messages' ? 'text-[#FF8C42]' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/messages' ? 2.5 : 2} />
              {msgUnread > 0 && (
                <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] rounded-full bg-[#FF4D4F] text-white text-[9px] font-bold flex items-center justify-center px-1">
                  {msgUnread > 99 ? '99+' : msgUnread}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium leading-none">{t('bottomNav.messages')}</span>
          </Link>

          <Link
            to="/profile"
            replace
            className={`flex flex-col items-center justify-center w-[20%] h-full cursor-pointer active:opacity-70 ${location.pathname === '/profile' || location.pathname === '/pet' ? 'text-[#FF8C42]' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <User className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/profile' || location.pathname === '/pet' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">{t('bottomNav.profile')}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
