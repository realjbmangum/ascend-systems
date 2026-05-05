import { useMemo, useState, type ReactNode } from 'react';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => ReactNode;
  /** Make this column sortable by clicking the header. */
  sortable?: boolean;
  /** Use this row value for sort comparison (defaults to row[key]). */
  sortValue?: (row: T) => string | number | null | undefined;
  /** Include this column in the search/filter input. */
  filterable?: boolean;
  /** Optional className for cell. */
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  /** Show a global filter input above the table. Defaults to true if any column is filterable. */
  showFilter?: boolean;
  /** Placeholder for the filter input. */
  filterPlaceholder?: string;
  /** Initial sort: { key, direction } */
  defaultSort?: { key: string; direction: 'asc' | 'desc' };
}

type SortState = { key: string; direction: 'asc' | 'desc' } | null;

function getSortValue<T extends Record<string, any>>(
  row: T,
  col: Column<T>
): string | number | null | undefined {
  if (col.sortValue) return col.sortValue(row);
  const v = row[col.key];
  if (v == null) return null;
  if (typeof v === 'number' || typeof v === 'string') return v;
  // Try to parse dates
  const d = new Date(v);
  if (!isNaN(d.getTime())) return d.getTime();
  return String(v);
}

function compareValues(a: any, b: any): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: 'base',
  });
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  onRowClick,
  emptyMessage = 'No data found.',
  showFilter,
  filterPlaceholder = 'Filter…',
  defaultSort,
}: DataTableProps<T>) {
  const [sort, setSort] = useState<SortState>(defaultSort ?? null);
  const [filter, setFilter] = useState('');

  const filterableColumns = columns.filter((c) => c.filterable);
  const filterEnabled =
    showFilter !== undefined ? showFilter : filterableColumns.length > 0;

  const processed = useMemo(() => {
    let out = rows;
    if (filter.trim() && filterableColumns.length) {
      const q = filter.trim().toLowerCase();
      out = out.filter((row) =>
        filterableColumns.some((col) => {
          const v = row[col.key];
          if (v == null) return false;
          return String(v).toLowerCase().includes(q);
        })
      );
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col) {
        out = [...out].sort((a, b) => {
          const av = getSortValue(a, col);
          const bv = getSortValue(b, col);
          const cmp = compareValues(av, bv);
          return sort.direction === 'asc' ? cmp : -cmp;
        });
      }
    }
    return out;
  }, [rows, sort, filter, columns, filterableColumns]);

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    setSort((prev) => {
      if (!prev || prev.key !== col.key) return { key: col.key, direction: 'asc' };
      if (prev.direction === 'asc') return { key: col.key, direction: 'desc' };
      return null;
    });
  };

  const sortIcon = (col: Column<T>) => {
    if (!col.sortable) return null;
    const active = sort?.key === col.key;
    if (!active) {
      return <span className="ml-1 text-gray-300">⇅</span>;
    }
    return (
      <span className="ml-1 text-orange">
        {sort?.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      {filterEnabled && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={filterPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-orange/30"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          {filter && (
            <span className="text-xs text-gray-500 tabular-nums">
              {processed.length} / {rows.length}
            </span>
          )}
        </div>
      )}
      <div className="bg-white rounded-xl border border-surface-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-100 bg-surface/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col)}
                    className={`text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide ${
                      col.sortable
                        ? 'cursor-pointer select-none hover:text-charcoal transition-colors'
                        : ''
                    }`}
                  >
                    <span className="inline-flex items-center">
                      {col.label}
                      {sortIcon(col)}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processed.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-gray-400"
                  >
                    {filter ? `No matches for "${filter}".` : emptyMessage}
                  </td>
                </tr>
              ) : (
                processed.map((row, i) => (
                  <tr
                    key={row.id ?? i}
                    onClick={() => onRowClick?.(row)}
                    className={`border-b border-surface-100 last:border-0 ${
                      onRowClick
                        ? 'cursor-pointer hover:bg-surface/30 transition-colors'
                        : ''
                    }`}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 text-charcoal ${col.cellClassName ?? ''}`}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
