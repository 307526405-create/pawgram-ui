import { Plus, Image as ImageIcon, MapPin, Hash, AtSign, Dog, X } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";
import { useLocation } from "react-router";

const selectedMedia = [
  { id: 1, src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=600", alt: "已选择的宠物照片" }
];

const myPets = [
  { id: 1, name: "旺财", avatar: "https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150" },
  { id: 2, name: "咪咪", avatar: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&q=80&w=150" },
  { id: 3, name: "大黑", avatar: "https://images.unsplash.com/photo-1489924034176-2e678c29d4c6?auto=format&fit=crop&q=80&w=150" }
];

export function PostCreate() {
  const [selectedPet, setSelectedPet] = useState<number | null>(1);
  const location = useLocation();
  const source = location.state?.source === "camera" ? "相机拍摄" : "相册选择";

  return (
    <div className="h-full bg-[#FAFAFA] relative flex flex-col">
      {/* Header: 顶部留白54px给状态栏，总体高98px，无橙色背景 */}
      <div className="bg-[#FAFAFA]/90 backdrop-blur-md pt-[var(--app-safe-top)] h-[var(--app-header-height)] flex items-center justify-between px-4 shrink-0 relative z-40 border-b border-transparent">
        <div className="w-16"></div> {/* Spacer */}
        <h1 className="text-[#333333] text-[17px] font-bold tracking-wider">发布</h1>
        <div className="w-16 flex justify-end">
          <button className="bg-[#FF8C42] text-white text-[13px] font-bold px-3.5 py-1.5 rounded-full active:scale-95 transition-transform shadow-sm">
            发布
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-[calc(var(--app-bottom-nav-height)+6px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Text Input & Grid */}
        <div className="p-4 bg-white mb-2 shadow-sm border-b border-gray-50">
          <textarea
            className="w-full h-24 bg-transparent text-[14px] text-gray-900 placeholder:text-gray-400 outline-none resize-none"
            placeholder={`通过${source}，分享你和宠物的精彩瞬间...`}
          />
          
          {/* Media Preview */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {selectedMedia.map((media, index) => (
              <div key={media.id} className="relative h-[108px] w-[108px] shrink-0 overflow-hidden rounded-[10px] bg-[#F5F5F5]">
                <ImageWithFallback
                  src={media.src}
                  alt={media.alt}
                  className="h-full w-full object-cover"
                />
                <button className="absolute right-1.5 top-1.5 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-black/45 text-white active:scale-95">
                  <X className="h-3.5 w-3.5" />
                </button>
                <div className="absolute bottom-1.5 left-1.5 rounded-full bg-black/45 px-1.5 py-0.5 text-[10px] text-white">
                  {index + 1}
                </div>
              </div>
            ))}
            <button className="flex h-[108px] w-[108px] shrink-0 flex-col items-center justify-center rounded-[10px] border border-dashed border-[#DDDDDD] bg-[#FAFAFA] active:bg-[#F5F5F5] transition-colors">
              <Plus className="mb-1 h-6 w-6 text-[#999999]" />
              <span className="text-[12px] text-[#999999]">继续添加</span>
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3.5 bg-white mb-2 flex items-center justify-between border-y border-gray-50 shadow-sm">
          <button className="flex flex-col items-center gap-1 group active:scale-95">
            <ImageIcon className="w-6 h-6 text-gray-700" />
          </button>
          <button className="flex flex-col items-center gap-1 group active:scale-95">
            <MapPin className="w-6 h-6 text-gray-700" />
          </button>
          <button className="flex flex-col items-center gap-1 group active:scale-95">
            <Hash className="w-6 h-6 text-gray-700" />
          </button>
          <button className="flex flex-col items-center gap-1 group active:scale-95">
            <AtSign className="w-6 h-6 text-gray-700" />
          </button>
          <button className="flex flex-col items-center gap-1 group active:scale-95">
            <Dog className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Select Pet */}
        <div className="bg-white p-4 shadow-sm border-y border-gray-50">
          <h2 className="text-[14px] font-bold text-gray-900 mb-4">选择宠物</h2>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden -mx-4 px-4 pb-2">
            {myPets.map(pet => (
              <button 
                key={pet.id} 
                onClick={() => setSelectedPet(pet.id)}
                className={`shrink-0 snap-start flex flex-col items-center gap-1.5 transition-transform active:scale-95 ${
                  selectedPet === pet.id ? 'opacity-100' : 'opacity-50 grayscale'
                }`}
              >
                <div className={`rounded-full p-[2px] ${selectedPet === pet.id ? 'bg-[#FF8C42]' : 'bg-transparent'}`}>
                  <ImageWithFallback 
                    src={pet.avatar} 
                    alt={pet.name} 
                    className="w-[36px] h-[36px] rounded-full object-cover border-2 border-white" 
                  />
                </div>
                <span className={`text-[12px] ${selectedPet === pet.id ? 'text-[#FF8C42] font-bold' : 'text-gray-600'}`}>
                  {pet.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
