import Head from "next/head";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import Navigation from "@/components/global/Navigation";
import Footer from "@/components/global/Footer";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://free-qr-gen.vercel.app";
const OG_IMAGE = `${SITE_URL}/og-image.png`;

type Props = {
  children: ReactNode;
  title?: string;
  description?: string;
};

const MainLayout = ({
  children,
  title = "QRGen — Free QR Code Generator",
  description = "Create free QR codes instantly. No signup required. Supports URLs, text, email, WiFi, vCard, WhatsApp and more. Download as PNG or SVG.",
}: Props) => {
  const router = useRouter();
  const canonical = `${SITE_URL}${router.asPath.split("?")[0]}`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="QR code generator, free QR code, QR code maker, QR code creator, WiFi QR code, vCard QR code, URL QR code" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonical} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="QRGen" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
