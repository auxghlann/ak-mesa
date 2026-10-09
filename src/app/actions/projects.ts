'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export async function revalidateProjectsCache() {
  try {
    revalidateTag('projects', { expire: 0 });
    revalidatePath('/', 'page');
    revalidatePath('/projects', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to revalidate projects cache:', error);
    return { success: false, error: String(error) };
  }
}
