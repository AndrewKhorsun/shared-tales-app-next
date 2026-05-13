import { serverApi } from "@/lib/server-api";
import { Book, Chapter, ChaptersResponse } from "@/types";
import { notFound } from "next/navigation";
import { ChapterSidebarNew } from "@/components/chapters/chapter-sidebar-new";
import { ChapterView } from "@/components/chapters/chapter-view";

interface ChapterPageProps {
  params: Promise<{ bookId: string; chapterId: string }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookId, chapterId } = await params;

  const [{ data: book, error: bookError }, { data: chaptersResponse }, { data: chapterData, error: chapterError }] =
    await Promise.all([
      serverApi.get<Book>(`/api/books/${bookId}`),
      serverApi.get<ChaptersResponse>(`/api/books/${bookId}/chapters`),
      serverApi.get<{ chapter: Chapter }>(`/api/books/${bookId}/chapters/${chapterId}`),
    ]);

  if (bookError || !book) return notFound();
  if (chapterError || !chapterData?.chapter) return notFound();

  const chapters = chaptersResponse?.chapters ?? [];
  const chapter = chapterData.chapter;

  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100dvh - 52px)" }}>
      <ChapterSidebarNew book={book} chapters={chapters} bookId={bookId} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <ChapterView
            bookId={bookId}
            chapterId={chapterId}
            initialContent={chapter.content}
          />
        </div>
      </main>
    </div>
  );
}
