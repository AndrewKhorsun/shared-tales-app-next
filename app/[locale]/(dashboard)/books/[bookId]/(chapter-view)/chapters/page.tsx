import { serverApi } from "@/lib/server-api";
import { Book, ChaptersResponse } from "@/types";
import { notFound, redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { ChapterSidebarNew } from "@/components/chapters/chapter-sidebar-new";
import { CreateFirstChapter } from "@/components/chapters/create-first-chapter";

interface ChaptersPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function ChaptersPage({ params }: ChaptersPageProps) {
  const { bookId } = await params;

  const [{ data: book, error: bookError }, { data: chaptersResponse }] =
    await Promise.all([
      serverApi.get<Book>(`/api/books/${bookId}`),
      serverApi.get<ChaptersResponse>(`/api/books/${bookId}/chapters`),
    ]);

  if (bookError || !book) return notFound();

  const chapters = chaptersResponse?.chapters ?? [];
  const first = chapters[0];

  if (first) {
    const locale = await getLocale();
    redirect(`/${locale}/books/${bookId}/chapters/${first.id}`);
  }

  return (
    <div className="flex overflow-hidden" style={{ height: "calc(100dvh - 52px)" }}>
      <ChapterSidebarNew book={book} chapters={[]} bookId={bookId} />
      <main className="flex-1 overflow-y-auto scrollbar-thin flex items-center justify-center">
        <CreateFirstChapter bookId={bookId} />
      </main>
    </div>
  );
}
