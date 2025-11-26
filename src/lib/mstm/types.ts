export type ProjectType = 'tool' | 'art' | 'game' | 'other'

export interface ProjectMetadata {
  slug: string
  title: string
  description: string
  type: ProjectType
  category: string
  tags: string[]
  authors: string[]
  featured?: boolean
  mobile: boolean
  createdAt: string
  updatedAt?: string
  license?: string
}

export interface ProjectWithPath extends ProjectMetadata {
  path: string
}