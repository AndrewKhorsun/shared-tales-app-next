import { BookPlanForm } from "@/components/books/book-plan-form";
import { serverApi } from "@/lib/server-api";
import { Book, BookPlan } from "@/types";

interface BookPlanPageProps {
  params: Promise<{ bookId: string }>;
}

export default async function BookPlanPage({ params }: BookPlanPageProps) {
  const { bookId } = await params;

  const [{ data: plan, error }, { data: book }] = await Promise.all([
    serverApi.get<{ bookPlan: BookPlan }>(`/api/books/${bookId}/plan`),
    serverApi.get<Book>(`/api/books/${bookId}`),
  ]);

  if (error) {
    return <p className="text-fog text-sm">{error}</p>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-parchment font-sans">
      <BookPlanForm
        key={plan?.bookPlan?.id}
        bookId={bookId}
        bookTitle={book?.title}
        existingPlan={plan?.bookPlan}
      />
    </div>
  );
}
