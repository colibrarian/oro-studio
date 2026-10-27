/**
 * ORO Studio — связка сайта с Google Календарём.
 *
 * Разворачивается в аккаунте events@orostudiotallinn.com как веб-приложение
 * (см. README.md рядом). Делает две вещи:
 *   GET  ?action=busy&from=YYYY-MM-DD&to=YYYY-MM-DD
 *        → какие часы заняты (по событиям календаря). Названия событий наружу не отдаются.
 *   POST {date, start, hours, type, guests, name, contact, comment, lang, price}
 *        → ещё раз проверяет, что время свободно, ставит событие «Заявка» в календарь
 *          и отправляет письмо на NOTIFY_EMAIL.
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

  const events = calendar_().getEvents(start, end);
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
  const contact = clean_(b.contact, 120);
  const comment = clean_(b.comment, 1000);
  const type = clean_(b.type, 80);
  const guests = Math.min(15, Math.max(1, Number(b.guests) || 1));
  const lang = b.lang === "ru" ? "ru" : "et";

  if (!isDate_(date) || !Number.isInteger(startHour) || !Number.isInteger(hours)) return { ok: false, error: "bad_request" };
  if (hours < 1 || hours > CONFIG.MAX_HOURS) return { ok: false, error: "bad_request" };
  if (startHour < CONFIG.OPEN_HOUR || startHour + hours > CONFIG.CLOSE_HOUR) return { ok: false, error: "bad_request" };
  if (!name || !contact) return { ok: false, error: "bad_request" };

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
    if (cal.getEvents(start, end).some((ev) => overlaps_(ev, start, end))) return { ok: false, error: "busy" };

    const price = pricePerHour_(guests) * hours;
    const title = `Заявка: ${name} · ${type} · ${guests} чел.`;
    const details = [
      `Формат: ${type}`,
      `Дата: ${date}, ${pad_(startHour)}:00–${pad_(startHour + hours)}:00 (${hours} ч)`,
      `Гостей: ${guests}`,
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      comment ? `Комментарий: ${comment}` : "",
      `Аренда по калькулятору: €${price}`,
      `Язык сайта: ${lang === "ru" ? "русский" : "эстонский"}`,
      "",
      "Заявка с сайта, ещё НЕ подтверждена. Если бронь не состоится, просто удалите это событие: время снова станет свободным на сайте.",
    ]
      .filter((line) => line !== "")
      .join("\n");

    const ev = cal.createEvent(title, start, end, { description: details });
    try {
      ev.setColor(CONFIG.EVENT_COLOR);
    } catch (e) {}

    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: `Новая заявка ORO Studio: ${date} ${pad_(startHour)}:00, ${name}`,
      body: details + `\n\nСобытие в календаре: ${title}`,
      name: "ORO Studio сайт",
    });
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

function overlaps_(ev, s, f) {
  // Отклонённые приглашения не блокируют время.
  try {
    if (ev.getMyStatus && ev.getMyStatus() === CalendarApp.GuestStatus.NO) return false;
  } catch (e) {}
  return ev.getStartTime() < f && ev.getEndTime() > s;
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
