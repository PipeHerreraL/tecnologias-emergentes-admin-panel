import SimpleTable, { type Column } from '@/components/admin/simple-table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { PageProps } from '@/types';

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
  ];

  return (
    <AppSidebarLayout>
      <SimpleTable<Subject>
        title="Subjects"
        description="Browse and search subjects"
        items={items}
        columns={columns}
        getRowHref={(row) => `/subjects/${row.id}`}
      />
    </AppSidebarLayout>
  );
}
