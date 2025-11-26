import type { Metadata } from "next"
import Header from "@components/Header"
import Footer from "@components/Footer"

export const metadata: Metadata = {
  title: "About - mstm",
  description: "A community-driven platform where developers build, share, and discover tools together.",
}

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white selection:bg-white selection:text-black font-sans">
      <div className="relative z-10 flex flex-col min-h-screen max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <Header />

        {/* Hero */}
        <section className="flex flex-col justify-center min-h-screen max-w-4xl gap-10 pt-20">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tighter">About mstm.dev</h1>
            <p className="text-2xl md:text-3xl font-light leading-relaxed opacity-80 max-w-2xl">
              A community-driven platform where developers build, share, and discover tools together.
            </p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="flex flex-col justify-center min-h-screen py-24 border-t border-white/10">
          <div className="max-w-4xl space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif">Our Vision</h2>
            <div className="space-y-8 text-xl md:text-2xl font-light leading-relaxed opacity-80">
              <p>
                Developer tools are scattered across the web today. Every project reinvents the same utilities. Every
                developer bookmarks dozens of single-purpose sites.
              </p>
              <p>It doesn&apos;t have to be this way.</p>
              <p>
                <span className="font-serif">mstm.dev</span> is a unified platform where the community builds tools
                together. One place to find, use, and contribute utilities that actually work.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="flex flex-col justify-center min-h-screen py-24 border-t border-white/10">
          <div className="space-y-16">
            <h2 className="text-4xl md:text-6xl font-serif">How It Works</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="text-6xl font-serif text-mstm opacity-50">01</div>
                <h3 className="text-2xl font-serif">Browse</h3>
                <p className="text-lg opacity-70 leading-relaxed">
                  Explore tools, art, and games built by the community. Everything is free, open source, and runs in
                  your browser.
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-6xl font-serif text-mstm opacity-50">02</div>
                <h3 className="text-2xl font-serif">Contribute</h3>
                <p className="text-lg opacity-70 leading-relaxed">
                  Submit your own projects via pull request. Create a folder with meta.json and page.tsx—that&apos;s it.
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-6xl font-serif text-mstm opacity-50">03</div>
                <h3 className="text-2xl font-serif">Build Together</h3>
                <p className="text-lg opacity-70 leading-relaxed">
                  Improve existing tools, suggest features, and help shape the platform. No gatekeepers, just code.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="flex flex-col justify-center min-h-screen py-24 border-t border-white/10">
          <div className="space-y-16">
            <h2 className="text-4xl md:text-6xl font-serif">Community First</h2>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-4 border-l-2 border-mstm pl-6">
                  <h3 className="text-2xl font-serif">No Corporate Interests</h3>
                  <p className="text-lg opacity-70 leading-relaxed">
                    Built by developers, for developers. No investors, no profit motives, no hidden agendas.
                  </p>
                </div>

                <div className="space-y-4 border-l-2 border-white/30 pl-6">
                  <h3 className="text-2xl font-serif">No Paywalls</h3>
                  <p className="text-lg opacity-70 leading-relaxed">
                    Every tool is free to use. No premium tiers, no feature gates, no subscription models.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4 border-l-2 border-white/30 pl-6">
                  <h3 className="text-2xl font-serif">Open Source</h3>
                  <p className="text-lg opacity-70 leading-relaxed">
                    All code is public. Fork it, learn from it, improve it. Transparency is not optional.
                  </p>
                </div>

                <div className="space-y-4 border-l-2 border-white/30 pl-6">
                  <h3 className="text-2xl font-serif">Community Governed</h3>
                  <p className="text-lg opacity-70 leading-relaxed">
                    Direction is set by contributors. Features are driven by pull requests, not roadmaps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="flex flex-col justify-center min-h-screen py-24 border-t border-white/10">
          <div className="space-y-16">
            <h2 className="text-4xl md:text-6xl font-serif">Built With</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: "Next.js", desc: "React framework" },
                { name: "TypeScript", desc: "Type safety" },
                { name: "Tailwind", desc: "Styling" },
                { name: "Vercel", desc: "Hosting" },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className="space-y-2 p-6 border border-white/10 hover:border-mstm/50 transition-colors"
                >
                  <h3 className="text-xl font-mono">{tech.name}</h3>
                  <p className="text-sm opacity-60">{tech.desc}</p>
                </div>
              ))}
            </div>

            <p className="text-lg opacity-70 leading-relaxed max-w-2xl">
              Modern, performant, and free to host. The entire platform runs on Vercel&apos;s free tier, keeping costs at
              zero and accessibility at 100%.
            </p>
          </div>
        </section>

        {/* Get Involved */}
        <section className="flex flex-col justify-center min-h-screen py-32 border-t border-white/10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-8xl font-serif">Get Involved</h2>
            <p className="text-2xl md:text-3xl opacity-70 font-light leading-relaxed">
              The platform is only as good as its community. <br />
              Join us in building something useful.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <a
                href="/contribute"
                className="px-8 py-3 bg-mstm text-black font-medium hover:bg-mstm/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(84,225,232,0.5)]"
              >
                Start Contributing
              </a>
              <a
                href="https://github.com/rxxuzi/mstm.dev"
                className="px-8 py-3 border border-white/20 hover:bg-white/10 hover:border-mstm/50 transition-all duration-300 backdrop-blur-sm"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  )
}
