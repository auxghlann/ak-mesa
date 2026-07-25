import Skeleton from '../ui/Skeleton';

export default function AdminProjectFormSkeleton() {
  return (
    <div className="bg-surface-container rounded-[24px] p-6 md:p-8 border border-outline-variant/30 shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-outline-variant/30">
        <Skeleton className="w-12 h-12 rounded-[16px]" />
        <div>
          <Skeleton className="w-64 h-7 mb-2" />
          <Skeleton className="w-48 h-5" />
        </div>
      </div>

      <div className="space-y-6">
        {/* Grid 1: Title & Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="w-32 h-5 mb-2" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
          <div>
            <Skeleton className="w-24 h-5 mb-2" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
        </div>

        {/* Grid 2: Date & Icon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="w-40 h-5 mb-2" />
            <Skeleton className="w-full h-12 rounded-xl" />
          </div>
          <div>
            <Skeleton className="w-48 h-5 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="w-full h-12 rounded-xl" />
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div>
          <Skeleton className="w-40 h-5 mb-2" />
          <Skeleton className="w-full h-24 rounded-xl" />
        </div>

        {/* Tech Stack */}
        <div>
          <Skeleton className="w-48 h-5 mb-2" />
          <Skeleton className="w-full h-12 rounded-xl" />
        </div>

        {/* Project Links Section */}
        <div className="border border-outline-variant/30 rounded-2xl p-4 bg-surface/50 space-y-4">
          <Skeleton className="w-48 h-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <Skeleton className="w-32 h-4 mb-1.5" />
                <Skeleton className="w-full h-11 rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Markdown content */}
        <div>
          <Skeleton className="w-48 h-5 mb-2" />
          <Skeleton className="w-full h-64 rounded-xl" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
          <Skeleton className="w-24 h-12 rounded-full" />
          <Skeleton className="w-48 h-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}
