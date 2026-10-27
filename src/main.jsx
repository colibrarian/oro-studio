import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { DICTS, DEFAULT_LANG } from "./i18n/index.js";

// The language comes from <html lang="..."> of the page: / is Estonian, /ru/ is Russian.
const lang = DICTS[document.documentElement.lang] ? document.documentElement.lang : DEFAULT_LANG;
const app = (
  <React.StrictMode>
    <App dict={DICTS[lang]} />
  </React.StrictMode>
);

const root = document.getElementById("root");
// In production the HTML is pre-rendered (see scripts/prerender.mjs), so React
// only attaches to it. In `npm run dev` the root is empty and React renders it.
if (root.firstElementChild) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
