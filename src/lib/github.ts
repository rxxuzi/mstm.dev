export interface GitHubUser {
  login: string
  name: string
  avatar_url: string
  bio: string
  html_url: string
  blog: string
  twitter_username: string
  location: string
  public_repos: number
  followers: number
  following: number
  created_at: string
}

export async function getGitHubUser(username: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Failed to fetch GitHub user:", error)
    return null
  }
}
