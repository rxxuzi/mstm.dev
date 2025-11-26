import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Docs - mstm",
  description: "Documentation for mstm.dev - Learn how to use and contribute to the platform.",
}

export default function DocsPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-5xl font-serif mb-6">Documentation</h1>

      <p className="text-xl opacity-80 leading-relaxed mb-12">
        Welcome to <span className="font-serif">mstm.dev</span> documentation. Learn how to use, contribute to, and
        build with the platform.
      </p>

      <section className="space-y-6 mb-16">
        <h2 className="text-3xl font-serif border-b border-white/10 pb-3">What is mstm.dev?</h2>
        <p className="opacity-80 leading-relaxed">
          <span className="font-serif">mstm.dev</span> is a community-driven platform for developer tools, experiments,
          and creative projects. Everything runs in the browser, is open source, and is built by developers like you.
        </p>
        <p className="opacity-80 leading-relaxed">
          Unlike fragmented tool websites, <span className="font-serif">mstm.dev</span> provides a unified platform
          where you can discover utilities, contribute your own, and help improve existing ones—all in one place.
        </p>
      </section>

      <section className="space-y-6 mb-16">
        <h2 className="text-3xl font-serif border-b border-white/10 pb-3">Quick Links</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/docs/quick-start"
            className="border border-white/10 p-6 hover:border-mstm/50 transition-colors group rounded"
          >
            <h3 className="text-xl mb-2 font-semibold group-hover:text-mstm transition-colors">Quick Start →</h3>
            <p className="text-sm opacity-70">Set up your development environment and start contributing.</p>
          </Link>
          <Link
            href="/docs/contributing"
            className="border border-white/10 p-6 hover:border-mstm/50 transition-colors group rounded"
          >
            <h3 className="text-xl mb-2 font-semibold group-hover:text-mstm transition-colors">Contributing Guide →</h3>
            <p className="text-sm opacity-70">Learn how to add your own projects and improve the platform.</p>
          </Link>
          <Link
            href="/docs/metadata"
            className="border border-white/10 p-6 hover:border-mstm/50 transition-colors group rounded"
          >
            <h3 className="text-xl mb-2 font-semibold group-hover:text-mstm transition-colors">Metadata Guide →</h3>
            <p className="text-sm opacity-70">Complete meta.json specification and validation rules.</p>
          </Link>
          <Link
            href="/docs/styling"
            className="border border-white/10 p-6 hover:border-mstm/50 transition-colors group rounded"
          >
            <h3 className="text-xl mb-2 font-semibold group-hover:text-mstm transition-colors">Styling Guide →</h3>
            <p className="text-sm opacity-70">Learn how to style your projects with Tailwind CSS.</p>
          </Link>
        </div>
      </section>

      <section className="space-y-6 mb-16">
        <h2 className="text-3xl font-serif border-b border-white/10 pb-3">Getting Started</h2>
        <ol className="space-y-4 list-decimal list-inside opacity-80">
          <li className="leading-relaxed">
            <strong>Browse existing projects</strong> on the{" "}
            <Link href="/browse" className="text-mstm hover:underline">
              Browse page
            </Link>{" "}
            to see what&apos;s already built.
          </li>
          <li className="leading-relaxed">
            <strong>Fork the repository</strong> on{" "}
            <a
              href="https://github.com/rxxuzi/mstm.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mstm hover:underline"
            >
              GitHub
            </a>{" "}
            and clone it locally.
          </li>
          <li className="leading-relaxed">
            <strong>Create your project</strong> in the{" "}
            <code className="bg-white/10 px-2 py-0.5 rounded text-sm">src/app/content/</code> directory following the{" "}
            <Link href="/docs/contributing" className="text-mstm hover:underline">
              contributing guide
            </Link>
            .
          </li>
          <li className="leading-relaxed">
            <strong>Submit a pull request</strong> and the community will review your contribution.
          </li>
        </ol>
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl font-serif border-b border-white/10 pb-3">Need Help?</h2>
        <p className="opacity-80 leading-relaxed">If you have questions or need assistance:</p>
        <ul className="space-y-2 list-disc list-inside opacity-80">
          <li>
            Read the{" "}
            <Link href="/docs/quick-start" className="text-mstm hover:underline">
              quick start guide
            </Link>{" "}
            to set up your environment
          </li>
          <li>
            Check the{" "}
            <Link href="/docs/contributing" className="text-mstm hover:underline">
              contributing guide
            </Link>{" "}
            for detailed instructions
          </li>
          <li>
            Browse existing projects on{" "}
            <Link href="/browse" className="text-mstm hover:underline">
              the browse page
            </Link>{" "}
            for examples
          </li>
          <li>
            Open an issue on{" "}
            <a
              href="https://github.com/rxxuzi/mstm.dev/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-mstm hover:underline"
            >
              GitHub
            </a>
          </li>
        </ul>
      </section>
    </article>
  )
}
