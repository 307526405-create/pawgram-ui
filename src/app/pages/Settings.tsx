import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { 
  ChevronLeft, 
  UserPen, 
  Shield, 
  Lock, 
  Bell, 
  Info, 
  Trash2,
  ChevronRight
} from "lucide-react";

export function Settings() {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'profile', icon: UserPen, title: '编辑个人资料' },
    { id: 'security', icon: Shield, title: '账号与安全' },
    { id: 'privacy', icon: Lock, title: '隐私设置' },
    { id: 'notification', icon: Bell, title: '通知设置' },
    { id: 'about', icon: Info, title: '关于爪印' },
    { id: 'cache', icon: Trash2, title: '清除缓存', extra: '23.5MB' },
  ];

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      
      {/* 顶部导航栏：与首页和其他页面完全一致对齐 */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-40 border-b border-transparent">
        <div className="w-16 flex justify-start">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 active:opacity-70 transition-opacity">
            <ChevronLeft className="w-6 h-6 text-[#333333]" />
          </button>
        </div>
        <h1 className="text-[#333333] text-[17px] font-bold tracking-wider">设置</h1>
        <div className="w-16 flex justify-end"></div> {/* Spacer to center the title */}
      </div>

      {/* 中间滚动区域，底部预留84px空间（50pxTabBar + 34px安全区） */}
      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* 设置列表卡片 */}
        <div className="mx-4 mt-2 bg-white rounded-[16px] px-4 shadow-sm border border-[#EEEEEE]">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id} 
                className={`h-[48px] flex items-center justify-between ${index !== menuItems.length - 1 ? 'border-b border-[#EEEEEE]' : ''} active:opacity-70 transition-opacity cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-[18px] h-[18px] text-[#333333]" />
                  <span className="text-[14px] font-bold text-[#333333]">{item.title}</span>
                </div>
                <div className="flex items-center gap-1">
                  {item.extra && (
                    <span className="text-[13px] text-[#999999] font-medium">{item.extra}</span>
                  )}
                  <ChevronRight className="w-[18px] h-[18px] text-[#CCCCCC]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 退出登录按钮 */}
        <div className="px-4 mt-8 mb-6 flex justify-center">
          <button 
            className="w-full bg-white text-[#FF4D4F] border border-[#EEEEEE] h-[48px] rounded-[16px] flex items-center justify-center text-[14px] font-bold active:bg-gray-50 transition-colors shadow-sm"
          >
            退出登录
          </button>
        </div>
        
      </div>

      <BottomNav />
    </div>
  );
}