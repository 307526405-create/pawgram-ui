import { Camera, Image as ImageIcon, Plus, X } from "lucide-react";
import type { ReactNode } from "react";
import { Home } from "./Home";
import { Discover } from "./Discover";
import { PostCreate } from "./PostCreate";
import { Messages } from "./Messages";
import { Profile } from "./Profile";
import { Search } from "./Search";
import { PostDetail } from "./PostDetail";
import { Settings } from "./Settings";
import { FollowList } from "./FollowList";
import { PetProfile } from "./PetProfile";
import { Login } from "./Login";
import { Register } from "./Register";
import { CheckIn } from "./CheckIn";
import { BowlRewards } from "./BowlRewards";

function PhoneFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="break-inside-avoid">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-[#333333]">{title}</h2>
        <span className="rounded-full bg-[#FFF3E6] px-3 py-1 text-[12px] text-[#FF8C42]">393 × 852</span>
      </div>
      <div className="h-[852px] w-[393px] overflow-hidden bg-white shadow-sm">
        <div className="relative h-full w-full overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </section>
  );
}

function PublishEntryPreview() {
  return (
    <div className="relative h-full bg-[#FAFAFA]">
      <Home />
      <div className="absolute inset-0 z-[80] flex flex-col justify-end bg-black/25">
        <div className="mx-3 mb-[calc(var(--app-bottom-nav-height)+8px)] rounded-[24px] bg-white p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between px-1">
            <div>
              <h3 className="text-[16px] font-bold text-[#333333]">发布新动态</h3>
              <p className="mt-1 text-[12px] text-[#999999]">选择照片或拍摄后进入编辑页</p>
            </div>
            <button className="rounded-full bg-[#F5F5F5] p-2">
              <X className="h-4 w-4 text-[#666666]" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center rounded-[18px] bg-[#FFF3E6] px-4 py-5">
              <div className="mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white text-[#FF8C42] shadow-sm">
                <ImageIcon className="h-6 w-6" />
              </div>
              <span className="text-[14px] font-bold text-[#333333]">从相册选择</span>
              <span className="mt-1 text-[11px] text-[#999999]">照片 / 视频</span>
            </button>

            <button className="flex flex-col items-center justify-center rounded-[18px] border border-[#EEEEEE] bg-[#FAFAFA] px-4 py-5">
              <div className="mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white text-[#FF8C42] shadow-sm">
                <Camera className="h-6 w-6" />
              </div>
              <span className="text-[14px] font-bold text-[#333333]">拍摄</span>
              <span className="mt-1 text-[11px] text-[#999999]">打开相机</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const exportPages = [
  { id: "login", title: "登录页", component: <Login /> },
  { id: "register", title: "注册页", component: <Register /> },
  { id: "home", title: "首页", component: <Home /> },
  { id: "discover", title: "发现页", component: <Discover /> },
  { id: "publish-entry", title: "发布入口弹窗", component: <PublishEntryPreview /> },
  { id: "post-create", title: "发布编辑页", component: <PostCreate /> },
  { id: "search", title: "搜索页", component: <Search /> },
  { id: "messages", title: "消息页", component: <Messages /> },
  { id: "post-detail", title: "帖子详情页", component: <PostDetail /> },
  { id: "profile", title: "我的页", component: <Profile /> },
  { id: "settings", title: "设置页", component: <Settings /> },
  { id: "follow-list", title: "关注列表", component: <FollowList /> },
  { id: "pet-profile", title: "宠物档案", component: <PetProfile /> },
  { id: "check-in", title: "打卡页", component: <CheckIn /> },
  { id: "bowl-rewards", title: "食盆奖励页", component: <BowlRewards /> },
];

export function Export() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] px-8 py-8 text-[#333333]">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 rounded-[28px] bg-white p-6 shadow-sm">
          <div className="mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-[16px] bg-[#FF8C42] text-white">
            <Plus className="h-6 w-6" />
          </div>
          <h1 className="text-[26px] font-bold text-[#333333]">PawGram 一比一设计导出板</h1>
          <p className="mt-2 max-w-[760px] text-[14px] text-[#666666]">
            所有画板均按 iPhone 15 的 393 × 852px 输出，可直接整页截图、浏览器打印 PDF，或作为 iPhone App 版本迁移验收稿。主应用为 iOS App 全屏布局：59pt 灵动岛安全区、44pt 导航栏、34pt Home 指示条，无手机模拟框。
          </p>
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,393px)] gap-x-8 gap-y-10">
          {exportPages.map((page) => (
            <PhoneFrame key={page.id} title={page.title}>
              {page.component}
            </PhoneFrame>
          ))}
        </div>
      </div>
    </div>
  );
}
