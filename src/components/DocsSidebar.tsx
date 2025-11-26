"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, Code, X, FileCode, Palette, Lightbulb } from "lucide-react"
import { useState } from "react"

const sections = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs", icon: BookOpen },
      { title: "Quick Start", href: "/docs/quick-start", icon: Code },
      { title: "Contributing", href: "/docs/contributing", icon: Code },
    ],
  },
  {
    title: "Guides",
    items: [
      { title: "Metadata (meta.json)", href: "/docs/metadata", icon: FileCode },
      { title: "Styling Guide", href: "/docs/styling", icon: Palette },
    ],
  },
  {
    title: "Community",
    items: [
      { title: "Code of Conduct", href: "/docs/code-of-conduct", icon: Lightbulb },
    ],
  },
]

export default function DocsSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 bg-mstm text-black p-3 rounded-full shadow-lg"
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
      </button>

      {/* Backdrop for mobile */}
      {mobileOpen && <div className="md:hidden fixed inset-0 bg-black/80 z-40" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-[57px] sm:top-[65px] left-0 z-40
          w-64 border-r border-white/10 
          h-[calc(100vh-57px)] sm:h-[calc(100vh-65px)]
          overflow-y-auto bg-black
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <nav className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {sections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider opacity-50">{section.title}</h3>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-all ${
                          isActive
                            ? "bg-mstm/10 text-mstm border-l-2 border-mstm"
                            : "opacity-70 hover:opacity-100 hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{item.title}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  )
}
