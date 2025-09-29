import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import type { PageProps } from '@/types';

function Field({ label, value }: { label: string; value: unknown }) {
  const v = value === null || value === undefined || value === '' ? '-' : String(value);
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-1 text-sm text-muted-foreground">{label}</div>
      <div className="col-span-2 font-medium break-words">{v}</div>
    </div>
  );
}

type Teacher = { id?: number; name?: string | null; last_name?: string | null } | null;

type Item = {
  id?: number;
  name?: string | null;
  code?: string | null;
  credits?: number | null;
  teacher?: Teacher;
};

type Props = PageProps & {
  item: Item;
};

export default function SubjectShow({ item }: Props) {
  const it: Item = item ?? {};
  const teacher = it.teacher ?? null;
  const teacherFullName = teacher ? `${teacher.name ?? ''} ${teacher.last_name ?? ''}`.trim() || '-' : '-';

  return (
    <AppSidebarLayout>
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Heading
            title={`Subject #${String(it.id ?? '')}`}
            description="Detalles de la asignatura"
          />
          <Button asChild variant="outline" size="sm">
            <Link href="/subjects">Volver</Link>
          </Button>
        </div>

        {/* Two sections side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Details (3 internal columns) */}
          <section className="rounded-md border p-4 space-y-4">
            <h2 className="text-base font-semibold">Basic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Name" value={it.name} />
              <Field label="Code" value={it.code} />
              <Field label="Credits" value={it.credits} />
            </div>
          </section>

          {/* Teacher (single row with full name) */}
          <section className="rounded-md border p-4 space-y-4">
            <h2 className="text-base font-semibold">Teacher</h2>
            <div className="grid grid-cols-1 gap-4">
              <Field label="Teacher" value={teacherFullName} />
            </div>
          </section>
        </div>
      </div>
    </AppSidebarLayout>
  );
}
