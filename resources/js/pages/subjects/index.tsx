import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Subject {
  id: number;
  name: string;
  code?: string | null;
  credits?: number | null;
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

    fetch(`/admin/subjects.json?${query}`, { credentials: 'same-origin' })
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
          <button
            className="rounded-md border border-sidebar-border/70 px-3 py-2 text-sm dark:border-sidebar-border"
            onClick={async () => {
              const name = prompt('Name');
              if (!name) return;
              const code = prompt('Code') ?? '';
              const creditsStr = prompt('Credits (number)') ?? '';
              const credits = creditsStr ? Number(creditsStr) : undefined;
              const token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]) ?? (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? '';
              const res = await fetch('/api/subjects', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                  'X-CSRF-TOKEN': token,
                },
                credentials: 'same-origin',
                body: JSON.stringify({ name, code, credits }),
              });
              if (res.ok) {
                setPage(1);
              } else {
                alert('Failed to create subject');
              }
            }}
          >New</button>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Credits</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-6" colSpan={5}>Loading...</td></tr>
                ) : error ? (
                  <tr><td className="px-4 py-6 text-red-600" colSpan={5}>Error: {error}</td></tr>
                ) : items.length === 0 ? (
                  <tr><td className="px-4 py-6" colSpan={5}>No subjects found.</td></tr>
                ) : (
                  items.map((s) => (
                    <tr key={s.id} className="border-t border-sidebar-border/50">
                      <td className="px-4 py-3">{s.id}</td>
                      <td className="px-4 py-3">{s.name}</td>
                      <td className="px-4 py-3">{s.code ?? '—'}</td>
                      <td className="px-4 py-3">{s.credits ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="rounded border border-sidebar-border/70 px-2 py-1 text-xs dark:border-sidebar-border"
                            onClick={async () => {
                              const name = prompt('Name', s.name) ?? s.name;
                              const code = prompt('Code', s.code ?? '') ?? s.code ?? '';
                              const creditsStr = prompt('Credits (number)', s.credits?.toString() ?? '') ?? (s.credits?.toString() ?? '');
                              const credits = creditsStr ? Number(creditsStr) : undefined;
                              const token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]) ?? (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? '';
                              const res = await fetch(`/api/subjects/${s.id}`, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'X-Requested-With': 'XMLHttpRequest',
                                  'X-CSRF-TOKEN': token,
                                },
                                credentials: 'same-origin',
                                body: JSON.stringify({ name, code, credits }),
                              });
                              if (!res.ok) {
                                alert('Failed to update subject');
                              } else {
                                setPage((p) => p);
                              }
                            }}
                          >Edit</button>
                          <button
                            className="rounded border border-red-400 px-2 py-1 text-xs text-red-600"
                            onClick={async () => {
                              if (!confirm('Delete this subject?')) return;
                              const token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]) ?? (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? '';
                              const res = await fetch(`/api/subjects/${s.id}`, {
                                method: 'DELETE',
                                headers: {
                                  'X-Requested-With': 'XMLHttpRequest',
                                  'X-CSRF-TOKEN': token,
                                },
                                credentials: 'same-origin',
                              });
                              if (!res.ok) {
                                alert('Failed to delete subject');
                              } else {
                                setPage((p) => Math.max(1, Math.min(p, meta.last_page)));
                              }
                            }}
                          >Delete</button>
                        </div>
                      </td>
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
