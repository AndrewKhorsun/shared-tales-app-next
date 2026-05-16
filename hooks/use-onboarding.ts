"use client";

import { useState, useCallback } from "react";
import { api } from "@/lib/api";

export function useOnboarding(initialCompleted: boolean) {
  const [isOpen, setIsOpen] = useState(!initialCompleted);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);

  const open = useCallback(() => setIsOpen(true), []);

  const complete = useCallback(async () => {
    setIsOpen(false);
    if (!isCompleted) {
      setIsCompleted(true);
      await api.post("/api/auth/complete-onboarding");
    }
  }, [isCompleted]);

  const closeIfCompleted = useCallback(() => {
    if (isCompleted) setIsOpen(false);
  }, [isCompleted]);

  return { isOpen, isCompleted, open, complete, closeIfCompleted };
}
