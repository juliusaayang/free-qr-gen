import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks } from "@/data/navigation";
import Button from "@/components/global/Button";

const QRLogo = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="8" fill="#2563EB" />
    <rect x="6" y="6" width="8" height="8" rx="1" fill="white" />
    <rect x="7" y="7" width="6" height="6" rx="0.5" fill="#2563EB" />
    <rect x="8" y="8" width="4" height="4" fill="white" />
    <rect x="18" y="6" width="8" height="8" rx="1" fill="white" />
    <rect x="19" y="7" width="6" height="6" rx="0.5" fill="#2563EB" />
    <rect x="20" y="8" width="4" height="4" fill="white" />
    <rect x="6" y="18" width="8" height="8" rx="1" fill="white" />
    <rect x="7" y="19" width="6" height="6" rx="0.5" fill="#2563EB" />
    <rect x="8" y="20" width="4" height="4" fill="white" />
    <rect x="18" y="18" width="3" height="3" fill="white" />
    <rect x="23" y="18" width="3" height="3" fill="white" />
    <rect x="18" y="23" width="3" height="3" fill="white" />
    <rect x="23" y="23" width="3" height="3" fill="white" />
  </svg>
);

const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <QRLogo />
            <span className="font-bold text-lg text-tc-main">
              QR<span className="text-primary">Gen</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-tc-secondary hover:text-tc-main hover:bg-gray-50 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Button tag="a" href="#generator" size="sm">
              Create QR Code
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-tc-secondary hover:bg-gray-100"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {mobileOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.2 } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.15 } }}
            className="md:hidden overflow-hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-2.5 text-sm text-tc-secondary hover:text-tc-main hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-100 mt-1">
                <Button tag="a" href="#generator" size="sm" className="w-full justify-center">
                  Create QR Code
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
