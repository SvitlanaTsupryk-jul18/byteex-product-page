/** Skeleton shown while content loads; mirrors the hero layout to limit layout shift. */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading page" className="animate-pulse">
      <div className="h-8 bg-cream" />
      <div className="container-page grid gap-8 py-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="h-8 w-40 bg-mist" />
          <div className="h-16 w-3/4 bg-mist" />
          <div className="h-24 bg-mist" />
          <div className="h-12 w-56 bg-mist" />
        </div>
        <div className="aspect-[4/3] bg-mist" />
      </div>
    </div>
  )
}

export function PageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <main className="container-page flex min-h-dvh flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl text-navy">Something went wrong</h1>
      <p className="max-w-md text-sm text-muted">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-sm bg-navy px-6 py-3 text-sm text-white hover:bg-navy-hover"
      >
        Try again
      </button>
    </main>
  )
}
