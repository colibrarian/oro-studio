import { createContext, useContext } from "react";
import ru from "./ru.js";
import et from "./et.js";
import { LANGS, DEFAULT_LANG, LEGAL_PAGES } from "../../site.config.js";

export const DICTS = { ru, et };
export { LANGS, DEFAULT_LANG };

export const LangContext = createContext(DICTS[DEFAULT_LANG]);
export const useT = () => useContext(LangContext);

// URL of the page for a given language, relative to the deployed base.
export const langHref = (code) => {
  const base = import.meta.env.BASE_URL || "/";
  const entry = LANGS.find((l) => l.code === code);
  return `${base}${entry ? entry.path : ""}`;
};

// URL of the legal page (terms, privacy, cookies) for a given language.
export const legalHref = (code) => `${import.meta.env.BASE_URL || "/"}${LEGAL_PAGES[code] || LEGAL_PAGES[DEFAULT_LANG]}`;
