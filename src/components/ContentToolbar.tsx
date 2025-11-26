// src/components/ContentToolbar.tsx
'use client'

import {useState, useEffect} from 'react'
import {usePathname} from 'next/navigation'
import {Info, Share2, Code, X, Home, ExternalLink} from 'lucide-react'
import Link from 'next/link'

interface ProjectMeta {
  title: string
  description: string
  type: string
  category: string
  tags: string[]
  authors: string[]
  license?: string
}

export function ContentToolbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [project, setProject] = useState<ProjectMeta | null>(null)
  const pathname = usePathname()
  // /content/hex-forge -> hex-forge
  // /hex-forge -> hex-forge (middleware経由)
  const slug = pathname.startsWith('/content/')
    ? pathname.replace('/content/', '').split('/')[0]
    : pathname.split('/').filter(Boolean)[0]

  useEffect(() => {
    async function loadMeta() {
      try {
        const meta = await import(`@/app/content/${slug}/meta.json`)
        const projectData = meta.default || meta
        setProject(projectData)
        // Set page title
        if (projectData?.title) {
          document.title = `${projectData.title} - mstm.dev`
        }
      } catch {
        setProject(null)
      }
    }

    if (slug) {
      loadMeta()
    }
  }, [slug])

  if (!project) {
    return null
  }

  const shareUrl = `https://mstm.dev/${slug}`

  const handleShare = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 w-8 h-8 bg-neutral-900 border border-white/10 text-mstm rounded-full flex items-center justify-center shadow-lg hover:border-mstm/50 hover:shadow-[0_0_12px_rgba(84,225,232,0.3)] transition-all"
        aria-label="Toggle project info"
      >
        {isOpen ? <X size={14}/> : <Info size={14}/>}
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          className="fixed bottom-14 left-4 z-50 w-72 bg-neutral-950 border border-white/10 rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-mstm"></div>
              <span className="text-xs font-mono uppercase tracking-wider opacity-50">
                {project.type}
              </span>
            </div>
            <span className="text-xs font-mono opacity-30">{project.license || 'MIT'}</span>
          </div>

          <div className="px-4 py-3">
            <h3 className="text-sm font-medium mb-1">{project.title}</h3>
            <p className="text-xs opacity-50 leading-relaxed">{project.description}</p>
          </div>

          <div className="px-4 pb-3 flex flex-wrap gap-1">
            {project.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] font-mono opacity-50"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono opacity-30">
                +{project.tags.length - 4}
              </span>
            )}
          </div>

          <div
            className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono">
            <span className="opacity-30">by {project.authors.join(', ')}</span>
            <span className="opacity-30">{project.category}</span>
          </div>

          <div className="px-2 py-2 border-t border-white/5 flex gap-1">
            <Link
              href="/"
              className="flex items-center justify-center p-2 hover:bg-white/5 rounded transition-colors"
              title="Home"
            >
              <Home size={14} className="opacity-50 hover:opacity-100"/>
            </Link>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-1.5 px-3 py-2 hover:bg-white/5 rounded transition-colors text-xs flex-1"
            >
              <Share2 size={12} className="opacity-50"/>
              <span className="opacity-70">{copied ? 'Copied!' : 'Share'}</span>
            </button>
            <a
              href={`https://github.com/rxxuzi/mstm.dev/tree/main/src/app/content/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 hover:bg-white/5 rounded transition-colors text-xs flex-1"
              title="View source"
            >
              <Code size={12} className="opacity-50"/>
              <span className="opacity-70">Source</span>
              <ExternalLink size={10} className="opacity-30"/>
            </a>
          </div>
        </div>
      )}
    </>
  )
}