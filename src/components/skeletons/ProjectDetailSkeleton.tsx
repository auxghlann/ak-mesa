import Skeleton from '../ui/Skeleton';

export default function ProjectDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      {/* Back button skeleton */}
      <Skeleton className="w-32 h-6 mb-8" />

      <div className="mb-12">
        <div className="mb-6">
          {/* Title skeleton */}
          <Skeleton className="w-3/4 h-12 md:h-16 mb-4" />
          {/* Date skeleton */}
          <Skeleton className="w-32 h-5" />
        </div>

        {/* Short description skeleton */}
        <div className="flex flex-col gap-3 mb-8">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-4/5 h-6" />
        </div>

        {/* Tech stack pills skeleton */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Skeleton className="w-20 h-7 rounded-lg" />
          <Skeleton className="w-24 h-7 rounded-lg" />
          <Skeleton className="w-16 h-7 rounded-lg" />
          <Skeleton className="w-28 h-7 rounded-lg" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex flex-wrap gap-4 border-b border-outline-variant/30 pb-8">
          <Skeleton className="w-36 h-12 rounded-full" />
          <Skeleton className="w-32 h-12 rounded-full" />
        </div>
      </div>

      {/* Content paragraphs skeleton */}
      <div className="space-y-6">
        <div className="space-y-3">
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-11/12 h-5" />
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-4/5 h-5" />
        </div>
        
        {/* Mock heading inside content */}
        <Skeleton className="w-1/3 h-8 mt-10 mb-4" />
        
        <div className="space-y-3">
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-11/12 h-5" />
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-3/4 h-5" />
        </div>
      </div>
    </div>
  );
}
