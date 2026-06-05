import { useEffect, useState } from "react";

export function NetworkStatus() {
  const [status, setStatus] = useState<"online" | "offline" | "recovered" | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setStatus("offline");
      setVisible(true);
    };

    const handleOnline = () => {
      setStatus("recovered");
      setVisible(true);
      setTimeout(() => {
        setVisible(false);
      }, 2000);
    };

    // Set initial state
    if (!navigator.onLine) {
      setStatus("offline");
      setVisible(true);
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!visible || !status) return null;

  const isOffline = status === "offline";

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[300] flex items-center justify-center py-2 px-4 text-white text-sm font-medium transition-all duration-300 ${
        isOffline ? "bg-red-500" : "bg-green-500"
      }`}
      style={{ paddingTop: "max(8px, var(--app-safe-top, 0px))" }}
    >
      {isOffline ? "无网络连接" : "网络已恢复"}
    </div>
  );
}
