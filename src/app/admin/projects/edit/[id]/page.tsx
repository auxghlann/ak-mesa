import AdminRoute from '@/components/admin/AdminRoute';
import AdminProjectForm from '@/components/admin/AdminProjectForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Project | Showcase CMS',
};

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AdminRoute>
      <AdminProjectForm id={id} />
    </AdminRoute>
  );
}
