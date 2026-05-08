"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ImagePlus, Pencil, Trash2, Loader2 } from "lucide-react";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface BookCoverProps {
  bookId: number;
  coverUrl: string | null | undefined;
  onUpdate: (newCoverUrl: string | null) => void;
}

type Toast = { message: string; key: number };

export function BookCover({ bookId, coverUrl, onUpdate }: BookCoverProps) {
  const t = useTranslations("BookCover");
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  function showToast(message: string) {
    const key = Date.now();
    setToast({ message, key });
    setTimeout(
      () => setToast((prev) => (prev?.key === key ? null : prev)),
      3500,
    );
  }

  function openPicker() {
    inputRef.current?.click();
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!ACCEPTED_TYPES.includes(file.type)) {
      showToast(t("error_type"));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      showToast(t("error_size"));
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("cover", file);
      const res = await fetch(`/api/books/${bookId}/cover`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onUpdate(data.book?.cover_image_url ?? null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/books/${bookId}/cover`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      onUpdate(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  }

  const hasCover = Boolean(coverUrl);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-2 text-fog">
          <Loader2 className="w-6 h-6 animate-spin text-amber" />
        </div>
      ) : hasCover ? (
        <div className="relative w-full h-full group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              coverUrl?.startsWith("http")
                ? coverUrl
                : `${process.env.NEXT_PUBLIC_API_URL}${coverUrl ?? ""}`
            }
            alt="Book cover"
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-canvas/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              onClick={openPicker}
              className="flex items-center gap-1.5 bg-elevated border border-border-soft text-parchment font-mono text-[10px] px-3 py-1.5 rounded hover:bg-surface transition-colors"
            >
              <Pencil className="w-3 h-3" />
              {t("change")}
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 bg-rust/20 border border-rust/40 text-rust font-mono text-[10px] px-3 py-1.5 rounded hover:bg-rust/30 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              {t("delete")}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={openPicker}
          className="flex flex-col items-center gap-2 text-fog hover:text-parchment transition-colors group w-full h-full justify-center"
        >
          <div className="w-12 h-12 rounded-full bg-surface border border-border-soft flex items-center justify-center group-hover:border-amber/40 transition-colors">
            <ImagePlus className="w-5 h-5" />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wide">
            {t("upload")}
          </span>
        </button>
      )}

      {toast && (
        <div
          key={toast.key}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-rust text-parchment font-mono text-[10px] px-3 py-1.5 rounded shadow-lg whitespace-nowrap z-20 animate-fade-in"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}
