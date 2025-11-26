"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/")
  }

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/browse", label: "Browse" },
    { href: "/creators", label: "Creators" },
    { href: "/docs", label: "Docs" },
    { href: "/explore", label: "Explore" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24 py-3 sm:py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-lg sm:text-xl font-serif tracking-tight lowercase hover:opacity-70 transition-opacity"
        >
          mstm.dev
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex gap-6 lg:gap-8 text-sm font-sans">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`transition-all ${
                    isActive(link.href) ? "text-mstm" : "opacity-70 hover:opacity-100 hover:text-mstm"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-md">
          <nav className="px-4 sm:px-6 py-4">
            <ul className="flex flex-col gap-4 text-sm font-sans">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-2 transition-all ${
                      isActive(link.href) ? "text-mstm" : "opacity-70 hover:opacity-100 hover:text-mstm"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
