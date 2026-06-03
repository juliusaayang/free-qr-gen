import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/types/global";
import MainLayout from "@/layouts/MainLayout";
import QRGenerator from "@/components/home/QRGenerator";
import Features from "@/components/home/Features";

const Home: NextPageWithLayout = () => {
  return (
    <>
      {/* Hero */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              100% Free · No Signup Required
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-tc-main leading-tight">
              Free QR Code{" "}
              <span className="text-primary">Generator</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-tc-muted max-w-2xl mx-auto leading-relaxed">
              Create QR codes instantly for links, WiFi, contacts, and more.
              No account needed — just generate and download.
            </p>
          </div>

          <QRGenerator />
        </div>
      </section>

      {/* Features */}
      <Features />

      {/* QR Types section */}
      <section id="types" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-tc-main">8 QR Code Types</h2>
            <p className="mt-4 text-lg text-tc-muted">
              Whatever you need to share, we have a QR type for it.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Link / URL", desc: "Any website or deep link" },
              { label: "Plain Text", desc: "Notes, codes, messages" },
              { label: "Email", desc: "Pre-filled compose window" },
              { label: "Phone Call", desc: "Dial a number instantly" },
              { label: "SMS", desc: "Pre-filled text message" },
              { label: "WiFi", desc: "Instant network join" },
              { label: "vCard", desc: "Share contact details" },
              { label: "WhatsApp", desc: "Open a chat directly" },
            ].map((type) => (
              <div
                key={type.label}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-primary-medium hover:bg-primary-light transition-all duration-200"
              >
                <p className="font-semibold text-sm text-tc-main">{type.label}</p>
                <p className="text-xs text-tc-muted mt-1">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-tc-main">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {[
              {
                q: "Is QRGen really free?",
                a: "Yes, completely free. No account, no subscription, no watermarks on your QR codes.",
              },
              {
                q: "What is the difference between PNG and SVG?",
                a: "PNG is a raster image — great for web and print at fixed sizes. SVG is a vector format that scales to any size without quality loss, ideal for large prints or logos.",
              },
              {
                q: "Can I use my QR codes commercially?",
                a: "Yes. QR codes generated here are yours to use however you like, including for commercial purposes.",
              },
              {
                q: "Are the QR codes static or dynamic?",
                a: "They are static — the data is encoded directly into the QR image. Changing the destination requires generating a new code.",
              },
              {
                q: "Do you store my data?",
                a: "No. All QR generation happens in your browser. We never see or store the data you enter.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group bg-white rounded-xl border border-gray-100 p-5 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-tc-main list-none">
                  {item.q}
                  <svg
                    className="ml-4 shrink-0 transition-transform group-open:rotate-180"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-tc-muted leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to create your QR code?
          </h2>
          <p className="mt-4 text-blue-200 text-lg">
            No account needed. Start for free in seconds.
          </p>
          <a
            href="#generator"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-white text-primary font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm"
          >
            Create QR Code — It&apos;s Free
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout title="QRGen — Free QR Code Generator">{page}</MainLayout>;
};

export default Home;
