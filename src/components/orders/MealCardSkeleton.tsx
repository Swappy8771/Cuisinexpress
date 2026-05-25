export default function MealCardSkeleton() {
  return (
    <div className="bg-cx-card rounded-2xl overflow-hidden border border-cx-line">
      <div className="aspect-[4/3] bg-cx-muted animate-pulse" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-20 bg-cx-muted rounded-full animate-pulse" />
        <div className="h-5 w-3/4 bg-cx-muted rounded animate-pulse" />
        <div className="h-4 w-full bg-cx-muted rounded animate-pulse" />
        <div className="h-4 w-2/3 bg-cx-muted rounded animate-pulse" />
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-16 bg-cx-muted rounded-full animate-pulse" />
          <div className="h-6 w-14 bg-cx-muted rounded-full animate-pulse" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="h-7 w-16 bg-cx-muted rounded animate-pulse" />
          <div className="h-10 w-32 bg-cx-muted rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
