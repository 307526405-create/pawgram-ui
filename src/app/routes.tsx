import { createBrowserRouter, Outlet, useLocation, useNavigationType } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { lazy, Suspense } from "react";
import { Home } from "./pages/Home";
import { Messages } from "./pages/Messages";
import { Profile } from "./pages/Profile";
import { Search } from "./pages/Search";
import { PostCreate } from "./pages/PostCreate";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Settings } from "./pages/Settings";
import { ChatDetail } from "./pages/ChatDetail";
import { Scan } from "./pages/Scan";

// Route-level code splitting
const PostDetail = lazy(() => import("./pages/PostDetail"));
const Discover = lazy(() => import("./pages/Discover"));
const PetProfile = lazy(() => import("./pages/PetProfile"));
const CheckIn = lazy(() => import("./pages/CheckIn"));
const BowlRewards = lazy(() => import("./pages/BowlRewards"));
const FollowList = lazy(() => import("./pages/FollowList"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const BreedPage = lazy(() => import("./pages/BreedPage"));
const NotificationDetail = lazy(() => import("./pages/NotificationDetail"));

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="h-full flex items-center justify-center bg-[#FAFAFA] dark:bg-gray-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#FF8C42] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}

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
      <div className="w-full h-full bg-white dark:bg-gray-900 relative">
        {(isTab || isPostCreate) ? (
          <div className="w-full h-full">
            <Outlet />
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
              <Outlet />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function withSuspense(Component: React.ComponentType) {
  return () => <PageSuspense><Component /></PageSuspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "post", Component: PostCreate },
      { path: "post/:id", Component: withSuspense(PostDetail) },
      { path: "profile", Component: Profile },
      { path: "discover", Component: withSuspense(Discover) },
      { path: "search", Component: Search },
      { path: "messages", Component: Messages },
      { path: "pet", Component: withSuspense(PetProfile) },
      { path: "checkin", Component: withSuspense(CheckIn) },
      { path: "bowl", Component: withSuspense(BowlRewards) },
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "settings", Component: Settings },
      { path: "follows", Component: withSuspense(FollowList) },
      { path: "export", Component: ChatDetail },
      { path: "scan", Component: Scan },
      { path: "chat/:id", Component: ChatDetail },
      { path: "post/edit/:id", Component: PostCreate },
      { path: "privacy", Component: withSuspense(PrivacyPolicy) },
      { path: "user/:id", Component: withSuspense(UserProfile) },
      { path: "breed/:breed", Component: withSuspense(BreedPage) },
      { path: "notifications/:type", Component: withSuspense(NotificationDetail) },
    ],
  },
]);