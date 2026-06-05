import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Download } from "lucide-react";
import html2canvas from "html2canvas";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ShareCardProps {
  open: boolean;
  onClose: () => void;
  post: {
    id: number;
    images?: string[];
    content?: string;
    user?: { id?: number; name?: string; avatar?: string };
    breed?: string;
    location?: string;
  } | null;
}

const getMediaUrl = (item: any) =>
  typeof item === "string" ? item : item?.url || item?.poster || "";

export function ShareCard({ open, onClose, post }: ShareCardProps) {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!open || !post) return null;

  const firstImage = post.images?.[0] ? getMediaUrl(post.images[0]) : "";
  const userName = post.user?.name || t("common.user");
  const userAvatar = post.user?.avatar || "";

  const handleSave = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, { useCORS: true, scale: 2, backgroundColor: "#fff" });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url; a.download = `pawgram-${post.id}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } catch {} finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
      <button onClick={onClose} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <div className="flex flex-col items-center gap-3 px-4">
        <p className="text-white text-[13px] opacity-70">{t("shareCard.preview")}</p>
        <div ref={cardRef} className="w-[300px] bg-white rounded-2xl overflow-hidden shadow-2xl" style={{border:"2px solid #FF8C42"}}>
          {/* Big image */}
          <div className="w-full aspect-[3/4] bg-gray-100 relative overflow-hidden">
            {firstImage ? (
              <ImageWithFallback src={firstImage} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400"><span className="text-[48px]">🐾</span></div>
            )}
            <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5">
              <img src="/app-icon.png" alt="" className="w-4 h-4 rounded-full object-cover" />
              <span className="text-[10px] font-bold text-white">{t("common.brandName")}</span>
            </div>
          </div>
          {/* Small info below */}
          <div className="px-3 py-2 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                {userAvatar ? <ImageWithFallback src={userAvatar} className="w-full h-full object-cover" /> : <span className="text-[14px]">🐾</span>}
              </div>
              <span className="text-[11px] font-bold text-[#333] truncate">{userName}</span>
            </div>
            {post.content && <p className="text-[10px] text-[#999] leading-snug line-clamp-1">{post.content}</p>}
            <div className="flex items-center justify-between pt-1" style={{borderTop:"1px solid #F0F0F0"}}>
              <div className="flex items-center gap-1.5">
                <img src="/app-icon.png" alt="" className="w-5 h-5 rounded object-cover" />
                <span className="text-[10px] font-bold text-[#FF8C42]">{t("common.brandName")}</span>
              </div>
              <span className="text-[9px] text-[#BBB]">{t("shareCard.scanToDownload")}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-5">
        <button onClick={onClose} className="px-5 py-2 rounded-full bg-white/20 text-white text-[13px]">{t("common.close")}</button>
        <button onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-full bg-[#FF8C42] text-white text-[13px] font-medium flex items-center gap-1.5">
          <Download className="w-3.5 h-3.5" />
          {saving ? t("shareCard.saving") : saved ? t("shareCard.saved") : t("shareCard.saveToAlbum")}
        </button>
      </div>
    </div>
  );
}
