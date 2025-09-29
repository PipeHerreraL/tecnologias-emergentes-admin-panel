import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';

type Item = {
  id: number;
  name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  gender?: string | null;
  document_type?: string | null;
  document?: string | null;
  birth_date?: string | null;
};

export default function TeacherEdit({ item }: { item: Item }) {
  const { data, setData, put, processing, errors, delete: destroy } = useForm({
    name: item.name ?? '',
    last_name: item.last_name ?? '',
    email: item.email ?? '',
    phone: item.phone ?? '',
    address: item.address ?? '',
    gender: item.gender ?? '',
    document_type: item.document_type ?? '',
    document: item.document ?? '',
    birth_date: item.birth_date ?? '',
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/teachers/${item.id}`);
  };

  const onDelete = () => {
    if (confirm('Are you sure you want to delete this teacher? This action cannot be undone.')) {
      destroy(`/teachers/${item.id}`);
    }
  };

  return (
    <AppSidebarLayout>
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Heading title={`Edit Teacher #${item.id}`} description="Update teacher information" />
          <div className="flex items-center gap-2">
            <Button variant="destructive" type="button" onClick={onDelete}>Delete</Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/teachers/${item.id}`}>Cancel</Link>
            </Button>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Basic Details */}
          <section className="rounded-md border p-4 space-y-4">
            <h2 className="text-base font-semibold">Basic Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input className="w-full h-9 rounded-md border px-3 text-sm" value={data.name}
                  onChange={(e) => setData('name', e.target.value)} />
                {errors.name && <div className="text-xs text-red-600 mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1">Last name</label>
                <input className="w-full h-9 rounded-md border px-3 text-sm" value={data.last_name}
                  onChange={(e) => setData('last_name', e.target.value)} />
                {errors.last_name && <div className="text-xs text-red-600 mt-1">{errors.last_name}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input type="email" className="w-full h-9 rounded-md border px-3 text-sm" value={data.email}
                  onChange={(e) => setData('email', e.target.value)} />
                {errors.email && <div className="text-xs text-red-600 mt-1">{errors.email}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1">Phone</label>
                <input className="w-full h-9 rounded-md border px-3 text-sm" value={data.phone}
                  onChange={(e) => setData('phone', e.target.value)} />
                {errors.phone && <div className="text-xs text-red-600 mt-1">{errors.phone}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1">Address</label>
                <input className="w-full h-9 rounded-md border px-3 text-sm" value={data.address}
                  onChange={(e) => setData('address', e.target.value)} />
                {errors.address && <div className="text-xs text-red-600 mt-1">{errors.address}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1">Gender</label>
                <div className="flex items-center gap-4 h-9">
                  {['male','female','other'].map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={data.gender === g}
                        onChange={(e) => setData('gender', e.target.value)}
                      />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && <div className="text-xs text-red-600 mt-1">{errors.gender}</div>}
              </div>
            </div>
          </section>

          {/* Identity */}
          <section className="rounded-md border p-4 space-y-4">
            <h2 className="text-base font-semibold">Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Document type</label>
                <select
                  className="w-full h-9 rounded-md border px-3 text-sm"
                  value={data.document_type}
                  onChange={(e) => setData('document_type', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="id_card">id_card</option>
                  <option value="passport">passport</option>
                </select>
                {errors.document_type && <div className="text-xs text-red-600 mt-1">{errors.document_type}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1">Document</label>
                <input className="w-full h-9 rounded-md border px-3 text-sm" value={data.document}
                  onChange={(e) => setData('document', e.target.value)} />
                {errors.document && <div className="text-xs text-red-600 mt-1">{errors.document}</div>}
              </div>
              <div>
                <label className="block text-sm mb-1">Birth date</label>
                <input type="date" className="w-full h-9 rounded-md border px-3 text-sm" value={data.birth_date}
                  onChange={(e) => setData('birth_date', e.target.value)} />
                {errors.birth_date && <div className="text-xs text-red-600 mt-1">{errors.birth_date}</div>}
              </div>
            </div>
          </section>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={processing}>Save</Button>
            <Button asChild type="button" variant="outline">
              <Link href={`/teachers/${item.id}`}>Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </AppSidebarLayout>
  );
}
