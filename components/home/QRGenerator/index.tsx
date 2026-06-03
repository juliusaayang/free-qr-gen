import { useState, useEffect, useCallback, useRef } from "react";
import type { ReactElement } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "framer-motion";
import { qrTypes } from "@/data/qrTypes";
import type { QRType, QRTypeConfig } from "@/data/qrTypes";

type DotShape = "square" | "rounded" | "dots";
type FrameType = "none" | "simple" | "rounded" | "scan-me";

const typeIcons: Record<QRType, ReactElement> = {
  url: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  text: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  call: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92v2z" transform="translate(1 1)" />
    </svg>
  ),
  sms: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  ),
  wifi: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0114.08 0" />
      <path d="M1.42 9a16 16 0 0121.16 0" />
      <path d="M8.53 16.11a6 6 0 016.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
  vcard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  whatsapp: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
};

function rrPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const cr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + cr, y);
  ctx.lineTo(x + w - cr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + cr);
  ctx.lineTo(x + w, y + h - cr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - cr, y + h);
  ctx.lineTo(x + cr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - cr);
  ctx.lineTo(x, y + cr);
  ctx.quadraticCurveTo(x, y, x + cr, y);
  ctx.closePath();
}

async function buildCanvas(
  data: string,
  fg: string,
  bg: string,
  bgTransparent: boolean,
  dotShape: DotShape,
  frameType: FrameType,
  logoDataUrl: string
): Promise<HTMLCanvasElement> {
  const qrObj = QRCode.create(data, {
    errorCorrectionLevel: logoDataUrl ? "H" : "M",
  });
  const { size, data: bits } = qrObj.modules;

  const CELL = 8;
  const MAR = 2;
  const qrPx = CELL * (size + MAR * 2);
  const FP = frameType !== "none" ? 16 : 0;
  const TH = frameType === "scan-me" ? 44 : 0;
  const W = qrPx + FP * 2;
  const H = qrPx + FP * 2 + TH;

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  if (!bgTransparent) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
  }

  if (frameType === "simple") {
    ctx.strokeStyle = fg;
    ctx.lineWidth = 3;
    ctx.strokeRect(5, 5, W - 10, H - 10);
  } else if (frameType === "rounded" || frameType === "scan-me") {
    ctx.strokeStyle = fg;
    ctx.lineWidth = 3;
    rrPath(ctx, 5, 5, W - 10, H - 10, 20);
    ctx.stroke();
  }

  const OX = FP;
  const OY = FP;

  ctx.fillStyle = fg;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!bits[r * size + c]) continue;
      const x = OX + (c + MAR) * CELL;
      const y = OY + (r + MAR) * CELL;

      if (dotShape === "rounded") {
        rrPath(ctx, x, y, CELL - 1, CELL - 1, CELL * 0.3);
        ctx.fill();
      } else if (dotShape === "dots") {
        ctx.beginPath();
        ctx.arc(x + CELL / 2, y + CELL / 2, CELL * 0.42, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, CELL, CELL);
      }
    }
  }

  if (logoDataUrl) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const LS = Math.round(qrPx * 0.22);
        const lx = OX + (qrPx - LS) / 2;
        const ly = OY + (qrPx - LS) / 2;
        const pad = 5;
        ctx.fillStyle = bgTransparent ? "#ffffff" : bg;
        rrPath(ctx, lx - pad, ly - pad, LS + pad * 2, LS + pad * 2, 6);
        ctx.fill();
        ctx.drawImage(img, lx, ly, LS, LS);
        resolve();
      };
      img.onerror = () => resolve();
      img.src = logoDataUrl;
    });
  }

  if (frameType === "scan-me") {
    ctx.fillStyle = fg;
    ctx.font = `bold ${Math.round(TH * 0.42)}px -apple-system, BlinkMacSystemFont, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCAN ME", W / 2, qrPx + FP * 2 + TH / 2);
  }

  return canvas;
}

function buildSvg(
  data: string,
  fg: string,
  bg: string,
  bgTransparent: boolean,
  dotShape: DotShape,
  frameType: FrameType,
  logoDataUrl: string
): string {
  const qrObj = QRCode.create(data, {
    errorCorrectionLevel: logoDataUrl ? "H" : "M",
  });
  const { size, data: bits } = qrObj.modules;

  const CELL = 8;
  const MAR = 2;
  const qrPx = CELL * (size + MAR * 2);
  const FP = frameType !== "none" ? 16 : 0;
  const TH = frameType === "scan-me" ? 44 : 0;
  const W = qrPx + FP * 2;
  const H = qrPx + FP * 2 + TH;

  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">`);
  if (!bgTransparent) {
    parts.push(`<rect width="${W}" height="${H}" fill="${bg}"/>`);
  }

  if (frameType === "simple") {
    parts.push(`<rect x="5" y="5" width="${W - 10}" height="${H - 10}" fill="none" stroke="${fg}" stroke-width="3"/>`);
  } else if (frameType === "rounded" || frameType === "scan-me") {
    parts.push(`<rect x="5" y="5" width="${W - 10}" height="${H - 10}" rx="20" fill="none" stroke="${fg}" stroke-width="3"/>`);
  }

  const OX = FP;
  const OY = FP;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!bits[r * size + c]) continue;
      const x = OX + (c + MAR) * CELL;
      const y = OY + (r + MAR) * CELL;

      if (dotShape === "dots") {
        parts.push(`<circle cx="${x + CELL / 2}" cy="${y + CELL / 2}" r="${CELL * 0.42}" fill="${fg}"/>`);
      } else if (dotShape === "rounded") {
        parts.push(`<rect x="${x}" y="${y}" width="${CELL - 1}" height="${CELL - 1}" rx="${CELL * 0.3}" fill="${fg}"/>`);
      } else {
        parts.push(`<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" fill="${fg}"/>`);
      }
    }
  }

  if (logoDataUrl) {
    const LS = Math.round(qrPx * 0.22);
    const lx = OX + (qrPx - LS) / 2;
    const ly = OY + (qrPx - LS) / 2;
    const pad = 5;
    parts.push(`<rect x="${lx - pad}" y="${ly - pad}" width="${LS + pad * 2}" height="${LS + pad * 2}" rx="6" fill="${bgTransparent ? "#ffffff" : bg}"/>`);
    parts.push(`<image href="${logoDataUrl}" x="${lx}" y="${ly}" width="${LS}" height="${LS}"/>`);
  }

  if (frameType === "scan-me") {
    const ty = qrPx + FP * 2 + TH / 2;
    parts.push(`<text x="${W / 2}" y="${ty}" text-anchor="middle" dominant-baseline="middle" font-weight="bold" font-size="${Math.round(TH * 0.42)}" font-family="-apple-system, sans-serif" fill="${fg}">SCAN ME</text>`);
  }

  parts.push(`</svg>`);
  return parts.join("\n");
}

const formatQRData = (config: QRTypeConfig, fields: Record<string, string>): string =>
  config.format(fields);

const QRGenerator = () => {
  const [activeTypeId, setActiveTypeId] = useState<QRType>("url");
  const [fields, setFields] = useState<Record<string, string>>({ url: "" });
  const [qrDataURL, setQrDataURL] = useState<string>("");
  const [svgString, setSvgString] = useState<string>("");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgTransparent, setBgTransparent] = useState(true);
  const [dotShape, setDotShape] = useState<DotShape>("square");
  const [frameType, setFrameType] = useState<FrameType>("none");
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const activeType = qrTypes.find((t) => t.id === activeTypeId)!;

  const generateQR = useCallback(async () => {
    const data = formatQRData(activeType, fields);
    if (!data.trim()) {
      setQrDataURL("");
      setSvgString("");
      return;
    }
    setIsGenerating(true);
    try {
      const canvas = await buildCanvas(data, fgColor, bgColor, bgTransparent, dotShape, frameType, logoDataUrl);
      setQrDataURL(canvas.toDataURL("image/png"));
      setSvgString(buildSvg(data, fgColor, bgColor, bgTransparent, dotShape, frameType, logoDataUrl));
    } catch {
      setQrDataURL("");
      setSvgString("");
    } finally {
      setIsGenerating(false);
    }
  }, [activeType, fields, fgColor, bgColor, bgTransparent, dotShape, frameType, logoDataUrl]);

  useEffect(() => {
    const t = setTimeout(generateQR, 300);
    return () => clearTimeout(t);
  }, [generateQR]);

  const switchType = (typeId: QRType) => {
    const config = qrTypes.find((t) => t.id === typeId)!;
    setActiveTypeId(typeId);
    setFields({ ...config.defaultFields });
  };

  const setField = (name: string, value: string) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const downloadPNG = () => {
    if (!qrDataURL) return;
    const a = document.createElement("a");
    a.href = qrDataURL;
    a.download = `qrcode-${activeTypeId}.png`;
    a.click();
  };

  const downloadSVG = () => {
    if (!svgString) return;
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qrcode-${activeTypeId}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoDataUrl(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const hasData = !!qrDataURL;

  return (
    <div id="generator" className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Type tabs */}
      <div className="border-b border-gray-100 overflow-x-auto">
        <div className="flex min-w-max">
          {qrTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => switchType(type.id)}
              className={`flex flex-col items-center gap-1 px-4 py-3 text-xs font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTypeId === type.id
                  ? "border-primary text-primary bg-primary-light"
                  : "border-transparent text-tc-muted hover:text-tc-secondary hover:bg-gray-50"
              }`}
            >
              <span className={activeTypeId === type.id ? "text-primary" : "text-tc-muted"}>
                {typeIcons[type.id]}
              </span>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left: form + design */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100 flex flex-col gap-5 overflow-y-auto max-h-[680px]">
          {/* Type-specific fields */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTypeId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-4"
            >
              <div>
                <h3 className="font-semibold text-tc-main">{activeType.label} QR Code</h3>
                <p className="text-sm text-tc-muted mt-0.5">{activeType.description}</p>
              </div>

              {activeType.fields.map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-tc-secondary">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>

                  {field.type === "textarea" ? (
                    <textarea
                      value={fields[field.name] ?? ""}
                      onChange={(e) => setField(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none transition"
                    />
                  ) : field.type === "select" ? (
                    <select
                      value={fields[field.name] ?? field.options?.[0]?.value ?? ""}
                      onChange={(e) => setField(field.name, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition bg-white"
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type === "password" ? "password" : field.type}
                      value={fields[field.name] ?? ""}
                      onChange={(e) => setField(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                    />
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Colors */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-tc-muted uppercase tracking-wide mb-3">Colors</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <div
                  className="w-8 h-8 rounded-lg border-2 border-gray-200 overflow-hidden relative"
                  style={{ backgroundColor: fgColor }}
                >
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                </div>
                <span className="text-xs text-tc-secondary">Foreground</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBgTransparent((v) => !v)}
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${
                    bgTransparent
                      ? "border-primary bg-primary-light text-primary"
                      : "border-gray-200 text-tc-muted hover:border-gray-300"
                  }`}
                  title="Transparent background"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="1" y="1" width="5" height="5" fill="currentColor" opacity="0.3" />
                    <rect x="8" y="1" width="5" height="5" fill="currentColor" />
                    <rect x="1" y="8" width="5" height="5" fill="currentColor" />
                    <rect x="8" y="8" width="5" height="5" fill="currentColor" opacity="0.3" />
                  </svg>
                </button>
                {!bgTransparent && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-gray-200 overflow-hidden relative"
                      style={{ backgroundColor: bgColor }}
                    >
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  </label>
                )}
                <span className="text-xs text-tc-secondary">
                  {bgTransparent ? "Transparent" : "Background"}
                </span>
              </div>
            </div>
          </div>

          {/* Frame */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-tc-muted uppercase tracking-wide mb-3">Frame</p>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  {
                    id: "none" as FrameType,
                    label: "None",
                    preview: (
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <rect x="4" y="4" width="10" height="10" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="22" y="4" width="10" height="10" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="4" y="22" width="10" height="10" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
                        <rect x="6" y="6" width="6" height="6" fill="currentColor" />
                        <rect x="24" y="6" width="6" height="6" fill="currentColor" />
                        <rect x="6" y="24" width="6" height="6" fill="currentColor" />
                        <rect x="22" y="22" width="4" height="4" fill="currentColor" />
                        <rect x="28" y="22" width="4" height="4" fill="currentColor" />
                        <rect x="22" y="28" width="4" height="4" fill="currentColor" />
                        <rect x="28" y="28" width="4" height="4" fill="currentColor" />
                      </svg>
                    ),
                  },
                  {
                    id: "simple" as FrameType,
                    label: "Border",
                    preview: (
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <rect x="1" y="1" width="34" height="34" stroke="currentColor" strokeWidth="2" />
                        <rect x="6" y="6" width="8" height="8" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                        <rect x="22" y="6" width="8" height="8" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                        <rect x="6" y="22" width="8" height="8" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                        <rect x="7.5" y="7.5" width="5" height="5" fill="currentColor" />
                        <rect x="23.5" y="7.5" width="5" height="5" fill="currentColor" />
                        <rect x="7.5" y="23.5" width="5" height="5" fill="currentColor" />
                        <rect x="22" y="22" width="3" height="3" fill="currentColor" />
                        <rect x="27" y="22" width="3" height="3" fill="currentColor" />
                        <rect x="22" y="27" width="3" height="3" fill="currentColor" />
                        <rect x="27" y="27" width="3" height="3" fill="currentColor" />
                      </svg>
                    ),
                  },
                  {
                    id: "rounded" as FrameType,
                    label: "Rounded",
                    preview: (
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <rect x="1" y="1" width="34" height="34" rx="8" stroke="currentColor" strokeWidth="2" />
                        <rect x="6" y="6" width="8" height="8" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                        <rect x="22" y="6" width="8" height="8" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                        <rect x="6" y="22" width="8" height="8" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                        <rect x="7.5" y="7.5" width="5" height="5" fill="currentColor" />
                        <rect x="23.5" y="7.5" width="5" height="5" fill="currentColor" />
                        <rect x="7.5" y="23.5" width="5" height="5" fill="currentColor" />
                        <rect x="22" y="22" width="3" height="3" fill="currentColor" />
                        <rect x="27" y="22" width="3" height="3" fill="currentColor" />
                        <rect x="22" y="27" width="3" height="3" fill="currentColor" />
                        <rect x="27" y="27" width="3" height="3" fill="currentColor" />
                      </svg>
                    ),
                  },
                  {
                    id: "scan-me" as FrameType,
                    label: "Scan Me",
                    preview: (
                      <svg width="36" height="44" viewBox="0 0 36 44" fill="none">
                        <rect x="1" y="1" width="34" height="34" rx="6" stroke="currentColor" strokeWidth="2" />
                        <rect x="6" y="5" width="7" height="7" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                        <rect x="23" y="5" width="7" height="7" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                        <rect x="6" y="22" width="7" height="7" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1" />
                        <rect x="7.5" y="6.5" width="4" height="4" fill="currentColor" />
                        <rect x="24.5" y="6.5" width="4" height="4" fill="currentColor" />
                        <rect x="7.5" y="23.5" width="4" height="4" fill="currentColor" />
                        <rect x="22" y="22" width="3" height="3" fill="currentColor" />
                        <rect x="27" y="22" width="3" height="3" fill="currentColor" />
                        <rect x="22" y="27" width="3" height="3" fill="currentColor" />
                        <rect x="27" y="27" width="3" height="3" fill="currentColor" />
                        <text x="18" y="41" textAnchor="middle" fontSize="6" fontWeight="bold" fill="currentColor" fontFamily="sans-serif">SCAN ME</text>
                      </svg>
                    ),
                  },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFrameType(f.id)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${
                    frameType === f.id
                      ? "border-primary bg-primary-light text-primary"
                      : "border-gray-100 text-tc-muted hover:border-gray-300"
                  }`}
                >
                  {f.preview}
                  <span className="text-xs font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Dot shape */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-tc-muted uppercase tracking-wide mb-3">Dot Shape</p>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    id: "square" as DotShape,
                    label: "Square",
                    preview: (
                      <svg width="36" height="24" viewBox="0 0 36 24" fill="currentColor">
                        {[0, 1, 2, 3].map((i) => (
                          <rect key={i} x={i * 9} y="4" width="7" height="7" />
                        ))}
                        {[0, 1, 2, 3].map((i) => (
                          <rect key={i} x={i * 9} y="13" width="7" height="7" />
                        ))}
                      </svg>
                    ),
                  },
                  {
                    id: "rounded" as DotShape,
                    label: "Rounded",
                    preview: (
                      <svg width="36" height="24" viewBox="0 0 36 24" fill="currentColor">
                        {[0, 1, 2, 3].map((i) => (
                          <rect key={i} x={i * 9} y="4" width="7" height="7" rx="2" />
                        ))}
                        {[0, 1, 2, 3].map((i) => (
                          <rect key={i} x={i * 9} y="13" width="7" height="7" rx="2" />
                        ))}
                      </svg>
                    ),
                  },
                  {
                    id: "dots" as DotShape,
                    label: "Dots",
                    preview: (
                      <svg width="36" height="24" viewBox="0 0 36 24" fill="currentColor">
                        {[0, 1, 2, 3].map((i) => (
                          <circle key={i} cx={i * 9 + 3.5} cy="7.5" r="3.5" />
                        ))}
                        {[0, 1, 2, 3].map((i) => (
                          <circle key={i} cx={i * 9 + 3.5} cy="16.5" r="3.5" />
                        ))}
                      </svg>
                    ),
                  },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  onClick={() => setDotShape(s.id)}
                  className={`flex flex-col items-center gap-1.5 py-2 px-1 rounded-xl border-2 transition-all ${
                    dotShape === s.id
                      ? "border-primary bg-primary-light text-primary"
                      : "border-gray-100 text-tc-muted hover:border-gray-300"
                  }`}
                >
                  {s.preview}
                  <span className="text-xs font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-tc-muted uppercase tracking-wide mb-3">Logo</p>
            {logoDataUrl ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden shrink-0">
                  <img src={logoDataUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-tc-secondary font-medium">Logo added</p>
                  <p className="text-xs text-tc-muted mt-0.5">Uses high error correction</p>
                </div>
                <button
                  onClick={() => setLogoDataUrl("")}
                  className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-tc-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoInputRef.current?.click()}
                className="w-full flex flex-col items-center gap-2 py-5 border-2 border-dashed border-gray-200 rounded-xl text-tc-muted hover:border-primary hover:text-primary hover:bg-primary-light transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
                <span className="text-xs font-medium">Upload logo image</span>
                <span className="text-xs opacity-70">PNG, JPG, SVG</span>
              </button>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Right: preview */}
        <div className="p-6 flex flex-col items-center gap-5 bg-gray-50/50">
          <div className="flex items-center justify-center w-full aspect-square max-w-[280px] bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 text-tc-muted">
                <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity="0.3" />
                  <path d="M21 12a9 9 0 00-9-9" strokeLinecap="round" />
                </svg>
                <span className="text-sm">Generating...</span>
              </div>
            ) : hasData ? (
              <img src={qrDataURL} alt="Generated QR code" className="w-full h-full object-contain p-5" />
            ) : (
              <div className="flex flex-col items-center gap-3 text-tc-faint">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" opacity="0.3">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="8" y="8" width="8" height="8" fill="currentColor" />
                  <rect x="28" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="32" y="8" width="8" height="8" fill="currentColor" />
                  <rect x="4" y="28" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                  <rect x="8" y="32" width="8" height="8" fill="currentColor" />
                  <rect x="28" y="28" width="7" height="7" fill="currentColor" />
                  <rect x="37" y="28" width="7" height="7" fill="currentColor" />
                  <rect x="28" y="37" width="7" height="7" fill="currentColor" />
                  <rect x="37" y="37" width="7" height="7" fill="currentColor" />
                </svg>
                <p className="text-sm text-center">Your QR code will appear here</p>
              </div>
            )}
          </div>

          <div className="flex gap-3 w-full max-w-[280px]">
            <button
              onClick={downloadPNG}
              disabled={!hasData}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              PNG
            </button>
            <button
              onClick={downloadSVG}
              disabled={!hasData}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-primary bg-primary-medium hover:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              SVG
            </button>
          </div>

          <p className="text-xs text-tc-faint text-center">
            Free forever · No watermarks · No signup
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
