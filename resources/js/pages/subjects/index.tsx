import SimpleTable, { type Column } from '@/components/admin/simple-table';
import AppShell from '@/components/app-shell';
import type { PageProps } from '@/types';

export type Subject = {
  id: number;
  name: string;
  code: string;
  credits: number;
  teacher_id?: number | null;
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
    { header: 'ID', accessor: (r) => r.id, className: 'w-[80px]' },
    { header: 'Name', accessor: (r) => r.name },
    { header: 'Code', accessor: (r) => r.code },
    { header: 'Credits', accessor: (r) => r.credits },
    { header: 'Teacher ID', accessor: (r) => r.teacher_id ?? '' },
  ];

  return (
    <AppShell title="Subjects">
      <SimpleTable<Subject>
        title="Subjects"
        description="Browse and search subjects"
        items={items}
        columns={columns}
      />
    </AppShell>
  );
}
