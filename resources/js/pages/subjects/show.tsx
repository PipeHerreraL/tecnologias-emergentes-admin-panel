import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { PageProps } from '@/types';
import { Link, useForm } from '@inertiajs/react';

function Field({ label, value }: { label: string; value: unknown }) {
    const v =
        value === null || value === undefined || value === ''
            ? '-'
            : String(value);
    return (
        <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1 text-sm text-muted-foreground">
                {label}
            </div>
            <div className="col-span-2 font-medium break-words">{v}</div>
        </div>
    );
}

type Teacher = {
    id?: number;
    name?: string | null;
    last_name?: string | null;
} | null;
type Student = { id: number; name: string | null; last_name: string | null };

type Item = {
    id?: number;
    name?: string | null;
    code?: string | null;
    credits?: number | null;
    teacher?: Teacher;
    students?: Student[];
};

type Props = PageProps & {
    item: Item;
    available_students?: Student[];
};

export default function SubjectShow({ item, available_students = [] }: Props) {
    const it: Item = item ?? {};
    const teacher = it.teacher ?? null;
    const teacherFullName = teacher
        ? `${teacher.name ?? ''} ${teacher.last_name ?? ''}`.trim() || '-'
        : '-';
    const students = (it.students ?? []) as Student[];
    const { data, setData, post, processing, errors } = useForm<{
        student_id: string | number | '';
    }>({ student_id: '' });

    const submitAttach = (e: React.FormEvent) => {
        e.preventDefault();
        if (!it.id) return;
        post(`/subjects/${it.id}/students/attach`);
    };

    return (
        <AppSidebarLayout>
            <div className="space-y-6 px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Subject #${String(it.id ?? '')}`}
                        description="Detalles de la asignatura"
                    />
                    <div className="flex items-center gap-2">
                        <Button asChild size="sm">
                            <Link href={`/subjects/${it.id}/edit`}>Edit</Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/subjects">Volver</Link>
                        </Button>
                    </div>
                </div>

                {/* Two sections side by side */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Basic Details (3 internal columns) */}
                    <section className="space-y-4 rounded-md border p-4">
                        <h2 className="text-base font-semibold">
                            Basic Details
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Field label="Name" value={it.name} />
                            <Field label="Code" value={it.code} />
                            <Field label="Credits" value={it.credits} />
                        </div>
                    </section>

                    {/* Teacher (single row with full name) */}
                    <section className="space-y-4 rounded-md border p-4">
                        <h2 className="text-base font-semibold">Teacher</h2>
                        <div className="grid grid-cols-1 gap-4">
                            <Field label="Teacher" value={teacherFullName} />
                        </div>
                    </section>
                </div>

                {/* Students */}
                <section className="space-y-4 rounded-md border p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold">Students</h2>
                    </div>
                    <div className="space-y-2">
                        {students.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                No students attached.
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-md border">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-3 py-2 text-left">
                                                Name
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {students.map((s) => (
                                            <tr key={s.id} className="border-t">
                                                <td className="px-3 py-2">
                                                    {`${s.name ?? ''} ${s.last_name ?? ''}`.trim()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Attach form */}
                    <form
                        onSubmit={submitAttach}
                        className="flex items-end gap-2"
                    >
                        <div>
                            <label className="mb-1 block text-sm text-muted-foreground">
                                Attach student
                            </label>
                            <select
                                className="h-9 rounded-md border bg-background px-2 text-sm"
                                value={String(data.student_id)}
                                onChange={(e) =>
                                    setData(
                                        'student_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : '',
                                    )
                                }
                            >
                                <option value="">— Select student —</option>
                                {available_students.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {`${s.name ?? ''} ${s.last_name ?? ''}`.trim()}
                                    </option>
                                ))}
                            </select>
                            {errors.student_id && (
                                <div className="mt-1 text-xs text-red-600">
                                    {String(errors.student_id)}
                                </div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={processing || !data.student_id}
                        >
                            Attach
                        </Button>
                    </form>
                </section>
            </div>
        </AppSidebarLayout>
    );
}
