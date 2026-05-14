import { serverApi } from "@/lib/server-api";
import { ChaptersResponse } from "@/types";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { CreateFirstChapter } from "@/components/chapters/create-first-chapter";

interface ChaptersPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function ChaptersPage({ params }: ChaptersPageProps) {
  const { bookId } = await params;

  const { data: chaptersResponse } =
    await serverApi.get<ChaptersResponse>(`/api/books/${bookId}/chapters`);

  const chapters = chaptersResponse?.chapters ?? [];
  const first = chapters[0];

  if (first) {
    const locale = await getLocale();
    redirect(`/${locale}/books/${bookId}/chapters/${first.id}`);
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin flex items-center justify-center">
      <CreateFirstChapter bookId={bookId} />
    </div>
  );
}
