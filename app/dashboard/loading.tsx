export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-black/5 bg-white/50 backdrop-blur-xl dark:border-white/5 dark:bg-gray-950/50 px-10 py-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-10 w-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="mt-3 h-5 w-64 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          </div>
          <div className="h-11 w-32 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10">
        <div className="rounded-2xl border border-black/5 bg-white/80 backdrop-blur-xl p-12 shadow-xl dark:border-white/5 dark:bg-gray-950/80">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

