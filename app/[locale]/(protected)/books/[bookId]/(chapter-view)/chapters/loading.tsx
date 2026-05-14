export default function ChaptersLoading() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden animate-pulse">
      {/* Toolbar */}
      <div className="h-10 bg-surface border-b border-border-soft shrink-0 flex items-center gap-2 px-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-6 w-7 bg-elevated rounded" />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 px-[15%] py-8 flex flex-col gap-3">
        <div className="h-5 bg-surface rounded w-2/3" />
        <div className="h-4 bg-surface rounded w-full" />
        <div className="h-4 bg-surface rounded w-11/12" />
        <div className="h-4 bg-surface rounded w-full" />
        <div className="h-4 bg-surface rounded w-4/5" />
        <div className="mt-4 h-4 bg-surface rounded w-full" />
        <div className="h-4 bg-surface rounded w-10/12" />
        <div className="h-4 bg-surface rounded w-full" />
        <div className="h-4 bg-surface rounded w-3/4" />
      </div>
    </div>
  );
}
