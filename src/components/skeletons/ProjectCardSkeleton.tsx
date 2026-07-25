import Skeleton from '../ui/Skeleton';

export default function ProjectCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <Skeleton className="w-24 h-5 mt-1" />
      </div>

      <Skeleton className="w-3/4 h-8 mb-4" />
      
      <div className="flex flex-col gap-2 mb-8 flex-grow">
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-full h-5" />
        <Skeleton className="w-5/6 h-5" />
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        <Skeleton className="w-16 h-7 rounded-lg" />
        <Skeleton className="w-20 h-7 rounded-lg" />
        <Skeleton className="w-14 h-7 rounded-lg" />
      </div>
    </div>
  );
}
