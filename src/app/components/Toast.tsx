import { useState, useEffect, useCallback } from "react";

let toastFn: ((msg: string) => void) | null = null;

export function toast(msg: string) {
  toastFn?.(msg);
}

export function Toast() {
  const [messages, setMessages] = useState<{ id: number; text: string }[]>([]);
  let idCounter = 0;

  const show = useCallback((text: string) => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    toastFn = show;
    return () => { toastFn = null; };
  }, [show]);

  if (messages.length === 0) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center gap-2 pointer-events-none">
      {messages.map(m => (
        <div
          key={m.id}
          className="bg-[#FF8C42] text-white px-5 py-2.5 rounded-full text-[14px] font-medium shadow-lg animate-[toast-in_0.3s_ease]"
        >
          {m.text}
        </div>
      ))}
    </div>
  );
}
