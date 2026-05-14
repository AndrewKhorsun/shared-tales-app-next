export default function BookLoading() {
  return (
    <div className="bg-page animate-pulse">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Back link */}
        <div className="h-3 w-16 bg-surface rounded mb-8" />

        {/* Hero: left + right card */}
        <div className="grid grid-cols-[1fr_260px] gap-8 mb-12">
          <div>
            <div className="h-2.5 w-32 bg-surface rounded mb-3" />
            <div className="h-12 w-3/4 bg-surface rounded mb-2" />
            <div className="h-4 w-40 bg-surface rounded mb-6" />
            <div className="flex flex-col gap-2 mb-6">
              <div className="h-3.5 w-full max-w-120 bg-surface rounded" />
              <div className="h-3.5 w-4/5 max-w-95 bg-surface rounded" />
              <div className="h-3.5 w-full max-w-115 bg-surface rounded" />
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-36 bg-surface rounded" />
              <div className="h-8 w-32 bg-surface rounded" />
            </div>
          </div>

          {/* Cover card */}
          <div className="bg-elevated rounded-xl border border-border-soft p-6 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber/30" />
            <div className="h-2 w-20 bg-surface rounded mb-4" />
            <div className="h-6 w-3/4 bg-surface rounded mb-1" />
            <div className="h-3.5 w-1/2 bg-surface rounded mb-4" />
            <div className="w-full bg-surface rounded-full h-1 mb-3" />
            <div className="h-3 w-24 bg-surface rounded" />
          </div>
        </div>

        {/* Chapters table */}
        <div className="border border-border-soft rounded-xl overflow-hidden mb-10">
          <div className="bg-surface border-b border-border-soft px-4 py-3 flex gap-4">
            <div className="h-2.5 w-6 bg-elevated rounded" />
            <div className="h-2.5 flex-1 bg-elevated rounded" />
            <div className="h-2.5 w-20 bg-elevated rounded" />
            <div className="h-2.5 w-14 bg-elevated rounded" />
            <div className="h-2.5 w-16 bg-elevated rounded" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="px-4 py-3 flex gap-4 border-b border-border-soft last:border-b-0"
              style={{ opacity: 1 - i * 0.12 }}
            >
              <div className="h-3.5 w-6 bg-surface rounded" />
              <div className="h-3.5 flex-1 bg-surface rounded" />
              <div className="h-3.5 w-20 bg-surface rounded" />
              <div className="h-3.5 w-10 bg-surface rounded" />
              <div className="h-3.5 w-16 bg-surface rounded" />
            </div>
          ))}
        </div>

        {/* Cast & Arc */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="h-6 w-16 bg-surface rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface rounded-xl p-4 border border-border-soft flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-elevated shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3.5 w-1/3 bg-elevated rounded" />
                    <div className="h-3 w-full bg-elevated rounded" />
                    <div className="h-3 w-4/5 bg-elevated rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="h-6 w-12 bg-surface rounded mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-surface rounded-xl p-4 border border-border-soft">
                  <div className="h-3.5 w-24 bg-elevated rounded mb-2" />
                  <div className="h-3 w-full bg-elevated rounded mb-1" />
                  <div className="h-3 w-3/4 bg-elevated rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
