"use client"

import Link from "next/link"
import { getAllProjects } from "@lib/mstm/registry"
import Header from "@components/Header"
import Footer from "@components/Footer"
import { useLayoutEffect } from "react"

export default function BrowsePage() {
  useLayoutEffect(() => {
    document.title = "Browse - mstm"
  }, [])
  const projects = getAllProjects()

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 pt-20 sm:pt-24 pb-16 sm:pb-24">
          <div className="mb-12 sm:mb-16 pt-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 leading-tight">Browse</h1>
            <p className="text-sm sm:text-base md:text-lg opacity-60 font-light max-w-2xl">
              Discover developer tools and experiments built by the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={project.path}
                className="group bg-white/5 border border-white/10 p-4 sm:p-6 hover:border-mstm/50 hover:bg-white/10 transition-all duration-300"
              >
                <div className="space-y-3 sm:space-y-4">
                  {/* Meta info */}
                  <div className="flex justify-between items-start text-xs uppercase tracking-wider font-mono opacity-40">
                    <span>{project.type}</span>
                    <span>{project.category}</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-lg sm:text-xl font-serif group-hover:text-mstm transition-colors">
                    {project.title}
                  </h2>

                  {/* Description */}
                  <p className="text-xs sm:text-sm opacity-60 leading-relaxed line-clamp-3">{project.description}</p>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap pt-2 border-t border-white/10">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs opacity-40 font-mono">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="text-xs opacity-40 font-mono">+{project.tags.length - 3}</span>
                    )}
                  </div>

                  {/* Author */}
                  <div className="text-xs opacity-40 pt-2">by {project.authors.join(', ')}</div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 sm:mt-16 text-center">
            <p className="text-xs sm:text-sm opacity-40 mb-4">Want to add your project?</p>
            <Link
              href="/contribute"
              className="inline-block px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm border border-white/20 hover:border-mstm hover:text-mstm transition-all duration-300"
            >
              Start Contributing
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
