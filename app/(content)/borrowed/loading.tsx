export default function BorrowedLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <div className="h-10 w-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-6 w-96 bg-muted rounded-lg animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          {/* Button Skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-8 w-40 bg-muted rounded-lg animate-pulse" />
            <div className="h-10 w-40 bg-muted rounded-lg animate-pulse" />
          </div>

          {/* Mobile Cards Skeleton */}
          <div className="md:hidden space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-56 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>

          {/* Desktop Table Skeleton */}
          <div className="hidden md:block space-y-4">
            <div className="h-12 bg-muted rounded-lg animate-pulse" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
