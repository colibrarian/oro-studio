# ORO Studio — сайт

Клиент: **Наталья (Natalia)**, ORO Studio, Narva mnt 4, Tallinn. Ведёт проект: Костя (Erewhile Digital).
Сайт: https://colibrarian.github.io/oro-studio/ (ET) и `/ru/` (RU). Деплой: push в `main` → GitHub Actions → GitHub Pages.

## Как устроено

- React 18 + Vite, одна страница. Весь UI в `src/App.jsx`.
- **Все тексты** — в `src/i18n/et.js` (эстонский, основной, корень сайта) и `src/i18n/ru.js` (русский, `/ru/`). Правки текста делаются только там, обе версии синхронно.
- `site.config.js` — домен (`CUSTOM_DOMAIN`), языки, контакты, `BOOKING_API_URL`.
- Сборка (`npm run build`): vite build → SSR-сборка `src/entry-server.jsx` → `scripts/prerender.mjs`, который вписывает готовый HTML каждой языковой страницы, meta/hreflang/Open Graph, JSON-LD (LocalBusiness, WebSite, FAQPage) и пишет `sitemap.xml`, `robots.txt`, `llms.txt` (+ `CNAME`, если задан домен).
- Фото: оригиналы JPG в `public/images/`, WebP 640/1280 в `public/images/w/`. Компонент `<Photo name="...">` берёт имя без расширения. После добавления фото надо сгенерировать WebP (Pillow, quality 78, ширины 640 и 1280).
- Бронирование: календарь на сайте. Если `BOOKING_API_URL` задан, занятость и заявки идут через Google Apps Script (`google-apps-script/Code.gs`, инструкция там же в README): заявка ставит жёлтое событие «Заявка: …» в календарь events@orostudiotallinn.com и шлёт письмо туда же. Если не задан или скрипт недоступен — заявка уходит в WhatsApp готовым сообщением.

## Решения, которые уже приняты

- Языки: эстонский (основной) + русский. Эстонский на «ты» (sina), «девичник» = *polterõhtu*. Перевод сделан ИИ, нужна вычитка носителем.
- Уведомления о заявках: только email (без мессенджеров). Заявка сразу блокирует время.
- Картинки храним в репозитории (WebP), без ImageKit/CDN.
- В Hero вместо фото — большой логотип (`public/images/oro-logo.png` + WebP в `images/w/`, константа `HERO_LOGO` в App.jsx) с анимированным блеском. Два варианта, переключаются константой `HERO_SHINE` (выбран `halo`): `sweep` (световая полоса по маске лого + искры на буквах) и `halo` (свет медленно идёт по кругу по золотым линиям). При prefers-reduced-motion анимация выключена.
- Фото программ (`program-*`) взяты из архива клиента, где каждое фото подписано названием программы (ноябрь 2026). Не менять без согласования с Натальей.
- Галерея — фото с людьми. Детское фото с планшетами НЕ ставить на «Картину на холсте» (там iPad, а программа про акрил).

## Открытые задачи

- [ ] Развернуть Google Apps Script под events@orostudiotallinn.com, вписать URL `/exec` в `BOOKING_API_URL`, проверить на живом календаре.
- [ ] Домен: подтвердить `orostudiotallinn.com` (куплен через Google, DNS теперь в Squarespace). A-записи `@` → 185.199.108–111.153, CNAME `www` → colibrarian.github.io, MX не трогать. Затем `CUSTOM_DOMAIN` в site.config.js и домен в GitHub → Settings → Pages + Enforce HTTPS.
- [ ] Вычитка эстонского носителем.

## Правила работы

- Для текстов, которые Костя публикует от своего имени (посты, офферы), не использовать длинное тире.
- Коммиты от имени Claude <noreply@anthropic.com>.
- npm в облачной среде Claude закрыт; полную сборку проверяет GitHub Actions. Для локальной проверки — esbuild из /opt/npm-tools + Playwright.
