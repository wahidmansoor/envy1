import React from 'react';

interface SkeletonCardProps {
  type?: 'guideline' | 'algorithm' | 'evidence' | 'practice';
}

function SkeletonCard({ type }: SkeletonCardProps) {
  return (
    <div className="relative rounded-xl overflow-hidden bg-white shadow-sm p-5 animate-pulse">
      {/* Type Indicator */}
      <div className="absolute top-3 right-3">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </div>

      {/* Header */}
      <div className="space-y-3 pr-12">
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Content Lines - Varied based on type */}
      <div className="mt-6 space-y-3">
        {type === 'algorithm' ? (
          // Algorithm-specific skeleton
          <>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="flex gap-2 justify-center mt-2">
              <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
              <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
            </div>
          </>
        ) : type === 'evidence' ? (
          // Evidence-specific skeleton with citation-like structure
          <>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            <div className="mt-4 h-4 bg-gray-100 rounded w-2/3"></div>
          </>
        ) : (
          // Default content skeleton
          <>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </>
        )}
      </div>

      {/* Tags/Metadata */}
      <div className="mt-4 flex gap-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

export default function HandbookSkeleton() {
  // Mix of different types for more realistic loading
  const types: SkeletonCardProps['type'][] = [
    'guideline', 'algorithm', 'evidence', 'practice',
    'guideline', 'evidence'
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {types.map((type, i) => (
        <SkeletonCard key={i} type={type} />
      ))}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-gray-200 rounded-md"></div>
        <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
      </div>
      {/* Filters */}
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-28 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="w-64 p-4 space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-6 animate-pulse">
        <div className="h-5 w-5 bg-gray-200 rounded"></div>
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </div>
      {/* Navigation Items */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center justify-between p-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 w-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BreadcrumbSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <React.Fragment key={i}>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
          {i < 2 && <div className="h-3 w-3 bg-gray-200 rounded-full"></div>}
        </React.Fragment>
      ))}
    </div>
  );
}

export function RecommendationsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-48 mb-4"></div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-3 p-3 rounded-lg bg-gray-50">
          <div className="h-12 w-12 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
}