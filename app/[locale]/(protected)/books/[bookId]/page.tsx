import { serverApi } from "@/lib/server-api";
import { Book, BookPlan } from "@/types";
import { ChaptersResponse } from "@/types/chapters";
import { notFound } from "next/navigation";
import { BookOverview } from "@/components/books/book-overview";

interface BookPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { bookId } = await params;

  const [
    { data: book, error: bookError },
    { data: chaptersResponse },
    planResponse,
  ] = await Promise.all([
    serverApi.get<Book>(`/api/books/${bookId}`),
    serverApi.get<ChaptersResponse>(`/api/books/${bookId}/chapters`),
    serverApi.get<BookPlan>(`/api/books/${bookId}/plan`).catch(() => ({ data: null })),
  ]);

  if (bookError || !book) {
    return notFound();
  }

  const chapters = chaptersResponse?.chapters || [];
  const plan = (planResponse?.data as any)?.bookPlan || planResponse?.data || null;

  return (
    <BookOverview
      book={book}
      chapters={chapters}
      plan={plan}
    />
  );
}
