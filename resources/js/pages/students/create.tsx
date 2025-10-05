import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import type { BreadcrumbItem } from '@/types';
import { create } from '@/routes/students';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: `Create Student`,
        href: create().url,
    },
];

export default function StudentCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        gender: '',
        document_type: '',
        document: '',
        birth_date: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/students');
    };

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Students" />
            <div className="space-y-6 px-4 py-6">
                <div className="flex items-center justify-between">
                    <Heading
                        title="Create Student"
                        description="Add a new student"
                    />
                    <Button asChild variant="outline" size="sm">
                        <Link href={"/students"}>Cancel</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    {/* Basic Details */}
                    <section className="space-y-4 rounded-md border p-4">
                        <h2 className="text-base font-semibold">
                            Basic Details
                        </h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                                    Last name
                                </label>
                                <input
                                    className="h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData('last_name', e.target.value)
                                    }
                                />
                                {errors.last_name && (
                                    <div className="mt-1 text-xs text-red-600">
                                        {errors.last_name}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                />
                                {errors.email && (
                                    <div className="mt-1 text-xs text-red-600">
                                        {errors.email}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">
                                    Phone
                                </label>
                                <input
                                    className="h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                />
                                {errors.phone && (
                                    <div className="mt-1 text-xs text-red-600">
                                        {errors.phone}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">
                                    Address
                                </label>
                                <input
                                    className="h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                />
                                {errors.address && (
                                    <div className="mt-1 text-xs text-red-600">
                                        {errors.address}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">
                                    Gender
                                </label>
                                <div className="flex h-9 items-center gap-4">
                                    {['male', 'female', 'other'].map((g) => (
                                        <label
                                            key={g}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={g}
                                                checked={data.gender === g}
                                                onChange={(e) =>
                                                    setData(
                                                        'gender',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <span className="capitalize">
                                                {g}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.gender && (
                                    <div className="mt-1 text-xs text-red-600">
                                        {errors.gender}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Identity */}
                    <section className="space-y-4 rounded-md border p-4">
                        <h2 className="text-base font-semibold">Identity</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm">
                                    Document type
                                </label>
                                <select
                                    className="h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.document_type}
                                    onChange={(e) =>
                                        setData('document_type', e.target.value)
                                    }
                                >
                                    <option value="">Select...</option>
                                    <option value="id_card">id_card</option>
                                    <option value="passport">passport</option>
                                </select>
                                {errors.document_type && (
                                    <div className="mt-1 text-xs text-red-600">
                                        {errors.document_type}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">
                                    Document
                                </label>
                                <input
                                    className="h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.document}
                                    onChange={(e) =>
                                        setData('document', e.target.value)
                                    }
                                />
                                {errors.document && (
                                    <div className="mt-1 text-xs text-red-600">
                                        {errors.document}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm">
                                    Birth date
                                </label>
                                <input
                                    type="date"
                                    className="h-9 w-full rounded-md border px-3 text-sm"
                                    value={data.birth_date}
                                    onChange={(e) =>
                                        setData('birth_date', e.target.value)
                                    }
                                />
                                {errors.birth_date && (
                                    <div className="mt-1 text-xs text-red-600">
                                        {errors.birth_date}
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="flex items-center gap-2">
                        <Button type="submit" disabled={processing}>
                            Create
                        </Button>
                        <Button asChild type="button" variant="outline">
                            <Link href={"/students"}>Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppSidebarLayout>
    );
}
