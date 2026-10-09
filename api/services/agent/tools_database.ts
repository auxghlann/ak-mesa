import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const listProjects = tool(
    async ({ all = false }: { all?: boolean } = {}) => {
        let query = supabase
            .from('projects')
            .select('slug, title, short_description, is_pinned')
            .eq('is_visible', true);

        if (!all) {
            query = query.eq('is_pinned', true);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Supabase query error:", error);
            return `Error fetching projects: ${error.message}`;
        }

        // Fallback: if pinned was requested but none found, return all visible projects
        if (!all && (!data || data.length === 0)) {
            const { data: allData, error: allError } = await supabase
                .from('projects')
                .select('slug, title, short_description, is_pinned')
                .eq('is_visible', true);
            if (!allError && allData && allData.length > 0) {
                return `List of my projects: ${JSON.stringify(allData, null, 2)}`;
            }
        }

        const label = all ? "all projects" : "pinned projects";
        return `List of my ${label}: ${JSON.stringify(data, null, 2)}`;
    },
    {
        name: "list_projects",
        description: "Fetch a list of Allan's portfolio projects, including their titles, slugs, and short descriptions. By default, returns only pinned/featured projects. Set 'all' to true only if the user explicitly asks to see all projects, unpinned projects, or the full catalog.",
        schema: z.object({
            all: z.boolean().optional().default(false).describe("Set to true only if the user explicitly asks to see all projects, unpinned projects, or the full list of projects. Defaults to false to only return pinned projects.")
        })
    }
);

export const getProjectDetails = tool(
    async ({ project_slug }) => {
        const { data, error } = await supabase
            .from('projects')
            .select('slug, title, date, ai_summary, tech_stack, links')
            .ilike('slug', `%${project_slug}%`)
            .eq('is_visible', true)
            .maybeSingle();

        if (error) {
            console.error(`Supabase query error for slug '${project_slug}':`, error);
            return `Error fetching project details for '${project_slug}': ${error.message}`;
        }

        if (!data) {
            return `No project found matching the slug '${project_slug}'. Please check the slug and try again.`;
        }

        return `Details for project '${project_slug}': ${JSON.stringify(data, null, 2)}`;
    },
    {
        name: "get_project_details",
        description: "Fetch the detailed AI summary, tech stack, and links for a specific project. You must provide the exact 'project_slug' obtained from the list_projects tool.",
        schema: z.object({
            project_slug: z.string().describe("The exact slug of the project (e.g., 'uffun', 'table-reviewer')")
        })
    }
);
