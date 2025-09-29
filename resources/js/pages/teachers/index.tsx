import SimpleTable, { type Column } from '@/components/admin/simple-table';
import AppShell from '@/components/app-shell';
import type { PageProps } from '@/types';

export type Teacher = {
  id: number;
  teachers_code?: string | null;
  name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
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
    { header: 'ID', accessor: (r) => r.id, className: 'w-[80px]' },
    { header: 'Code', accessor: (r) => r.teachers_code ?? '' },
    { header: 'Name', accessor: (r) => r.name },
    { header: 'Last name', accessor: (r) => r.last_name },
    { header: 'Email', accessor: (r) => r.email ?? '' },
    { header: 'Phone', accessor: (r) => r.phone ?? '' },
  ];

  return (
    <AppShell title="Teachers">
      <SimpleTable<Teacher>
        title="Teachers"
        description="Browse and search teachers"
        items={items}
        columns={columns}
      />
    </AppShell>
  );
}
