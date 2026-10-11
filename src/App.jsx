import React, { useState, useMemo, useEffect } from "react";
import {
  Instagram,
  Facebook,
  Send,
  Phone,
  MapPin,
  Clock,
  Coffee,
  Wifi,
  Tv,
  Refrigerator,
  Sparkles,
  Users,
  Mail,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Camera,
  Gift,
  Cake,
  Heart,
  Briefcase,
  Image as ImageIcon,
} from "lucide-react";

// Always resolves to the correct absolute path regardless of the deployed
// subpath (e.g. GitHub Pages project sites) or whether the URL has a
// trailing slash — avoids relative-path 404s.
const asset = (path) => `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/").replace(":/", "://");

/* ---------------------------------------------------------
   CONTACTS — single source of truth
--------------------------------------------------------- */
const PHONE_DISPLAY = "+372 5336 3795";
const PHONE_RAW = "37253363795";
const EMAIL = "events@orostudiotallinn.com";
const whatsapp = (text) => `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(text)}`;
const WA_FORMAT = whatsapp("Здравствуйте! Помогите, пожалуйста, подобрать формат мероприятия в ORO Studio.");
const WA_TURNKEY = whatsapp("Здравствуйте! Хочу узнать стоимость мероприятия под ключ в ORO Studio.");
const WA_REGULAR = whatsapp("Здравствуйте! Хочу проводить регулярные мероприятия в ORO Studio.");

/* ---------------------------------------------------------
   TOKENS
--------------------------------------------------------- */
const COLORS = {
  ivory: "#F7F3EC",
  ivoryDeep: "#EDE6D6",
  ivoryCard: "#FBF8F2",
  olive: "#6F7A56",
  oliveDark: "#4F5A3D",
  oliveSoft: "#8B9670",
  gold: "#B08A45",
  goldLight: "#D8BE8A",
  ink: "#3A3428",
  inkSoft: "#6B6250",
};

const SANS = "'Montserrat', sans-serif";
const SERIF = "'Cormorant Garamond', serif";

/* ---------------------------------------------------------
   FLOWER OF LIFE — signature ornament, echoes the real ORO mark
--------------------------------------------------------- */
function FlowerOfLife({ size = 300, opacity = 1, color = COLORS.gold, strokeWidth = 1 }) {
  const r = size / 6.2;
  const cx = size / 2;
  const cy = size / 2;
  const centers = [[0, 0]];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    centers.push([r * Math.cos(a), r * Math.sin(a)]);
  }
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    centers.push([2 * r * Math.cos(a), 2 * r * Math.sin(a)]);
  }
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    centers.push([2 * r * Math.cos(Math.PI / 6) * Math.cos(a - Math.PI / 6), 2 * r * Math.cos(Math.PI / 6) * Math.sin(a - Math.PI / 6)]);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }} aria-hidden="true">
      <circle cx={cx} cy={cy} r={size * 0.47} fill="none" stroke={color} strokeWidth={strokeWidth} />
      {centers.map(([x, y], i) => (
        <circle key={i} cx={cx + x} cy={cy + y} r={r} fill="none" stroke={color} strokeWidth={strokeWidth} />
      ))}
    </svg>
  );
}

/* ---------------------------------------------------------
   LOGO — single source of truth so header/footer never diverge
--------------------------------------------------------- */
function Logo({ size = 26, oroColor = COLORS.gold, studioColor = COLORS.oliveDark }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", gap: 8 }}>
      <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: size, color: oroColor, letterSpacing: "0.08em" }}>ORO</span>
      <span style={{ fontFamily: SERIF, fontWeight: 400, fontSize: size * 0.72, color: studioColor }}>studio</span>
    </span>
  );
}

/* ---------------------------------------------------------
   SMALL UI HELPERS
--------------------------------------------------------- */
function Eyebrow({ children, light }) {
  return (
    <div
      style={{
        fontFamily: SANS,
        fontSize: 12,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: light ? COLORS.goldLight : COLORS.gold,
        fontWeight: 500,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, light }) {
  return (
    <h2
      style={{
        fontFamily: SERIF,
        fontWeight: 500,
        fontSize: "clamp(30px, 4vw, 46px)",
        color: light ? COLORS.ivoryCard : COLORS.ink,
        margin: 0,
        lineHeight: 1.15,
      }}
    >
      {children}
    </h2>
  );
}

function Divider({ color = COLORS.gold, width = 64 }) {
  return <div style={{ width, height: 1, background: color, opacity: 0.6, margin: "18px 0" }} />;
}

function Lead({ children, light, style = {} }) {
  return (
    <p
      style={{
        fontFamily: SANS,
        fontSize: 15.5,
        lineHeight: 1.85,
        color: light ? "rgba(251,248,242,0.82)" : COLORS.inkSoft,
        fontWeight: 300,
        margin: "0 0 14px",
        maxWidth: 720,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function Button({ href, children, variant = "primary", light, external }) {
  const base = {
    fontFamily: SANS,
    fontSize: 14,
    padding: "15px 30px",
    borderRadius: 30,
    textDecoration: "none",
    display: "inline-block",
  };
  const styles = {
    primary: {
      ...base,
      color: COLORS.ivoryCard,
      background: light ? COLORS.gold : COLORS.oliveDark,
      boxShadow: "0 14px 30px -10px rgba(79,90,61,0.55)",
    },
    secondary: {
      ...base,
      color: light ? COLORS.ivoryCard : COLORS.ink,
      border: `1px solid ${light ? "rgba(251,248,242,0.5)" : COLORS.oliveSoft}`,
    },
  };
  return (
    <a
      href={href}
      className={`oro-btn oro-btn-${variant}${light ? " oro-btn-light" : ""}`}
      style={styles[variant]}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

function SwipeHint() {
  return (
    <p className="oro-swipe-hint" style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.08em", color: COLORS.oliveSoft, margin: "0 0 10px" }}>
      Листайте →
    </p>
  );
}

function PhotoPlaceholder({ label = "Фото появится здесь", height = 260, ratio, style = {} }) {
  return (
    <div
      style={{
        height: ratio ? undefined : height,
        aspectRatio: ratio || undefined,
        borderRadius: 18,
        border: `1px dashed ${COLORS.oliveSoft}`,
        background:
          "repeating-linear-gradient(135deg, rgba(111,122,86,0.05) 0px, rgba(111,122,86,0.05) 10px, transparent 10px, transparent 20px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        color: COLORS.oliveSoft,
        textAlign: "center",
        padding: 12,
        ...style,
      }}
    >
      <ImageIcon size={26} strokeWidth={1.3} />
      <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.05em" }}>{label}</span>
    </div>
  );
}

// Real photo with graceful fallback to the placeholder above if the file
// isn't present yet (e.g. before /images/... is added to the repo's public folder).
// Pass `ratio` (e.g. "4 / 5") for a fixed-aspect crop instead of a fixed pixel height.
function Photo({ src, alt, label, height = 260, ratio, eager = false, style = {} }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <PhotoPlaceholder label={label} height={height} ratio={ratio} style={style} />;
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      style={{
        width: "100%",
        height: ratio ? undefined : height,
        aspectRatio: ratio || undefined,
        objectFit: "cover",
        borderRadius: 18,
        boxShadow: "0 16px 34px -16px rgba(58,52,40,0.35)",
        display: "block",
        ...style,
      }}
    />
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      className="oro-card"
      style={{
        background: COLORS.ivoryCard,
        borderRadius: 20,
        padding: "30px 28px",
        boxShadow: "0 10px 30px -14px rgba(58,52,40,0.18)",
        border: "1px solid rgba(111,122,86,0.12)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children, color = COLORS.olive, size = 24 }) {
  return <h3 style={{ fontFamily: SERIF, fontSize: size, fontWeight: 500, color, margin: "0 0 14px", lineHeight: 1.2 }}>{children}</h3>;
}

function BulletList({ items, light }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 11 }}>
      {items.map((item) => (
        <li
          key={item}
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 12,
            fontFamily: SANS,
            fontSize: 14.5,
            lineHeight: 1.5,
            fontWeight: 300,
            color: light ? COLORS.ivoryCard : COLORS.ink,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: light ? COLORS.goldLight : COLORS.gold,
              flex: "0 0 auto",
              transform: "translateY(-2px)",
            }}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Section({ id, bg = COLORS.ivory, children, ornament, padding = "100px 28px", maxWidth = 1180 }) {
  return (
    <section id={id} style={{ padding, background: bg, position: "relative", overflow: "hidden" }}>
      {ornament}
      <div style={{ maxWidth, margin: "0 auto", position: "relative" }}>{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------
   NAV
--------------------------------------------------------- */
function Nav() {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["О студии", "#about"],
    ["Форматы", "#formats"],
    ["Под ключ", "#turnkey"],
    ["Галерея", "#gallery"],
    ["Цены", "#pricing"],
    ["Календарь", "#booking"],
  ];

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: solid || open ? "rgba(247,243,236,0.95)" : "transparent",
        backdropFilter: solid ? "blur(10px)" : "none",
        borderBottom: solid ? "1px solid rgba(111,122,86,0.14)" : "1px solid transparent",
        transition: "all .35s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "16px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a href="#top" aria-label="ORO Studio — наверх" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Logo size={26} />
        </a>

        <nav style={{ display: "flex", gap: 30 }} className="oro-nav-links">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="oro-nav-link"
              style={{ fontFamily: SANS, fontSize: 13, letterSpacing: "0.04em", color: COLORS.ink, textDecoration: "none" }}
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#booking"
          className="oro-nav-cta oro-btn oro-btn-primary"
          style={{
            fontFamily: SANS,
            fontSize: 13,
            color: COLORS.ivoryCard,
            background: COLORS.oliveDark,
            padding: "10px 22px",
            borderRadius: 30,
            textDecoration: "none",
            letterSpacing: "0.03em",
          }}
        >
          Забронировать
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="oro-burger"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          style={{ display: "none", background: "none", border: "none", color: COLORS.ink, cursor: "pointer" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="oro-mobile-menu" style={{ background: COLORS.ivory, padding: "10px 28px 24px", display: "none" }}>
          {[...links, ["Забронировать", "#booking"]].map(([label, href], i) => (
            <a
              key={label + i}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "12px 0",
                fontFamily: SANS,
                fontSize: 15,
                color: COLORS.ink,
                textDecoration: "none",
                borderBottom: "1px solid rgba(111,122,86,0.14)",
              }}
            >
              {label}
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 920px) {
          .oro-nav-links, .oro-nav-cta { display: none !important; }
          .oro-burger { display: block !important; }
          .oro-mobile-menu { display: block !important; }
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------
   HERO
--------------------------------------------------------- */
function Hero() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "70px 28px 90px",
        background: `radial-gradient(ellipse at top right, ${COLORS.ivoryDeep} 0%, ${COLORS.ivory} 60%)`,
      }}
    >
      <div style={{ position: "absolute", top: -60, right: -60, pointerEvents: "none" }}>
        <FlowerOfLife size={420} opacity={0.14} />
      </div>

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 60,
          alignItems: "center",
          position: "relative",
        }}
        className="oro-hero-grid"
      >
        <div>
          <Eyebrow>В самом сердце Таллинна</Eyebrow>
          <h1
            style={{
              fontFamily: SERIF,
              fontWeight: 500,
              fontSize: "clamp(42px, 6vw, 72px)",
              lineHeight: 1.06,
              color: COLORS.ink,
              margin: "0 0 22px",
            }}
          >
            Пространство, где <span style={{ color: COLORS.olive, fontStyle: "italic" }}>хочется встречаться</span>
          </h1>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 16,
              lineHeight: 1.7,
              color: COLORS.inkSoft,
              maxWidth: 480,
              margin: "0 0 34px",
              fontWeight: 300,
            }}
          >
            Камерная студия для встреч, мастер-классов, дней рождения и девичников. Аренда пространства
            или мероприятие под ключ — до 15 человек.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Button href="#booking">Забронировать студию</Button>
            <Button href="#booking" variant="secondary">
              Посмотреть календарь
            </Button>
          </div>
        </div>

        <Photo
          src={asset("images/hero-consulting.jpg")}
          alt="Гостиная зона ORO Studio"
          label="Фото студии — гостиная зона"
          height={420}
          eager
        />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   ABOUT — история Наталии
--------------------------------------------------------- */
function About() {
  return (
    <Section id="about">
      <div
        style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 60, alignItems: "center" }}
        className="oro-about-grid"
      >
        <Photo src={asset("images/natalia.jpg")} alt="Наталия, создатель ORO Studio" label="Фото Наталии" ratio="4 / 5" />
        <div>
          <Eyebrow>О студии</Eyebrow>
          <SectionTitle>Меня зовут Наталия, я создатель ORO Studio</SectionTitle>
          <Divider />
          <Lead>
            Я всегда любила объединять людей, знакомиться с новым и создавать вокруг себя пространство, в котором
            интересно быть. Так появилось ORO.
          </Lead>
          <Lead>
            Мне хотелось создать не просто красивую студию на несколько часов, а живое место для людей и их идей.
            Сюда можно прийти на женскую встречу, познакомиться с интересным экспертом, провести свой мастер-класс —
            или собрать близких и красиво отметить день рождения или девичник.
          </Lead>
          <Lead>
            Сегодня здесь знакомятся с эфирными маслами и минералами, завтра играют в трансформационную игру, рисуют,
            говорят о финансах или астрологии, а через несколько дней пространство полностью меняется под чьё-то
            личное событие.
          </Lead>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 24, lineHeight: 1.35, color: COLORS.olive, margin: "26px 0 0" }}>
            «ORO каждый раз немного разная. Потому что её наполняют люди.»
          </p>
          <p style={{ fontFamily: SANS, fontSize: 14.5, color: COLORS.ink, fontWeight: 500, margin: "22px 0 0" }}>
            Здесь уже есть пространство и атмосфера. А вы приходите со своей идеей.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------
   FORMATS — что можно провести
--------------------------------------------------------- */
function Formats() {
  const experts = [
    "Консультации и индивидуальная работа",
    "Психологические и коучинговые встречи",
    "Мастер-классы и творческие занятия",
    "Лекции и небольшие обучения",
    "Женские встречи и регулярные группы",
    "Трансформационные игры",
    "Фото- и видеосъёмки",
  ];
  const privateEvents = ["Дни рождения", "Девичники", "Встречи подруг", "Тематические вечера", "Творческие праздники"];

  return (
    <Section
      id="formats"
      bg={COLORS.olive}
      ornament={
        <div style={{ position: "absolute", bottom: -80, left: -80, pointerEvents: "none" }}>
          <FlowerOfLife size={360} opacity={0.12} color={COLORS.ivoryCard} />
        </div>
      }
    >
      <Eyebrow light>Форматы</Eyebrow>
      <SectionTitle light>Здесь можно провести своё мероприятие</SectionTitle>
      <Divider color={COLORS.ivoryCard} />
      <Lead light>
        ORO Studio подходит для небольших камерных событий — комфортно до 15 человек. Можно просто арендовать
        пространство или выбрать мероприятие под ключ.
      </Lead>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 36 }} className="oro-two-col">
        {[
          { icon: Briefcase, title: "Для экспертов", items: experts },
          { icon: Heart, title: "Для частных событий", items: privateEvents },
        ].map(({ icon: Icon, title, items }) => (
          <div
            key={title}
            style={{
              background: "rgba(251,248,242,0.08)",
              border: "1px solid rgba(251,248,242,0.25)",
              borderRadius: 20,
              padding: "28px 28px 30px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <Icon size={20} color={COLORS.goldLight} strokeWidth={1.5} />
              <CardTitle color={COLORS.ivoryCard} size={26}>
                {title}
              </CardTitle>
            </div>
            <BulletList items={items} light />
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------
   WHY ORO
--------------------------------------------------------- */
function Why() {
  const items = [
    {
      icon: MapPin,
      title: "В самом сердце города",
      text: "Не нужно ехать далеко ради красивого мероприятия — гостям удобно добираться.",
    },
    {
      icon: Users,
      title: "Камерный формат",
      text: "Люди здесь действительно общаются, а не теряются в огромном зале. До 15 человек — комфортно.",
    },
    {
      icon: Camera,
      title: "Красивые фотозоны",
      text: "Готовые зоны для общих фото, контента и кадров, которые захочется сохранить.",
    },
    {
      icon: Coffee,
      title: "Всё для атмосферы",
      text: "Кофе, чай, молоко и лёгкие угощения — мелочи, которые превращают встречу в приятный вечер.",
    },
  ];
  return (
    <Section id="why">
      <Eyebrow>Почему ORO Studio</Eyebrow>
      <SectionTitle>Уютное пространство, где не нужно начинать с пустой комнаты</SectionTitle>
      <Divider />
      <div
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginTop: 40 }}
        className="oro-four-col"
      >
        {items.map(({ icon: Icon, title, text }) => (
          <Card key={title} style={{ padding: "28px 24px" }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: COLORS.ivoryDeep,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <Icon size={20} color={COLORS.gold} strokeWidth={1.5} />
            </div>
            <CardTitle size={22}>{title}</CardTitle>
            <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.7, color: COLORS.inkSoft, fontWeight: 300, margin: 0 }}>{text}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------
   TURNKEY — мероприятия под ключ + программы
--------------------------------------------------------- */
const PROGRAMS = [
  {
    slug: "perfume",
    title: "Создание собственного парфюма",
    text: "Каждая участница знакомится с ароматами и собирает свою композицию из эфирных масел. На память остаётся свой аромат.",
  },
  {
    slug: "perfume-lecture",
    title: "Парфюмерная лекция",
    text: "Бренды и интересные ароматы, разбор нот и впечатлений. Понравившийся парфюм можно купить прямо на месте.",
  },
  {
    slug: "candles",
    title: "Программные свечи",
    text: "Выбираете тему, с которой хочется работать, и создаёте свечу-ритуал — символ вашего намерения.",
  },
  {
    slug: "astrology",
    title: "Астрологический вечер",
    text: "Ваш астрологический портрет. Тему выбираете заранее: отношения, предназначение, деньги, сильные стороны, важный период или своя.",
  },
  {
    slug: "numerology",
    title: "Нумерология",
    text: "Взгляд на себя и свою жизнь через числа. Тему программы подбираем под вашу компанию.",
  },
  {
    slug: "minerals",
    title: "Минералы и браслеты",
    text: "Знакомимся с минералами, выбираем подходящие камни и создаём свой браслет — памятный подарок каждой участнице.",
  },
  {
    slug: "game",
    title: "Трансформационная игра «Куда приводят мечты»",
    text: "Когда хочется чего-то большего, чем развлечения: взглянуть на свои желания и цели под другим углом — смеясь и размышляя.",
  },
];

function Turnkey() {
  const timeline = [
    { hours: "2 часа", text: "Выбранная программа с экспертом" },
    { hours: "2 часа", text: "Время только для вашей компании: общение, фото, просекко, подарки и еда — никто не торопит" },
  ];
  return (
    <Section id="turnkey" bg={COLORS.ivoryDeep}>
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 50, alignItems: "start" }} className="oro-two-col">
        <div>
          <Eyebrow>Мероприятия под ключ</Eyebrow>
          <SectionTitle>А если вы хотите не просто помещение?</SectionTitle>
          <Divider />
          <Lead>
            Хочется устроить день рождения или девичник, но не хочется самой искать программу, эксперта и еду и
            продумывать каждую мелочь? Доверьте организацию нам.
          </Lead>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "22px 0 30px" }}>
            {["От 5 человек", "Бутылочка просекко в подарок", "Готовые фотозоны"].map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: SANS,
                  fontSize: 12.5,
                  color: COLORS.oliveDark,
                  background: COLORS.ivoryCard,
                  border: "1px solid rgba(111,122,86,0.2)",
                  padding: "8px 14px",
                  borderRadius: 20,
                }}
              >
                {t}
              </span>
            ))}
          </div>
          <Button href={WA_TURNKEY} external>
            Узнать стоимость
          </Button>
          <p style={{ fontFamily: SANS, fontSize: 12.5, color: COLORS.inkSoft, fontWeight: 300, margin: "14px 0 0" }}>
            Стоимость зависит от формата и количества гостей.
          </p>
        </div>

        <Card>
          <CardTitle>Вы получаете студию на 4 часа</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 8 }}>
            {timeline.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    flex: "0 0 auto",
                    minWidth: 74,
                    textAlign: "center",
                    fontFamily: SERIF,
                    fontSize: 20,
                    fontWeight: 600,
                    color: i === 0 ? COLORS.ivoryCard : COLORS.oliveDark,
                    background: i === 0 ? COLORS.olive : COLORS.ivoryDeep,
                    borderRadius: 12,
                    padding: "8px 10px",
                  }}
                >
                  {t.hours}
                </div>
                <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.65, color: COLORS.ink, fontWeight: 300, margin: "6px 0 0" }}>
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Programs */}
      <div style={{ marginTop: 80 }}>
        <Eyebrow>Выберите программу</Eyebrow>
        <SectionTitle>Программы для вашего праздника</SectionTitle>
        <Divider />
        <div style={{ marginTop: 28 }}>
          <SwipeHint />
        </div>
        <div
          className="oro-swipe oro-programs"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, marginTop: 8 }}
        >
          {PROGRAMS.map((p, i) => (
            <Card key={p.slug} style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <Photo
                src={asset(`images/program-${p.slug}.jpg`)}
                alt={p.title}
                label={`Фото: ${p.title.toLowerCase()}`}
                ratio="4 / 5"
                style={{ borderRadius: 0, boxShadow: "none", border: "none" }}
              />
              <div style={{ padding: "22px 24px 26px" }}>
                <div style={{ fontFamily: SANS, fontSize: 11, letterSpacing: "0.2em", color: COLORS.gold, marginBottom: 8 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <CardTitle size={22} color={COLORS.ink}>
                  {p.title}
                </CardTitle>
                <p style={{ fontFamily: SANS, fontSize: 13.5, lineHeight: 1.7, color: COLORS.inkSoft, fontWeight: 300, margin: 0 }}>
                  {p.text}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div style={{ marginTop: 50, display: "grid", gridTemplateColumns: "1fr 1fr 1.3fr", gap: 20 }} className="oro-addons">
        <Card style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <Coffee size={22} color={COLORS.gold} strokeWidth={1.5} style={{ flex: "0 0 auto", marginTop: 4 }} />
          <div>
            <CardTitle size={21}>Кейтеринг</CardTitle>
            <p style={{ fontFamily: SANS, fontSize: 13.5, color: COLORS.inkSoft, fontWeight: 300, margin: 0 }}>
              Поможем организовать еду и угощения для вашей компании.
            </p>
          </div>
        </Card>
        <Card style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <Cake size={22} color={COLORS.gold} strokeWidth={1.5} style={{ flex: "0 0 auto", marginTop: 4 }} />
          <div>
            <CardTitle size={21}>Торт</CardTitle>
            <p style={{ fontFamily: SANS, fontSize: 13.5, color: COLORS.inkSoft, fontWeight: 300, margin: 0 }}>Можно заказать отдельно.</p>
          </div>
        </Card>
        <div style={{ alignSelf: "center", padding: "0 6px" }}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 21, color: COLORS.olive, margin: "0 0 6px", lineHeight: 1.35 }}>
            Можно добавить к празднику, чтобы не организовывать всё самостоятельно.
          </p>
          <p style={{ fontFamily: SANS, fontSize: 12.5, color: COLORS.inkSoft, fontWeight: 300, margin: 0 }}>
            Дополнительные услуги оплачиваются отдельно.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------
   OCCASIONS — день рождения, девичник, эксперты
--------------------------------------------------------- */
function Occasions() {
  const items = [
    {
      icon: Gift,
      eyebrow: "День рождения",
      title: "Праздник, который подходит именно вам",
      text: "Не обязательно выбирать между рестораном и домашними посиделками. Соберите своих людей в красивом пространстве и добавьте программу — или просто красивый вечер с едой, тортом и фотографиями. Выбираете вы, мы помогаем всё собрать.",
      cta: ["Выбрать дату", "#booking"],
    },
    {
      icon: Sparkles,
      eyebrow: "Девичник",
      title: "Соберите своих девочек и сделайте вечер особенным",
      text: "Можно прийти просто пообщаться. А можно создать свой аромат, сделать свечи или браслеты, узнать астрологический портрет или сыграть в трансформационную игру. От 5 человек.",
      cta: ["Выбрать дату", "#booking"],
    },
    {
      icon: Briefcase,
      eyebrow: "Для экспертов",
      title: "Красивое пространство для вашей встречи",
      text: "Консультант, психолог, коуч, преподаватель, ведущий игры или мастер — проводите здесь консультации, группы, лекции и мастер-классы. Не нужно каждый раз искать новое помещение.",
      cta: ["Обсудить регулярные встречи", WA_REGULAR, true],
    },
  ];
  return (
    <Section id="occasions">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="oro-three-col">
        {items.map(({ icon: Icon, eyebrow, title, text, cta }) => (
          <Card key={eyebrow} style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Icon size={18} color={COLORS.gold} strokeWidth={1.5} />
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
            <CardTitle size={25} color={COLORS.ink}>
              {title}
            </CardTitle>
            <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: COLORS.inkSoft, fontWeight: 300, margin: "0 0 22px", flex: 1 }}>
              {text}
            </p>
            <a
              href={cta[1]}
              className="oro-link"
              {...(cta[2] ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              style={{ fontFamily: SANS, fontSize: 13.5, color: COLORS.oliveDark, fontWeight: 500, textDecoration: "none" }}
            >
              {cta[0]} <span className="oro-arrow">→</span>
            </a>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------
   GALLERY
--------------------------------------------------------- */
function Lightbox({ photos, index, onClose, onNav }) {
  const touchX = React.useRef(null);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onNav]);

  const p = photos[index];
  const navBtn = (side) => ({
    position: "absolute",
    top: "50%",
    [side]: 14,
    transform: "translateY(-50%)",
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "1px solid rgba(251,248,242,0.35)",
    background: "rgba(58,52,40,0.45)",
    color: COLORS.ivoryCard,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={p.alt}
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (Math.abs(dx) > 50) onNav(dx < 0 ? 1 : -1);
        touchX.current = null;
      }}
      className="oro-lightbox"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(30,27,21,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 16px",
      }}
    >
      <img
        src={p.src}
        alt={p.alt}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)" }}
      />
      <button aria-label="Закрыть" className="oro-icon-btn" onClick={onClose} style={{ ...navBtn("right"), top: 30, transform: "none" }}>
        <X size={20} />
      </button>
      <button
        aria-label="Предыдущее фото"
        className="oro-icon-btn"
        onClick={(e) => {
          e.stopPropagation();
          onNav(-1);
        }}
        style={navBtn("left")}
      >
        <ChevronLeft size={22} />
      </button>
      <button
        aria-label="Следующее фото"
        className="oro-icon-btn"
        onClick={(e) => {
          e.stopPropagation();
          onNav(1);
        }}
        style={navBtn("right")}
      >
        <ChevronRight size={22} />
      </button>
      <p
        style={{
          position: "absolute",
          bottom: 18,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: SANS,
          fontSize: 13,
          color: "rgba(251,248,242,0.75)",
          margin: 0,
        }}
      >
        {p.label} · {index + 1} / {photos.length}
      </p>
    </div>
  );
}

function Gallery() {
  const [open, setOpen] = useState(null);
  const photos = [
    { src: asset("images/gallery-birthday-group.jpg"), label: "Праздник в студии", alt: "Праздник в ORO Studio" },
    { src: asset("images/gallery-meditation-circle.jpg"), label: "Медитативный круг", alt: "Групповая встреча" },
    { src: asset("images/gallery-workshop-scrub.jpg"), label: "Мастер-класс", alt: "Мастер-класс в студии" },
    { src: asset("images/gallery-macarons.jpg"), label: "Праздничные детали", alt: "Праздничный десерт" },
    { src: asset("images/gallery-birthday-toast.jpg"), label: "Тёплые встречи", alt: "Гости студии" },
    { src: asset("images/gallery-workshop-wide.jpg"), label: "Пространство для практик", alt: "Практика в студии" },
    { src: asset("images/gallery-meditation-alt.jpg"), label: "Момент тишины", alt: "Встреча в студии" },
    { src: asset("images/gallery-birthday-portrait.jpg"), label: "Атмосфера ORO", alt: "Гостья студии" },
    { src: asset("images/gallery-workshop-alt.jpg"), label: "Творческий процесс", alt: "Мастер-класс" },
  ];
  // Deterministic "scattered" offsets/rotations per card — organic but stable between renders.
  const scatter = [
    { y: 0, r: -1.8 },
    { y: 34, r: 1.2 },
    { y: -14, r: -0.8 },
    { y: 18, r: 2 },
    { y: -6, r: -1.4 },
    { y: 30, r: 1.6 },
    { y: -20, r: -2.2 },
    { y: 10, r: 0.6 },
    { y: -12, r: -1 },
  ];
  const close = React.useCallback(() => setOpen(null), []);
  const nav = React.useCallback((d) => setOpen((i) => (i + d + photos.length) % photos.length), [photos.length]);

  return (
    <Section id="gallery" bg={COLORS.ivoryDeep} padding="100px 28px 120px">
      <Eyebrow>Галерея</Eyebrow>
      <SectionTitle>Посмотрите, как здесь бывает</SectionTitle>
      <Divider />
      <Lead>Живые люди. Настоящие встречи. Разные поводы. Одно пространство.</Lead>
      <div style={{ marginTop: 28 }}>
        <SwipeHint />
      </div>
      <div
        style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 34 }}
        className="oro-gallery-grid oro-swipe"
      >
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={`Открыть фото: ${p.label}`}
            className="oro-gallery-item"
            style={{
              "--gy": `${scatter[i % scatter.length].y}px`,
              "--gr": `${scatter[i % scatter.length].r}deg`,
              padding: 0,
              border: "none",
              background: "none",
              cursor: "zoom-in",
              display: "block",
              width: "100%",
            }}
          >
            <Photo src={p.src} alt={p.alt} label={p.label} ratio="4 / 5" />
          </button>
        ))}
      </div>
      {open !== null && <Lightbox photos={photos} index={open} onClose={close} onNav={nav} />}
      <style>{`
        .oro-gallery-item {
          transform: translateY(var(--gy)) rotate(var(--gr));
          transition: transform .4s ease;
        }
        @media (hover: hover) {
          .oro-gallery-item:hover {
            transform: translateY(calc(var(--gy) - 8px)) rotate(0deg) scale(1.03);
            z-index: 2;
            position: relative;
          }
        }
        @media (max-width: 860px) and (min-width: 641px) {
          .oro-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
        }
        @media (max-width: 640px) {
          .oro-gallery-item { transform: none !important; }
          .oro-gallery-grid > * { flex-basis: 62% !important; }
        }
      `}</style>
    </Section>
  );
}

/* ---------------------------------------------------------
   PRICING + ЧТО ВЫ ПОЛУЧАЕТЕ
--------------------------------------------------------- */
function Pricing() {
  const tiers = [
    { title: "Индивидуальная работа", sub: "1–2 человека", price: "20", note: "Консультации и встречи" },
    { title: "Групповые мероприятия", sub: "3–10 человек", price: "30", featured: true },
    { title: "Групповые мероприятия", sub: "11–15 человек", price: "40" },
  ];
  const included = [
    "Уютное готовое пространство и удобная мебель",
    "Красивые фотозоны",
    "Кофе, чай, молоко и лёгкие угощения",
    "Мероприятия до 15 человек",
    "Удобное расположение в самом сердце города",
  ];
  const equipment = [
    { icon: Wifi, text: "Хороший Wi-Fi" },
    { icon: Tv, text: "Телевизор с подключением ноутбука" },
    { icon: Sparkles, text: "Bluetooth-колонка JBL" },
    { icon: Coffee, text: "Кофемашина и капучинатор" },
    { icon: Refrigerator, text: "Мини-холодильник, кулер с горячей и холодной водой" },
    { icon: Users, text: "Обеденная группа и сервиз на 15 персон" },
    { icon: Sparkles, text: "Бокалы для вина и шампанского, канцелярия" },
  ];
  const floor = ["Духовой шкаф", "Посудомоечная машина", "Микроволновая печь"];

  return (
    <Section id="pricing">
      <Eyebrow>Аренда студии</Eyebrow>
      <SectionTitle>Прозрачная цена — без сюрпризов</SectionTitle>
      <Divider />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 40 }} className="oro-three-col">
        {tiers.map((t) => (
          <Card key={t.sub} style={t.featured ? { background: COLORS.oliveDark, border: "none" } : {}}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: t.featured ? COLORS.goldLight : COLORS.oliveSoft,
                margin: "0 0 6px",
              }}
            >
              {t.sub}
            </p>
            <h3 style={{ fontFamily: SERIF, fontSize: 24, color: t.featured ? COLORS.ivoryCard : COLORS.ink, margin: "0 0 18px", fontWeight: 500 }}>
              {t.title}
            </h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: SERIF, fontSize: 52, color: t.featured ? COLORS.goldLight : COLORS.olive, fontWeight: 600 }}>
                €{t.price}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: t.featured ? "rgba(251,248,242,0.7)" : COLORS.inkSoft }}>/ час</span>
            </div>
            {t.note && (
              <p style={{ fontFamily: SANS, fontSize: 13, color: COLORS.inkSoft, fontWeight: 300, margin: "8px 0 0" }}>{t.note}</p>
            )}
          </Card>
        ))}
      </div>

      <div
        style={{
          marginTop: 26,
          display: "flex",
          gap: 30,
          flexWrap: "wrap",
          alignItems: "center",
          fontFamily: SANS,
          fontSize: 13.5,
          color: COLORS.inkSoft,
          fontWeight: 300,
        }}
      >
        <span>✦ Сервис уборки (при необходимости) — €20, оплачивается отдельно</span>
        <span>
          ✦ Планируете регулярные мероприятия?{" "}
          <a href={WA_REGULAR} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.oliveDark, fontWeight: 500 }}>
            Напишите нам
          </a>{" "}
          — обсудим удобный вариант
        </span>
      </div>

      {/* Что вы получаете */}
      <div style={{ marginTop: 70, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="oro-two-col">
        <Card>
          <CardTitle>Что вы получаете в студии</CardTitle>
          <BulletList items={included} />
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20, color: COLORS.olive, margin: "24px 0 0", lineHeight: 1.4 }}>
            Вам не нужно начинать с пустой комнаты — просто приходите и создавайте своё мероприятие.
          </p>
        </Card>

        <Card>
          <details className="oro-details">
            <summary>
              <span style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: COLORS.olive }}>Подробнее об оснащении</span>
              <ChevronDown size={18} color={COLORS.oliveDark} className="oro-chevron" />
            </summary>
            <div style={{ display: "flex", flexDirection: "column", gap: 13, marginTop: 18 }}>
              {equipment.map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon size={17} color={COLORS.gold} strokeWidth={1.5} style={{ flex: "0 0 auto" }} />
                  <span style={{ fontFamily: SANS, fontSize: 14, color: COLORS.ink, fontWeight: 300 }}>{text}</span>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: SANS, fontSize: 13, color: COLORS.inkSoft, fontWeight: 300, margin: "22px 0 12px" }}>
              На этаже, по согласованию при бронировании:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {floor.map((t) => (
                <span
                  key={t}
                  style={{ fontFamily: SANS, fontSize: 12.5, color: COLORS.oliveDark, background: COLORS.ivoryDeep, padding: "8px 14px", borderRadius: 20 }}
                >
                  {t}
                </span>
              ))}
            </div>
          </details>
        </Card>
      </div>

      <div style={{ marginTop: 40 }}>
        <Button href="#booking">Посмотреть календарь</Button>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------
   BOOKING — демо-календарь (тестовая версия, заявки пока никуда не отправляются)
--------------------------------------------------------- */
const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const MONTH_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const STUDIO_CLOSE_HOUR = 20; // last booking must end by this hour
const DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8];
const EVENT_TYPES = [
  "Индивидуальная работа",
  "Групповое мероприятие",
  "Мастер-класс",
  "День рождения",
  "Девичник",
  "Трансформационная игра",
  "Другое",
];

const hoursWord = (n) => (n === 1 ? "час" : n < 5 ? "часа" : "часов");
const pricePerHourFor = (guests) => (guests <= 2 ? 20 : guests <= 10 ? 30 : 40);

function addHours(time, hours) {
  const [h, m] = time.split(":").map(Number);
  return `${String(h + hours).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function maxDurationFrom(time) {
  const [h] = time.split(":").map(Number);
  return Math.max(1, STUDIO_CLOSE_HOUR - h);
}

function buildCalendar(year, month) {
  const first = new Date(year, month, 1);
  const startDay = (first.getDay() + 6) % 7; // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

const EMPTY_FORM = { type: EVENT_TYPES[0], guests: 2, name: "", contact: "", comment: "" };

function Booking() {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isToday =
    selectedDay === today.getDate() && cursor.month === today.getMonth() && cursor.year === today.getFullYear();
  const slotPassed = (t) => isToday && Number(t.split(":")[0]) <= today.getHours();

  const maxDuration = selectedTime ? maxDurationFrom(selectedTime) : DURATIONS.length;
  const endTime = selectedTime ? addHours(selectedTime, duration) : null;
  const guests = Math.min(15, Math.max(1, Number(form.guests) || 1));
  const pricePerHour = pricePerHourFor(guests);
  const totalPrice = pricePerHour * duration;

  const cells = useMemo(() => buildCalendar(cursor.year, cursor.month), [cursor]);
  const atCurrentMonth = cursor.year === today.getFullYear() && cursor.month === today.getMonth();

  const isPast = (d) => {
    if (!d) return false;
    const date = new Date(cursor.year, cursor.month, d);
    const cmp = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < cmp;
  };

  const changeMonth = (delta) => {
    let m = cursor.month + delta;
    let y = cursor.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setCursor({ year: y, month: m });
    setSelectedDay(null);
    setSelectedTime(null);
    setDuration(1);
  };

  const canSubmit = selectedDay && selectedTime && form.name.trim() && form.contact.trim();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    // Тестовая версия: здесь позже будет реальная отправка заявки
    // (Google Calendar / email / WhatsApp).
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
    }, 900);
  };

  const dateLabel = selectedDay ? `${selectedDay} ${MONTH_GENITIVE[cursor.month]} ${cursor.year}` : null;

  const reset = () => {
    setConfirmed(false);
    setSelectedDay(null);
    setSelectedTime(null);
    setDuration(1);
    setForm(EMPTY_FORM);
  };

  if (confirmed) {
    return (
      <section id="booking" style={{ padding: "100px 28px", background: COLORS.olive }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <Card style={{ textAlign: "center", padding: "50px 40px" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: COLORS.ivoryDeep,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Check size={28} color={COLORS.olive} />
            </div>
            <h3 style={{ fontFamily: SERIF, fontSize: 28, color: COLORS.ink, margin: "0 0 10px", fontWeight: 500 }}>
              Спасибо, {form.name}! Заявка отправлена
            </h3>
            <p style={{ fontFamily: SANS, fontSize: 14, color: COLORS.inkSoft, lineHeight: 1.7, fontWeight: 300 }}>
              <strong style={{ color: COLORS.olive }}>
                {form.type} · {dateLabel}, {selectedTime}–{endTime}
              </strong>
              <br />
              {guests} {guests === 1 ? "гость" : guests < 5 ? "гостя" : "гостей"} · {duration} {hoursWord(duration)}
              <br />
              Мы свяжемся с вами ({form.contact}), чтобы подтвердить бронирование и прислать счёт.
            </p>
            <button
              onClick={reset}
              className="oro-btn oro-btn-secondary"
              style={{
                marginTop: 22,
                fontFamily: SANS,
                fontSize: 13,
                color: COLORS.oliveDark,
                background: "none",
                border: `1px solid ${COLORS.oliveSoft}`,
                borderRadius: 30,
                padding: "12px 26px",
                cursor: "pointer",
              }}
            >
              Отправить ещё одну заявку
            </button>
          </Card>
        </div>
      </section>
    );
  }

  const label = (text) => (
    <span style={{ fontFamily: SANS, fontSize: 12, color: COLORS.oliveSoft, display: "block", marginBottom: 6 }}>{text}</span>
  );

  return (
    <Section
      id="booking"
      bg={COLORS.olive}
      maxWidth={1040}
      ornament={
        <div style={{ position: "absolute", top: -100, right: -100, pointerEvents: "none" }}>
          <FlowerOfLife size={380} opacity={0.1} color={COLORS.ivoryCard} />
        </div>
      }
    >
      <Eyebrow light>Календарь</Eyebrow>
      <SectionTitle light>Выберите дату</SectionTitle>
      <Lead light style={{ marginTop: 12 }}>
        Посмотрите свободные даты, выберите время и расскажите немного о вашей встрече.
      </Lead>

      <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 24 }} className="oro-booking-grid">
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <button
              onClick={() => changeMonth(-1)}
              disabled={atCurrentMonth}
              aria-label="Предыдущий месяц"
              style={{ ...iconBtnStyle, opacity: atCurrentMonth ? 0.35 : 1, cursor: atCurrentMonth ? "default" : "pointer" }}
            >
              <ChevronLeft size={18} color={COLORS.oliveDark} />
            </button>
            <span style={{ fontFamily: SERIF, fontSize: 20, color: COLORS.ink }}>
              {MONTH_NAMES[cursor.month]} {cursor.year}
            </span>
            <button onClick={() => changeMonth(1)} aria-label="Следующий месяц" className="oro-icon-btn" style={iconBtnStyle}>
              <ChevronRight size={18} color={COLORS.oliveDark} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6 }}>
            {WEEKDAYS.map((w) => (
              <div key={w} style={{ textAlign: "center", fontFamily: SANS, fontSize: 11, color: COLORS.oliveSoft }}>
                {w}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
            {cells.map((d, i) => {
              const disabled = !d || isPast(d);
              const active = d === selectedDay;
              return (
                <button
                  key={i}
                  disabled={disabled}
                  className="oro-pick"
                  onClick={() => {
                    setSelectedDay(d);
                    setSelectedTime(null);
                    setDuration(1);
                  }}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 10,
                    border: "none",
                    background: active ? COLORS.oliveDark : d ? COLORS.ivoryDeep : "transparent",
                    color: active ? COLORS.ivoryCard : disabled ? "rgba(58,52,40,0.25)" : COLORS.ink,
                    fontFamily: SANS,
                    fontSize: 13,
                    cursor: disabled ? "default" : "pointer",
                  }}
                >
                  {d || ""}
                </button>
              );
            })}
          </div>

          {selectedDay && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontFamily: SANS, fontSize: 12, color: COLORS.oliveSoft, marginBottom: 10 }}>Свободное время на {dateLabel}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TIME_SLOTS.map((t) => {
                  const passed = slotPassed(t);
                  const active = t === selectedTime;
                  return (
                    <button
                      key={t}
                      disabled={passed}
                      className="oro-pick"
                      onClick={() => {
                        setSelectedTime(t);
                        setDuration((d) => Math.min(d, maxDurationFrom(t)));
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 20,
                        border: `1px solid ${active ? COLORS.oliveDark : "rgba(111,122,86,0.3)"}`,
                        background: active ? COLORS.oliveDark : "transparent",
                        color: active ? COLORS.ivoryCard : passed ? "rgba(58,52,40,0.25)" : COLORS.ink,
                        fontFamily: SANS,
                        fontSize: 12.5,
                        cursor: passed ? "default" : "pointer",
                      }}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedDay && selectedTime && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontFamily: SANS, fontSize: 12, color: COLORS.oliveSoft, marginBottom: 10 }}>Продолжительность, часов</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DURATIONS.filter((h) => h <= maxDuration).map((h) => (
                  <button
                    key={h}
                    className="oro-pick"
                    onClick={() => setDuration(h)}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: `1px solid ${h === duration ? COLORS.oliveDark : "rgba(111,122,86,0.3)"}`,
                      background: h === duration ? COLORS.oliveDark : "transparent",
                      color: h === duration ? COLORS.ivoryCard : COLORS.ink,
                      fontFamily: SANS,
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <p style={{ fontFamily: SANS, fontSize: 12.5, color: COLORS.inkSoft, marginTop: 10 }}>
                {selectedTime}–{endTime} · {duration} {hoursWord(duration)}
              </p>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle color={COLORS.ink} size={22}>
            Расскажите немного о вашей встрече
          </CardTitle>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label>
              {label("Что вы хотите провести?")}
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {label("Количество гостей (до 15)")}
              <input
                type="number"
                min={1}
                max={15}
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                style={inputStyle}
              />
            </label>
            <input
              placeholder="Ваше имя"
              aria-label="Ваше имя"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Телефон / удобный способ связи"
              aria-label="Телефон или удобный способ связи"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              style={inputStyle}
            />
            <textarea
              placeholder="Комментарий"
              aria-label="Комментарий"
              rows={3}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              style={{ ...inputStyle, resize: "vertical", fontFamily: SANS }}
            />

            <div
              style={{
                padding: "12px 14px",
                background: COLORS.ivoryDeep,
                borderRadius: 10,
                fontFamily: SANS,
                fontSize: 12.5,
                lineHeight: 1.6,
                color: COLORS.oliveDark,
              }}
            >
              {selectedDay && selectedTime ? (
                <>
                  Желаемая дата: {dateLabel}, {selectedTime}–{endTime}
                  <br />
                  Аренда: <strong>€{totalPrice}</strong> (€{pricePerHour}/час × {duration})
                  {(form.type === "День рождения" || form.type === "Девичник") && (
                    <>
                      <br />
                      Программа под ключ рассчитывается отдельно.
                    </>
                  )}
                </>
              ) : (
                "Выберите дату и время в календаре"
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className={canSubmit ? "oro-btn oro-btn-primary" : undefined}
              style={{
                marginTop: 4,
                padding: "14px 20px",
                borderRadius: 30,
                border: "none",
                background: canSubmit ? COLORS.oliveDark : "rgba(111,122,86,0.35)",
                color: COLORS.ivoryCard,
                fontFamily: SANS,
                fontSize: 14,
                cursor: canSubmit ? "pointer" : "default",
              }}
            >
              {submitting ? "Отправляем..." : "Забронировать"}
            </button>
          </form>
        </Card>
      </div>
    </Section>
  );
}

const iconBtnStyle = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  border: "none",
  background: COLORS.ivoryDeep,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

const inputStyle = {
  width: "100%",
  padding: "13px 16px",
  borderRadius: 10,
  border: "1px solid rgba(111,122,86,0.28)",
  background: COLORS.ivory,
  fontFamily: SANS,
  fontSize: 13.5,
  color: COLORS.ink,
  outline: "none",
};

/* ---------------------------------------------------------
   FAQ — правила + подбор формата
--------------------------------------------------------- */
function Faq() {
  const items = [
    {
      q: "Как подтвердить бронирование?",
      a: "За 3 суток до мероприятия вы подтверждаете бронь, после чего мы высылаем счёт на оплату.",
    },
    {
      q: "Можно прийти пораньше или задержаться?",
      a: "Да, без доплаты: до 15 минут для индивидуальной работы и до 30 минут для мероприятий. Если задержка больше — оплачивается следующий час.",
    },
    {
      q: "Кто убирает после мероприятия?",
      a: "Студия должна остаться в том же виде, что и до бронирования — за это отвечает организатор. Если не хочется убирать самим, закажите сервис уборки за €20.",
    },
    {
      q: "Можно ли алкоголь?",
      a: "Мероприятия с алкоголем согласовываются при бронировании. Курение, включая вейпы, и наркотические вещества в студии запрещены.",
    },
    {
      q: "Можно ли проводить мероприятия регулярно?",
      a: "Да. Если вы хотите стать постоянным клиентом студии, напишите нам — обсудим удобный формат сотрудничества.",
    },
  ];
  return (
    <Section id="faq" bg={COLORS.ivoryDeep}>
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 40, alignItems: "start" }} className="oro-two-col">
        <div>
          <Eyebrow>Полезно знать</Eyebrow>
          <SectionTitle>Частые вопросы</SectionTitle>
          <Divider />
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
            {items.map(({ q, a }) => (
              <details key={q} className="oro-details oro-faq">
                <summary>
                  <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 500, color: COLORS.ink }}>{q}</span>
                  <ChevronDown size={18} color={COLORS.oliveDark} className="oro-chevron" />
                </summary>
                <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: COLORS.inkSoft, fontWeight: 300, margin: "12px 0 0" }}>{a}</p>
              </details>
            ))}
          </div>
        </div>

        <Card style={{ background: COLORS.oliveDark, border: "none", marginTop: 8 }}>
          <CardTitle color={COLORS.ivoryCard} size={26}>
            Не знаете, какой формат выбрать?
          </CardTitle>
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: "rgba(251,248,242,0.82)", fontWeight: 300, margin: "0 0 24px" }}>
            Расскажите, что хотите отметить или провести, сколько будет гостей и какое настроение хочется создать —
            поможем подобрать формат.
          </p>
          <Button href={WA_FORMAT} light external>
            Подобрать формат
          </Button>
        </Card>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------
   FINAL CTA
--------------------------------------------------------- */
function FinalCta() {
  return (
    <Section
      id="final"
      padding="110px 28px"
      maxWidth={820}
      ornament={
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
          <FlowerOfLife size={520} opacity={0.08} />
        </div>
      }
    >
      <div style={{ textAlign: "center" }}>
        <Eyebrow>Здесь всегда что-то происходит</Eyebrow>
        <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.8, color: COLORS.inkSoft, fontWeight: 300, margin: "0 auto 26px", maxWidth: 560 }}>
          Сегодня — консультация, завтра — женская встреча, в выходные — день рождения или девичник. ORO Studio каждый
          раз становится особенной благодаря людям, которые сюда приходят.
        </p>
        <h2
          style={{
            fontFamily: SERIF,
            fontWeight: 500,
            fontSize: "clamp(32px, 4.6vw, 52px)",
            lineHeight: 1.12,
            color: COLORS.ink,
            margin: "0 0 18px",
          }}
        >
          Ваш следующий красивый вечер <span style={{ color: COLORS.olive, fontStyle: "italic" }}>может начаться здесь</span>
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.7, color: COLORS.inkSoft, fontWeight: 300, margin: "0 auto 34px", maxWidth: 520 }}>
          Выберите дату, расскажите о своей идее — и мы поможем превратить её в настоящее событие.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Button href="#booking">Забронировать студию</Button>
          <Button href="#booking" variant="secondary">
            Посмотреть календарь
          </Button>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------
   FOOTER
--------------------------------------------------------- */
function Footer() {
  const social = [
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/oro_studio_tln" },
    { icon: Phone, label: "WhatsApp", href: `https://wa.me/${PHONE_RAW}` },
    { icon: Send, label: "Telegram", href: "https://t.me/oro_studio_tallinn" },
    { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1DtTPKb5Eu/" },
  ];
  const row = { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 };
  const text = { fontFamily: SANS, fontSize: 13.5, color: "rgba(251,248,242,0.8)", fontWeight: 300, textDecoration: "none" };
  return (
    <footer style={{ background: COLORS.ink, padding: "60px 28px 30px" }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 1fr",
          gap: 40,
          paddingBottom: 40,
          borderBottom: "1px solid rgba(251,248,242,0.12)",
        }}
        className="oro-footer-grid"
      >
        <div>
          <div style={{ marginBottom: 14 }}>
            <Logo size={24} oroColor={COLORS.goldLight} studioColor={COLORS.ivoryDeep} />
          </div>
          <p style={{ fontFamily: SANS, fontSize: 13, color: "rgba(251,248,242,0.6)", lineHeight: 1.8, fontWeight: 300, maxWidth: 280, margin: "0 0 20px" }}>
            Пространство для встреч, мероприятий и красивых событий.
          </p>
          <a
            href="#booking"
            className="oro-btn oro-btn-primary"
            style={{
              fontFamily: SANS,
              fontSize: 13,
              color: COLORS.ink,
              background: COLORS.goldLight,
              padding: "11px 24px",
              borderRadius: 30,
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Забронировать
          </a>
        </div>

        <div>
          <h4 style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.1em", color: COLORS.goldLight, margin: "0 0 16px", fontWeight: 500 }}>КОНТАКТЫ</h4>
          <div style={row}>
            <MapPin size={15} color={COLORS.oliveSoft} />
            <a href="https://maps.google.com/?q=Narva+mnt+4,+Tallinn" target="_blank" rel="noopener noreferrer" style={text}>
              Narva mnt 4, Таллинн — самое сердце города
            </a>
          </div>
          <div style={row}>
            <Phone size={15} color={COLORS.oliveSoft} />
            <a href={`https://wa.me/${PHONE_RAW}`} target="_blank" rel="noopener noreferrer" style={text}>
              WhatsApp: {PHONE_DISPLAY}
            </a>
          </div>
          <div style={row}>
            <Mail size={15} color={COLORS.oliveSoft} />
            <a href={`mailto:${EMAIL}`} style={text}>
              {EMAIL}
            </a>
          </div>
          <div style={row}>
            <Instagram size={15} color={COLORS.oliveSoft} />
            <a href="https://www.instagram.com/oro_studio_tln" target="_blank" rel="noopener noreferrer" style={text}>
              @oro_studio_tln
            </a>
          </div>
          <div style={{ ...row, marginBottom: 0 }}>
            <Clock size={15} color={COLORS.oliveSoft} />
            <span style={text}>Ежедневно, по бронированию</span>
          </div>
        </div>

        <div>
          <h4 style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.1em", color: COLORS.goldLight, margin: "0 0 16px", fontWeight: 500 }}>МЫ В СОЦСЕТЯХ</h4>
          <div style={{ display: "flex", gap: 12 }}>
            {social.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                className="oro-social"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  border: "1px solid rgba(251,248,242,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.ivoryDeep,
                  textDecoration: "none",
                }}
              >
                <Icon size={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <p style={{ fontFamily: SANS, fontSize: 12, color: "rgba(251,248,242,0.4)", textAlign: "center", margin: "26px 0 0" }}>
        © {new Date().getFullYear()} ORO Studio. Все права защищены.
      </p>
    </footer>
  );
}

/* ---------------------------------------------------------
   APP
--------------------------------------------------------- */
export default function App() {
  return (
    <div style={{ background: COLORS.ivory, minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; scroll-padding-top: 76px; }
        body { margin: 0; }
        a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, summary:focus-visible {
          outline: 2px solid ${COLORS.gold};
          outline-offset: 2px;
        }
        .oro-card { transition: transform .35s ease, box-shadow .35s ease; }

        /* ---------- Buttons & interactive states ---------- */
        .oro-btn {
          transition: transform .25s ease, box-shadow .25s ease, background-color .25s ease, border-color .25s ease, color .25s ease;
          will-change: transform;
        }
        .oro-btn:active { transform: translateY(0) scale(0.98) !important; }
        .oro-nav-link { opacity: .85; position: relative; transition: opacity .2s ease; }
        .oro-nav-link::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: -6px; height: 1px;
          background: ${COLORS.gold}; transform: scaleX(0); transform-origin: left; transition: transform .3s ease;
        }
        .oro-arrow { display: inline-block; transition: transform .25s ease; }
        .oro-social, .oro-icon-btn, .oro-pick { transition: transform .2s ease, background-color .2s ease, border-color .2s ease, color .2s ease; }
        @media (hover: hover) {
          .oro-btn:hover { transform: translateY(-3px); }
          .oro-btn-primary:hover { box-shadow: 0 18px 34px -12px rgba(79,90,61,0.65) !important; filter: brightness(1.06); }
          .oro-btn-secondary:hover { background-color: rgba(111,122,86,0.1) !important; border-color: ${COLORS.oliveDark} !important; }
          .oro-btn-secondary.oro-btn-light:hover { background-color: rgba(251,248,242,0.12) !important; border-color: ${COLORS.ivoryCard} !important; }
          .oro-nav-link:hover { opacity: 1; }
          .oro-nav-link:hover::after { transform: scaleX(1); }
          .oro-link:hover .oro-arrow { transform: translateX(5px); }
          .oro-social:hover { transform: translateY(-3px); border-color: ${COLORS.goldLight} !important; color: ${COLORS.goldLight} !important; }
          .oro-icon-btn:not(:disabled):hover { transform: scale(1.08); }
          .oro-pick:not(:disabled):hover { transform: translateY(-2px); border-color: ${COLORS.oliveDark} !important; }
        }

        /* ---------- Mobile swipe rows (programs, gallery) ---------- */
        .oro-swipe-hint { display: none; }
        @media (max-width: 640px) {
          .oro-swipe-hint { display: block; }
          .oro-swipe {
            display: flex !important;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 14px !important;
            margin-left: -28px;
            margin-right: -28px;
            padding: 6px 28px 20px;
            scroll-padding: 0 28px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .oro-swipe::-webkit-scrollbar { display: none; }
          .oro-swipe > * { flex: 0 0 80%; scroll-snap-align: start; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { transition: none !important; scroll-behavior: auto !important; }
        }
        @media (hover: hover) {
          .oro-card:hover { transform: translateY(-4px); box-shadow: 0 18px 40px -14px rgba(58,52,40,0.28) !important; }
        }
        .oro-details summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .oro-details summary::-webkit-details-marker { display: none; }
        .oro-chevron { flex: 0 0 auto; transition: transform .25s ease; }
        .oro-details[open] .oro-chevron { transform: rotate(180deg); }
        .oro-faq {
          background: ${COLORS.ivoryCard};
          border: 1px solid rgba(111,122,86,0.14);
          border-radius: 16px;
          padding: 18px 22px;
        }
        @media (max-width: 1000px) {
          .oro-four-col { grid-template-columns: repeat(2, 1fr) !important; }
          .oro-addons { grid-template-columns: 1fr 1fr !important; }
          .oro-addons > *:last-child { grid-column: 1 / -1; }
        }
        @media (max-width: 860px) {
          .oro-hero-grid, .oro-about-grid, .oro-two-col, .oro-three-col, .oro-booking-grid { grid-template-columns: 1fr !important; }
          .oro-hero-grid > *:first-child { order: 2; }
          .oro-hero-grid > *:last-child { order: 1; }
          .oro-about-grid > *:first-child { max-width: 420px; }
        }
        @media (max-width: 760px) {
          .oro-footer-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 560px) {
          .oro-four-col, .oro-addons { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav />
      <main>
        <Hero />
        <About />
        <Formats />
        <Why />
        <Turnkey />
        <Occasions />
        <Gallery />
        <Pricing />
        <Booking />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
