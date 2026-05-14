import { BookCardSkeleton } from "@/components/books/book-card-skeleton";

export default function BooksLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="px-8 pt-8 pb-0">
        <div className="h-2.5 w-20 bg-surface rounded mb-4" />
        <div className="h-10 w-64 bg-surface rounded mb-2" />
        <div className="h-4 w-40 bg-surface rounded mb-6" />
      </div>

      {/* Controls + Grid */}
      <div className="px-8 pt-6 flex flex-col gap-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-7 w-12 bg-surface rounded-md border border-border-soft" />
            <div className="h-7 w-24 bg-surface rounded-md border border-border-soft" />
            <div className="h-7 w-20 bg-surface rounded-md border border-border-soft" />
          </div>
          <div className="h-8 w-28 bg-surface rounded-md border border-border-soft" />
          <div className="ml-auto flex gap-1">
            <div className="h-8 w-8 bg-surface rounded" />
            <div className="h-8 w-8 bg-surface rounded" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
