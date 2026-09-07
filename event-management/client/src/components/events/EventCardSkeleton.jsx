export default function EventCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div className="aspect-[16/10] w-full animate-pulse bg-muted" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-5 w-24 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="mt-auto space-y-2 pt-1">
          <div className="h-3.5 w-40 animate-pulse rounded bg-muted" />
          <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-1.5 w-full animate-pulse rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}
