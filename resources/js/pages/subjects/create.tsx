import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
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
            <div className="space-y-6 px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Create Subject"
                        description="Add a new subject"
                    />
                    <Button asChild variant="outline" size="sm">
                        <Link href="/subjects">Cancel</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Two sections side by side */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Basic Details */}
                        <section className="space-y-4 rounded-md border p-4">
                            <h2 className="text-base font-semibold">
                                Basic Details
                            </h2>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="mb-1 block text-sm">
                                        Name
                                    </label>
                                    <input
                                        className="h-9 w-full rounded-md border px-3 text-sm"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                    />
                                    {errors.name && (
                                        <div className="mt-1 text-xs text-red-600">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">
                                        Code
                                    </label>
                                    <input
                                        className="h-9 w-full rounded-md border px-3 text-sm"
                                        value={data.code}
                                        onChange={(e) =>
                                            setData('code', e.target.value)
                                        }
                                    />
                                    {errors.code && (
                                        <div className="mt-1 text-xs text-red-600">
                                            {errors.code}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm">
                                        Credits
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        className="h-9 w-full rounded-md border px-3 text-sm"
                                        value={data.credits}
                                        onChange={(e) =>
                                            setData(
                                                'credits',
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                    {errors.credits && (
                                        <div className="mt-1 text-xs text-red-600">
                                            {errors.credits}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Teacher */}
                        <section className="space-y-4 rounded-md border p-4">
                            <h2 className="text-base font-semibold">Teacher</h2>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm">
                                        Teacher (optional)
                                    </label>
                                    <select
                                        className="h-9 w-full rounded-md border px-3 text-sm"
                                        value={String(data.teacher_id)}
                                        onChange={(e) =>
                                            setData(
                                                'teacher_id',
                                                e.target.value
                                                    ? Number(e.target.value)
                                                    : '',
                                            )
                                        }
                                    >
                                        <option value="">— None —</option>
                                        {teachers.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {(t.name ?? '') +
                                                    ' ' +
                                                    (t.last_name ?? '')}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.teacher_id && (
                                        <div className="mt-1 text-xs text-red-600">
                                            {errors.teacher_id}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button type="submit" disabled={processing}>
                            Create
                        </Button>
                        <Button asChild type="button" variant="outline">
                            <Link href="/subjects">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
