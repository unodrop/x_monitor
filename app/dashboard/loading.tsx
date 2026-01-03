export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      {/* Header Skeleton */}
      <div className="shrink-0 border-b border-black/10 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-gray-950/90 px-10 py-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-64 animate-pulse rounded-lg bg-gray-200/60 dark:bg-gray-800/60" />
          <div className="h-10 w-36 animate-pulse rounded-xl bg-gray-200/60 dark:bg-gray-800/60" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
            <div className="h-5 w-8 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
          </div>
          <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
            <div className="h-5 w-8 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
          </div>
          <div className="h-4 w-px bg-black/10 dark:bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
            <div className="h-5 w-8 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="rounded-2xl border border-black/10 bg-white/90 backdrop-blur-xl shadow-lg dark:border-white/10 dark:bg-gray-950/90 overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-black/10 bg-gradient-to-r from-gray-50/80 to-transparent dark:border-white/10 dark:from-gray-900/80">
            <div className="flex items-center px-4 py-4 gap-4">
              <div className="w-[180px] h-4 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
              <div className="min-w-[200px] flex-1 h-4 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
              <div className="w-[120px] h-4 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
              <div className="min-w-[180px] flex-1 h-4 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
              <div className="w-[140px] h-4 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
              <div className="w-[140px] h-4 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-black/10 dark:divide-white/10 bg-white dark:bg-gray-950">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center px-4 py-3 gap-4 transition-colors"
              >
                <div className="w-[180px]">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
                </div>
                <div className="min-w-[200px] flex-1">
                  <div className="h-4 w-32 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
                </div>
                <div className="w-[120px]">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-gray-200/60 dark:bg-gray-800/60" />
                </div>
                <div className="min-w-[180px] flex-1">
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
                </div>
                <div className="w-[140px]">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-200/60 dark:bg-gray-800/60" />
                </div>
                <div className="w-[140px]">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200/60 dark:bg-gray-800/60" />
                    <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-200/60 dark:bg-gray-800/60" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

