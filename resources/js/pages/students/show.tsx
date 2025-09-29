import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
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

type Props = PageProps & {
  item: Record<string, unknown>;
};

export default function StudentShow({ item }: Props) {
  const it = (item ?? {}) as Record<string, unknown>;

  return (
    <AppSidebarLayout>
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Heading title={`Student #${it.id ?? ''}`} description="Detalles del estudiante" />
          <Button asChild variant="outline" size="sm">
            <Link href="/students">Volver</Link>
          </Button>
        </div>

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
      </div>
    </AppSidebarLayout>
  );
}
