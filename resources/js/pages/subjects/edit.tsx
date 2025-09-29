import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Link, router, useForm } from '@inertiajs/react';
import React from 'react';

type Teacher = { id: number; name: string | null; last_name: string | null };

type Item = {
    id: number;
    name: string;
    code: string;
    credits: number;
    teacher?: Teacher | null;
};

type Props = { item: Item; teachers: Teacher[] };

export default function SubjectEdit({ item, teachers }: Props) {
    const {
        data,
        setData,
        put,
        processing,
        errors,
        delete: destroy,
    } = useForm({
        name: item.name ?? '',
        code: item.code ?? '',
        credits: item.credits ?? 0,
        teacher_id: item.teacher?.id ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/subjects/${item.id}`, {
            onSuccess: () => router.visit(`/subjects`),
        });
    };

    const onDelete = () => {
        if (
            confirm(
                'Are you sure you want to delete this subject? This action cannot be undone.',
            )
        ) {
            destroy(`/subjects/${item.id}`, {
                onSuccess: () => router.visit('/subjects'),
            });
        }
    };

    return (
        <AppSidebarLayout>
            <div className="space-y-6 px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title={`Edit Subject #${item.id}`}
                        description="Update subject"
                    />
                    <div className="flex items-center gap-2">
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={onDelete}
                        >
                            Delete
                        </Button>
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/subjects/${item.id}`}>Cancel</Link>
                        </Button>
                    </div>
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
                                        value={Number(data.credits)}
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
                                        value={String(data.teacher_id ?? '')}
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
                            Save
                        </Button>
                        <Button asChild type="button" variant="outline">
                            <Link href={`/subjects/${item.id}`}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
