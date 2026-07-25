import Skeleton from '../ui/Skeleton';

export default function AdminProjectRowSkeleton() {
  return (
    <div className="bg-surface-container rounded-[24px] p-6 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4 w-full">
        <Skeleton className="w-12 h-12 rounded-[16px] shrink-0" />
        
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-32 h-5 rounded-full" />
          </div>
          <Skeleton className="w-3/4 max-w-xl h-5 mb-3" />
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="w-16 h-5 rounded-md" />
            <Skeleton className="w-20 h-5 rounded-md" />
            <Skeleton className="w-24 h-5 rounded-md" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 border-outline-variant/30 pt-3 md:pt-0 w-full md:w-auto justify-end">
        <Skeleton className="w-9 h-9 rounded-full" />
        <Skeleton className="w-20 h-9 rounded-full" />
        <Skeleton className="w-24 h-9 rounded-full" />
      </div>
    </div>
  );
}
