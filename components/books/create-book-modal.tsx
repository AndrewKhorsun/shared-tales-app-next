"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { Book } from "@/types";
import { Modal } from "@/components/ui/modal";

export function CreateBookModal({ variant = "card" }: { variant?: "card" | "row" }) {
  const t = useTranslations("CreateBookModal");
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setIsOpen(false);
    setTitle("");
    setDescription("");
    setError(null);
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { error } = await api.post<{ book: Book }>("/api/books", { title, description });

    setIsLoading(false);

    if (error) {
      setError(error);
      return;
    }

    handleClose();
    router.refresh();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={
          variant === "row"
            ? "flex items-center gap-2 px-4 py-3 w-full text-left text-fog hover:text-parchment hover:bg-surface transition-colors border border-dashed border-fog/20 hover:border-fog/40 rounded-xl cursor-pointer"
            : "flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-surface hover:bg-elevated transition-colors text-fog hover:text-parchment border border-dashed border-fog/20 hover:border-fog/40 min-h-30 cursor-pointer"
        }
      >
        <span className="text-xl leading-none">+</span>
        <span className="text-sm font-light">{t("triggerLabel")}</span>
      </button>

      <Modal isOpen={isOpen} onClose={handleClose} title={t("modalTitle")}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-fog font-light">{t("titleLabel")}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder={t("titlePlaceholder")}
              className="bg-surface rounded-lg px-3 py-2 text-sm text-parchment placeholder:text-fog/40 outline-none focus:ring-1 focus:ring-fog/30 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-fog font-light">{t("descriptionLabel")}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("descriptionPlaceholder")}
              rows={3}
              className="bg-surface rounded-lg px-3 py-2 text-sm text-parchment placeholder:text-fog/40 outline-none focus:ring-1 focus:ring-fog/30 transition resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-sm text-fog hover:text-parchment transition-colors cursor-pointer"
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-sm bg-amber-dim text-parchment hover:bg-amber transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? t("creating") : t("create")}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
