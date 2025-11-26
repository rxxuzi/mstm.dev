// src/lib/mstm/registry.ts
import projectsData from '@/../data/projects.json'
import type { ProjectWithPath, ProjectType } from './types'

const projects = projectsData as ProjectWithPath[]

export function getAllProjects(): ProjectWithPath[] {
  return projects
}

export function getProjectBySlug(slug: string): ProjectWithPath | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): ProjectWithPath[] {
  return projects.filter((p) => p.featured === true)
}

export function getProjectsByType(type: ProjectType): ProjectWithPath[] {
  return projects.filter((p) => p.type === type)
}

export function getProjectsByTag(tag: string): ProjectWithPath[] {
  return projects.filter((p) => p.tags.includes(tag))
}

export function getProjectsByCategory(category: string): ProjectWithPath[] {
  return projects.filter((p) => p.category === category)
}

export function getProjectsByAuthor(author: string): ProjectWithPath[] {
  return projects.filter((p) => p.authors.includes(author))
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>()
  projects.forEach((p) => p.tags.forEach((tag) => tagSet.add(tag)))
  return Array.from(tagSet).sort()
}

export function getAllCategories(): string[] {
  const categorySet = new Set<string>()
  projects.forEach((p) => categorySet.add(p.category))
  return Array.from(categorySet).sort()
}

export function searchProjects(query: string): ProjectWithPath[] {
  const lowerQuery = query.toLowerCase()
  return projects.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}