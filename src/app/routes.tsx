import { createHashRouter, Outlet, useLocation } from "react-router";
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
import { Export } from "./pages/Export";

function Root() {
  const location = useLocation();

  if (location.pathname === "/export") {
    return <Outlet />;
  }

  return (
    <div className="w-full h-full bg-white overflow-x-hidden overflow-y-auto">
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
      { path: "export", Component: Export },
    ],
  },
]);