import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { useDarkMode } from "./hooks/useDarkMode";
import { SplashScreen } from "./components/SplashScreen";
import { Onboarding } from "./components/Onboarding";

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
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSplashDone = () => {
    setShowSplash(false);
    if (!localStorage.getItem("pawgram_onboarding_done")) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingDone = () => {
    setShowOnboarding(false);
    localStorage.setItem("pawgram_onboarding_done", "1");
  };

  // Replace initial history entry so native swipe-back doesn't land on a blank page
  useEffect(() => {
    if (!showSplash && !showOnboarding) {
      window.history.replaceState(null, "", window.location.href);
    }
  }, [showSplash, showOnboarding]);

  const appReady = !showSplash && !showOnboarding;

  return (
    <>
      <DarkModeInit />
      {appReady && <RouterProvider router={router} />}
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
    </>
  );
}
