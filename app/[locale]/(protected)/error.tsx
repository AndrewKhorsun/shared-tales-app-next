"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Protected layout error]", error.message);
  }, [error]);

  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-canvas gap-6">
      <p className="font-serif text-parchment text-xl">Something went wrong</p>
      <p className="text-fog text-sm max-w-sm text-center">{error.message}</p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="px-4 py-2 bg-amber text-page text-sm rounded-lg cursor-pointer"
        >
          Try again
        </button>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-fog text-sm hover:text-parchment transition-colors cursor-pointer"
        >
          Go home
        </button>
      </div>
    </div>
  );
}
