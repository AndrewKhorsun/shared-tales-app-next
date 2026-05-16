"use client";

import { useEffect } from "react";
import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingModal } from "./onboarding-modal";

type Locale = "en" | "uk";

interface OnboardingProviderProps {
  initialCompleted: boolean;
  locale: Locale;
  children: React.ReactNode;
}

export function OnboardingProvider({ initialCompleted, locale, children }: OnboardingProviderProps) {
  const { isOpen, isCompleted, open, complete, closeIfCompleted } = useOnboarding(initialCompleted);

  useEffect(() => {
    const handler = () => open();
    window.addEventListener("open-onboarding", handler);
    return () => window.removeEventListener("open-onboarding", handler);
  }, [open]);

  return (
    <>
      {children}
      <OnboardingModal
        isOpen={isOpen}
        isCompleted={isCompleted}
        defaultLocale={locale}
        onComplete={complete}
        onClose={closeIfCompleted}
      />
    </>
  );
}
