import SimpleTable, { type Column } from '@/components/admin/simple-table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { PageProps } from '@/types';

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
      { header: 'Document', accessor: (r) => r.document, className: 'w-[80px]' },
      { header: 'Name', accessor: (r) => r.name },
      { header: 'Last name', accessor: (r) => r.last_name },
      { header: 'Age', accessor: (r) => r.age ?? '' },
  ];

  return (
    <AppSidebarLayout>
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
