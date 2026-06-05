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
    user?: {
      id?: number;
      name?: string;
      avatar?: string;
    };
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

  const firstImage = post.images?.[0]
    ? getMediaUrl(post.images[0])
    : "";
  const userName = post.user?.name || t("common.user");
  const userAvatar = post.user?.avatar || "";

  const handleSaveToAlbum = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        backgroundColor: "#ffffff",
      });

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) {
        // Fallback: use data URL
        const url = canvas.toDataURL("image/png");
        triggerDownload(url, `pawgram-share-${post.id}.png`);
      } else {
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `pawgram-share-${post.id}.png`);
        URL.revokeObjectURL(url);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Save to album failed:", err);
      // Last resort: simple canvas download
      try {
        if (!cardRef.current) return;
        const canvas = await html2canvas(cardRef.current, {
          useCORS: true,
          allowTaint: true,
          scale: 2,
          backgroundColor: "#ffffff",
        });
        const url = canvas.toDataURL("image/png");
        triggerDownload(url, `pawgram-share-${post.id}.png`);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      } catch (fallbackErr) {
        console.error("Fallback save also failed:", fallbackErr);
      }
    } finally {
      setSaving(false);
    }
  };

  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center">
      {/* Back button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active:bg-white/30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Card preview */}
      <div className="flex flex-col items-center gap-4 px-4">
        <p className="text-white text-[14px] font-medium opacity-80">
          {t("shareCard.preview")}
        </p>

        {/* The share card */}
        <div
          ref={cardRef}
          className="w-[300px] bg-white rounded-2xl overflow-hidden shadow-2xl"
          style={{ border: "3px solid #FF8C42" }}
        >
          {/* Post first image */}
          <div className="w-full aspect-[4/3] bg-gray-100 relative overflow-hidden">
            {firstImage ? (
              <ImageWithFallback
                src={firstImage}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-[40px]">🐾</span>
              </div>
            )}
            {/* App logo badge on top-left */}
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
              <img
                src="/app-icon.png"
                alt="PawGram"
                className="w-5 h-5 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="text-[11px] font-bold text-[#FF8C42]">
                {t("common.brandName")}
              </span>
            </div>
          </div>

          {/* Card body */}
          <div className="p-4">
            {/* Author info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0">
                {userAvatar ? (
                  <ImageWithFallback
                    src={userAvatar}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[18px]">
                    🐾
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-bold text-[#333] truncate">
                  {userName}
                </p>
                <p className="text-[11px] text-[#999]">
                  {t("shareCard.sharedFrom")}
                </p>
              </div>
            </div>

            {/* Post content preview */}
            {post.content && (
              <p className="text-[12px] text-[#666] leading-relaxed mb-3 line-clamp-2">
                {post.content}
              </p>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.breed && (
                <span className="bg-[#FFF3E6] text-[#FF8C42] px-2 py-0.5 rounded text-[10px] font-medium">
                  #{(t as any)("pet.breeds." + post.breed, post.breed)}
                </span>
              )}
              {post.location && (
                <span className="bg-[#F5F5F5] text-[#666] px-2 py-0.5 rounded text-[10px]">
                  📍{post.location}
                </span>
              )}
            </div>

            {/* Bottom: QR + branding */}
            <div
              className="flex items-center justify-between pt-3"
              style={{ borderTop: "1px dashed #FF8C42" }}
            >
              <div className="flex items-center gap-2">
                <img
                  src="/app-icon.png"
                  alt="PawGram"
                  className="w-8 h-8 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <div>
                  <p className="text-[11px] font-bold text-[#FF8C42] leading-tight">
                    {t("common.brandName")}
                  </p>
                  <p className="text-[9px] text-[#999] leading-tight">
                    {t("shareCard.scanToDownload")}
                  </p>
                </div>
              </div>
              {/* QR code placeholder using app icon */}
              <div className="w-12 h-12 rounded-lg border-2 border-[#FF8C42] bg-[#FFF3E6] flex items-center justify-center overflow-hidden">
                <img
                  src="/app-icon.png"
                  alt="QR"
                  className="w-8 h-8 object-cover"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    const parent = el.parentElement;
                    if (parent) {
                      parent.innerHTML =
                        '<span style="font-size:24px">🐾</span>';
                    }
                  }}
                />
              </div>
            </div>

            {/* Paw print decoration */}
            <div className="flex justify-center gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="text-[#FF8C42] opacity-30 text-[10px]"
                >
                  🐾
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[14px] font-medium active:bg-white/30"
        >
          {t("common.close")}
        </button>
        <button
          onClick={handleSaveToAlbum}
          disabled={saving}
          className="px-6 py-2.5 rounded-full bg-[#FF8C42] text-white text-[14px] font-medium flex items-center gap-2 active:bg-[#E67A35] disabled:opacity-60"
        >
          <Download className="w-4 h-4" />
          {saving
            ? t("shareCard.saving")
            : saved
              ? t("shareCard.saved")
              : t("shareCard.saveToAlbum")}
        </button>
      </div>
    </div>
  );
}
