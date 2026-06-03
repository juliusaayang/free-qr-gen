import Head from "next/head";
import type { ReactNode } from "react";
import Navigation from "@/components/global/Navigation";
import Footer from "@/components/global/Footer";

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
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default MainLayout;
