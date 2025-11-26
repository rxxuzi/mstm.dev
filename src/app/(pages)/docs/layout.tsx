import type React from "react"
import Header from "@components/Header"
import DocsSidebar from "@components/DocsSidebar"
import "./docs.css"

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen w-full bg-black text-white selection:bg-white selection:text-black font-sans">
      <Header />

      <div className="flex pt-[73px]">
        <DocsSidebar />

        <div className="flex-1 flex flex-col">
          <div className="flex-1 max-w-4xl mx-auto px-8 md:px-16 py-12 w-full">{children}</div>
        </div>
      </div>
    </main>
  )
}
