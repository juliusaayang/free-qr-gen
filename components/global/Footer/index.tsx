import Link from "next/link";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-tc-main">
              QR<span className="text-primary">Gen</span>
            </span>
            <span className="text-tc-muted text-sm">— Free QR Code Generator</span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-tc-secondary">
            <Link href="#features" className="hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#types" className="hover:text-primary transition-colors">
              QR Types
            </Link>
            <Link href="#faq" className="hover:text-primary transition-colors">
              FAQ
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-tc-faint">
          <span>© {year} QRGen. Free to use, forever.</span>
          <a
            href="https://linktr.ee/juliusayang"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-tc-secondary hover:text-primary transition-colors duration-200"
          >
            <span className="text-tc-faint group-hover:text-primary transition-colors">Built by</span>
            <span className="font-semibold text-tc-main group-hover:text-primary transition-colors">juliusayang</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
              aria-hidden="true"
            >
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
