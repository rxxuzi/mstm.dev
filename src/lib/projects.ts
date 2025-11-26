import projectsData from "@data/projects.json"

export interface Project {
  slug: string
  title: string
  description: string
  type: string
  category: string
  tags: string[]
  authors: string[]
  featured: boolean
  createdAt: string
  license: string
  path: string
}

export function getAllProjects(): Project[] {
  return projectsData as Project[]
}

export function getAllTags(): string[] {
  const allTags = projectsData.flatMap((project) => project.tags)
  return Array.from(new Set(allTags)).sort()
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find((project) => project.slug === slug)
}

export function getProjectsByTag(tag: string): Project[] {
  return projectsData.filter((project) => project.tags.includes(tag))
}

export function getProjectsByAuthor(username: string): Project[] {
  return projectsData.filter((project) => project.authors.includes(username.toLowerCase()))
}

export function getAllAuthors(): string[] {
  const allAuthors = projectsData.flatMap((project) => project.authors)
  return Array.from(new Set(allAuthors)).sort()
}

export function isContributor(username: string): boolean {
  const lowerUsername = username.toLowerCase()
  return projectsData.some((project) =>
    project.authors.some((author) => author.toLowerCase() === lowerUsername)
  )
}
