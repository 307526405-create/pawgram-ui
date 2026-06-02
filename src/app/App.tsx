import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useDarkMode } from "./hooks/useDarkMode";

function DarkModeInit() {
  const { theme, setTheme } = useDarkMode();

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e.detail) setTheme(e.detail);
    };
    window.addEventListener("pawgram:set-theme", handler as EventListener);
    return () => window.removeEventListener("pawgram:set-theme", handler as EventListener);
  }, [setTheme]);

  return null;
}

export default function App() {
  return (
    <>
      <DarkModeInit />
      <RouterProvider router={router} />
    </>
  );
}

