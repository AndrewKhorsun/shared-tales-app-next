"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, List } from "lucide-react";
import { Book } from "@/types";
import { BookCard } from "./book-card";
import { ShelfRow } from "./shelf-row";
import { CreateBookModal } from "./create-book-modal";

interface BookGridProps {
  books: Book[];
}

type FilterType = "all" | "in-progress" | "complete";
type SortType = "updated" | "title";
type ViewType = "cards" | "shelf";

export function BookGrid({ books }: BookGridProps) {
  const t = useTranslations("BookGrid");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("updated");
  const [viewMode, setViewMode] = useState<ViewType>("cards");

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      if (filter === "all") return true;
      const total = Number(book.total_chapters ?? 0);
      const published = Number(book.published_chapters ?? 0);
      if (filter === "in-progress") return total > 0 && published < total;
      if (filter === "complete") return published > 0 && published === total;
      return true;
    });
  }, [books, filter]);

  const sortedBooks = useMemo(() => {
    const sorted = [...filteredBooks];
    if (sort === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    return sorted;
  }, [filteredBooks, sort]);

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`text-[12px] px-3 py-1 rounded-md border transition-colors cursor-pointer ${
              filter === "all"
                ? "border-amber text-amber bg-amber/10"
                : "border-border-soft text-fog hover:text-parchment"
            }`}
          >
            {t("filterAll")}
          </button>
          <button
            onClick={() => setFilter("in-progress")}
            className={`text-[12px] px-3 py-1 rounded-md border transition-colors cursor-pointer ${
              filter === "in-progress"
                ? "border-amber text-amber bg-amber/10"
                : "border-border-soft text-fog hover:text-parchment"
            }`}
          >
            {t("filterInProgress")}
          </button>
          <button
            onClick={() => setFilter("complete")}
            className={`text-[12px] px-3 py-1 rounded-md border transition-colors cursor-pointer ${
              filter === "complete"
                ? "border-amber text-amber bg-amber/10"
                : "border-border-soft text-fog hover:text-parchment"
            }`}
          >
            {t("filterComplete")}
          </button>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortType)}
          className="text-sm bg-input border border-border-soft rounded-md px-3 py-1.5 text-parchment focus:outline-none focus:border-border-active cursor-pointer appearance-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23B8C4B2' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            paddingRight: '28px',
          }}
        >
          <option value="updated">{t("sortRecent")}</option>
          <option value="title">{t("sortTitle")}</option>
        </select>

        <div className="ml-auto flex gap-1">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              viewMode === "cards"
                ? "bg-surface text-parchment"
                : "text-fog hover:text-parchment"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("shelf")}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              viewMode === "shelf"
                ? "bg-surface text-parchment"
                : "text-fog hover:text-parchment"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Grid or Shelf View */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <CreateBookModal />
          {sortedBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="border border-border-soft rounded-xl overflow-hidden">
            {sortedBooks.map((book) => (
              <ShelfRow key={book.id} book={book} />
            ))}
          </div>
          <CreateBookModal variant="row" />
        </div>
      )}
    </div>
  );
}
