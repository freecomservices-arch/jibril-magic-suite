import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const StatCardSkeleton: React.FC = () => (
  <div className="rounded-lg border border-border bg-card p-4 card-shadow flex items-center gap-3">
    <Skeleton className="h-10 w-10 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-6 w-24" />
      <Skeleton className="h-3 w-16" />
    </div>
  </div>
);

export const PropertyCardSkeleton: React.FC = () => (
  <div className="rounded-lg border border-border bg-card card-shadow overflow-hidden">
    <Skeleton className="h-44 w-full" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-3">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-3 w-10" />
      </div>
      <Skeleton className="h-6 w-28" />
      <div className="flex gap-1.5 pt-3 border-t border-border">
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
    </div>
  </div>
);

export const ContactRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 card-shadow">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-48" />
      <Skeleton className="h-3 w-40" />
    </div>
    <div className="flex flex-col items-end gap-2">
      <Skeleton className="h-5 w-14 rounded-full" />
      <div className="flex gap-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 7 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-5 py-3">
        <Skeleton className="h-4 w-full max-w-[120px]" />
      </td>
    ))}
  </tr>
);

export const KanbanCardSkeleton: React.FC = () => (
  <div className="rounded-lg border border-border bg-card p-3 mb-2 space-y-2">
    <Skeleton className="h-3.5 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <Skeleton className="h-4 w-20" />
  </div>
);

export const BailRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 px-5 py-4">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-36" />
    </div>
    <div className="text-right space-y-1">
      <Skeleton className="h-4 w-24 ml-auto" />
      <Skeleton className="h-3 w-32 ml-auto" />
    </div>
    <div className="flex flex-col items-end gap-1">
      <Skeleton className="h-5 w-12 rounded-md" />
      <Skeleton className="h-5 w-14 rounded-md" />
    </div>
    <div className="flex gap-1.5">
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-md" />
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  </div>
);

export const ChartSkeleton: React.FC<{ height?: number }> = ({ height = 240 }) => (
  <div className="rounded-lg border border-border bg-card p-5 card-shadow">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-4 w-40" />
    </div>
    <Skeleton className={`w-full rounded-lg`} style={{ height }} />
  </div>
);

export const UserRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 px-5 py-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-44" />
    </div>
    <Skeleton className="h-5 w-12 rounded-md" />
    <div className="flex gap-1">
      <Skeleton className="h-7 w-7 rounded-md" />
      <Skeleton className="h-7 w-7 rounded-md" />
    </div>
  </div>
);

/** Hook: simulates loading for `ms` milliseconds */
export const usePageLoading = (ms = 600) => {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
};
