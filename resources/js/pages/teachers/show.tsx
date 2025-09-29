import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import type { PageProps } from '@/types';

function formatDateMDY(value: unknown): string {
  if (!value) return '-';
  const d = new Date(String(value));
  if (isNaN(d.getTime())) return String(value);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(d);
}

function Field({ label, value }: { label: string; value: unknown }) {
  const v = value === null || value === undefined || value === '' ? '-' : String(value);
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-1 text-sm text-muted-foreground">{label}</div>
      <div className="col-span-2 font-medium break-words">{v}</div>
    </div>
  );
}

type Subject = { id: number; name: string; code: string };

type Props = PageProps & {
  item: Record<string, unknown> & { id?: number; teachers_code?: string | null; subjects?: Subject[] };
  available_subjects?: Subject[];
};

export default function TeacherShow({ item, available_subjects = [] }: Props) {
  const it = (item ?? {}) as Record<string, unknown> & { id?: number; teachers_code?: string | null; subjects?: Subject[] };
  const subjects = (it.subjects ?? []) as Subject[];
  const { data, setData, post, processing, errors } = useForm<{ subject_id: string | number | ''}>({ subject_id: '' });

  const submitAssociate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!it.id) return;
    post(`/teachers/${it.id}/subjects/associate`);
  };

  return (
    <AppSidebarLayout>
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Heading title={`Teacher #${String(it.id ?? '')}`} description="Detalles del docente" />
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href={`/teachers/${it.id}/edit`}>Edit</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/teachers">Volver</Link>
            </Button>
          </div>
        </div>

        {/* Teacher section (code) */}
        <section className="rounded-md border p-4 space-y-4">
          <h2 className="text-base font-semibold">Teacher</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Teachers code" value={it.teachers_code} />
          </div>
        </section>

        {/* Basic Details */}
        <section className="rounded-md border p-4 space-y-4">
          <h2 className="text-base font-semibold">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Name" value={it.name} />
            <Field label="Last name" value={it.last_name} />
            <Field label="Email" value={it.email} />
            <Field label="Phone" value={it.phone} />
            <Field label="Address" value={it.address} />
            <Field label="Age" value={it.age} />
            <Field label="Gender" value={it.gender} />
          </div>
        </section>

        {/* Identity */}
        <section className="rounded-md border p-4 space-y-4">
          <h2 className="text-base font-semibold">Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Document type" value={it.document_type} />
            <Field label="Document" value={it.document} />
            <Field label="Birth date" value={formatDateMDY(it.birth_date)} />
          </div>
        </section>

        {/* Subjects */}
        <section className="rounded-md border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Subjects</h2>
          </div>
          <div className="space-y-2">
            {subjects.length === 0 ? (
              <div className="text-sm text-muted-foreground">No subjects associated.</div>
            ) : (
              <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50"><tr><th className="text-left px-3 py-2">Name</th><th className="text-left px-3 py-2">Code</th></tr></thead>
                  <tbody>
                    {subjects.map((s) => (
                      <tr key={s.id} className="border-t">
                        <td className="px-3 py-2">{s.name}</td>
                        <td className="px-3 py-2">{s.code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Associate form (only subjects with null teacher_id provided from server) */}
          <form onSubmit={submitAssociate} className="flex items-end gap-2">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Associate subject</label>
              <select
                className="h-9 rounded-md border bg-background px-2 text-sm"
                value={String(data.subject_id)}
                onChange={(e) => setData('subject_id', e.target.value ? Number(e.target.value) : '')}
              >
                <option value="">— Select unassigned subject —</option>
                {available_subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
              {errors.subject_id && <div className="text-xs text-red-600 mt-1">{String(errors.subject_id)}</div>}
            </div>
            <Button type="submit" disabled={processing || !data.subject_id}>Associate</Button>
          </form>
        </section>
      </div>
    </AppSidebarLayout>
  );
}
