import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

const docsDir = path.join(process.cwd(), 'src/app/(pages)/docs/content')

// Valid slugs that have MDX files
const validSlugs = ['setup', 'contributing', 'metadata', 'styling', 'quick-start', 'code-of-conduct']

export async function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  const titles: Record<string, string> = {
    'setup': 'Setup',
    'quick-start': 'Quick Start',
    'contributing': 'Contributing',
    'project-structure': 'Project Structure',
    'metadata': 'Metadata Guide',
    'styling': 'Styling Guide',
    'code-of-conduct': 'Code of Conduct',
  }

  const title = titles[slug] || slug
  return {
    title: `${title} - mstm`,
    description: `${title} guide for mstm.dev platform`,
  }
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  if (!validSlugs.includes(slug)) {
    notFound()
  }

  const mdxPath = path.join(docsDir, `${slug}.mdx`)

  if (!fs.existsSync(mdxPath)) {
    notFound()
  }

  const source = fs.readFileSync(mdxPath, 'utf-8')

  return (
    <article className="prose prose-invert max-w-none">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight],
          },
        }}
      />
    </article>
  )
}
