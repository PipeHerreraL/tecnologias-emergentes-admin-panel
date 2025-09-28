import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Subject {
  id: number;
  name: string;
  code?: string | null;
  students_count?: number;
  teacher_id?: number | null;
}

interface Paginated<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Subjects', href: '/subjects' },
];

export default function SubjectsIndex() {
  const [items, setItems] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [meta, setMeta] = useState<{ total: number; last_page: number; per_page: number }>({ total: 0, last_page: 1, per_page: 10 });

  const query = useMemo(() => new URLSearchParams({ page: String(page), search, per_page: String(meta.per_page) }).toString(), [page, search, meta.per_page]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    const isWrapped = <T,>(v: unknown): v is { data: T } => {
      return typeof v === 'object' && v !== null && 'data' in (v as Record<string, unknown>);
    };

    fetch(`/api/subjects?${query}`, { credentials: 'same-origin' })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json: unknown = await r.json();
        if (ignore) return;
        const payload: Paginated<Subject> = isWrapped<Paginated<Subject>>(json)
          ? json.data
          : (json as Paginated<Subject>);
        setItems(payload.data ?? []);
        setMeta({
          total: payload.total ?? 0,
          last_page: payload.last_page ?? 1,
          per_page: payload.per_page ?? 10,
        });
        setError(null);
      })
      .catch((e) => !ignore && setError(e.message))
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [query]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Subjects" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search by name or code..."
            className="w-full max-w-sm rounded-md border border-sidebar-border/70 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-sidebar-border"
          />
        </div>

        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Students</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-6" colSpan={4}>Loading...</td></tr>
                ) : error ? (
                  <tr><td className="px-4 py-6 text-red-600" colSpan={4}>Error: {error}</td></tr>
                ) : items.length === 0 ? (
                  <tr><td className="px-4 py-6" colSpan={4}>No subjects found.</td></tr>
                ) : (
                  items.map((s) => (
                    <tr key={s.id} className="border-t border-sidebar-border/50">
                      <td className="px-4 py-3">{s.id}</td>
                      <td className="px-4 py-3">{s.name}</td>
                      <td className="px-4 py-3">{s.code ?? '—'}</td>
                      <td className="px-4 py-3">{s.students_count ?? 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">Total: {meta.total}</div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-md border border-sidebar-border/70 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-sidebar-border"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >Previous</button>
            <span className="text-sm">Page {page} / {meta.last_page}</span>
            <button
              className="rounded-md border border-sidebar-border/70 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-sidebar-border"
              onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
              disabled={page >= meta.last_page || loading}
            >Next</button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
