import { useEffect, useRef } from "react";
import { createHashRouter, Outlet, useLocation, useNavigate } from "react-router";
import { useRef } from "react";
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
  const navRef = useRef({ x:0, y:0, on:false, off:0 });

  if (location.pathname === "/export") return <Outlet />;

  const isHome = location.pathname === "/";

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 overflow-hidden relative"
      onTouchStart={e => {
        if (isHome) return;
        const t = e.touches[0];
        navRef.current = { x: t.clientX, y: t.clientY, on: t.clientX < 28, off: 0 };
      }}
      onTouchMove={e => {
        const n = navRef.current;
        if (!n.on) return;
        const t = e.touches[0];
        const dx = t.clientX - n.x;
        const dy = Math.abs(t.clientY - n.y);
        if (dy > dx * 1.5) { n.on = false; return; }
        if (dx > 0) { n.off = dx; e.currentTarget.style.transform = `translateX(${dx}px)`; }
      }}
      onTouchEnd={e => {
        const n = navRef.current;
        if (!n.on) return;
        n.on = false;
        const el = e.currentTarget as HTMLElement;
        if (n.off > 80) {
          el.style.transform = 'translateX(100%)';
          el.style.transition = 'transform 0.3s ease-out';
          setTimeout(() => navigate(-1), 300);
        } else {
          el.style.transform = '';
          el.style.transition = 'transform 0.2s ease-out';
        }
      }}
    >
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