import { ChevronLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";

export function Login() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gradient-to-b from-[#FFF3E6] to-white relative flex flex-col">
      {/* 顶部导航与首页完全一致（浅色底+毛玻璃） */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => navigate(-1)} className="text-[#333333] active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#333333] text-[17px] font-bold tracking-wider">登录</h1>
        <div className="w-6 h-6"></div> {/* 占位保持居中 */}
      </div>

      {/* 滚动区域 */}
      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col items-center">
        
        {/* 中间大爪印与标题 */}
        <div className="flex flex-col items-center mt-10 mb-8 shrink-0">
          <div className="text-[60px] leading-none mb-3">🐾</div>
          <h2 className="text-[24px] font-bold text-[#FF8C42] mb-1.5">爪印 PawGram</h2>
          <p className="text-[12px] text-[#999999]">每只宠物，都值得留下爪印</p>
        </div>

        {/* 白色圆角卡片：表单区 */}
        <div className="bg-white rounded-[16px] w-[calc(100%-32px)] mx-4 p-6 shadow-sm border border-[#EEEEEE] shrink-0">
          {/* 手机号输入框 */}
          <div className="mb-4">
            <input 
              type="tel" 
              placeholder="请输入手机号" 
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] px-3 text-[14px] text-[#333333] outline-none focus:border-[#FF8C42] placeholder:text-[#999999] transition-colors"
            />
          </div>

          {/* 验证码输入框 */}
          <div className="mb-8 relative flex items-center">
            <input 
              type="text" 
              placeholder="请输入验证码" 
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] pl-3 pr-[90px] text-[14px] text-[#333333] outline-none focus:border-[#FF8C42] placeholder:text-[#999999] transition-colors"
            />
            <button className="absolute right-3 text-[#FF8C42] text-[14px] font-medium bg-transparent active:opacity-70 transition-opacity">
              获取验证码
            </button>
          </div>

          {/* 登录大按钮 */}
          <button 
            onClick={() => navigate('/')} 
            className="w-full h-[48px] bg-[#FF8C42] rounded-[12px] text-white text-[16px] font-bold active:bg-[#F27E36] transition-colors flex items-center justify-center shadow-sm"
          >
            登录
          </button>
        </div>

        {/* 其他方式登录 */}
        <div className="mt-12 flex flex-col items-center shrink-0">
          <p className="text-[12px] text-[#999999] mb-5">—— 其他方式登录 ——</p>
          
          <button className="w-[44px] h-[44px] rounded-full bg-[#07C160] flex items-center justify-center active:scale-95 transition-transform shadow-sm">
            <MessageCircle className="w-6 h-6 text-white fill-current" />
          </button>
        </div>

        {/* 占位，将注册推至最下方 */}
        <div className="flex-1"></div>

        {/* 注册账号链接 */}
        <div className="mb-6 mt-8 shrink-0">
          <button 
            onClick={() => navigate('/register')}
            className="text-[14px] text-[#FF8C42] font-medium active:opacity-70 transition-opacity"
          >
            注册账号
          </button>
        </div>
      </div>

      {/* 底部固定 5 个 TabBar */}
      <BottomNav />
    </div>
  );
}