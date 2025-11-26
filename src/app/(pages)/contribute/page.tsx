import type { Metadata } from "next"
import Header from "@components/Header"
import Footer from "@components/Footer"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contribute - mstm",
  description: "Learn how to contribute your projects to mstm.dev. Anyone can contribute!",
}

export default function ContributePage() {
  return (
    <main className="relative min-h-screen w-full bg-black text-white selection:bg-white selection:text-black font-sans">
      <div className="relative z-10 flex flex-col min-h-screen max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        <Header />

        {/* Hero */}
        <section className="flex flex-col justify-center min-h-screen max-w-4xl gap-10 pt-20">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-serif leading-[0.9] tracking-tighter">Contribute</h1>
            <p className="text-2xl md:text-3xl font-light leading-relaxed opacity-80 max-w-2xl">
              Anyone can contribute. Here&apos;s how to get started.
            </p>
          </div>
        </section>

        {/* Simple Steps */}
        <section className="flex flex-col justify-center min-h-screen py-20 sm:py-24 border-t border-white/10">
          <div className="max-w-4xl space-y-16">
            <h2 className="text-4xl md:text-6xl font-serif">Fork it. Build it. Ship it.</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="text-6xl font-serif text-mstm opacity-50">01</div>
                <h3 className="text-2xl font-serif">Fork</h3>
                <p className="text-lg opacity-70 leading-relaxed">
                  Fork the repository on GitHub and clone it locally.
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-6xl font-serif text-mstm opacity-50">02</div>
                <h3 className="text-2xl font-serif">Build</h3>
                <p className="text-lg opacity-70 leading-relaxed">
                  Create your project in <code className="bg-white/10 px-2 py-0.5 rounded text-sm">content/</code> with
                  meta.json and page.tsx.
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-6xl font-serif text-mstm opacity-50">03</div>
                <h3 className="text-2xl font-serif">Ship</h3>
                <p className="text-lg opacity-70 leading-relaxed">Submit a pull request. We&apos;ll review and merge it.</p>
              </div>
            </div>
          </div>
        </section>

        {/* What You Can Contribute */}
        <section className="flex flex-col justify-center min-h-screen py-20 sm:py-24 border-t border-white/10 max-w-4xl">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif">What to Contribute</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-white/10 p-6 hover:border-mstm/50 transition-colors">
                <h3 className="text-xl font-serif mb-3">Tools</h3>
                <p className="text-sm opacity-70">
                  Developer utilities that solve real problems. Converters, formatters, generators.
                </p>
              </div>

              <div className="border border-white/10 p-6 hover:border-mstm/50 transition-colors">
                <h3 className="text-xl font-serif mb-3">Art</h3>
                <p className="text-sm opacity-70">Generative art, visualizations, creative coding experiments.</p>
              </div>

              <div className="border border-white/10 p-6 hover:border-mstm/50 transition-colors">
                <h3 className="text-xl font-serif mb-3">Games</h3>
                <p className="text-sm opacity-70">Browser games, interactive experiences, playful projects.</p>
              </div>

              <div className="border border-white/10 p-6 hover:border-mstm/50 transition-colors">
                <h3 className="text-xl font-serif mb-3">Platform</h3>
                <p className="text-sm opacity-70">
                  Improve the platform itself. Better search, new features, bug fixes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="flex flex-col justify-center min-h-screen py-20 sm:py-24 border-t border-white/10 max-w-4xl">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif">Quick Start</h2>

            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-serif">1. Fork and Clone</h3>
                <pre className="bg-white/5 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
                  <code>{`git clone https://github.com/rxxuzi/mstm.dev.git
cd mstm.dev
npm install`}</code>
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif">2. Create Your Project</h3>
                <pre className="bg-white/5 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
                  <code>{`mkdir -p src/app/content/your-project
cd src/app/content/your-project

# Create meta.json and page.tsx`}</code>
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif">3. Test Locally</h3>
                <pre className="bg-white/5 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
                  <code>{`npm run dev
# Visit http://localhost:3000/content/your-project`}</code>
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif">4. Submit PR</h3>
                <pre className="bg-white/5 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
                  <code>{`git checkout -b content/your-project
git add .
git commit -m "feat: add your project"
git push origin content/your-project`}</code>
                </pre>
              </div>
            </div>

            <p className="text-lg opacity-70">
              For detailed instructions, check the{" "}
              <Link href="/docs/contributing" className="text-mstm hover:underline">
                full contributing guide
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Guidelines */}
        <section className="flex flex-col justify-center min-h-screen py-20 sm:py-24 border-t border-white/10 max-w-4xl">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif">Guidelines</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-xl font-serif">Quality First</h3>
                <p className="opacity-70">We value polish over quantity. Take time to make it good.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-serif">Client-Side</h3>
                <p className="opacity-70">Prefer browser-based solutions. Keeps the platform fast and free.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-serif">Minimal Dependencies</h3>
                <p className="opacity-70">Use what you need, but keep it light. Less is more.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-serif">Document</h3>
                <p className="opacity-70">Add comments where helpful. Future you will thank you.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-serif">Respect Copyright</h3>
                <p className="opacity-70">Only submit code you have rights to. Credit where due.</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-serif">Be Kind</h3>
                <p className="opacity-70">
                  Follow the{" "}
                  <Link href="/docs/code-of-conduct" className="text-mstm hover:underline">
                    code of conduct
                  </Link>
                  . No jerks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="flex flex-col justify-center min-h-screen py-20 sm:py-24 border-t border-white/10 max-w-4xl">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-6xl font-serif">Resources</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Link
                href="/docs/contributing"
                className="border border-white/10 p-6 hover:border-mstm/50 transition-colors group"
              >
                <h3 className="text-xl font-serif mb-2 group-hover:text-mstm transition-colors">
                  Contributing Guide →
                </h3>
                <p className="text-sm opacity-70">Detailed instructions on how to contribute projects.</p>
              </Link>

              <Link
                href="/docs/code-of-conduct"
                className="border border-white/10 p-6 hover:border-mstm/50 transition-colors group"
              >
                <h3 className="text-xl font-serif mb-2 group-hover:text-mstm transition-colors">Code of Conduct →</h3>
                <p className="text-sm opacity-70">Community standards and expected behavior.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="flex flex-col justify-center min-h-screen py-24 sm:py-32 border-t border-white/10 text-center">
          <div className="max-w-4xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-8xl font-serif">Ready to Start?</h2>
            <p className="text-2xl md:text-3xl opacity-70 font-light leading-relaxed">
              Fork the repo and build something useful.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Link
                href="https://github.com/rxxuzi/mstm.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-mstm text-black font-medium hover:bg-mstm/80 transition-all duration-300 hover:shadow-[0_0_20px_rgba(84,225,232,0.5)]"
              >
                View on GitHub
              </Link>
              <Link
                href="/docs/contributing"
                className="px-8 py-3 border border-white/20 hover:bg-white/10 hover:border-mstm/50 transition-all duration-300 backdrop-blur-sm"
              >
                Read Full Guide
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
