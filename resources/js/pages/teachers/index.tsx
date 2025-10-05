import SimpleTable, { type Column } from '@/components/admin/simple-table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem, PageProps } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { index } from '@/routes/teachers';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teachers',
        href: index().url,
    },
];

export type Teacher = {
    id: number;
    document?: number | string | null;
    name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
    age?: number | null;
};

type Paginator<T> = {
    data: T[];
    current_page: number;
    per_page: number;
    last_page: number;
    total: number;
};

type Props = PageProps & {
    items: Paginator<Teacher>;
};

export default function TeachersIndex({ items }: Props) {
    const columns: Column<Teacher>[] = [
        {
            header: 'Document',
            accessor: (r) => r.document,
            className: 'w-[80px]',
        },
        { header: 'Name', accessor: (r) => r.name },
        { header: 'Last name', accessor: (r) => r.last_name },
        { header: 'Age', accessor: (r) => r.age ?? '' },
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
                            router.visit(`/teachers/${r.id}/edit`);
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
                            if (confirm('Delete this teacher?')) {
                                router.delete(`/teachers/${r.id}`);
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
            <Head title="Teachers" />
            <SimpleTable<Teacher>
                title="Teachers"
                description="Browse and search teachers"
                items={items}
                columns={columns}
                getRowHref={(row) => `/teachers/${row.id}`}
                actionHref="/teachers/create"
                actionLabel="New Teacher"
            />
        </AppSidebarLayout>
    );
}
