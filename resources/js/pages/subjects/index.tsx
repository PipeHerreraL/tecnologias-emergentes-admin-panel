import SimpleTable, { type Column } from '@/components/admin/simple-table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { index } from '@/routes/subjects';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: `Subjects`,
        href: index().url,
    },
];

export type Subject = {
    id: number;
    name: string;
    code: string;
    credits: number;
};

type Paginator<T> = {
    data: T[];
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
};

type Props = PageProps & {
    items: Paginator<Subject>;
};

export default function SubjectsIndex({ items }: Props) {
    const columns: Column<Subject>[] = [
        { header: 'Name', accessor: (r) => r.name },
        { header: 'Code', accessor: (r) => r.code },
        { header: 'Credits', accessor: (r) => r.credits },
        {
            header: 'Actions',
            accessor: (r) => (
                <div
                    className="flex items-center justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                        title="Edit"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            router.visit(`/subjects/${r.id}/edit`);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                        title="Delete"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            if (confirm('Delete this subject?')) {
                                router.delete(`/subjects/${r.id}`);
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                </div>
            ),
            className: 'w-[110px] text-right',
        },
    ];

    return (
        <AppSidebarLayout breadcrumbs={breadcrumbs}>
            <Head title="Subjects" />
            <SimpleTable<Subject>
                title="Subjects"
                description="Browse and search subjects"
                items={items}
                columns={columns}
                getRowHref={(row) => `/subjects/${row.id}`}
                actionHref="/subjects/create"
                actionLabel="New Subject"
            />
        </AppSidebarLayout>
    );
}
