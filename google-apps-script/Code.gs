/**
 * ORO Studio — связка сайта с Google Календарём.
 *
 * Разворачивается в аккаунте events@orostudiotallinn.com как веб-приложение
 * (см. README.md рядом). Делает две вещи:
 *   GET  ?action=busy&from=YYYY-MM-DD&to=YYYY-MM-DD
 *        → какие часы заняты (по событиям календаря). Названия событий наружу не отдаются.
 *   POST {date, start, hours, type, guests, name, email, contact, comment, lang, price}
 *        → ещё раз проверяет, что время свободно, ставит событие «Заявка» в календарь,
 *          отправляет письмо на NOTIFY_EMAIL и письмо-подтверждение клиенту (ET/RU).
 *
 * Буфер: вокруг каждого события календаря время закрыто ещё на BUFFER_BEFORE_HOURS
 * до и BUFFER_AFTER_HOURS после (подготовка и уборка), как в Calendly.
 */

const CONFIG = {
  CALENDAR_ID: "primary", // "primary" = основной календарь аккаунта; можно вставить ID другого календаря
  TIMEZONE: "Europe/Tallinn",
  NOTIFY_EMAIL: "events@orostudiotallinn.com",
  OPEN_HOUR: 10, // первый слот
  CLOSE_HOUR: 20, // бронь должна закончиться к этому часу
  MAX_HOURS: 8,
  MAX_DAYS_AHEAD: 365,
  MAX_BOOKINGS_PER_HOUR: 20, // защита от спама: не больше N заявок в час со всего сайта
  EVENT_COLOR: CalendarApp.EventColor.YELLOW, // заявки жёлтые, чтобы отличать от подтверждённых
  BUFFER_BEFORE_HOURS: 1, // столько часов перед каждым событием сайт показывает занятыми
  BUFFER_AFTER_HOURS: 1, // и столько после
  PREPAYMENT_EUR: 20, // сколько не возвращается при отмене после оплаты, упоминается в письме клиенту
  SEND_CLIENT_EMAIL: true, // письмо-подтверждение клиенту
  // Для фирменного письма. После переезда на свой домен поменять SITE_URL и LOGO_URL.
  SITE_URL: "https://colibrarian.github.io/oro-studio/",
  LOGO_URL: "https://colibrarian.github.io/oro-studio/images/email/oro-logo-240.png",
  PHONE_DISPLAY: "+372 5336 3795",
  PHONE_RAW: "37253363795",
  ADDRESS: "Narva mnt 4, Tallinn",

  // ---- Автосчёт клиенту (PDF во вложении к письму-подтверждению) ----
  // Пока IBAN пустой, счёт НЕ отправляется: клиент получает обычное подтверждение.
  INVOICE: {
    ENABLED: true,
    SELLER_NAME: "Flor Da Vida OÜ", // юр. название фирмы
    REG_CODE: "3127475", // регистрационный код (TODO: в Эстонии 8 цифр, сверить с ariregister.rik.ee)
    VAT_NO: "", // KMKR, если фирма плательщик НДС; иначе пусто
    VAT_RATE: 0, // 0.24, если плательщик НДС (цены сайта считаются включающими НДС); иначе 0
    SELLER_ADDRESS: "Narva mnt 4, 10117 Tallinn",
    IBAN: "EE46 2200 2210 9167 5087",
    BANK: "Swedbank",
    PREFIX: "ORO", // номер счёта: ORO-2026-001. Отдельная серия, чтобы не пересекаться с бухгалтерией
    DUE_DAYS: 3, // срок оплаты, но не позже дня мероприятия
    SKIP_TYPES: ["birthday", "bachelorette"], // под ключ: цена считается отдельно, счёт Наталья делает вручную
  },
};

/* ---------------- HTTP ---------------- */

function doGet(e) {
  try {
    const p = (e && e.parameter) || {};
    if (p.action === "busy") return json_(busy_(p.from, p.to));
    return json_({ ok: true, service: "ORO Studio booking" });
  } catch (err) {
    return json_({ ok: false, error: "server", message: String(err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    return json_(book_(body));
  } catch (err) {
    return json_({ ok: false, error: "server", message: String(err) });
  }
}

/* ---------------- Занятость ---------------- */

function busy_(from, to) {
  if (!isDate_(from) || !isDate_(to)) return { ok: false, error: "bad_range" };
  const start = at_(from, 0);
  const end = new Date(at_(to, 0).getTime() + 24 * 3600 * 1000);
  if (end - start > 62 * 24 * 3600 * 1000 || end <= start) return { ok: false, error: "bad_range" };

  const events = eventsAround_(calendar_(), start, end);
  const busy = {};
  for (let d = new Date(start); d < end; d = new Date(d.getTime() + 24 * 3600 * 1000)) {
    const key = Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM-dd");
    const hours = [];
    for (let h = CONFIG.OPEN_HOUR; h < CONFIG.CLOSE_HOUR; h++) {
      const s = at_(key, h);
      const f = at_(key, h + 1);
      if (events.some((ev) => overlaps_(ev, s, f))) hours.push(h);
    }
    if (hours.length) busy[key] = hours;
  }
  return { ok: true, open: CONFIG.OPEN_HOUR, close: CONFIG.CLOSE_HOUR, busy };
}

/* ---------------- Заявка ---------------- */

function book_(b) {
  // Скрытое поле-ловушка для ботов: человек его не видит и не заполняет.
  if (b.website) return { ok: true };

  const date = String(b.date || "");
  const startHour = Number(b.start);
  const hours = Number(b.hours);
  const name = clean_(b.name, 80);
  const email = clean_(b.email, 120);
  const contact = clean_(b.contact, 120);
  const comment = clean_(b.comment, 1000);
  const type = clean_(b.type, 80);
  const typeKey = clean_(b.typeKey, 30);
  const guests = Math.min(15, Math.max(1, Number(b.guests) || 1));
  const lang = b.lang === "ru" ? "ru" : "et";

  if (!isDate_(date) || !Number.isInteger(startHour) || !Number.isInteger(hours)) return { ok: false, error: "bad_request" };
  if (hours < 1 || hours > CONFIG.MAX_HOURS) return { ok: false, error: "bad_request" };
  if (startHour < CONFIG.OPEN_HOUR || startHour + hours > CONFIG.CLOSE_HOUR) return { ok: false, error: "bad_request" };
  if (!name || !isEmail_(email)) return { ok: false, error: "bad_request" };

  const start = at_(date, startHour);
  const end = at_(date, startHour + hours);
  const now = new Date();
  if (start <= now) return { ok: false, error: "past" };
  if (start - now > CONFIG.MAX_DAYS_AHEAD * 24 * 3600 * 1000) return { ok: false, error: "bad_request" };

  if (!rateOk_()) return { ok: false, error: "rate" };

  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const cal = calendar_();
    if (eventsAround_(cal, start, end).some((ev) => overlaps_(ev, start, end))) return { ok: false, error: "busy" };

    const price = pricePerHour_(guests) * hours;
    const title = `Заявка: ${name} · ${type} · ${guests} чел.`;
    const details = [
      `Формат: ${type}`,
      `Дата: ${date}, ${pad_(startHour)}:00–${pad_(startHour + hours)}:00 (${hours} ч)`,
      `Гостей: ${guests}`,
      `Имя: ${name}`,
      `Email: ${email}`,
      contact ? `Телефон / контакт: ${contact}` : "",
      comment ? `Комментарий: ${comment}` : "",
      `Аренда по калькулятору: €${price}`,
      `Язык сайта: ${lang === "ru" ? "русский" : "эстонский"}`,
      "",
      `Заявка с сайта, ещё НЕ подтверждена. Клиенту ушло письмо: бронь подтверждается после оплаты счёта за аренду, при отмене €${CONFIG.PREPAYMENT_EUR} не возвращаются.`,
      "Если бронь не состоится, просто удалите это событие: время снова станет свободным на сайте.",
    ]
      .filter((line) => line !== "")
      .join("\n");

    const ev = cal.createEvent(title, start, end, { description: details });
    try {
      ev.setColor(CONFIG.EVENT_COLOR);
    } catch (e) {}

    const order = { name, email, type, date, startHour, hours, guests, price, pricePerHour: pricePerHour_(guests), start };

    // Счёт: номер, PDF, запись в таблицу. Если что-то не так, заявка всё равно принимается.
    let invoice = null;
    let invoiceNote = "";
    if (CONFIG.SEND_CLIENT_EMAIL && invoiceReady_() && CONFIG.INVOICE.SKIP_TYPES.indexOf(typeKey) === -1) {
      try {
        invoice = makeInvoice_(lang, order);
        ev.setDescription(details + `\n\nСчёт ${invoice.number} на €${price} отправлен клиенту, срок оплаты ${invoice.dueText}.`);
        invoiceNote = `\n\nСчёт ${invoice.number} на €${price} отправлен клиенту (копия во вложении), срок оплаты ${invoice.dueText}.`;
      } catch (e) {
        console.error("invoice failed: " + e);
        invoiceNote = "\n\nАвтосчёт создать не удалось, выставьте счёт вручную.";
      }
    } else if (invoiceReady_()) {
      invoiceNote = "\n\nАвтосчёт не отправлялся (программа под ключ), выставьте счёт вручную.";
    }

    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: `Новая заявка ORO Studio: ${date} ${pad_(startHour)}:00, ${name}`,
      body: details + invoiceNote + `\n\nСобытие в календаре: ${title}\nОтветить клиенту можно прямо на это письмо.`,
      name: "ORO Studio сайт",
      replyTo: email,
      attachments: invoice ? [invoice.pdf] : [],
    });

    if (CONFIG.SEND_CLIENT_EMAIL) {
      // Если письмо клиенту не ушло (квота, кривой адрес), заявка всё равно принята.
      try {
        const m = clientEmail_(lang, order, invoice);
        MailApp.sendEmail({
          to: email,
          subject: m.subject,
          body: m.body,
          htmlBody: m.htmlBody,
          name: "ORO Studio",
          replyTo: CONFIG.NOTIFY_EMAIL,
          attachments: invoice ? [invoice.pdf] : [],
        });
      } catch (e) {
        console.error("client email failed: " + e);
      }
    }
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}

/* ---------------- Помощники ---------------- */

function calendar_() {
  return CONFIG.CALENDAR_ID === "primary" ? CalendarApp.getDefaultCalendar() : CalendarApp.getCalendarById(CONFIG.CALENDAR_ID);
}

// Дата + час в часовом поясе студии.
function at_(ymd, hour) {
  const day = Utilities.parseDate(ymd + " 00:00", CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm");
  return new Date(day.getTime() + hour * 3600 * 1000);
}

// Пересекается ли событие (вместе с буфером до и после) с промежутком [s, f).
function overlaps_(ev, s, f) {
  // Отклонённые приглашения не блокируют время.
  try {
    if (ev.getMyStatus && ev.getMyStatus() === CalendarApp.GuestStatus.NO) return false;
  } catch (e) {}
  // События на весь день (выходной, отпуск) закрывают день целиком, без буфера.
  if (ev.isAllDayEvent()) return ev.getStartTime() < f && ev.getEndTime() > s;
  const before = CONFIG.BUFFER_BEFORE_HOURS * 3600 * 1000;
  const after = CONFIG.BUFFER_AFTER_HOURS * 3600 * 1000;
  return ev.getStartTime().getTime() - before < f.getTime() && ev.getEndTime().getTime() + after > s.getTime();
}

// События, которые могут задеть [s, f) с учётом буфера.
function eventsAround_(cal, s, f) {
  const pad = Math.max(CONFIG.BUFFER_BEFORE_HOURS, CONFIG.BUFFER_AFTER_HOURS) * 3600 * 1000;
  return cal.getEvents(new Date(s.getTime() - pad), new Date(f.getTime() + pad));
}

/* ---------------- Письмо клиенту ---------------- */

const MONTHS_ = {
  ru: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
  et: ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"],
};

function clientEmail_(lang, o, inv) {
  const [y, mo, d] = o.date.split("-").map(Number);
  const time = `${pad_(o.startHour)}:00–${pad_(o.startHour + o.hours)}:00`;
  const pre = CONFIG.PREPAYMENT_EUR;
  const t =
    lang === "ru"
      ? {
          subject: `ORO Studio: заявка на ${d} ${MONTHS_.ru[mo - 1]}, ${time}`,
          hello: `Здравствуйте, ${o.name}!`,
          intro: "Спасибо за заявку. Мы предварительно забронировали для вас время в ORO Studio:",
          rows: [
            ["Дата", `${d} ${MONTHS_.ru[mo - 1]} ${y}`],
            ["Время", time],
            ["Формат", o.type],
            ["Гостей", String(o.guests)],
            ["Аренда по калькулятору", `€${o.price}`],
          ],
          note: inv
            ? `Бронь подтверждается после оплаты счёта ${inv.number} (во вложении). Если вы отмените бронь, оплату вернём, кроме €${pre}.`
            : `Бронь подтверждается после оплаты аренды: счёт мы пришлём отдельным письмом. Если вы отмените бронь, оплату вернём, кроме €${pre}.`,
          payTitle: "Оплата",
          payRows: inv
            ? [
                ["Счёт", inv.number],
                ["Сумма", `€${o.price}`],
                ["Получатель", CONFIG.INVOICE.SELLER_NAME],
                ["IBAN", CONFIG.INVOICE.IBAN],
                ["Пояснение", inv.number],
                ["Оплатить до", inv.dueText],
              ]
            : null,
          outro: "Если есть вопросы или нужно что-то изменить, просто ответьте на это письмо или напишите нам в WhatsApp:",
          bye: "До встречи!",
        }
      : {
          subject: `ORO Studio: broneeringu päring ${d}. ${MONTHS_.et[mo - 1]}, ${time}`,
          hello: `Tere, ${o.name}!`,
          intro: "Aitäh päringu eest! Broneerisime sinu jaoks esialgselt aja ORO Studios:",
          rows: [
            ["Kuupäev", `${d}. ${MONTHS_.et[mo - 1]} ${y}`],
            ["Kellaaeg", time],
            ["Formaat", o.type],
            ["Külalisi", String(o.guests)],
            ["Rendi hind kalkulaatori järgi", `€${o.price}`],
          ],
          note: inv
            ? `Broneering kinnitatakse pärast arve ${inv.number} tasumist (manuses). Broneeringu tühistamisel tagastame makse, välja arvatud €${pre}.`
            : `Broneering kinnitatakse pärast rendi tasumist: arve saadame eraldi kirjaga. Broneeringu tühistamisel tagastame makse, välja arvatud €${pre}.`,
          payTitle: "Tasumine",
          payRows: inv
            ? [
                ["Arve", inv.number],
                ["Summa", `€${o.price}`],
                ["Saaja", CONFIG.INVOICE.SELLER_NAME],
                ["IBAN", CONFIG.INVOICE.IBAN],
                ["Selgitus", inv.number],
                ["Tasuda hiljemalt", inv.dueText],
              ]
            : null,
          outro: "Kui sul on küsimusi või soovid midagi muuta, vasta lihtsalt sellele kirjale või kirjuta meile WhatsAppis:",
          bye: "Kohtumiseni!",
        };

  const body = [
    t.hello,
    "",
    t.intro,
    "",
    ...t.rows.map(([k, v]) => `${k}: ${v}`),
    "",
    ...(t.payRows ? [t.payTitle + ":", ...t.payRows.map(([k, v]) => `${k}: ${v}`), ""] : []),
    t.note,
    "",
    `${t.outro} ${CONFIG.PHONE_DISPLAY}`,
    "",
    t.bye,
    "ORO Studio",
    CONFIG.ADDRESS,
  ].join("\n");

  return { subject: t.subject, body, htmlBody: brandedHtml_(t) };
}

/* Фирменное HTML-письмо: цвета и шрифты сайта. Вёрстка таблицами и инлайн-стилями,
   чтобы одинаково выглядело в Gmail, Outlook и Apple Mail. */
const BRAND_ = {
  ivory: "#F7F3EC",
  card: "#FBF8F2",
  ivoryDeep: "#EDE6D6",
  oliveDark: "#4F5A3D",
  olive: "#6F7A56",
  gold: "#B08A45",
  ink: "#3A3428",
  inkSoft: "#6B6250",
  serif: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
  sans: "Montserrat, 'Helvetica Neue', Arial, sans-serif",
};

function esc_(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function brandedHtml_(t) {
  const B = BRAND_;
  const table = (list) =>
    list
      .map(
        ([k, v]) =>
          `<tr><td style="padding:9px 0;border-bottom:1px solid ${B.ivoryDeep};font:300 13px/1.5 ${B.sans};color:${B.inkSoft};">${esc_(k)}</td>` +
          `<td align="right" style="padding:9px 0;border-bottom:1px solid ${B.ivoryDeep};font:500 14px/1.5 ${B.sans};color:${B.ink};">${esc_(v)}</td></tr>`
      )
      .join("");
  const pay = t.payRows
    ? `<h2 style="margin:0 0 6px;font:500 20px/1.3 ${B.serif};color:${B.oliveDark};">${esc_(t.payTitle)}</h2>` +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">${table(t.payRows)}</table>`
    : "";
  const rows = t.rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:9px 0;border-bottom:1px solid ${B.ivoryDeep};font:300 13px/1.5 ${B.sans};color:${B.inkSoft};">${esc_(k)}</td>` +
        `<td align="right" style="padding:9px 0;border-bottom:1px solid ${B.ivoryDeep};font:500 14px/1.5 ${B.sans};color:${B.ink};">${esc_(v)}</td></tr>`
    )
    .join("");
  const wa = `https://wa.me/${CONFIG.PHONE_RAW}`;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Montserrat:wght@300;400;500&display=swap" rel="stylesheet"></head>
<body style="margin:0;padding:0;background:${B.ivory};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${B.ivory};"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
<tr><td align="center" style="padding:0 0 20px;"><img src="${CONFIG.LOGO_URL}" width="96" height="96" alt="ORO Studio" style="display:block;border:0;"></td></tr>
<tr><td style="background:${B.card};border:1px solid ${B.ivoryDeep};border-radius:18px;padding:36px 32px;">
<h1 style="margin:0 0 14px;font:500 28px/1.2 ${B.serif};color:${B.oliveDark};">${esc_(t.hello)}</h1>
<p style="margin:0 0 20px;font:300 14px/1.7 ${B.sans};color:${B.ink};">${esc_(t.intro)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 22px;">${rows}</table>
${pay}
<p style="margin:0 0 22px;padding:14px 16px;background:${B.ivoryDeep};border-left:3px solid ${B.gold};border-radius:8px;font:400 13px/1.6 ${B.sans};color:${B.oliveDark};">${esc_(t.note)}</p>
<p style="margin:0 0 22px;font:300 13px/1.7 ${B.sans};color:${B.inkSoft};">${esc_(t.outro)} <a href="${wa}" style="color:${B.oliveDark};font-weight:500;">${esc_(CONFIG.PHONE_DISPLAY)}</a></p>
<p style="margin:0;font:italic 500 20px/1.3 ${B.serif};color:${B.gold};">${esc_(t.bye)}</p>
</td></tr>
<tr><td align="center" style="padding:22px 0 0;font:300 12px/1.7 ${B.sans};color:${B.inkSoft};">
ORO Studio · ${esc_(CONFIG.ADDRESS)}<br>
<a href="${CONFIG.SITE_URL}" style="color:${B.olive};">${esc_(CONFIG.SITE_URL.replace(/^https?:\/\//, ""))}</a> · <a href="mailto:${CONFIG.NOTIFY_EMAIL}" style="color:${B.olive};">${CONFIG.NOTIFY_EMAIL}</a>
</td></tr></table></td></tr></table></body></html>`;
}

/* ---------------- Автосчёт ---------------- */

function invoiceReady_() {
  const I = CONFIG.INVOICE;
  return I.ENABLED && !!I.IBAN && !!I.SELLER_NAME && !!I.REG_CODE;
}

// Следующий номер счёта: ORO-2026-001. Вызывается под LockService из book_().
function nextInvoiceNumber_() {
  const props = PropertiesService.getScriptProperties();
  const year = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy");
  const key = "invoice_seq_" + year;
  const n = Number(props.getProperty(key) || 0) + 1;
  props.setProperty(key, String(n));
  return `${CONFIG.INVOICE.PREFIX}-${year}-${String(n).padStart(3, "0")}`;
}

// Папка на Диске и таблица-журнал счетов создаются сами при первом счёте.
function invoiceStore_() {
  const props = PropertiesService.getScriptProperties();
  let folder;
  try {
    folder = DriveApp.getFolderById(props.getProperty("invoice_folder"));
  } catch (e) {
    folder = DriveApp.createFolder("ORO Studio — счета");
    props.setProperty("invoice_folder", folder.getId());
  }
  let sheet;
  try {
    sheet = SpreadsheetApp.openById(props.getProperty("invoice_sheet")).getSheets()[0];
  } catch (e) {
    const ss = SpreadsheetApp.create("ORO Studio — журнал счетов");
    DriveApp.getFileById(ss.getId()).moveTo(folder);
    sheet = ss.getSheets()[0];
    sheet.appendRow(["Номер", "Дата счёта", "Срок оплаты", "Клиент", "Email", "Мероприятие", "Часы", "Сумма €", "PDF", "Оплачен"]);
    sheet.setFrozenRows(1);
    props.setProperty("invoice_sheet", ss.getId());
  }
  return { folder, sheet };
}

function makeInvoice_(lang, o) {
  const number = nextInvoiceNumber_();
  const today = new Date();
  const due = new Date(Math.min(today.getTime() + CONFIG.INVOICE.DUE_DAYS * 24 * 3600 * 1000, o.start.getTime()));
  const fmt = (d) => Utilities.formatDate(d, CONFIG.TIMEZONE, "dd.MM.yyyy");
  const inv = { number, dateText: fmt(today), dueText: fmt(due) };

  const html = invoiceHtml_(lang, o, inv);
  const pdf = Utilities.newBlob(html, "text/html", number + ".html").getAs("application/pdf").setName(`${number}.pdf`);
  inv.pdf = pdf;

  const store = invoiceStore_();
  const file = store.folder.createFile(pdf);
  store.sheet.appendRow([number, inv.dateText, inv.dueText, o.name, o.email, `${o.date} ${pad_(o.startHour)}:00`, o.hours, o.price, file.getUrl(), ""]);
  return inv;
}

function logoDataUri_() {
  try {
    const blob = UrlFetchApp.fetch(CONFIG.LOGO_URL).getBlob();
    return "data:image/png;base64," + Utilities.base64Encode(blob.getBytes());
  } catch (e) {
    return "";
  }
}

function invoiceHtml_(lang, o, inv) {
  const B = BRAND_;
  const I = CONFIG.INVOICE;
  const ru = lang === "ru";
  const L = ru
    ? { title: "Счёт", no: "№", date: "Дата", due: "Оплатить до", seller: "Продавец", buyer: "Покупатель", reg: "Рег. код", vat: "KMKR",
        item: "Описание", qty: "Кол-во", unit: "Цена", sum: "Сумма", hrs: "ч", net: "Без НДС", vatLine: "НДС", total: "Итого к оплате",
        pay: "Реквизиты для оплаты", ref: "Пояснение к платежу", bank: "Банк",
        desc: `Аренда ORO Studio, ${o.date.split("-").reverse().join(".")} ${pad_(o.startHour)}:00–${pad_(o.startHour + o.hours)}:00 (${o.type})`,
        cancel: `Бронь подтверждается после оплаты. При отмене оплата возвращается, кроме €${CONFIG.PREPAYMENT_EUR}.` }
    : { title: "Arve", no: "Nr", date: "Kuupäev", due: "Maksetähtaeg", seller: "Müüja", buyer: "Ostja", reg: "Reg-kood", vat: "KMKR",
        item: "Kirjeldus", qty: "Kogus", unit: "Hind", sum: "Summa", hrs: "h", net: "Summa km-ta", vatLine: "Käibemaks", total: "Tasumisele kuulub",
        pay: "Maksmise andmed", ref: "Selgitus", bank: "Pank",
        desc: `ORO Studio rent, ${o.date.split("-").reverse().join(".")} ${pad_(o.startHour)}:00–${pad_(o.startHour + o.hours)}:00 (${o.type})`,
        cancel: `Broneering kinnitatakse pärast tasumist. Tühistamisel tagastame makse, välja arvatud €${CONFIG.PREPAYMENT_EUR}.` };
  const eur = (n) => "€" + n.toFixed(2);
  const total = o.price;
  const net = I.VAT_RATE ? total / (1 + I.VAT_RATE) : total;
  const logo = logoDataUri_();
  const cell = `padding:8px 6px;border-bottom:1px solid ${B.ivoryDeep};font-size:11px;`;
  const kv = (k, v) => (v ? `<tr><td style="padding:2px 12px 2px 0;color:${B.inkSoft};">${esc_(k)}</td><td style="padding:2px 0;">${esc_(v)}</td></tr>` : "");
  return `<html><head><meta charset="utf-8"></head><body style="margin:0;font-family:Arial,sans-serif;color:${B.ink};font-size:11px;">
<div style="padding:36px 44px;">
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td valign="top">${logo ? `<img src="${logo}" width="84" height="84">` : `<span style="font-family:Georgia,serif;font-size:30px;color:${B.gold};">ORO</span> <span style="font-family:Georgia,serif;color:${B.gold};">studio</span>`}</td>
<td valign="top" align="right"><div style="font-family:Georgia,serif;font-size:28px;color:${B.oliveDark};">${L.title}</div>
<table cellpadding="0" cellspacing="0" style="margin-top:6px;font-size:11px;">${kv(L.no, inv.number)}${kv(L.date, inv.dateText)}${kv(L.due, inv.dueText)}</table></td>
</tr></table>
<div style="height:1px;background:${B.gold};margin:22px 0;"></div>
<table width="100%" cellpadding="0" cellspacing="0"><tr>
<td valign="top" width="50%" style="font-size:11px;line-height:1.6;"><div style="font-size:9px;letter-spacing:1px;color:${B.olive};text-transform:uppercase;margin-bottom:6px;">${L.seller}</div>
<b>${esc_(I.SELLER_NAME)}</b><br>${esc_(I.SELLER_ADDRESS)}<br>${L.reg}: ${esc_(I.REG_CODE)}${I.VAT_NO ? `<br>${L.vat}: ${esc_(I.VAT_NO)}` : ""}<br>${esc_(CONFIG.NOTIFY_EMAIL)} · ${esc_(CONFIG.PHONE_DISPLAY)}</td>
<td valign="top" width="50%" style="font-size:11px;line-height:1.6;"><div style="font-size:9px;letter-spacing:1px;color:${B.olive};text-transform:uppercase;margin-bottom:6px;">${L.buyer}</div>
<b>${esc_(o.name)}</b><br>${esc_(o.email)}</td>
</tr></table>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:26px;">
<tr style="background:${B.ivoryDeep};"><td style="${cell}color:${B.oliveDark};">${L.item}</td><td align="right" style="${cell}color:${B.oliveDark};">${L.qty}</td><td align="right" style="${cell}color:${B.oliveDark};">${L.unit}</td><td align="right" style="${cell}color:${B.oliveDark};">${L.sum}</td></tr>
<tr><td style="${cell}">${esc_(L.desc)}</td><td align="right" style="${cell}">${o.hours} ${L.hrs}</td><td align="right" style="${cell}">${eur(o.pricePerHour)}</td><td align="right" style="${cell}">${eur(total)}</td></tr>
</table>
<table cellpadding="0" cellspacing="0" align="right" style="margin-top:12px;font-size:11px;">
${I.VAT_RATE ? `<tr><td style="padding:3px 18px 3px 0;color:${B.inkSoft};">${L.net}</td><td align="right">${eur(net)}</td></tr><tr><td style="padding:3px 18px 3px 0;color:${B.inkSoft};">${L.vatLine} ${Math.round(I.VAT_RATE * 100)}%</td><td align="right">${eur(total - net)}</td></tr>` : ""}
<tr><td style="padding:8px 18px 0 0;font-family:Georgia,serif;font-size:15px;color:${B.oliveDark};">${L.total}</td><td align="right" style="padding-top:8px;font-size:15px;"><b>${eur(total)}</b></td></tr>
</table>
<div style="clear:both;"></div>
<div style="margin-top:30px;padding:14px 16px;background:${B.ivory};border-left:3px solid ${B.gold};">
<div style="font-family:Georgia,serif;font-size:14px;color:${B.oliveDark};margin-bottom:6px;">${L.pay}</div>
<table cellpadding="0" cellspacing="0" style="font-size:11px;">${kv("IBAN", I.IBAN)}${kv(L.bank, I.BANK)}${kv(L.ref, inv.number)}${kv(L.due, inv.dueText)}</table>
</div>
<p style="margin-top:18px;color:${B.inkSoft};">${esc_(L.cancel)}</p>
</div></body></html>`;
}

/** Ручная проверка: создаёт тестовый PDF-счёт на Диске (не отправляет и не увеличивает номер). */
function testInvoice() {
  const o = { name: "Test Client", email: "test@example.com", type: "Групповое мероприятие", date: "2026-12-01", startHour: 14, hours: 3, guests: 6, price: 90, pricePerHour: 30, start: new Date() };
  const html = invoiceHtml_("ru", o, { number: "TEST-001", dateText: "01.12.2026", dueText: "01.12.2026" });
  const file = DriveApp.createFile(Utilities.newBlob(html, "text/html", "t.html").getAs("application/pdf").setName("TEST-001.pdf"));
  Logger.log(file.getUrl());
}

function pricePerHour_(guests) {
  return guests <= 2 ? 20 : guests <= 10 ? 30 : 40;
}

function rateOk_() {
  const cache = CacheService.getScriptCache();
  const key = "bookings_" + Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyyMMddHH");
  const n = Number(cache.get(key) || 0);
  if (n >= CONFIG.MAX_BOOKINGS_PER_HOUR) return false;
  cache.put(key, String(n + 1), 3700);
  return true;
}

function isDate_(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(s || ""));
}
function isEmail_(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || ""));
}
function clean_(s, max) {
  return String(s == null ? "" : s).replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, max);
}
function pad_(n) {
  return String(n).padStart(2, "0");
}
function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Запустите вручную один раз из редактора, чтобы выдать доступы и проверить связь. */
function testSetup() {
  const today = Utilities.formatDate(new Date(), CONFIG.TIMEZONE, "yyyy-MM-dd");
  Logger.log("Календарь: " + calendar_().getName());
  Logger.log(JSON.stringify(busy_(today, today)));
  MailApp.getRemainingDailyQuota();
}
