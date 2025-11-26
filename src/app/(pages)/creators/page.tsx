import Link from "next/link"
import Image from "next/image"
import { Users } from "lucide-react"
import Header from "@/components/Header"
import { getAllAuthors, getProjectsByAuthor } from "@/lib/projects"
import { getGitHubUser } from "@/lib/github"

export const metadata = {
  title: "Creators - mstm.dev",
  description: "Meet the creators building the future of developer tools on mstm.dev",
}

export default async function CreatorsPage() {
  const authors = getAllAuthors()

  // Fetch GitHub data for all creators
  const creatorsData = await Promise.all(
    authors.map(async (username) => {
      const [githubUser, projects] = await Promise.all([
        getGitHubUser(username),
        Promise.resolve(getProjectsByAuthor(username)),
      ])
      return {
        username,
        githubUser,
        projectCount: projects.length,
      }
    }),
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-32 pb-24">
        {/* Header Section */}
        <div className="mb-12 sm:mb-16 pt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 leading-tight">Creators</h1>
          <p className="text-sm sm:text-base md:text-lg opacity-60 font-light max-w-2xl">
            Meet the developers building and shaping <span className="font-serif text-white">mstm.dev</span>.
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creatorsData.map(({ username, githubUser, projectCount }) => (
            <Link
              key={username}
              href={`/@${username}`}
              className="group block bg-white/5 border border-white/10 hover:border-mstm/50 transition-all p-6 hover:bg-white/[0.07]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={githubUser?.avatar_url || "/placeholder.svg"}
                    alt={githubUser?.name || username}
                    width={64}
                    height={64}
                    className="rounded-full border-2 border-white/10 group-hover:border-mstm/30 transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-serif mb-1 group-hover:text-mstm transition-colors truncate">
                    {githubUser?.name || username}
                  </h3>
                  <p className="text-sm text-white/50 truncate">@{username}</p>
                </div>
              </div>

              {githubUser?.bio && (
                <p className="text-sm text-white/60 mb-4 line-clamp-2 leading-relaxed">{githubUser.bio}</p>
              )}

              <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                <span className="text-white/40">
                  {projectCount} {projectCount === 1 ? "project" : "projects"}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {creatorsData.length === 0 && (
          <div className="text-center py-24">
            <Users className="w-16 h-16 mx-auto mb-4 text-white/20" />
            <p className="text-xl text-white/40">No creators found yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}
