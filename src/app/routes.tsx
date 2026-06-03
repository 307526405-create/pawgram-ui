import { useRef } from "react";
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
  const pageRef = useRef<HTMLDivElement>(null);
  const gesture = useRef({ startX: 0, startY: 0, swiping: false, dx: 0 });

  if (location.pathname === "/export") return <Outlet />;

  const isHome = location.pathname === "/";

  const finish = (el: HTMLDivElement, forward: boolean) => {
    el.style.transition = 'transform 0.3s ease-out';
    if (forward) {
      el.style.transform = `translateX(${window.innerWidth}px)`;
      setTimeout(() => {
        el.style.transition = 'none';
        el.style.transform = '';
        navigate(-1);
      }, 300);
    } else {
      el.style.transform = 'translateX(0)';
      setTimeout(() => { el.style.transition = 'none'; }, 300);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 overflow-hidden"
      onTouchStart={e => {
        if (isHome) return;
        const t = e.touches[0];
        gesture.current = { startX: t.clientX, startY: t.clientY, swiping: t.clientX < 28, dx: 0 };
      }}
      onTouchMove={e => {
        const g = gesture.current;
        if (!g.swiping) return;
        const t = e.touches[0];
        const dx = t.clientX - g.startX;
        const dy = Math.abs(t.clientY - g.startY);
        if (dy > dx * 1.5) { g.swiping = false; return; }
        if (dx > 0) {
          g.dx = dx;
          const el = pageRef.current;
          if (el) {
            el.style.transition = 'none';
            el.style.transform = `translateX(${dx}px)`;
          }
        }
      }}
      onTouchEnd={() => {
        const g = gesture.current;
        if (!g.swiping) return;
        g.swiping = false;
        const el = pageRef.current;
        if (!el) return;
        const progress = g.dx / window.innerWidth;
        finish(el, progress > 0.3);
      }}
    >
      <div ref={pageRef} className="w-full h-full bg-white dark:bg-gray-900 relative">
        <Outlet />
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
    ],
  },
]);