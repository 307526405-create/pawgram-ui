import { useEffect, useRef } from "react";
import { createHashRouter, Outlet, useLocation, useNavigate } from "react-router";
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

function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const swipeRef = useRef({ startX: 0, startY: 0, swiping: false });

  useEffect(() => {
    const s = swipeRef.current;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      s.startX = e.touches[0].clientX;
      s.startY = e.touches[0].clientY;
      s.swiping = s.startX < 30;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!s.swiping) return;
      const dy = Math.abs(e.touches[0].clientY - s.startY);
      const dx = e.touches[0].clientX - s.startX;
      if (dy > Math.abs(dx)) { s.swiping = false; return; }
      if (dx < 0) s.swiping = false;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!s.swiping) return;
      const dx = e.changedTouches[0].clientX - s.startX;
      if (dx > 50) navigate(-1);
      s.swiping = false;
    };
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [navigate]);

  if (location.pathname === "/export") {
    return <Outlet />;
  }

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 overflow-x-hidden overflow-y-auto">
      <Outlet />
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
    ],
  },
]);