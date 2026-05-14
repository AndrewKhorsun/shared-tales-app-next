"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Chapter, Book } from "@/types";
import { CreateChapterModal } from "@/components/chapters/create-chapter-modal";

function StatusDot({ status }: { status: Chapter["status"] }) {
  if (status === "published") {
    return (
      <span className="inline-block w-2 h-2 rounded-full bg-amber shrink-0" />
    );
  }
  if (status === "draft") {
    return (
      <span className="inline-block w-2 h-2 rounded-full border border-fog/50 shrink-0" />
    );
  }
  return (
    <span className="inline-block w-2 h-2 rounded-full bg-border-mid shrink-0" />
  );
}

function ChapterRow({ chapter, bookId }: { chapter: Chapter; bookId: string }) {
  const path = usePathname();
  const href = `/books/${bookId}/chapters/${chapter.id}`;
  const isActive = path === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors border-l-2 ${
        isActive
          ? "bg-elevated border-amber"
          : "border-transparent hover:bg-surface"
      }`}
    >
      <span className="font-mono text-[10px] w-4.5 shrink-0 tracking-wider text-fog/60">
        {String(chapter.order_index).padStart(2, "0")}
      </span>
      <StatusDot status={chapter.status} />
      <div className="flex-1 min-w-0">
        <div
          className={`text-[13px] truncate ${
            isActive ? "text-parchment font-medium" : "text-fog"
          }`}
        >
          {chapter.title}
        </div>
      </div>
    </Link>
  );
}

interface ChapterSidebarNewProps {
  book: Book;
  chapters: Chapter[];
  bookId: string;
}

export function ChapterSidebarNew({
  book,
  chapters,
  bookId,
}: ChapterSidebarNewProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const published = chapters.filter((c) => c.status === "published").length;
  const totalWords = chapters.reduce((sum, c) => sum + (c.word_count ?? 0), 0);

  return (
    <aside className="w-62 shrink-0 bg-page border-r border-border-soft flex flex-col h-full">
      {/* Back link */}
      <div className="px-3 pt-3 pb-1">
        <Link
          href="/books"
          className="flex items-center gap-1.5 text-[11px] text-fog/70 px-2 py-1.5 rounded-lg hover:bg-surface transition-colors"
        >
          <span>←</span> All books
        </Link>
      </div>

      {/* Book header */}
      <div className="px-4.5 pt-2 pb-3.5">
        <div className="font-serif text-[17px] text-parchment leading-tight mb-1">
          {book.title}
        </div>
        <div className="text-[11px] text-fog/70 tracking-wide">
          {book.author_name}
        </div>
      </div>

      {/* Mini stats */}
      <div className="mx-4.5 mb-3.5 px-3 py-2.5 bg-surface rounded-lg flex justify-between font-mono text-[10px] tracking-widest uppercase">
        <div>
          <div className="text-fog/60">chapters</div>
          <div className="text-parchment text-[13px] mt-0.5">
            {published}/{chapters.length}
          </div>
        </div>
        <div className="text-right">
          <div className="text-fog/60">words</div>
          <div className="text-parchment text-[13px] mt-0.5">
            {totalWords > 0 ? `${(totalWords / 1000).toFixed(1)}k` : "—"}
          </div>
        </div>
      </div>

      {/* Book nav */}
      <div className="px-3">
        <div className="text-[9px] text-fog/50 tracking-[.12em] uppercase px-3 py-2">
          The Book
        </div>
        <div className="flex flex-col gap-0.5">
          {[
            { label: "Overview", href: `/books/${bookId}` },
            { label: "Book plan", href: `/books/${bookId}/book-plan` },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] text-fog hover:text-parchment hover:bg-surface transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Chapters list */}
      <div className="px-3 mt-2.5 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="text-[11px] text-fog/70 tracking-[.08em] uppercase font-medium">
            Chapters
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="text-[18px] text-fog/70 hover:text-parchment leading-none cursor-pointer transition-colors"
          >
            +
          </button>
        </div>
        <div className="flex flex-col gap-0.5 overflow-y-auto flex-1 pb-4 scrollbar-thin">
          {chapters.map((c) => (
            <ChapterRow key={c.id} chapter={c} bookId={bookId} />
          ))}
        </div>
      </div>

      <CreateChapterModal
        bookId={bookId}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={() => {
          setIsCreateOpen(false);
        }}
        orderIndex={chapters.length}
      />
    </aside>
  );
}
