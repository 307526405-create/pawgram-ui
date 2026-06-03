import { createHashRouter, Outlet, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
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
import { Settings } from "./pages/Settings";
import { FollowList } from "./pages/FollowList";
import { ChatDetail } from "./pages/ChatDetail";
import { Scan } from "./pages/Scan";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { UserProfile } from "./pages/UserProfile";

function Root() {
  const location = useLocation();

  if (location.pathname === "/export") return <Outlet />;

  return (
    <div className="w-full h-full bg-gray-900 overflow-hidden">
      <div className="w-full h-full bg-white dark:bg-gray-900 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export const router = createHashRouter([
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
      { path: "settings", Component: Settings },
      { path: "follows", Component: FollowList },
      { path: "export", Component: ChatDetail },
      { path: "scan", Component: Scan },
      { path: "chat/:id", Component: ChatDetail },
      { path: "post/edit/:id", Component: PostCreate },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "user/:id", Component: UserProfile },
    ],
  },
]);