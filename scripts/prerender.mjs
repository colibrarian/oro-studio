// Runs after `vite build` + the SSR build (see package.json "build").
// For every language it:
//   - fills the page HTML with the pre-rendered app (full text visible without JS),
//   - writes <head>: title, description, canonical, hreflang, Open Graph, JSON-LD
//     (LocalBusiness + FAQPage + WebSite).
// Then writes sitemap.xml, robots.txt, llms.txt and (for a custom domain) CNAME.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { SITE_URL, CUSTOM_DOMAIN, LANGS, DEFAULT_LANG, CONTACT } from "../site.config.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = process.env.DIST_DIR || resolve(root, "dist");
const serverEntry = process.env.SERVER_ENTRY || resolve(root, "dist-server/entry-server.js");
const { render, DICTS } = await import(pathToFileURL(serverEntry).href);

const pageUrl = (lang) => `${SITE_URL}/${LANGS.find((l) => l.code === lang).path}`;
const ogImage = `${SITE_URL}/images/hero-consulting.jpg`;
const esc = (str) =>
  String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// JSON inside <script>: neutralise "</script>" and similar sequences.
const jsonLd = (obj) => JSON.stringify(obj, null, 2).replace(/</g, "\\u003c");

function head(lang) {
  const t = DICTS[lang];
  const self = LANGS.find((l) => l.code === lang);
  const url = pageUrl(lang);

  const business = {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#studio`,
    name: "ORO Studio",
    description: t.meta.description,
    url,
    image: ogImage,
    telephone: CONTACT.phoneDisplay,
    email: CONTACT.email,
    priceRange: "€20–€40 / h",
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT.street,
      addressLocality: CONTACT.city,
      addressCountry: CONTACT.country,
    },
    hasMap: CONTACT.mapsUrl,
    maximumAttendeeCapacity: 15,
    sameAs: [CONTACT.instagram, CONTACT.facebook, CONTACT.telegram],
    founder: { "@type": "Person", name: lang === "ru" ? "Наталия" : "Natalia" },
  };
  const faq = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: lang,
    mainEntity: t.faq.items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${url}#website`,
    url,
    name: "ORO Studio",
    inLanguage: lang,
    publisher: { "@id": `${SITE_URL}/#studio` },
  };

  const alternates = [
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${pageUrl(l.code)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT_LANG)}" />`,
  ];
  const otherLocales = LANGS.filter((l) => l.code !== lang).map(
    (l) => `<meta property="og:locale:alternate" content="${l.locale}" />`
  );

  return [
    `<title>${esc(t.meta.title)}</title>`,
    `<meta name="description" content="${esc(t.meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="ORO Studio" />`,
    `<meta property="og:locale" content="${self.locale}" />`,
    ...otherLocales,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${esc(t.meta.ogTitle)}" />`,
    `<meta property="og:description" content="${esc(t.meta.ogDescription)}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<link rel="preload" as="image" type="image/webp" imagesrcset="${SITE_URL}/images/w/hero-consulting-640.webp 640w, ${SITE_URL}/images/w/hero-consulting-1280.webp 1280w" imagesizes="(max-width: 860px) 100vw, 520px" />`,
    `<script type="application/ld+json">${jsonLd({ "@context": "https://schema.org", "@graph": [business, website, faq] })}</script>`,
  ].join("\n    ");
}

for (const { code, path } of LANGS) {
  const file = resolve(distDir, path, "index.html");
  if (!existsSync(file)) throw new Error(`Missing ${file} — did vite build run?`);
  const html = readFileSync(file, "utf8");
  if (!html.includes("<!--app-html-->") || !html.includes("<!--app-head-->")) {
    throw new Error(`Placeholders not found in ${file}`);
  }
  const out = html.replace("<!--app-head-->", head(code)).replace("<!--app-html-->", render(code));
  writeFileSync(file, out);
  console.log(`prerendered ${code} → ${file} (${Math.round(out.length / 1024)} KB)`);
}

// ---- sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urlEntry = (lang) => `  <url>
    <loc>${pageUrl(lang)}</loc>
    <lastmod>${today}</lastmod>
${LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${pageUrl(l.code)}" />`).join("\n")}
    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(DEFAULT_LANG)}" />
  </url>`;
writeFileSync(
  resolve(distDir, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map((l) => urlEntry(l.code)).join("\n")}
</urlset>
`
);

// ---- robots.txt (search engines and AI assistants are welcome)
writeFileSync(
  resolve(distDir, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
);

// ---- llms.txt — a short, plain summary for AI assistants (llmstxt.org)
const et = DICTS.et;
const ru = DICTS.ru;
const faqBlock = (t) => t.faq.items.map(({ q, a }) => `- **${q}** ${a}`).join("\n");
writeFileSync(
  resolve(distDir, "llms.txt"),
  `# ORO Studio

> A cosy event and meeting studio in the very centre of Tallinn, Estonia (${CONTACT.street}). Rent the space by the hour for consultations, workshops, lectures, women's circles and photo shoots, or book a turnkey birthday or bachelorette party with a hosted programme. Up to 15 guests.

## Key facts

- Address: ${CONTACT.street}, ${CONTACT.city}, Estonia
- Capacity: up to 15 people
- Hourly rent: €20 (1–2 people), €30 (3–10 people), €40 (11–15 people); optional cleaning service €20
- Turnkey parties: from 5 guests, 4 hours (2 h programme with an expert + 2 h free time), bottle of prosecco as a gift
- Programmes: own perfume creation, perfume lecture, intention candles, astrology evening, numerology, minerals and bracelets, transformational game
- Included: furnished space, photo corners, Wi-Fi, TV with laptop connection, Bluetooth speaker, coffee machine, coffee, tea and light snacks, tableware for 15
- Booking: calendar on the website (sends a WhatsApp message) or WhatsApp ${CONTACT.phoneDisplay}
- Email: ${CONTACT.email}

## Pages

- [ORO Studio in Estonian](${pageUrl("et")}): full site in Estonian
- [ORO Studio in Russian](${pageUrl("ru")}): full site in Russian

## FAQ (Estonian)

${faqBlock(et)}

## FAQ (Russian)

${faqBlock(ru)}
`
);

if (CUSTOM_DOMAIN) writeFileSync(resolve(distDir, "CNAME"), `${CUSTOM_DOMAIN}\n`);
console.log("wrote sitemap.xml, robots.txt, llms.txt" + (CUSTOM_DOMAIN ? ", CNAME" : ""));
