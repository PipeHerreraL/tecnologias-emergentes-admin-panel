import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';

type Teacher = { id: number; name: string | null; last_name: string | null };

type Props = { teachers: Teacher[] };

export default function SubjectCreate({ teachers }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
    code: '',
    credits: 0,
    teacher_id: '' as string | number | '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/subjects');
  };

  return (
    <AppSidebarLayout>
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Heading title="Create Subject" description="Add a new subject" />
          <Button asChild variant="outline" size="sm">
            <Link href="/subjects">Cancel</Link>
          </Button>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Two sections side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Details */}
            <section className="rounded-md border p-4 space-y-4">
              <h2 className="text-base font-semibold">Basic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Name</label>
                  <input className="w-full h-9 rounded-md border px-3 text-sm" value={data.name}
                    onChange={(e) => setData('name', e.target.value)} />
                  {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Code</label>
                  <input className="w-full h-9 rounded-md border px-3 text-sm" value={data.code}
                    onChange={(e) => setData('code', e.target.value)} />
                  {errors.code && <div className="text-xs text-red-600 mt-1">{errors.code}</div>}
                </div>
                <div>
                  <label className="block text-sm mb-1">Credits</label>
                  <input type="number" min={0} className="w-full h-9 rounded-md border px-3 text-sm" value={data.credits}
                    onChange={(e) => setData('credits', Number(e.target.value))} />
                  {errors.credits && <div className="text-xs text-red-600 mt-1">{errors.credits}</div>}
                </div>
              </div>
            </section>

            {/* Teacher */}
            <section className="rounded-md border p-4 space-y-4">
              <h2 className="text-base font-semibold">Teacher</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm mb-1">Teacher (optional)</label>
                  <select
                    className="w-full h-9 rounded-md border px-3 text-sm"
                    value={String(data.teacher_id)}
                    onChange={(e) => setData('teacher_id', e.target.value ? Number(e.target.value) : '')}
                  >
                    <option value="">— None —</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {(t.name ?? '') + ' ' + (t.last_name ?? '')}
                      </option>
                    ))}
                  </select>
                  {errors.teacher_id && <div className="text-xs text-red-600 mt-1">{errors.teacher_id}</div>}
                </div>
              </div>
            </section>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={processing}>Create</Button>
            <Button asChild type="button" variant="outline">
              <Link href="/subjects">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}
