"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Book, BookPlan } from "@/types";
import { Chapter } from "@/types/chapters";
import { StatusPill } from "./status-pill";
import { BookCover } from "./BookCover";
import { DropdownMenu } from "@/components/ui/dropdown-menu";

interface BookOverviewProps {
  book: Book;
  chapters: Chapter[];
  plan: BookPlan | null;
}

function wordCount(content: string): number {
  return content
    ? content
        .split(/\s+/)
        .filter((word) => word.length > 0).length
    : 0;
}

function getCharacterColor(index: number): string {
  const colors = ["#C9A96E", "#9B4A35", "#9DB898"];
  return colors[index % colors.length];
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BookOverview({ book, chapters, plan }: BookOverviewProps) {
  const router = useRouter();
  const locale = useLocale();
  const [coverUrl, setCoverUrl] = useState<string | null>(book.cover_image_url ?? null);
  const [exporting, setExporting] = useState(false);

  async function handleExport(format: "docx" | "pdf" | "epub") {
    setExporting(true);
    try {
      const res = await fetch(`/api/books/${book.id}/export/${format}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }
  const totalChapters = chapters.length;
  const publishedChapters = chapters.filter(
    (ch) => ch.status === "published"
  ).length;
  const progressPercent = totalChapters > 0 ? (publishedChapters / totalChapters) * 100 : 0;

  const genre = plan?.genre || "Unknown Genre";
  const language = plan?.language || "en";
  const premise = plan?.generation_settings?.plot_arc?.premise || "";
  const conflict = plan?.generation_settings?.plot_arc?.conflict || "";
  const resolution = plan?.generation_settings?.plot_arc?.resolution || "";
  const characters = plan?.generation_settings?.characters || [];

  return (
    <div className="bg-page">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back link */}
        <Link
          href="/books"
          className="font-mono text-[11px] text-fog hover:text-parchment transition-colors block mb-8"
        >
          ← All books
        </Link>

        {/* Hero section */}
        <div className="grid grid-cols-[1fr_260px] gap-8 mb-12">
          {/* Left column */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog mb-3">
              {genre} · {language.toUpperCase()}
            </p>

            <h1 className="font-serif text-[52px] font-normal leading-[1.05] text-parchment mb-2">
              {book.title}
            </h1>

            <p className="font-serif-body italic text-[16px] text-fog mb-6">
              by {book.author_name}
            </p>

            {premise && (
              <p className="text-[15px] text-fog/90 leading-relaxed mt-4 max-w-[480px] mb-6">
                {premise}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => router.push(`/${locale}/books/${book.id}/chapters`)}
                className="bg-amber text-canvas font-mono text-[11px] px-4 py-2 rounded hover:bg-amber/90 transition-colors"
              >
                Continue writing →
              </button>
              <button
                onClick={() => router.push(`/${locale}/books/${book.id}/book-plan`)}
                className="border border-border-soft text-parchment font-mono text-[11px] px-4 py-2 rounded hover:bg-surface/30 transition-colors"
              >
                Edit book plan
              </button>
              <DropdownMenu
                trigger={exporting ? "Exporting..." : "Export"}
                disabled={exporting}
                items={[
                  { label: "Export as docx", onClick: () => handleExport("docx") },
                ]}
              />
            </div>
          </div>

          {/* Right column - cover card */}
          <div className="bg-elevated rounded-xl border border-border-soft relative overflow-hidden" style={{ minHeight: 260 }}>
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-amber z-10" />

            {coverUrl ? (
              <div className="w-full h-full" style={{ minHeight: 260 }}>
                <BookCover bookId={book.id} coverUrl={coverUrl} onUpdate={setCoverUrl} />
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-gradient-to-br from-amber/5 to-transparent" />
                <div className="relative z-10 p-6 flex flex-col h-full">
                  <p className="font-mono text-[9px] text-fog uppercase mb-4">
                    A Novel · in progress
                  </p>
                  <h2 className="font-serif text-[22px] text-parchment mb-1">
                    {book.title}
                  </h2>
                  <p className="text-[13px] text-fog italic mb-4">
                    {book.author_name}
                  </p>
                  {totalChapters > 0 && (
                    <div className="w-full bg-surface rounded-full h-1 mb-3 overflow-hidden">
                      <div
                        className="bg-amber h-1 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  )}
                  <p className="font-mono text-[11px] text-fog mb-6">
                    {publishedChapters}/{totalChapters} CHAPTERS
                  </p>
                  <div className="flex-1 flex items-end">
                    <BookCover bookId={book.id} coverUrl={null} onUpdate={setCoverUrl} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Chapters table */}
        <div className="border border-border-soft rounded-xl overflow-hidden mb-10">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-surface border-b border-border-soft">
                <th className="text-fog font-mono text-[10px] uppercase tracking-[0.08em] px-4 py-3 text-left w-12">
                  #
                </th>
                <th className="text-fog font-mono text-[10px] uppercase tracking-[0.08em] px-4 py-3 text-left">
                  Title
                </th>
                <th className="text-fog font-mono text-[10px] uppercase tracking-[0.08em] px-4 py-3 text-left w-28">
                  Status
                </th>
                <th className="text-fog font-mono text-[10px] uppercase tracking-[0.08em] px-4 py-3 text-left w-20">
                  Words
                </th>
                <th className="text-fog font-mono text-[10px] uppercase tracking-[0.08em] px-4 py-3 text-left w-24">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chapter, idx) => (
                <tr
                  key={chapter.id}
                  onClick={() =>
                    router.push(
                      `/${locale}/books/${book.id}/chapters/${chapter.id}`
                    )
                  }
                  className="hover:bg-surface/50 cursor-pointer border-b border-border-soft last:border-b-0 transition-colors"
                >
                  <td className="px-4 py-3 text-[13px] text-fog">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-parchment">
                    {chapter.title}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={chapter.status} />
                  </td>
                  <td className="px-4 py-3 text-[13px] text-fog">
                    {wordCount(chapter.content)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-fog">
                    {formatDate(chapter.updated_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cast & Arc section */}
        <div className="grid grid-cols-2 gap-8">
          {/* Cast */}
          <div>
            <h3 className="font-serif text-[22px] font-normal text-parchment mb-4">
              Cast
            </h3>
            {characters.length > 0 ? (
              <div className="space-y-3">
                {characters.map((char, idx) => (
                  <div
                    key={idx}
                    className="bg-surface rounded-xl p-4 border border-border-soft flex gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-serif font-bold text-canvas shrink-0"
                      style={{
                        backgroundColor: getCharacterColor(idx),
                      }}
                    >
                      {char.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="font-serif text-[15px] text-parchment">
                          {char.name}
                        </p>
                        <p className="font-mono text-[9px] text-fog uppercase">
                          {char.role}
                        </p>
                      </div>
                      <p className="text-[13px] text-fog">
                        {char.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-fog text-[13px]">No characters defined yet</p>
            )}
          </div>

          {/* Arc */}
          <div>
            <h3 className="font-serif text-[22px] font-normal text-parchment mb-4">
              Arc
            </h3>
            <div className="space-y-3">
              {[
                { title: "Premise", text: premise },
                { title: "Conflict", text: conflict },
                { title: "Resolution", text: resolution },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-xl p-4 border border-border-soft"
                >
                  <p className="font-serif text-[15px] text-parchment mb-2">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-fog leading-relaxed">
                    {item.text || "Not yet defined"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
