import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const { i18n } = useTranslation();
  const [fading, setFading] = useState(false);
  const isZh = i18n.language?.startsWith("zh");

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1800);
    const t2 = setTimeout(() => onDone(), 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`fixed inset-0 z-[999] flex items-center justify-center transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`}>
      <img
        src={isZh ? "/splash-zh.png" : "/splash-en.png"}
        alt="爪印 PawGram"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
