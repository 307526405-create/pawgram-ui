import { createBrowserRouter, Outlet, useLocation, useNavigationType } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { NetworkStatus } from "./components/NetworkStatus";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Home } from "./pages/Home";
import { PostDetail } from "./pages/PostDetail";
import { Profile } from "./pages/Profile";
import { Discover } from "./pages/Discover";
import { Search } from "./pages/Search";
import { PostCreate } from "./pages/PostCreate";
import { Messages } from "./pages/Messages";
import { PetProfile } from "./pages/PetProfile";
import { CheckIn } from "./pages/CheckIn";
import { BowlRewards } from "./pages/BowlRewards";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { WelcomeGuide } from "./pages/WelcomeGuide";
import { Settings } from "./pages/Settings";
import { FollowList } from "./pages/FollowList";
import { ChatDetail } from "./pages/ChatDetail";
import { Scan } from "./pages/Scan";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { UserProfile } from "./pages/UserProfile";
import { BreedPage } from "./pages/BreedPage";
import { NotificationDetail } from "./pages/NotificationDetail";

const TAB_ROUTES = new Set(["/", "/discover", "/messages", "/profile"]);

function Root() {
  const location = useLocation();
  const navType = useNavigationType();

  if (location.pathname === "/export") return <Outlet />;

  const isTab = TAB_ROUTES.has(location.pathname);
  const isPostCreate = location.pathname === '/post';
  const isPush = navType === 'PUSH';

  return (
    <div className="w-full h-full bg-gray-900 overflow-hidden">
      <NetworkStatus />
      <div className="w-full h-full bg-white dark:bg-gray-900 relative">
        {(isTab || isPostCreate) ? (
          <div className="w-full h-full">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              key={location.pathname}
              initial={isPush ? { x: "100%" } : false}
              animate={{ x: 0 }}
              exit={isPush ? { x: "100%" } : { x: "100%", transition: { duration: 0 } }}
              transition={{ duration: 0.3 }}
              className="w-full h-full absolute inset-0"
            >
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "post", Component: PostCreate },
      { path: "post/:id", Component: PostDetail },
      { path: "profile", Component: Profile },
      { path: "discover", Component: Discover },
      { path: "search", Component: Search },
      { path: "messages", Component: Messages },
      { path: "pet", Component: PetProfile },
      { path: "checkin", Component: CheckIn },
      { path: "bowl", Component: BowlRewards },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "welcome", Component: WelcomeGuide },
      { path: "settings", Component: Settings },
      { path: "follows", Component: FollowList },
      { path: "export", Component: ChatDetail },
      { path: "scan", Component: Scan },
      { path: "chat/:id", Component: ChatDetail },
      { path: "post/edit/:id", Component: PostCreate },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "user/:id", Component: UserProfile },
      { path: "breed/:breed", Component: BreedPage },
      { path: "notifications/:type", Component: NotificationDetail },
    ],
  },
]);
