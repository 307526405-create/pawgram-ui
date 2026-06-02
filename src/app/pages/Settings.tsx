import { useNavigate } from "react-router";
import { BottomNav } from "../components/BottomNav";
import { ChevronLeft, UserPen, Shield, Lock, Bell, Info, Trash2, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { logout } from "../api/auth";

function SubPage({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col">
      <div className="pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0 border-b border-[#F0F0F0]">
        <button onClick={onClose} className="p-1 -ml-1"><ChevronLeft className="w-6 h-6 text-[#333]"/></button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] mr-8">{title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}

export function Settings() {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [showCache, setShowCache] = useState(false);
  const [page, setPage] = useState<string | null>(null);

  const renderPage = () => {
    switch(page) {
      case 'profile': return (
        <SubPage title="编辑个人资料" onClose={() => setPage(null)}>
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F5F5F5]"/>
              <div><button className="text-[#FF8C42] text-[13px]">更换头像</button></div>
            </div>
            <div>
              <label className="text-[12px] text-[#999] mb-1 block">昵称</label>
              <input className="w-full h-10 bg-[#F5F5F5] rounded-lg px-3 text-[14px] outline-none" defaultValue="王丽丽"/>
            </div>
            <div>
              <label className="text-[12px] text-[#999] mb-1 block">简介</label>
              <textarea className="w-full h-20 bg-[#F5F5F5] rounded-lg px-3 py-2 text-[14px] outline-none resize-none" defaultValue="金毛&布偶猫铲屎官 | 爱生活爱宠物"/>
            </div>
            <button className="w-full h-11 bg-[#FF8C42] text-white rounded-xl text-[15px] font-bold">保存</button>
          </div>
        </SubPage>
      );
      case 'security': return (
        <SubPage title="账号与安全" onClose={() => setPage(null)}>
          <div className="divide-y divide-[#F5F5F5]">
            {[{label:'修改密码',desc:'******'},{label:'绑定手机',desc:'138****8888'},{label:'微信绑定',desc:'已绑定'}].map((m,i) => (
              <div key={i} className="px-4 py-4 flex items-center justify-between">
                <div><div className="text-[14px] text-[#333]">{m.label}</div><div className="text-[12px] text-[#999]">{m.desc}</div></div>
                <ChevronRight className="w-4 h-4 text-[#CCC]"/>
              </div>
            ))}
          </div>
        </SubPage>
      );
      case 'privacy': return (
        <SubPage title="隐私设置" onClose={() => setPage(null)}>
          <div className="divide-y divide-[#F5F5F5]">
            {[{label:'黑名单',desc:'0人'},{label:'谁可以看我的帖子',desc:'所有人'},{label:'隐藏我的位置',desc:'关闭'}].map((m,i) => (
              <div key={i} className="px-4 py-4 flex items-center justify-between">
                <div><div className="text-[14px] text-[#333]">{m.label}</div><div className="text-[12px] text-[#999]">{m.desc}</div></div>
                <ChevronRight className="w-4 h-4 text-[#CCC]"/>
              </div>
            ))}
          </div>
        </SubPage>
      );
      case 'notification': return (
        <SubPage title="通知设置" onClose={() => setPage(null)}>
          <div className="divide-y divide-[#F5F5F5]">
            {[{label:'消息推送',on:true},{label:'互动提醒',on:true},{label:'系统通知',on:true},{label:'声音',on:false}].map((m,i) => (
              <div key={i} className="px-4 py-4 flex items-center justify-between">
                <span className="text-[14px] text-[#333]">{m.label}</span>
                <div className={`w-11 h-6 rounded-full relative transition-colors ${m.on ? 'bg-[#FF8C42]' : 'bg-[#E5E5E5]'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${m.on ? 'left-[22px]' : 'left-0.5'}`}/>
                </div>
              </div>
            ))}
          </div>
        </SubPage>
      );
      case 'about': return (
        <SubPage title="关于爪印" onClose={() => setPage(null)}>
          <div className="p-6 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-[#FF8C42] mx-auto flex items-center justify-center"><span className="text-2xl">🐾</span></div>
            <div className="text-[17px] font-bold text-[#333]">爪印 PawGram</div>
            <div className="text-[13px] text-[#999]">Version 1.0.0</div>
            <div className="text-[12px] text-[#BBB] pt-4">© 2026 广东雅和网络科技有限公司</div>
          </div>
        </SubPage>
      );
      default: return null;
    }
  };

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      {page && renderPage()}

      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center px-4 shrink-0">
        <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ChevronLeft className="w-6 h-6 text-[#333]"/></button>
        <h1 className="flex-1 text-center text-[17px] font-bold text-[#333] mr-8">设置</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-[var(--app-bottom-nav-height)] [&::-webkit-scrollbar]:hidden">
        <div className="mx-4 mt-2 bg-white rounded-2xl shadow-sm border border-[#F0F0F0]">
          {[
            { icon:UserPen, label:'编辑个人资料', page:'profile' },
            { icon:Shield, label:'账号与安全', page:'security' },
            { icon:Lock, label:'隐私设置', page:'privacy' },
            { icon:Bell, label:'通知设置', page:'notification' },
            { icon:Info, label:'关于爪印', page:'about' },
          ].map((m, i) => (
            <div key={i} onClick={() => setPage(m.page)} className={`px-4 h-14 flex items-center justify-between ${i<4?'border-b border-[#F5F5F5]':''} cursor-pointer active:bg-[#F9F9F9]`}>
              <div className="flex items-center gap-3">
                <m.icon className="w-4 h-4 text-[#666]"/>
                <span className="text-[14px] text-[#333] font-medium">{m.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#CCC]"/>
            </div>
          ))}
        </div>

        <div className="mx-4 mt-8 bg-white rounded-2xl shadow-sm border border-[#F0F0F0]">
          <div onClick={() => setShowCache(true)} className="px-4 h-14 flex items-center justify-between cursor-pointer active:bg-[#F9F9F9] border-b border-[#F5F5F5]">
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4 text-[#666]"/>
              <span className="text-[14px] text-[#333] font-medium">清除缓存</span>
            </div>
            <div className="flex items-center gap-1"><span className="text-[13px] text-[#999]">23.5MB</span><ChevronRight className="w-4 h-4 text-[#CCC]"/></div>
          </div>
          <div onClick={() => setShowLogout(true)} className="px-4 h-14 flex items-center justify-center cursor-pointer active:bg-[#F9F9F9]">
            <span className="text-[14px] text-[#FF4D4F] font-medium">退出登录</span>
          </div>
        </div>
      </div>

      {showLogout && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[280px] text-center">
            <p className="text-[15px] text-[#333] mb-2">确定退出登录？</p><p className="text-[12px] text-[#999] mb-6">退出后需要重新登录</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 h-10 bg-[#F5F5F5] rounded-lg text-[14px] text-[#666]">取消</button>
              <button onClick={() => { setShowLogout(false); logout(); }} className="flex-1 h-10 bg-[#FF4D4F] text-white rounded-lg text-[14px] font-bold">退出</button>
            </div>
          </div>
        </div>
      )}

      {showCache && (
        <div className="fixed inset-0 z-[90] bg-black/40 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[280px] text-center">
            <p className="text-[15px] text-[#333] mb-2">清除缓存</p><p className="text-[12px] text-[#999] mb-6">将清除临时文件和图片缓存</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCache(false)} className="flex-1 h-10 bg-[#F5F5F5] rounded-lg text-[14px] text-[#666]">取消</button>
              <button onClick={() => setShowCache(false)} className="flex-1 h-10 bg-[#FF8C42] text-white rounded-lg text-[14px] font-bold">确定</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
