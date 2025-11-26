"use client"
import Link from "next/link"
import { useState, useEffect, useMemo, useLayoutEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { getAllProjects } from "@lib/mstm/registry"
import Header from "@components/Header"

export default function ExplorePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projects = getAllProjects()

  const queryFromUrl = searchParams.get("q") || ""
  const [inputValue, setInputValue] = useState(queryFromUrl)
  const [searchQuery, setSearchQuery] = useState(queryFromUrl)
  const [selectedType, setSelectedType] = useState<string>("all")

  // Set page title when search query changes - using useLayoutEffect for immediate update
  useLayoutEffect(() => {
    if (searchQuery) {
      document.title = `Search: ${searchQuery} - mstm`
    } else {
      document.title = "Explore - mstm"
    }
  }, [searchQuery])

  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) {
      params.set("q", searchQuery)
    }
    const newUrl = searchQuery ? `/explore?${params.toString()}` : "/explore"
    router.push(newUrl, { scroll: false })
  }, [searchQuery, router])

  const handleSearch = () => {
    setSearchQuery(inputValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    setInputValue("")
    setSearchQuery("")
  }

  const filteredProjects = useMemo(() => {
    if (!searchQuery && selectedType === "all") return []

    return projects.filter((project) => {
      const matchesSearch =
        !searchQuery ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesType = selectedType === "all" || project.type === selectedType

      return matchesSearch && matchesType
    })
  }, [projects, searchQuery, selectedType])

  const hasSearched = searchQuery.length > 0

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      {!hasSearched ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-24 pb-32">
          <div className="max-w-3xl w-full space-y-6 sm:space-y-8">
            <div className="space-y-3 text-center">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight">Explore</h1>
              <p className="text-base sm:text-lg md:text-xl opacity-60 font-light">
                Search and filter through the complete collection.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
              <input
                type="text"
                placeholder="Search by name, description, or tags... (Press Enter)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border border-white/20 px-12 sm:px-16 py-4 sm:py-5 text-base sm:text-lg focus:outline-none focus:border-mstm transition-colors placeholder:opacity-30"
                autoFocus
              />
              {inputValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 hover:text-mstm transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 pt-20 sm:pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-8 sm:py-12">
            {/* Search bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-5 h-5 opacity-30" />
                <input
                  type="text"
                  placeholder="Search by name, description, or tags... (Press Enter)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border border-white/20 px-12 sm:px-16 py-3 sm:py-4 text-sm sm:text-base focus:outline-none focus:border-mstm transition-colors placeholder:opacity-30"
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 hover:text-mstm transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Type Filter */}
            <div className="mb-12">
              <div className="text-xs uppercase tracking-wider font-mono opacity-40 mb-3">Filter by Type</div>
              <div className="flex gap-2 flex-wrap">
                {["all", "tool", "art", "game", "other"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 sm:px-5 py-2 text-xs sm:text-sm uppercase tracking-wider transition-all ${
                      selectedType === type
                        ? "bg-mstm text-black"
                        : "bg-white/5 border border-white/20 hover:border-white/40"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {filteredProjects.length > 0 ? (
              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={project.path}
                    className="group block bg-white/5 border-l-2 border-transparent hover:border-mstm p-4 sm:p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-6">
                      <div className="flex-1 space-y-2">
                        <h2 className="text-lg sm:text-xl font-serif group-hover:text-mstm transition-colors">
                          {project.title}
                        </h2>
                        <p className="text-xs sm:text-sm opacity-60 leading-relaxed">{project.description}</p>
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs font-mono opacity-40">
                          <span className="uppercase">{project.type}</span>
                          <span className="hidden sm:inline">•</span>
                          <span>by {project.authors.join(', ')}</span>
                          <span className="hidden sm:inline">•</span>
                          <span className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 3).map((tag) => (
                              <span key={tag}>{tag}</span>
                            ))}
                            {project.tags.length > 3 && <span>+{project.tags.length - 3}</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 space-y-3">
                <p className="text-xl sm:text-2xl font-serif opacity-30">No results found</p>
                <p className="text-xs sm:text-sm opacity-20">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
