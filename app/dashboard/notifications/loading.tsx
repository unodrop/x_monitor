export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      {/* Header Skeleton */}
      <div className="shrink-0 border-b border-black/5 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-gray-950/50 px-10 py-8 shadow-sm">
        <div className="flex items-center justify-end">
          <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-200/60 dark:bg-gray-800/60" />
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-black/5 bg-white/80 backdrop-blur-xl p-4 shadow-sm transition-all hover:shadow-md hover:border-black/10 dark:border-white/5 dark:bg-gray-950/80 dark:hover:border-white/10"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="h-4 w-24 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
                    <div className="h-5 w-20 animate-pulse rounded-md border bg-gray-200/60 dark:bg-gray-800/60" />
                  </div>
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60 mt-0.5" />
                </div>
                <div className="h-7 w-7 animate-pulse rounded-lg bg-gray-200/60 dark:bg-gray-800/60 shrink-0" />
              </div>

              {/* Card Content */}
              <div className="space-y-2 rounded-lg bg-gray-50/50 p-3 dark:bg-gray-900/50">
                <div className="space-y-1.5">
                  <div className="h-2.5 w-8 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
                  <div className="h-3 w-full animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

