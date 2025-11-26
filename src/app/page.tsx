"use client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white selection:bg-white selection:text-black font-sans">
      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="flex flex-col justify-center items-center min-h-screen max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-24 pt-20 pb-12">
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center w-full gap-8 lg:gap-16">
            {/* Text Content - Left side on desktop */}
            <div className="flex flex-col gap-6 sm:gap-10 max-w-2xl w-full">
              <div className="space-y-2">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-serif leading-[0.85] tracking-tighter mix-blend-difference">
                  mstm.dev
                </h1>
                <p className="text-xl sm:text-2xl md:text-3xl font-light tracking-tight opacity-90">
                  Build. Break. Create.
                </p>
              </div>

              <div className="space-y-6 sm:space-y-8 max-w-lg">
                <p className="text-base sm:text-lg md:text-xl font-light leading-relaxed opacity-70 text-balance">
                  Developer tools and digital experiments. <br />
                  No friction, just function.
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <Link href="/browse">
                    <button className="px-6 sm:px-8 py-2.5 sm:py-3 bg-mstm text-black font-medium hover:bg-mstm/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(84,225,232,0.5)] text-sm sm:text-base">
                      Start Browsing
                    </button>
                  </Link>
                  <Link href="/contribute">
                    <button className="px-6 sm:px-8 py-2.5 sm:py-3 border border-white/20 hover:bg-white/10 hover:border-mstm/50 transition-all duration-300 backdrop-blur-sm text-white text-sm sm:text-base">
                      Start Building
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Character Image - Right side on desktop, top on mobile */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 shrink-0">
              <Image
                src="/images/mstm_1.png"
                alt="mstm.dev mascot character"
                width={2000}
                height={2000}
                priority
                className="w-full h-full object-contain drop-shadow-[0_0_60px_rgba(84,225,232,0.3)]"
              />
            </div>
          </div>
        </section>

        {/* The mstm.dev To House All Tools text section */}
        <section className="flex flex-col justify-center min-h-screen max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-24 py-24 border-t border-white/10">
          <div className="max-w-5xl">
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] mb-8 text-balance">
              The <span className="font-serif">mstm.dev</span> <br />
              <span className="opacity-50">To House All Tools</span>
            </h2>
            <div className="max-w-2xl">
              <p className="text-lg sm:text-xl md:text-2xl font-light leading-relaxed opacity-80 text-balance">
                Developer tools are fragmented today, but they don&apos;t need to be. For the first time, build utilities,
                share experiments, and discover solutions on the same open platform.
              </p>
            </div>
          </div>
        </section>

        {/* Community First Section */}
        <section className="flex flex-col justify-center min-h-screen max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-24 py-24 border-t border-white/10">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-serif leading-tight">Community First</h2>
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4">
                <p className="text-2xl sm:text-3xl md:text-4xl font-serif border-l-2 border-white pl-4 sm:pl-6">
                  No corporate interests.
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-serif border-l-2 border-white/50 pl-4 sm:pl-6 opacity-80">
                  No paywalls.
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-serif border-l-2 border-white/20 pl-4 sm:pl-6 opacity-60">
                  No bullshit.
                </p>
              </div>
              <p className="text-lg sm:text-xl opacity-70 max-w-md pl-4 sm:pl-6">
                Built by developers, for everyone. Open source, transparent, and designed for the modern web.
              </p>
            </div>
          </div>
        </section>

        {/* Join Section */}
        <section className="flex flex-col justify-center min-h-screen max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-24 py-32 border-t border-white/10 text-center">
          <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
            <h2 className="text-4xl sm:text-5xl md:text-8xl font-serif">Join the Build</h2>
            <p className="text-xl sm:text-2xl md:text-3xl opacity-70 font-light leading-relaxed px-4">
              Anyone can contribute, build, and shape <span className="font-serif">mstm.dev</span>.
            </p>
            <Link href="/contribute">
              <button className="group inline-flex items-center gap-3 text-base sm:text-lg uppercase tracking-widest hover:gap-6 transition-all duration-300 mt-8 text-mstm">
                <span>Start Contributing</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </section>

        {/* Minimal Footer */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 lg:px-24">
          <Footer />
        </div>
      </div>
    </main>
  )
}
