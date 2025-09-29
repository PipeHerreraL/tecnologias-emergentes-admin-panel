import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import type { PageProps } from '@/types';

type Props = PageProps & {
  item: Record<string, unknown>;
};

export default function SubjectShow({ item }: Props) {
  return (
    <AppSidebarLayout>
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <Heading title={`Subject #${String((item as Record<string, unknown>)?.id ?? '')}`} description="Detalles de la asignatura" />
          <Button asChild variant="outline" size="sm">
            <Link href="/subjects">Volver</Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <table className="w-full text-sm">
            <tbody>
              {Object.entries(item ?? {}).map(([k, v]) => (
                <tr key={k} className="border-b last:border-b-0">
                  <th className="w-48 text-left px-3 py-2 font-medium bg-muted/50 capitalize">{k.replaceAll('_',' ')}</th>
                  <td className="px-3 py-2">{String(v ?? '')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppSidebarLayout>
  );
}
