"use client";

import { useState } from "react";
import { ONBOARDING_TRANSLATIONS, type OnboardingLocale } from "./onboarding-translations";

const STEPS_IMAGES = [
  "/onboarding/Step-1.png",
  "/onboarding/Step-2.png",
  "/onboarding/Step-3.png",
  "/onboarding/Step-4.png",
  "/onboarding/Step-5.png",
  "/onboarding/Step-6.png",
  "/onboarding/Step-7.png",
];

type Locale = OnboardingLocale;

interface OnboardingModalProps {
  isOpen: boolean;
  isCompleted: boolean;
  defaultLocale: Locale;
  onComplete: () => void;
  onClose: () => void;
}

export function OnboardingModal({
  isOpen,
  isCompleted,
  defaultLocale,
  onComplete,
  onClose,
}: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  if (!isOpen) return null;

  const t = ONBOARDING_TRANSLATIONS[locale];
  const currentStep = t.steps[step]!;
  const isLastStep = step === t.steps.length - 1;
  const canClose = isCompleted;

  function handleNext() {
    if (isLastStep) {
      onComplete();
      setStep(0);
    } else {
      setStep((s) => s + 1);
    }
  }

  function handlePrev() {
    setStep((s) => Math.max(0, s - 1));
  }

  function handleBackdropClick() {
    if (canClose) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-3xl mx-4 bg-elevated rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ height: "780px", maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="font-serif text-amber text-lg tracking-wide">Shared Tales</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {(["en", "uk"] as Locale[]).map((code) => (
                <button
                  key={code}
                  onClick={() => setLocale(code)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                    locale === code
                      ? "text-amber font-medium"
                      : "text-fog hover:text-parchment"
                  }`}
                >
                  {code === "en" ? "EN" : "UA"}
                </button>
              ))}
            </div>
            {canClose && (
              <button
                onClick={onClose}
                className="text-fog hover:text-parchment transition-colors text-base leading-none cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Screenshot */}
        <div className="relative w-full overflow-hidden" style={{ height: 480 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={STEPS_IMAGES[step]!}
            alt={`Step ${step + 1}`}
            className="w-full h-full object-cover object-top"
          />
          {/* Vignette — soft edges, stronger at bottom */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                linear-gradient(to bottom, #2E3D2B 0%, transparent 3%, transparent 70%, #2E3D2B 100%),
                linear-gradient(to right, #2E3D2B 0%, transparent 3%, transparent 97%, #2E3D2B 100%)
              `,
            }}
          />
        </div>

        {/* Step content */}
        <div className="px-8 pt-2 pb-4 flex-1 flex flex-col">
          <h2 className="font-serif text-parchment text-2xl mb-2 leading-snug">
            {currentStep.title}
          </h2>
          <p className="text-fog text-sm leading-relaxed">{currentStep.description}</p>
        </div>

        {/* Footer */}
        <div className="px-8 pb-6 pt-3 flex items-center justify-between border-t border-border-soft">
          {/* Step dots */}
          <div className="flex items-center gap-2">
            {t.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => isCompleted && setStep(i)}
                className={`rounded-full transition-all ${
                  i === step ? "w-5 h-2 bg-amber" : "w-2 h-2 bg-surface"
                } ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            {step > 0 && (
              <button
                onClick={handlePrev}
                className="text-fog hover:text-parchment text-sm transition-colors cursor-pointer"
              >
                {t.prev}
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-5 py-2 bg-amber text-page text-sm font-medium rounded-lg hover:bg-amber/90 transition-colors cursor-pointer"
            >
              {isLastStep ? t.finish : t.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
