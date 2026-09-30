import { Suspense } from 'react';
import AdminRoute from '@/components/admin/AdminRoute';
import AdminProjectForm from '@/components/admin/AdminProjectForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Project | Showcase CMS',
};

async function EditProjectContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AdminProjectForm id={id} />;
}

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AdminRoute>
      <Suspense fallback={<div className="p-8 text-on-surface-variant font-mono text-sm">Loading project editor...</div>}>
        <EditProjectContent params={params} />
      </Suspense>
    </AdminRoute>
  );
}
