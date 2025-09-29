import { Link, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import Heading from '@/components/heading';

export type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
};

type Paginator<T> = {
  data: T[];
  current_page: number;
  per_page: number;
  last_page: number;
  total: number;
};

type Props<T> = {
  title: string;
  description?: string;
  items: Paginator<T>;
  columns: Column<T>[];
  getRowHref?: (row: T) => string | undefined;
  actionHref?: string;
  actionLabel?: string;
};

export default function SimpleTable<T extends Record<string, unknown>>({ title, description, items, columns, getRowHref, actionHref, actionLabel }: Props<T>) {
  const page = usePage();
  const url = (page.url || '').split('?')[0] || '';
  const initialQ = useMemo(() => new URLSearchParams((page.url.split('?')[1] ?? '')).get('q') ?? '', [page.url]);
  const initialPerPage = useMemo(() => parseInt(new URLSearchParams((page.url.split('?')[1] ?? '')).get('per_page') ?? `${items.per_page}`) || items.per_page, [page.url, items.per_page]);

  const [q, setQ] = useState(initialQ);
  const [perPage, setPerPage] = useState(initialPerPage);

  const goto = (params: Record<string, string | number | undefined>) => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    sp.set('per_page', String(perPage));
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) sp.set(k, String(v));
    });
    router.get(`${url}?${sp.toString()}`, {}, { preserveState: true, replace: true });
  };

  return (
    <div className="px-4 py-6">
      <Heading title={title} description={description ?? ''} />

      <div className="flex items-end justify-between gap-2 mb-4">
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Search</label>
            <input
              className="h-9 w-64 rounded-md border bg-background px-3 text-sm"
              placeholder="Search..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') goto({ page: 1 });
              }}
            />
          </div>
          <Button size="sm" onClick={() => goto({ page: 1 })}>Filter</Button>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Per page</label>
            <select
              className="h-9 rounded-md border bg-background px-2 text-sm"
              value={perPage}
              onChange={(e) => { setPerPage(parseInt(e.target.value)); setTimeout(() => goto({ page: 1 }), 0); }}
            >
              {[10, 15, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {actionHref && actionLabel && (
            <Button asChild size="sm">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((c, i) => (
                <th key={i} className={`text-left px-3 py-2 font-medium ${c.className ?? ''}`}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.data.length === 0 && (
              <tr><td className="px-3 py-6 text-center text-muted-foreground" colSpan={columns.length}>No data.</td></tr>
            )}
            {items.data.map((row, ri) => {
              const href = getRowHref?.(row as T);
              const clickable = Boolean(href);
              return (
                <tr
                  key={ri}
                  className={`border-t ${clickable ? 'cursor-pointer hover:bg-muted/40' : ''}`}
                  onClick={() => href && router.visit(href)}
                  tabIndex={clickable ? 0 : -1}
                  onKeyDown={(e) => {
                    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      router.visit(href!);
                    }
                  }}
                >
                  {columns.map((c, ci) => (
                    <td key={ci} className={`px-3 py-2 ${c.className ?? ''}`}>{c.accessor(row as T)}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Showing {(items.current_page - 1) * items.per_page + (items.data.length ? 1 : 0)}-
          {(items.current_page - 1) * items.per_page + items.data.length} of {items.total}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={items.current_page <= 1} onClick={() => goto({ page: items.current_page - 1 })}>
            Previous
          </Button>
          <span className="text-sm">Page {items.current_page} / {items.last_page}</span>
          <Button variant="outline" size="sm" disabled={items.current_page >= items.last_page} onClick={() => goto({ page: items.current_page + 1 })}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
