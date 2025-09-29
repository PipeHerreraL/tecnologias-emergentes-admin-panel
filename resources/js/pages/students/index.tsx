import SimpleTable, { type Column } from '@/components/admin/simple-table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import type { PageProps } from '@/types';

export type Student = {
  document: number;
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
  items: Paginator<Student>;
};

export default function StudentsIndex({ items }: Props) {
  const columns: Column<Student>[] = [
    { header: 'Document', accessor: (r) => r.document, className: 'w-[80px]' },
    { header: 'Name', accessor: (r) => r.name },
    { header: 'Last name', accessor: (r) => r.last_name },
    { header: 'Age', accessor: (r) => r.age ?? '' },
  ];

  return (
    <AppSidebarLayout>
      <SimpleTable<Student>
        title="Students"
        description="Browse and search students"
        items={items}
        columns={columns}
      />
    </AppSidebarLayout>
  );
}
