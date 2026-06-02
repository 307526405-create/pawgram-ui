import { Home, User, Compass, MessageSquare, Plus, Image as ImageIcon, Camera, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showPublishSheet, setShowPublishSheet] = useState(false);

  const openPostCreate = (source: "album" | "camera") => {
    setShowPublishSheet(false);
    navigate("/post", { state: { source } });
  };

  return (
    <>
      {showPublishSheet && (
        <div className="absolute inset-0 z-[80] flex flex-col justify-end bg-black/25" onClick={() => setShowPublishSheet(false)}>
          <div className="mx-3 mb-[calc(var(--app-bottom-nav-height)+8px)] rounded-[24px] bg-white p-4 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between px-1">
              <div>
                <h3 className="text-[16px] font-bold text-[#333333]">发布新动态</h3>
                <p className="mt-1 text-[12px] text-[#999999]">选择照片或拍摄后进入编辑页</p>
              </div>
              <button className="rounded-full bg-[#F5F5F5] p-2 active:scale-95" onClick={() => setShowPublishSheet(false)}>
                <X className="h-4 w-4 text-[#666666]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                className="flex flex-col items-center justify-center rounded-[18px] bg-[#FFF3E6] px-4 py-5 active:scale-[0.98] transition-transform"
                onClick={() => openPostCreate("album")}
              >
                <div className="mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white text-[#FF8C42] shadow-sm">
                  <ImageIcon className="h-6 w-6" />
                </div>
                <span className="text-[14px] font-bold text-[#333333]">从相册选择</span>
                <span className="mt-1 text-[11px] text-[#999999]">照片 / 视频</span>
              </button>

              <button
                className="flex flex-col items-center justify-center rounded-[18px] bg-[#FAFAFA] px-4 py-5 active:scale-[0.98] transition-transform border border-[#EEEEEE]"
                onClick={() => openPostCreate("camera")}
              >
                <div className="mb-3 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white text-[#FF8C42] shadow-sm">
                  <Camera className="h-6 w-6" />
                </div>
                <span className="text-[14px] font-bold text-[#333333]">拍摄</span>
                <span className="mt-1 text-[11px] text-[#999999]">打开相机</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#EEEEEE] pb-[var(--app-safe-bottom)] z-50">
        <div className="flex justify-around items-center h-[50px] relative px-2">
          <Link 
            to="/" 
            className={`flex flex-col items-center justify-center w-[20%] h-full ${location.pathname === '/' ? 'text-[#FF8C42]' : 'text-gray-400'}`}
          >
            <Home className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">首页</span>
          </Link>

          <Link 
            to="/discover" 
            onClick={(e) => {
              if (location.pathname === '/discover') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('pawgram:discover-tab-click'));
              }
            }}
            className={`flex flex-col items-center justify-center w-[20%] h-full ${location.pathname === '/discover' ? 'text-[#FF8C42]' : 'text-gray-400'}`}
          >
            <Compass className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/discover' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">发现</span>
          </Link>
          
          <button
            type="button"
            onClick={() => setShowPublishSheet(true)}
            className="flex flex-col items-center justify-center w-[20%] h-full relative"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full flex items-center justify-center shadow-sm z-10 bg-[#FF9A5C]">
              <Plus className="w-6 h-6 text-white" strokeWidth={2.75} />
            </div>
          </button>

          <Link 
            to="/messages" 
            className={`flex flex-col items-center justify-center w-[20%] h-full ${location.pathname === '/messages' ? 'text-[#FF8C42]' : 'text-gray-400'}`}
          >
            <MessageSquare className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/messages' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">消息</span>
          </Link>

          <Link 
            to="/profile" 
            className={`flex flex-col items-center justify-center w-[20%] h-full ${location.pathname === '/profile' || location.pathname === '/pet' ? 'text-[#FF8C42]' : 'text-gray-400'}`}
          >
            <User className="w-5 h-5 mb-0.5" strokeWidth={location.pathname === '/profile' || location.pathname === '/pet' ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">我的</span>
          </Link>
        </div>
      </div>
    </>
  );
}
