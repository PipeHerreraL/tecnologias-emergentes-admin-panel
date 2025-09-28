import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface Student {
  id: number;
  document?: string | null;
  name: string;
  last_name: string;
  address?: string | null;
  age?: number | null;
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
  { title: 'Students', href: '/students' },
];

export default function StudentsIndex() {
  const [items, setItems] = useState<Student[]>([]);
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

    fetch(`/admin/students.json?${query}`, { credentials: 'same-origin' })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const json: unknown = await r.json();
        if (ignore) return;
        const payload: Paginated<Student> = isWrapped<Paginated<Student>>(json)
          ? json.data
          : (json as Paginated<Student>);
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
      <Head title="Students" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value); }}
            placeholder="Search by name, document or address..."
            className="w-full max-w-sm rounded-md border border-sidebar-border/70 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground/40 dark:border-sidebar-border"
          />
          <button
            className="rounded-md border border-sidebar-border/70 px-3 py-2 text-sm dark:border-sidebar-border"
            onClick={async () => {
              const name = prompt('Name');
              if (!name) return;
              const last_name = prompt('Last name') ?? '';
              const document = prompt('Document') ?? '';
              const address = prompt('Address') ?? '';
              const res = await fetch('/api/students', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Requested-With': 'XMLHttpRequest',
                  'X-CSRF-TOKEN': (document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]) ?? (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? '',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ name, last_name, document, address }),
              });
              if (res.ok) {
                // refresh
                setPage(1);
              } else {
                alert('Failed to create student');
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
                  <th className="px-4 py-3 font-medium">Document</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Last name</th>
                  <th className="px-4 py-3 font-medium">Address</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="px-4 py-6" colSpan={7}>Loading...</td></tr>
                ) : error ? (
                  <tr><td className="px-4 py-6 text-red-600" colSpan={7}>Error: {error}</td></tr>
                ) : items.length === 0 ? (
                  <tr><td className="px-4 py-6" colSpan={7}>No students found.</td></tr>
                ) : (
                  items.map((s) => (
                    <tr key={s.id} className="border-t border-sidebar-border/50">
                      <td className="px-4 py-3">{s.id}</td>
                      <td className="px-4 py-3">{s.document ?? '—'}</td>
                      <td className="px-4 py-3">{s.name}</td>
                      <td className="px-4 py-3">{s.last_name}</td>
                      <td className="px-4 py-3">{s.address ?? '—'}</td>
                      <td className="px-4 py-3">{s.age ?? '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            className="rounded border border-sidebar-border/70 px-2 py-1 text-xs dark:border-sidebar-border"
                            onClick={async () => {
                              const name = prompt('Name', s.name) ?? s.name;
                              const last_name = prompt('Last name', s.last_name) ?? s.last_name;
                              const documentVal = prompt('Document', s.document ?? '') ?? s.document ?? '';
                              const addressVal = prompt('Address', s.address ?? '') ?? s.address ?? '';
                              const token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]) ?? (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? '';
                              const res = await fetch(`/api/students/${s.id}`, {
                                method: 'PATCH',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'X-Requested-With': 'XMLHttpRequest',
                                  'X-CSRF-TOKEN': token,
                                },
                                credentials: 'same-origin',
                                body: JSON.stringify({ name, last_name, document: documentVal, address: addressVal }),
                              });
                              if (!res.ok) {
                                alert('Failed to update student');
                              } else {
                                // re-fetch by triggering state change
                                setPage((p) => p);
                              }
                            }}
                          >Edit</button>
                          <button
                            className="rounded border border-red-400 px-2 py-1 text-xs text-red-600"
                            onClick={async () => {
                              if (!confirm('Delete this student?')) return;
                              const token = (document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1]) ?? (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null)?.content ?? '';
                              const res = await fetch(`/api/students/${s.id}`, {
                                method: 'DELETE',
                                headers: {
                                  'X-Requested-With': 'XMLHttpRequest',
                                  'X-CSRF-TOKEN': token,
                                },
                                credentials: 'same-origin',
                              });
                              if (!res.ok) {
                                alert('Failed to delete student');
                              } else {
                                // If on last item of last page, go back one page
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
