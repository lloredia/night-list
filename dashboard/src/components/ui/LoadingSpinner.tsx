import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="h-5 w-5 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
        <span className="text-xs text-muted-foreground">Loading…</span>
      </div>
    </div>
  );
}

// Skeleton for table rows
export function TableRowSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card/30 animate-pulse">
          <div className="h-8 w-8 rounded-full bg-secondary/50" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-32 rounded bg-secondary/50" />
            <div className="h-2.5 w-20 rounded bg-secondary/30" />
          </div>
          <div className="h-3 w-16 rounded bg-secondary/50" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for stat cards
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card/30 p-5 animate-pulse space-y-3">
      <div className="h-3 w-24 rounded bg-secondary/50" />
      <div className="h-7 w-32 rounded bg-secondary/50" />
      <div className="h-2.5 w-20 rounded bg-secondary/30" />
    </div>
  );
}
