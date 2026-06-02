import { Home, User, Compass, MessageSquare, Plus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-[#EEEEEE] dark:border-gray-700 pb-[var(--app-safe-bottom)] z-50">
        <div className="flex justify-around items-center h-[50px] relative px-2">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center w-[20%] h-full ${location.pathname === '/' ? 'text-[#FF8C42]' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Home className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">{t('bottomNav.home')}</span>
          </Link>

          <Link
            to="/discover"
            onClick={(e) => {
              if (location.pathname === '/discover') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('pawgram:discover-tab-click'));
              }
            }}
            className={`flex flex-col items-center justify-center w-[20%] h-full ${location.pathname === '/discover' ? 'text-[#FF8C42]' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <Compass className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/discover' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">{t('bottomNav.discover')}</span>
          </Link>

          <button
            type="button"
            onClick={() => navigate("/post")}
            className="flex flex-col items-center justify-center w-[20%] h-full relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full flex items-center justify-center shadow-sm z-10 bg-[#FF9A5C]">
              <Plus className="w-6 h-6 text-white" strokeWidth={2.75} />
            </div>
          </button>

          <Link
            to="/messages"
            className={`flex flex-col items-center justify-center w-[20%] h-full ${location.pathname === '/messages' ? 'text-[#FF8C42]' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/messages' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">{t('bottomNav.messages')}</span>
          </Link>

          <Link
            to="/profile"
            className={`flex flex-col items-center justify-center w-[20%] h-full ${location.pathname === '/profile' || location.pathname === '/pet' ? 'text-[#FF8C42]' : 'text-gray-400 dark:text-gray-500'}`}
          >
            <User className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/profile' || location.pathname === '/pet' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">{t('bottomNav.profile')}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
