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

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-tc-faint">
          © {year} QRGen. Free to use, forever.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
