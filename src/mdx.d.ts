declare module '*.mdx' {
  import type { ComponentProps, JSX } from 'react'

  export const meta: {
    title: string;
    date: string;
    shortDescription: string;
    techStack: string[];
    links?: {
      livePreview?: string | null;
      github?: string | null;
      videoDemo?: string | null;
      article?: string | null;
    };
    images?: string[];
  }

  export default function MDXContent(props: ComponentProps<'div'>): JSX.Element
}
