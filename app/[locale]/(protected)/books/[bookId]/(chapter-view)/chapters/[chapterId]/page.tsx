import { serverApi } from "@/lib/server-api";
import { Chapter } from "@/types";
import { notFound } from "next/navigation";
import { ChapterView } from "@/components/chapters/chapter-view";

interface ChapterPageProps {
  params: Promise<{ bookId: string; chapterId: string }>;
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookId, chapterId } = await params;

  const { data: chapterData, error: chapterError } =
    await serverApi.get<{ chapter: Chapter }>(`/api/books/${bookId}/chapters/${chapterId}`);

  if (chapterError || !chapterData?.chapter) return notFound();

  const chapter = chapterData.chapter;

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <ChapterView
        bookId={bookId}
        chapterId={chapterId}
        initialContent={chapter.content}
      />
    </div>
  );
}
