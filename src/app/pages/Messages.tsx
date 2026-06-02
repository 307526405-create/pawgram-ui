import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Bell, Info, ShieldAlert } from "lucide-react";

const interactions = [
  {
    id: 1,
    username: "Alice Wang",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzbWlsaW5nJTIwYXZhdGFyfGVufDF8fHx8MTc3OTc5Njg4MHww&ixlib=rb-4.1.0&q=80&w=150",
    action: "赞了你的帖子",
    postImg: "https://images.unsplash.com/photo-1504826260979-242151ee45b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwZG9nJTIwcHVwcHl8ZW58MXx8fHwxNzc5ODg4NTYyfDA&ixlib=rb-4.1.0&q=80&w=150"
  },
  {
    id: 2,
    username: "Bob Chen",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTc3OTg4OTUyMHww&ixlib=rb-4.1.0&q=80&w=150",
    action: "评论了你的帖子：太可爱了吧！",
    postImg: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXRlJTIwY2F0JTIwa2l0dGVufGVufDF8fHx8MTc3OTg1Njc5Mnww&ixlib=rb-4.1.0&q=80&w=150"
  },
  {
    id: 3,
    username: "Charlie Lee",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTc3OTg4OTUyMHww&ixlib=rb-4.1.0&q=80&w=150",
    action: "关注了你",
    postImg: null
  }
];

const directMessages = [
  {
    id: 1,
    username: "Alice Wang",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBzbWlsaW5nJTIwYXZhdGFyfGVufDF8fHx8MTc3OTc5Njg4MHww&ixlib=rb-4.1.0&q=80&w=150",
    lastMessage: "周末去公园遛狗吗？",
    unread: 2,
  },
  {
    id: 2,
    username: "Charlie Lee",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHx1c2VyJTIwYXZhdGFyfGVufDF8fHx8MTc3OTg4OTUyMHww&ixlib=rb-4.1.0&q=80&w=150",
    lastMessage: "好的，下次见！",
    unread: 0,
  }
];

const systemNotifications = [
  {
    id: 1,
    icon: Bell,
    text: "你的帖子「今天和狗狗玩得很开心」获得了100个赞！",
  },
  {
    id: 2,
    icon: Info,
    text: "欢迎来到 PawGram 宠物社区！",
  },
  {
    id: 3,
    icon: ShieldAlert,
    text: "系统维护通知：今晚凌晨将进行短暂的服务器升级。",
  }
];

export function Messages() {
  const [activeTab, setActiveTab] = useState("互动");

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      {/* 顶部留出54px空白区域给手机状态栏，导航栏标题向下移，去掉橙色背景 */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-center shrink-0 relative z-40 border-b border-transparent">
        <h1 className="text-[#333333] text-[17px] font-bold tracking-wider">消息</h1>
      </div>

      {/* Tabs */}
      <div className="bg-white flex px-4 shadow-sm relative z-30 shrink-0">
        {["互动", "私信", "系统"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[14px] font-medium transition-colors relative ${
              activeTab === tab ? "text-[#FF8C42]" : "text-[#999999]"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-[#FF8C42] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content - 内容整体下移，底部预留给 TabBar 的空间 */}
      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {activeTab === "互动" && (
          <div className="px-4 py-3 space-y-3">
            {interactions.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[12px] p-3 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform"
              >
                <ImageWithFallback
                  src={item.avatar}
                  alt={item.username}
                  className="w-[36px] h-[36px] rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] font-bold text-[#333333] block truncate">
                    {item.username}
                  </span>
                  <span className="text-[12px] text-[#999999] block truncate mt-0.5">
                    {item.action}
                  </span>
                </div>
                {item.postImg && (
                  <ImageWithFallback
                    src={item.postImg}
                    alt="Post thumbnail"
                    className="w-[45px] h-[45px] rounded-[12px] object-cover shrink-0 ml-2"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "私信" && (
          <div className="px-4 py-3 space-y-3">
            {directMessages.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[12px] p-3 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform"
              >
                <ImageWithFallback
                  src={item.avatar}
                  alt={item.username}
                  className="w-[36px] h-[36px] rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[14px] text-[#333333] font-bold block truncate">
                    {item.username}
                  </span>
                  <span className="text-[12px] text-[#999999] block truncate mt-0.5">
                    {item.lastMessage}
                  </span>
                </div>
                {item.unread > 0 && (
                  <div className="shrink-0 w-4 h-4 bg-[#FF8C42] rounded-full flex items-center justify-center ml-2">
                    <span className="text-[10px] text-white font-medium">
                      {item.unread}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "系统" && (
          <div className="px-4 py-3 space-y-3">
            {systemNotifications.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-[12px] p-3 flex items-center gap-3 shadow-sm active:scale-[0.98] transition-transform"
              >
                <div className="w-[36px] h-[36px] rounded-full bg-[#FAFAFA] flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#999999]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] text-[#666666] block leading-relaxed">
                    {item.text}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}