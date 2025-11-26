import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Globe, Github, Twitter, MapPin, Users, BookOpen, Calendar, Code2 } from "lucide-react"
import Header from "@components/Header"
import { getGitHubUser } from "@lib/github"
import { getProjectsByAuthor, isContributor } from "@lib/projects"

interface CreatorPageProps {
  params: Promise<{
    user: string
  }>
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const { user } = await params

  // Check if user is a contributor before calling GitHub API
  if (!isContributor(user)) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-24 sm:pt-32 pb-24">
          <div className="text-center py-16 sm:py-24">
            <Code2 className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 text-white/20" />
            <h1 className="text-3xl sm:text-4xl font-serif mb-4">@{user}</h1>
            <p className="text-lg sm:text-xl text-white/40 mb-8">
              This user hasn&apos;t contributed to any projects yet.
            </p>
            <Link
              href="/contribute"
              className="inline-block px-6 py-3 border border-white/20 hover:bg-white/10 hover:border-mstm/50 transition-all text-sm"
            >
              Want to contribute?
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const [githubUser, projects] = await Promise.all([
    getGitHubUser(user),
    Promise.resolve(getProjectsByAuthor(user)),
  ])

  if (!githubUser) {
    notFound()
  }

  const projectsByType = projects.reduce(
    (acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )


  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-24 sm:pt-32 pb-24">
        {/* Profile Header with Stats Grid */}
        <div className="mb-12 sm:mb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start mb-8 pb-8 border-b border-white/10">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start sm:items-center flex-1 w-full">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 shrink-0">
                <Image
                  src={githubUser.avatar_url || "/placeholder.svg"}
                  alt={githubUser.name || githubUser.login}
                  width={160}
                  height={160}
                  className="rounded-full border-4 border-mstm/30 shadow-[0_0_40px_rgba(84,225,232,0.2)]"
                />
              </div>

              <div className="flex-1 space-y-4 sm:space-y-6 w-full">
                <div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-2">
                    {githubUser.name || githubUser.login}
                  </h1>
                  <p className="text-base sm:text-lg text-mstm/80">@{githubUser.login}</p>
                </div>

                {githubUser.bio && (
                  <p className="text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">{githubUser.bio}</p>
                )}

                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-white/60">
                  {githubUser.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{githubUser.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      <strong className="text-white">{githubUser.followers}</strong> followers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>
                      <strong className="text-white">{githubUser.public_repos}</strong> repos
                    </span>
                  </div>
                  {githubUser.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined {new Date(githubUser.created_at).getFullYear()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Links and Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Social Links */}
            <a
              href={githubUser.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mstm/50 transition-all group"
            >
              <Github className="w-5 h-5 text-white/60 group-hover:text-mstm transition-colors" />
              <span className="text-sm font-medium">GitHub Profile</span>
            </a>

            {githubUser.blog && (
              <a
                href={githubUser.blog.startsWith("http") ? githubUser.blog : `https://${githubUser.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mstm/50 transition-all group"
              >
                <Globe className="w-5 h-5 text-white/60 group-hover:text-mstm transition-colors" />
                <span className="text-sm font-medium">Website</span>
              </a>
            )}

            {githubUser.twitter_username && (
              <a
                href={`https://twitter.com/${githubUser.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-mstm/50 transition-all group"
              >
                <Twitter className="w-5 h-5 text-white/60 group-hover:text-mstm transition-colors" />
                <span className="text-sm font-medium">Twitter</span>
              </a>
            )}

            {/* Project Stats Card */}
            <div className="flex items-center gap-3 px-4 py-3 bg-mstm/10 border border-mstm/30">
              <Code2 className="w-5 h-5 text-mstm" />
              <div>
                <div className="text-2xl font-serif text-mstm">{projects.length}</div>
                <div className="text-xs text-white/60">Projects</div>
              </div>
            </div>
          </div>

          {/* Project Type Breakdown */}
          {Object.keys(projectsByType).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {Object.entries(projectsByType).map(([type, count]) => (
                <div key={type} className="px-3 py-1.5 bg-white/5 border border-white/10 text-sm">
                  <span className="text-white/40 uppercase tracking-wider text-xs">{type}</span>
                  <span className="ml-2 text-white font-medium">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif">
              Projects <span className="text-white/40">({projects.length})</span>
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 sm:py-24 border border-dashed border-white/10">
              <Code2 className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-white/20" />
              <p className="text-lg sm:text-xl text-white/40">No projects found for this creator.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  href={project.path}
                  className="group block bg-white/5 border border-white/10 hover:border-mstm/50 transition-all hover:bg-white/[0.07]"
                >
                  <div className="p-5 sm:p-6 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-lg sm:text-xl font-serif group-hover:text-mstm transition-colors flex-1">
                        {project.title}
                      </h3>
                      <span className="text-xs px-2 py-1 bg-white/10 text-white/60 uppercase tracking-wider shrink-0">
                        {project.type}
                      </span>
                    </div>

                    <p className="text-sm text-white/60 line-clamp-3 leading-relaxed">{project.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-white/5 text-white/40 hover:bg-white/10 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className="text-xs px-2 py-1 text-white/40">+{project.tags.length - 4}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
