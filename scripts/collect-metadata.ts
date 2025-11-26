// scripts/collect-metadata.ts
import fs from 'fs'
import path from 'path'
import type { ProjectMetadata, ProjectWithPath, ProjectType } from '../src/lib/mstm/types'

type MetaJson = Omit<ProjectMetadata, 'slug' | 'path'>

async function collectMetadata() {
  const contentDir = path.join(process.cwd(), 'src/app/content')
  const projects: ProjectWithPath[] = []

  if (!fs.existsSync(contentDir)) {
    console.warn('⚠️  content directory not found')
    fs.mkdirSync(contentDir, { recursive: true })
    return []
  }

  const entries = fs.readdirSync(contentDir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name.startsWith('_')) {
      continue
    }

    const slug = entry.name
    const metaPath = path.join(contentDir, slug, 'meta.json')

    if (!fs.existsSync(metaPath)) {
      console.warn(`⚠️  ${slug}: meta.json not found`)
      continue
    }

    try {
      const metaContent = fs.readFileSync(metaPath, 'utf-8')
      const meta: MetaJson = JSON.parse(metaContent)

      // バリデーション
      if (!meta.title || !meta.description || !meta.type) {
        console.error(`❌ ${slug}: Invalid meta.json (missing required fields)`)
        continue
      }

      const validTypes: ProjectType[] = ['tool', 'art', 'game', 'other']
      if (!validTypes.includes(meta.type)) {
        console.error(`❌ ${slug}: Invalid type "${meta.type}"`)
        continue
      }

      // authors のバリデーション
      if (!Array.isArray(meta.authors) || meta.authors.length === 0) {
        console.error(`❌ ${slug}: authors must be a non-empty array`)
        continue
      }

      // createdAt のバリデーション (yyyy-mm-dd)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.createdAt)) {
        console.error(`❌ ${slug}: createdAt must be in yyyy-mm-dd format`)
        continue
      }

      const project: ProjectWithPath = {
        slug,
        ...meta,
        path: `/${slug}`,
      }

      projects.push(project)
      console.log(`✓ ${slug}`)
    } catch (error) {
      console.error(`❌ ${slug}: Failed to parse meta.json`, error)
    }
  }

  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  const outputPath = path.join(process.cwd(), 'data/projects.json')
  fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2))

  console.log(`\n✨ Collected ${projects.length} projects`)
  return projects
}

collectMetadata().catch(console.error)