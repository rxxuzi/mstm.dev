import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "404 - Page Not Found - mstm",
  description: "The page you're looking for doesn't exist or has been moved.",
}

export default function NotFound() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white flex items-center justify-center px-6">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Number */}
        <div className="space-y-4">
          <h1 className="text-9xl md:text-[12rem] font-serif leading-none tracking-tighter opacity-20">404</h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-mstm to-transparent" />
        </div>

        {/* Message */}
        <div className="space-y-4">
          <h2 className="text-3xl md:text-5xl font-serif text-balance">Page Not Found</h2>
          <p className="text-lg md:text-xl opacity-70 font-light leading-relaxed text-balance">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-8 py-3 bg-mstm text-black font-medium hover:bg-mstm/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(84,225,232,0.5)]"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Go Home</span>
          </Link>
          <Link
            href="/browse"
            className="px-8 py-3 border border-white/20 hover:bg-white/10 hover:border-mstm/50 transition-all duration-300 backdrop-blur-sm text-white"
          >
            Browse Projects
          </Link>
        </div>

        {/* Decoration */}
        <div className="pt-12 opacity-30">
          <p className="text-sm font-mono tracking-widest uppercase">Error: Resource Not Available</p>
        </div>
      </div>

      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-mstm/10 rounded-full blur-[120px]" />
      </div>
    </main>
  )
}
