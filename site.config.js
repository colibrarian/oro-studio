// Single place to switch the site between the GitHub Pages address and the
// client's own domain. When the domain DNS is ready:
//   1. set CUSTOM_DOMAIN to "orostudiotallinn.com"
//   2. push — the build writes the CNAME file and switches all URLs to "/".
export const CUSTOM_DOMAIN = null; // e.g. "orostudiotallinn.com"

export const BASE = CUSTOM_DOMAIN ? "/" : "/oro-studio/";
export const SITE_URL = CUSTOM_DOMAIN ? `https://${CUSTOM_DOMAIN}` : "https://colibrarian.github.io/oro-studio";

// Estonian is the default language and lives at the site root; Russian at /ru/.
export const LANGS = [
  { code: "et", path: "", locale: "et_EE" },
  { code: "ru", path: "ru/", locale: "ru_RU" },
];
export const DEFAULT_LANG = "et";

// Google Calendar booking: the web-app URL of the Apps Script from
// google-apps-script/ (ends with /exec). null = booking goes through WhatsApp only.
export const BOOKING_API_URL = null;

// Contacts — single source of truth for the page and for the SEO data.
export const CONTACT = {
  phoneDisplay: "+372 5336 3795",
  phoneRaw: "37253363795",
  email: "events@orostudiotallinn.com",
  street: "Narva mnt 4",
  city: "Tallinn",
  country: "EE",
  mapsUrl: "https://maps.google.com/?q=Narva+mnt+4,+Tallinn",
  instagram: "https://www.instagram.com/oro_studio_tln",
  telegram: "https://t.me/oro_studio_tallinn",
  facebook: "https://www.facebook.com/share/1DtTPKb5Eu/",
};
