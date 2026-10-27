// Used only at build time to pre-render each language page to static HTML,
// so search engines and AI crawlers see the full text without running JavaScript.
import React from "react";
import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { DICTS } from "./i18n/index.js";

export { DICTS };

export function render(lang) {
  return renderToString(
    <React.StrictMode>
      <App dict={DICTS[lang]} />
    </React.StrictMode>
  );
}
