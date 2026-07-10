import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
// We recommend using the Service Role Key for seeding to bypass RLS
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase URL or Key in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const BUCKET_NAME = 'portfolio-assets';

async function seed() {
  const contentDir = path.join(process.cwd(), 'src', 'content', 'projects');
  const assetsDir = path.join(process.cwd(), 'src', 'assets', 'projects');
  
  if (!fs.existsSync(contentDir)) {
    console.error('Content directory not found:', contentDir);
    return;
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.mdx'));

  for (const file of files) {
    console.log(`\nProcessing ${file}...`);
    const filePath = path.join(contentDir, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');

    // Extract meta object using regex
    const metaRegex = /export const meta = ({[\s\S]*?});/;
    const metaMatch = rawContent.match(metaRegex);
    
    if (!metaMatch) {
      console.warn(`No meta object found in ${file}. Skipping.`);
      continue;
    }

    let meta;
    try {
      // Evaluate the JS object string securely-ish for our own local script
      meta = new Function('return ' + metaMatch[1])();
    } catch (e) {
      console.error(`Failed to parse meta for ${file}:`, e);
      continue;
    }

    // The rest of the file is the markdown content
    const markdownContent = rawContent.replace(metaRegex, '').trim();

    // 1. Upload Images to Supabase Storage
    const publicImageUrls: string[] = [];
    if (meta.images && Array.isArray(meta.images)) {
      for (const imagePath of meta.images) {
        const localImagePath = path.join(assetsDir, ...imagePath.split('/'));
        
        if (fs.existsSync(localImagePath)) {
          console.log(`  Uploading image: ${imagePath}`);
          const imageBuffer = fs.readFileSync(localImagePath);
          const ext = path.extname(imagePath);
          const fileName = `${path.basename(imagePath, ext)}-${Date.now()}${ext}`;
          const storagePath = `${meta.title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}/${fileName}`;

          const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, imageBuffer, {
              contentType: `image/${ext.replace('.', '')}`,
              upsert: true
            });

          if (error) {
            console.error(`  Error uploading ${imagePath}:`, error.message);
          } else {
            const { data: publicUrlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
            publicImageUrls.push(publicUrlData.publicUrl);
          }
        } else {
          console.warn(`  Image not found locally: ${localImagePath}`);
        }
      }
    }

    // 2. Insert into Supabase DB
    const slug = path.basename(file, '.mdx');
    const projectData = {
      slug,
      title: meta.title,
      date: meta.date,
      icon: meta.icon,
      short_description: meta.shortDescription,
      content: markdownContent,
      tech_stack: meta.techStack || [],
      links: meta.links || {}
    };

    // We can add images directly to the links object or to a dedicated column if we alter the schema.
    // The current schema uses `links` jsonb. Let's append images to links for simplicity if not in schema.
    // Actually, let's just dump the images into the links JSON for now, or into a new top-level object if preferred.
    // Since we created `links jsonb` in our schema, we can store images in a generic JSON column if needed,
    // or add `images jsonb` to the schema. Our schema from earlier didn't explicitly add `images jsonb`.
    // Let's add it to `links` to keep it simple, or insert it. Wait, `links jsonb` is just one column.
    projectData.links = { ...meta.links, images: publicImageUrls };

    const { data, error } = await supabase
      .from('projects')
      .upsert(projectData, { onConflict: 'slug' })
      .select();

    if (error) {
      console.error(`Error inserting ${slug}:`, error.message);
    } else {
      console.log(`Successfully migrated ${slug}`);
    }
  }
  
  console.log('\nMigration complete!');
}

seed().catch(console.error);
