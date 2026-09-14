import AdminRoute from '@/components/admin/AdminRoute';
import AdminProjectForm from '@/components/admin/AdminProjectForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Project | Showcase CMS',
};

export default function NewProjectPage() {
  return (
    <AdminRoute>
      <AdminProjectForm />
    </AdminRoute>
  );
}
