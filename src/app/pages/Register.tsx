import { ChevronLeft, Camera, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";

export function Register() {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gradient-to-b from-[#FFF3E6] to-white relative flex flex-col">
      {/* 顶部导航与登录页完全一致（浅色底+毛玻璃） */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-10">
        <button onClick={() => navigate(-1)} className="text-[#333333] active:scale-95 transition-transform p-1 -ml-1">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-[#333333] text-[17px] font-bold tracking-wider">注册</h1>
        <div className="w-6 h-6"></div> {/* 占位保持居中 */}
      </div>

      {/* 滚动区域 */}
      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col items-center">
        
        {/* 圆形头像占位区 80px 虚线边框 */}
        <div className="mt-8 mb-8 shrink-0">
          <div className="w-[80px] h-[80px] rounded-full flex items-center justify-center cursor-pointer active:scale-95 transition-transform border-2 border-dashed border-[#CCCCCC] bg-white relative">
            <Camera className="w-8 h-8 text-[#CCCCCC]" />
            <div className="absolute -bottom-1 -right-1 bg-[#FF8C42] w-[26px] h-[26px] rounded-full flex items-center justify-center border-2 border-white shadow-sm">
              <span className="text-white text-[16px] leading-none mb-0.5 font-bold">+</span>
            </div>
          </div>
        </div>

        {/* 注册表单卡片 */}
        <div className="bg-white rounded-[16px] w-[calc(100%-32px)] mx-4 p-6 shadow-sm border border-[#EEEEEE] shrink-0">
          {/* 昵称输入框 */}
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="请输入昵称" 
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] px-3 text-[14px] text-[#333333] outline-none focus:border-[#FF8C42] placeholder:text-[#999999] transition-colors"
            />
          </div>

          {/* 手机号输入框 */}
          <div className="mb-4">
            <input 
              type="tel" 
              placeholder="请输入手机号" 
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] px-3 text-[14px] text-[#333333] outline-none focus:border-[#FF8C42] placeholder:text-[#999999] transition-colors"
            />
          </div>

          {/* 验证码输入框 */}
          <div className="mb-6 relative flex items-center">
            <input 
              type="text" 
              placeholder="请输入验证码" 
              className="w-full h-[44px] rounded-[8px] border border-[#E5E5E5] pl-3 pr-[90px] text-[14px] text-[#333333] outline-none focus:border-[#FF8C42] placeholder:text-[#999999] transition-colors"
            />
            <button className="absolute right-3 text-[#FF8C42] text-[14px] font-medium bg-transparent active:opacity-70 transition-opacity">
              获取验证码
            </button>
          </div>

          {/* 同意用户协议复选框（默认勾选） */}
          <div className="flex items-center gap-2 mb-8 cursor-pointer active:opacity-70 transition-opacity">
            <div className="w-[16px] h-[16px] rounded-full bg-[#FF8C42] flex items-center justify-center shrink-0">
              <Check className="w-[10px] h-[10px] text-white" strokeWidth={3} />
            </div>
            <span className="text-[12px] text-[#999999]">
              我已阅读并同意 <span className="text-[#FF8C42]">用户协议</span> 与 <span className="text-[#FF8C42]">隐私政策</span>
            </span>
          </div>

          {/* 注册大按钮 */}
          <button 
            onClick={() => navigate('/')} 
            className="w-full h-[48px] bg-[#FF8C42] rounded-[12px] text-white text-[16px] font-bold active:bg-[#F27E36] transition-colors flex items-center justify-center shadow-sm"
          >
            注册
          </button>
        </div>

        {/* 占位，把底部顶下去 */}
        <div className="flex-1"></div>
      </div>

      {/* 底部固定 5 个 TabBar */}
      <BottomNav />
    </div>
  );
}