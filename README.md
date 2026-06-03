# QRGen — Free QR Code Generator

A fast, free, browser-based QR code generator. No account, no watermarks, no server-side processing — everything runs in your browser.

**Live:** https://free-qr-gen.vercel.app

## Features

- **8 QR types** — URL, Plain Text, Email, Phone Call, SMS, WiFi, vCard, WhatsApp
- **Custom dot shapes** — Square, Rounded, Dots
- **Frames** — None, Border, Rounded, Scan Me
- **Logo overlay** — Upload your own image (PNG, JPG, SVG up to 2 MB)
- **Transparent background** — Default is transparent; toggle to solid color
- **Custom colors** — Foreground and background color pickers
- **Download as PNG or SVG** — High-resolution, no watermarks

## Tech Stack

- [Next.js 15](https://nextjs.org) (Pages Router)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [qrcode](https://www.npmjs.com/package/qrcode) — raw QR module data for custom canvas rendering

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for SEO meta tags | `https://free-qr-gen.vercel.app` |

## Deploy

Import the GitHub repo at [vercel.com/new](https://vercel.com/new). Vercel auto-detects Next.js — no configuration needed.
