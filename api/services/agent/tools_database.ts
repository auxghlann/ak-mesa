import "dotenv/config";
import { z } from "zod";
import { tool } from "langchain";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const listProjects = tool(
    async () => {
        const { data, error } = await supabase
            .from('projects')
            .select('slug, title, short_description');

        if (error) {
            console.error("Supabase query error:", error);
            return `Error fetching projects: ${error.message}`;
        }

        return `List of my projects: ${JSON.stringify(data, null, 2)}`;
    },
    {
        name: "list_projects",
        description: "Fetch a high-level list of Allan's portfolio projects, including their titles, slugs, and short descriptions. Call this tool first to discover available projects before asking for specific details.",
        schema: z.object({})
    }
);

export const getProjectDetails = tool(
    async ({ project_slug }) => {
        const { data, error } = await supabase
            .from('projects')
            .select('slug, title, date, ai_summary, tech_stack, links')
            .ilike('slug', `%${project_slug}%`)
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
