import { supabase } from '@/lib/supabase';
import { revalidateProjectsCache } from '@/app/actions/projects';

export type AdminProject = {
  id: string;
  slug: string;
  title: string;
  date: string;
  icon: string;
  short_description: string;
  tech_stack: string[];
  is_pinned?: boolean;
  views?: number;
  tags?: string[];
  app_icon_url?: string | null;
  is_visible?: boolean;
};

/**
 * Fetch all projects for the admin dashboard (ordered by pinned and date).
 */
export async function fetchAdminProjects(): Promise<{ data: AdminProject[]; error: string | null }> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('date', { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }
  return { data: (data as AdminProject[]) || [], error: null };
}

/**
 * Toggle the pinned status of a project and revalidate the public cache.
 */
export async function toggleProjectPin(id: string, is_pinned: boolean): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('projects')
    .update({ is_pinned })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await revalidateProjectsCache();
  return { success: true };
}

/**
 * Toggle the visibility status of a project and revalidate the public cache.
 */
export async function toggleProjectVisibility(id: string, is_visible: boolean): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('projects')
    .update({ is_visible })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await revalidateProjectsCache();
  return { success: true };
}

/**
 * Delete a project by ID and revalidate the public cache.
 */
export async function deleteProject(id: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  await revalidateProjectsCache();
  return { success: true };
}
