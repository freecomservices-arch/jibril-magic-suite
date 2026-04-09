import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

export interface TableColumn<T> {
  key: string;
  label: string;
  render: (item: T) => React.ReactNode;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

function ResponsiveTable<T>({
  columns,
  data,
  keyExtractor,
  actions,
  emptyMessage = 'Aucun résultat.',
  onRowClick,
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return (
      <div className="px-5 py-10 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  // Mobile: stacked cards
  if (isMobile) {
    return (
      <div className="divide-y divide-border">
        {data.map(item => (
          <div
            key={keyExtractor(item)}
            className="p-4 space-y-2 active:bg-muted/30 transition-colors"
            onClick={() => onRowClick?.(item)}
          >
            {columns.map(col => (
              <div key={col.key} className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-medium text-muted-foreground shrink-0 min-w-[80px]">
                  {col.label}
                </span>
                <span className="text-sm text-card-foreground text-right flex-1">
                  {col.render(item)}
                </span>
              </div>
            ))}
            {actions && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50 mt-2">
                {actions(item)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Desktop: classic table
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.filter(c => !c.hideOnMobile).map(col => (
              <th key={col.key} className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-5 py-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map(item => (
            <tr
              key={keyExtractor(item)}
              className="hover:bg-muted/30 transition-colors"
              onClick={() => onRowClick?.(item)}
            >
              {columns.filter(c => !c.hideOnMobile).map(col => (
                <td key={col.key} className="px-5 py-3 text-sm">
                  {col.render(item)}
                </td>
              ))}
              {actions && (
                <td className="px-5 py-3">
                  <div className="flex gap-1">{actions(item)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResponsiveTable;
