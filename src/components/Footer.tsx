export default function Footer() {
  return (
    <footer className="py-8 sm:py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 text-xs sm:text-sm opacity-60 font-mono">
          <div className="text-center md:text-left">
            © 2025 <span className="font-serif lowercase">mstm.dev</span>
          </div>
          <a
            href="https://github.com/rxxuzi/mstm.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-100 transition-opacity hover:text-mstm"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
