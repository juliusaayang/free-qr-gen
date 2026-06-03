export type QRType =
  | "url"
  | "text"
  | "email"
  | "call"
  | "sms"
  | "wifi"
  | "vcard"
  | "whatsapp";

export type FieldType = "text" | "email" | "tel" | "url" | "textarea" | "select" | "password";

export type QRField = {
  name: string;
  label: string;
  placeholder: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  required?: boolean;
};

export type QRTypeConfig = {
  id: QRType;
  label: string;
  description: string;
  fields: QRField[];
  format: (fields: Record<string, string>) => string;
  defaultFields: Record<string, string>;
};

export const qrTypes: QRTypeConfig[] = [
  {
    id: "url",
    label: "Link",
    description: "Link to any website or URL",
    defaultFields: { url: "" },
    fields: [
      { name: "url", label: "URL", placeholder: "https://example.com", type: "url", required: true },
    ],
    format: (f) => f.url || "",
  },
  {
    id: "text",
    label: "Text",
    description: "Plain text or message",
    defaultFields: { text: "" },
    fields: [
      { name: "text", label: "Text", placeholder: "Enter your text here...", type: "textarea", required: true },
    ],
    format: (f) => f.text || "",
  },
  {
    id: "email",
    label: "Email",
    description: "Open email client with pre-filled fields",
    defaultFields: { email: "", subject: "", body: "" },
    fields: [
      { name: "email", label: "Email Address", placeholder: "you@example.com", type: "email", required: true },
      { name: "subject", label: "Subject (optional)", placeholder: "Email subject", type: "text" },
      { name: "body", label: "Message (optional)", placeholder: "Email body...", type: "textarea" },
    ],
    format: (f) => {
      const params: string[] = [];
      if (f.subject) params.push(`subject=${encodeURIComponent(f.subject)}`);
      if (f.body) params.push(`body=${encodeURIComponent(f.body)}`);
      return `mailto:${f.email || ""}${params.length ? "?" + params.join("&") : ""}`;
    },
  },
  {
    id: "call",
    label: "Call",
    description: "Dial a phone number when scanned",
    defaultFields: { phone: "" },
    fields: [
      { name: "phone", label: "Phone Number", placeholder: "+1 234 567 8900", type: "tel", required: true },
    ],
    format: (f) => `tel:${f.phone || ""}`,
  },
  {
    id: "sms",
    label: "SMS",
    description: "Send a pre-filled text message",
    defaultFields: { phone: "", message: "" },
    fields: [
      { name: "phone", label: "Phone Number", placeholder: "+1 234 567 8900", type: "tel", required: true },
      { name: "message", label: "Message (optional)", placeholder: "Your message...", type: "textarea" },
    ],
    format: (f) => `SMSTO:${f.phone || ""}:${f.message || ""}`,
  },
  {
    id: "wifi",
    label: "WiFi",
    description: "Connect to a WiFi network instantly",
    defaultFields: { ssid: "", password: "", encryption: "WPA" },
    fields: [
      { name: "ssid", label: "Network Name (SSID)", placeholder: "MyWiFiNetwork", type: "text", required: true },
      { name: "password", label: "Password", placeholder: "WiFi password", type: "password" },
      {
        name: "encryption",
        label: "Encryption",
        placeholder: "",
        type: "select",
        options: [
          { label: "WPA/WPA2", value: "WPA" },
          { label: "WEP", value: "WEP" },
          { label: "None", value: "nopass" },
        ],
      },
    ],
    format: (f) => `WIFI:T:${f.encryption || "WPA"};S:${f.ssid || ""};P:${f.password || ""};;`,
  },
  {
    id: "vcard",
    label: "vCard",
    description: "Share contact information",
    defaultFields: { firstName: "", lastName: "", phone: "", email: "", org: "", url: "" },
    fields: [
      { name: "firstName", label: "First Name", placeholder: "John", type: "text", required: true },
      { name: "lastName", label: "Last Name", placeholder: "Doe", type: "text" },
      { name: "phone", label: "Phone", placeholder: "+1 234 567 8900", type: "tel" },
      { name: "email", label: "Email", placeholder: "john@example.com", type: "email" },
      { name: "org", label: "Organization", placeholder: "Company name", type: "text" },
      { name: "url", label: "Website", placeholder: "https://example.com", type: "url" },
    ],
    format: (f) => {
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `FN:${[f.firstName, f.lastName].filter(Boolean).join(" ")}`,
        f.phone ? `TEL:${f.phone}` : "",
        f.email ? `EMAIL:${f.email}` : "",
        f.org ? `ORG:${f.org}` : "",
        f.url ? `URL:${f.url}` : "",
        "END:VCARD",
      ];
      return lines.filter(Boolean).join("\n");
    },
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Open WhatsApp chat with a message",
    defaultFields: { phone: "", message: "" },
    fields: [
      { name: "phone", label: "Phone Number", placeholder: "+1 234 567 8900", type: "tel", required: true },
      { name: "message", label: "Pre-filled Message (optional)", placeholder: "Hello!", type: "textarea" },
    ],
    format: (f) => {
      const phone = (f.phone || "").replace(/\D/g, "");
      const msg = f.message ? `?text=${encodeURIComponent(f.message)}` : "";
      return `https://wa.me/${phone}${msg}`;
    },
  },
];
