import { serverApi } from "@/lib/server-api";
import { Book, ChaptersResponse } from "@/types";
import { notFound } from "next/navigation";
import { ChapterSidebarNew } from "@/components/chapters/chapter-sidebar-new";

interface ChapterViewLayoutProps {
  children: React.ReactNode;
  params: Promise<{ bookId: string }>;
}

export default async function ChapterViewLayout({
  children,
  params,
}: ChapterViewLayoutProps) {
  const { bookId } = await params;

  const [{ data: book, error: bookError }, { data: chaptersResponse }] =
    await Promise.all([
      serverApi.get<Book>(`/api/books/${bookId}`),
      serverApi.get<ChaptersResponse>(`/api/books/${bookId}/chapters`),
    ]);

  if (bookError || !book) return notFound();

  const chapters = chaptersResponse?.chapters ?? [];

  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100dvh - 52px)" }}>
      <ChapterSidebarNew book={book} chapters={chapters} bookId={bookId} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
