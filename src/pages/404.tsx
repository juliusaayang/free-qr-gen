import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/types/global";
import MainLayout from "@/layouts/MainLayout";
import Link from "next/link";

const NotFound: NextPageWithLayout = () => {
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-light mb-8">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
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
        </div>

        <p className="text-6xl font-bold text-primary mb-4">404</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-tc-main mb-4">
          Page not found
        </h1>
        <p className="text-tc-muted text-lg mb-10">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back to generating QR codes.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to QRGen
        </Link>
      </div>
    </section>
  );
};

NotFound.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="404 — Page Not Found | QRGen">{page}</MainLayout>;
};

export default NotFound;
