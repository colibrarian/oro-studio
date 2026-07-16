import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Menu,
  X,
  Image as ImageIcon,
} from "lucide-react";

// Always resolves to the correct absolute path regardless of the deployed
// subpath (e.g. GitHub Pages project sites) or whether the URL has a
// trailing slash — avoids relative-path 404s.
const asset = (path) => `${import.meta.env.BASE_URL}${path}`.replace(/\/{2,}/g, "/").replace(":/", "://");

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

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Montserrat:wght@300;400;500;600&display=swap');";

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
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }}>
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
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 600,
          fontSize: size,
          color: oroColor,
          letterSpacing: "0.08em",
        }}
      >
        ORO
      </span>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: size * 0.72,
          color: studioColor,
        }}
      >
        studio
      </span>
    </span>
  );
}

/* ---------------------------------------------------------
   SMALL UI HELPERS
--------------------------------------------------------- */
function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 12,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        color: COLORS.gold,
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
        fontFamily: "'Cormorant Garamond', serif",
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
        ...style,
      }}
    >
      <ImageIcon size={26} strokeWidth={1.3} />
      <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, letterSpacing: "0.05em" }}>{label}</span>
    </div>
  );
}

// Real photo with graceful fallback to the placeholder above if the file
// isn't present yet (e.g. before /images/... is added to the repo's public folder).
// Pass `ratio` (e.g. "4 / 5") for a fixed-aspect crop instead of a fixed pixel height.
function Photo({ src, alt, label, height = 260, ratio, style = {} }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <PhotoPlaceholder label={label} height={height} ratio={ratio} style={style} />;
  return (
    <img
      src={src}
      alt={alt}
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
      style={{
        background: COLORS.ivoryCard,
        borderRadius: 20,
        padding: "30px 28px",
        boxShadow: "0 10px 30px -14px rgba(58,52,40,0.18)",
        border: "1px solid rgba(111,122,86,0.12)",
        transition: "transform .35s ease, box-shadow .35s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 18px 40px -14px rgba(58,52,40,0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 10px 30px -14px rgba(58,52,40,0.18)";
      }}
    >
      {children}
    </div>
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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    ["О студии", "#about"],
    ["Возможности", "#amenities"],
    ["Галерея", "#gallery"],
    ["Стоимость", "#pricing"],
    ["Правила", "#rules"],
    ["Бронирование", "#booking"],
  ];

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: solid ? "rgba(247,243,236,0.92)" : "transparent",
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
        <a href="#top" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <Logo size={26} />
        </a>

        <div style={{ display: "flex", gap: 34 }} className="oro-nav-links">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 13,
                letterSpacing: "0.04em",
                color: COLORS.ink,
                textDecoration: "none",
                opacity: 0.85,
              }}
            >
              {label}
            </a>
          ))}
        </div>

        <a
          href="#booking"
          className="oro-nav-cta"
          style={{
            fontFamily: "'Montserrat', sans-serif",
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
          style={{ display: "none", background: "none", border: "none", color: COLORS.ink }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="oro-mobile-menu" style={{ background: COLORS.ivory, padding: "10px 28px 24px", display: "none" }}>
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "block",
                padding: "10px 0",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 14,
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
        @media (max-width: 860px) {
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
          <Eyebrow>Таллин · пространство состояния</Eyebrow>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
              fontSize: "clamp(40px, 6vw, 68px)",
              lineHeight: 1.08,
              color: COLORS.ink,
              margin: "0 0 22px",
            }}
          >
            ORO studio — <br />
            <span style={{ color: COLORS.olive, fontStyle: "italic" }}>про замедление</span> в мире,
            который постоянно торопит
          </h1>
          <p
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 16,
              lineHeight: 1.7,
              color: COLORS.inkSoft,
              maxWidth: 480,
              margin: "0 0 34px",
              fontWeight: 300,
            }}
          >
            Про мягкость вместо напряжения. Про красоту без громкости. Камерная студия для встреч,
            мастер-классов, съёмок и тихих женских разговоров.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="#booking"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 14,
                color: COLORS.ivoryCard,
                background: COLORS.oliveDark,
                padding: "15px 30px",
                borderRadius: 30,
                textDecoration: "none",
                boxShadow: "0 14px 30px -10px rgba(79,90,61,0.55)",
              }}
            >
              Забронировать студию
            </a>
            <a
              href="#about"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 14,
                color: COLORS.ink,
                border: `1px solid ${COLORS.oliveSoft}`,
                padding: "15px 30px",
                borderRadius: 30,
                textDecoration: "none",
              }}
            >
              Узнать больше
            </a>
          </div>
        </div>

        <Photo
          src={asset("images/hero-consulting.jpg")}
          alt="Встреча в ORO studio"
          label="Фото студии — гостиная зона"
          height={420}
        />
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   ABOUT
--------------------------------------------------------- */
function About() {
  return (
    <section id="about" style={{ padding: "100px 28px", background: COLORS.ivory }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 60,
          alignItems: "center",
        }}
        className="oro-about-grid"
      >
        <Photo
          src={asset("images/about-meeting.jpg")}
          alt="Разговор в ORO studio"
          label="Фото — зона отдыха"
          height={380}
        />
        <div>
          <Eyebrow>О студии</Eyebrow>
          <SectionTitle>Здесь проходят камерные встречи, творческие события и съёмки</SectionTitle>
          <Divider />
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 15.5, lineHeight: 1.9, color: COLORS.inkSoft, fontWeight: 300 }}>
            ORo создавалась как пространство для встреч, разговоров, идей и пауз между большими шагами.
            Здесь проходят камерные женские встречи, творческие события и съёмки, в которых важна не
            только картинка, но и чувство внутри неё.
          </p>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              fontSize: 22,
              color: COLORS.olive,
              marginTop: 24,
            }}
          >
            «ORo — про замедление, эстетику и присутствие»
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   USE CASES
--------------------------------------------------------- */
function UseCases() {
  const items = [
    "Консультирование",
    "Трансформационные и настольные игры",
    "Арома-мероприятия",
    "Время для себя",
    "Проведение встреч",
    "Проведение праздников",
    "Лекции",
    "Мастер-классы",
    "Дегустации",
    "Мастер-майнды",
    "Коворкинг",
    "Фотосессии",
  ];
  return (
    <section
      style={{
        padding: "100px 28px",
        background: COLORS.olive,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{ position: "absolute", bottom: -80, left: -80, pointerEvents: "none" }}>
        <FlowerOfLife size={360} opacity={0.12} color={COLORS.ivoryCard} />
      </div>
      <div style={{ maxWidth: 1180, margin: "0 auto", position: "relative" }}>
        <Eyebrow>Идеи назначения студии</Eyebrow>
        <SectionTitle light>Пространство для того, что важно именно вам</SectionTitle>
        <Divider color={COLORS.ivoryCard} />
        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 14,
          }}
        >
          {items.map((item) => (
            <div
              key={item}
              style={{
                background: "rgba(251,248,242,0.1)",
                border: "1px solid rgba(251,248,242,0.25)",
                borderRadius: 14,
                padding: "16px 20px",
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 14.5,
                color: COLORS.ivoryCard,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.goldLight, flex: "0 0 auto" }} />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   AMENITIES
--------------------------------------------------------- */
function Amenities() {
  const included = [
    { icon: Coffee, text: "Качественный кофе" },
    { icon: Sparkles, text: "Коллекция трав и чая" },
    { icon: Coffee, text: "Лёгкие закуски (конфеты, печенье)" },
    { icon: Refrigerator, text: "Кулер с водой (горячая / холодная)" },
    { icon: Sparkles, text: "Канцелярия" },
  ];
  const studio = [
    { icon: Wifi, text: "Хороший Wi-Fi" },
    { icon: Tv, text: "Телевизор с подключением ноутбука" },
    { icon: Sparkles, text: "Bluetooth-колонка JBL" },
    { icon: Coffee, text: "Кофемашина и капучинатор" },
    { icon: Refrigerator, text: "Мини-холодильник" },
    { icon: Refrigerator, text: "Кулер с горячей и холодной водой" },
    { icon: Users, text: "Обеденная группа и сервиз на 15 персон" },
    { icon: Sparkles, text: "Бокалы для вина / шампанского" },
  ];
  const floor = ["Духовой шкаф", "Посудомоечная машина", "Микроволновая печь"];

  return (
    <section id="amenities" style={{ padding: "100px 28px", background: COLORS.ivory }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Eyebrow>Возможности студии</Eyebrow>
        <SectionTitle>Всё, чтобы вам осталось просто быть</SectionTitle>
        <Divider />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 44 }} className="oro-amenities-grid">
          <Card>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: COLORS.olive, margin: "0 0 18px" }}>
              В студии
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {studio.map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Icon size={17} color={COLORS.gold} strokeWidth={1.5} />
                  <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: COLORS.ink, fontWeight: 300 }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <Card>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: COLORS.olive, margin: "0 0 18px" }}>
                Включено в стоимость
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {included.map(({ icon: Icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Icon size={17} color={COLORS.gold} strokeWidth={1.5} />
                    <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: COLORS.ink, fontWeight: 300 }}>
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: COLORS.olive, margin: "0 0 12px" }}>
                На этаже, по согласованию
              </h3>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: COLORS.inkSoft, fontWeight: 300, margin: "0 0 14px" }}>
                Доступны в общем помещении на этаже, использование согласовывается при бронировании:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {floor.map((t) => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 12.5,
                      color: COLORS.oliveDark,
                      background: COLORS.ivoryDeep,
                      padding: "8px 14px",
                      borderRadius: 20,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 760px) {
          .oro-amenities-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------------------------------------------------------
   GALLERY
--------------------------------------------------------- */
function Gallery() {
  const photos = [
    { src: asset("images/gallery-birthday-group.jpg"), label: "Праздник в студии", alt: "Праздник в ORO studio" },
    { src: asset("images/gallery-meditation-circle.jpg"), label: "Медитативный круг", alt: "Групповая медитация" },
    { src: asset("images/gallery-workshop-scrub.jpg"), label: "Мастер-класс", alt: "Мастер-класс в студии" },
    { src: asset("images/gallery-macarons.jpg"), label: "Праздничные детали", alt: "Праздничный десерт" },
    { src: asset("images/gallery-birthday-toast.jpg"), label: "Тёплые встречи", alt: "Гости студии" },
    { src: asset("images/gallery-workshop-wide.jpg"), label: "Пространство для практик", alt: "Практика в студии" },
    { src: asset("images/gallery-meditation-alt.jpg"), label: "Момент тишины", alt: "Медитация" },
    { src: asset("images/gallery-birthday-portrait.jpg"), label: "Атмосфера ORO", alt: "Гостья студии" },
    { src: asset("images/gallery-workshop-alt.jpg"), label: "Творческий процесс", alt: "Мастер-класс" },
  ];
  // Deterministic "scattered" offsets/rotations per card — organic but stable
  // between renders (no layout shift, no hydration mismatch).
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
  return (
    <section id="gallery" style={{ padding: "100px 28px 120px", background: COLORS.ivoryDeep }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Eyebrow>Галерея</Eyebrow>
        <SectionTitle>Атмосферу невозможно забронировать отдельно</SectionTitle>
        <Divider />
        <div
          style={{
            marginTop: 50,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 34,
          }}
          className="oro-gallery-grid"
        >
          {photos.map((p, i) => (
            <div
              key={p.src}
              className="oro-gallery-item"
              style={{ "--gy": `${scatter[i % scatter.length].y}px`, "--gr": `${scatter[i % scatter.length].r}deg` }}
            >
              <Photo src={p.src} alt={p.alt} label={p.label} ratio="4 / 5" />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .oro-gallery-item {
          transform: translateY(var(--gy)) rotate(var(--gr));
          transition: transform .4s ease, filter .4s ease;
        }
        .oro-gallery-item:hover {
          transform: translateY(calc(var(--gy) - 8px)) rotate(0deg) scale(1.03);
          z-index: 2;
          position: relative;
        }
        @media (max-width: 860px) {
          .oro-gallery-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
        }
        @media (max-width: 520px) {
          .oro-gallery-grid { grid-template-columns: 1fr !important; }
          .oro-gallery-item { transform: none !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------------------------------------------------------
   PRICING
--------------------------------------------------------- */
function Pricing() {
  const tiers = [
    { title: "Индивидуальные встречи", sub: "1–2 человека", price: "20", },
    { title: "Мероприятия", sub: "3–10 человек", price: "30", featured: true },
    { title: "Мероприятия", sub: "11–15 человек", price: "40" },
  ];
  return (
    <section id="pricing" style={{ padding: "100px 28px", background: COLORS.ivory }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Eyebrow>Стоимость</Eyebrow>
        <SectionTitle>Прозрачная цена — без сюрпризов</SectionTitle>
        <Divider />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 44 }} className="oro-pricing-grid">
          {tiers.map((t) => (
            <Card
              key={t.title + t.sub}
              style={
                t.featured
                  ? { background: COLORS.oliveDark, border: "none" }
                  : {}
              }
            >
              <p
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: t.featured ? COLORS.goldLight : COLORS.oliveSoft,
                  margin: "0 0 6px",
                }}
              >
                {t.sub}
              </p>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 24,
                  color: t.featured ? COLORS.ivoryCard : COLORS.ink,
                  margin: "0 0 20px",
                  fontWeight: 500,
                }}
              >
                {t.title}
              </h3>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 52,
                    color: t.featured ? COLORS.goldLight : COLORS.olive,
                    fontWeight: 600,
                  }}
                >
                  €{t.price}
                </span>
                <span
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontSize: 13,
                    color: t.featured ? "rgba(251,248,242,0.7)" : COLORS.inkSoft,
                  }}
                >
                  / час
                </span>
              </div>
            </Card>
          ))}
        </div>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            gap: 30,
            flexWrap: "wrap",
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 13.5,
            color: COLORS.inkSoft,
            fontWeight: 300,
          }}
        >
          <span>✦ При бронировании более чем на 5 часов — 1 час в подарок</span>
          <span>✦ Сервис уборки (при необходимости) — €20, оплачивается отдельно</span>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .oro-pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------------------------------------------------------
   RULES
--------------------------------------------------------- */
function Rules() {
  const rules = [
    {
      title: "Правила пространства",
      body: [
        "Курение, включая вейпы, и использование наркотических веществ строго запрещено.",
        "Мероприятия с алкогольными напитками необходимо согласовывать при бронировании.",
        "Студия должна оставаться в чистом состоянии, как и до бронирования. За уборку несёт ответственность организатор мероприятия.",
      ],
    },
    {
      title: "Детали по времени",
      body: [
        "Можно прийти пораньше и/или задержаться без доплат.",
        "Для индивидуального использования — до 15 минут.",
        "Для мероприятий — до 30 минут.",
      ],
    },
    {
      title: "Продление и отмена",
      body: [
        "За 3 суток вы подтверждаете бронирование студии, после чего мы высылаем счёт на оплату.",
        "В случае задержки более чем на 15 минут (для индивидуального использования) и более чем на 30 минут (для мероприятий) — оплачивается следующий час.",
      ],
    },
  ];
  return (
    <section id="rules" style={{ padding: "100px 28px", background: COLORS.ivoryDeep }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <Eyebrow>Правила</Eyebrow>
        <SectionTitle>Немного деталей для комфорта всех</SectionTitle>
        <Divider />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 44 }} className="oro-rules-grid">
          {rules.map((r) => (
            <Card key={r.title}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: COLORS.olive, margin: "0 0 16px" }}>
                {r.title}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {r.body.map((b, i) => (
                  <p
                    key={i}
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: 13.5,
                      lineHeight: 1.7,
                      color: COLORS.inkSoft,
                      margin: 0,
                      fontWeight: 300,
                    }}
                  >
                    {b}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 860px) {
          .oro-rules-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ---------------------------------------------------------
   BOOKING — mock Google Calendar style picker
   (placeholder: real integration will replace this flow;
   here we simulate the "book -> email confirmation" idea)
--------------------------------------------------------- */
const MONTH_NAMES = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const STUDIO_CLOSE_HOUR = 20; // last booking must end by this hour
const PRICE_PER_HOUR = { "1–2 человека": 20, "3–10 человек": 30, "11–15 человек": 40 };
const DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8];

function addHours(time, hours) {
  const [h, m] = time.split(":").map(Number);
  const end = h + hours;
  return `${String(end).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
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

function Booking() {
  const today = new Date();
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", guests: "1–2 человека" });
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const maxDuration = selectedTime ? maxDurationFrom(selectedTime) : DURATIONS.length;
  const endTime = selectedTime ? addHours(selectedTime, duration) : null;
  const pricePerHour = PRICE_PER_HOUR[form.guests] ?? 20;
  const totalPrice = pricePerHour * duration;

  const cells = useMemo(() => buildCalendar(cursor.year, cursor.month), [cursor]);

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

  const canSubmit = selectedDay && selectedTime && form.name && form.email;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    // Placeholder: this is where a real Google Calendar booking
    // + confirmation-email call would happen.
    setTimeout(() => {
      setSubmitting(false);
      setConfirmed(true);
    }, 900);
  };

  const dateLabel = selectedDay
    ? `${selectedDay} ${MONTH_NAMES[cursor.month].toLowerCase()} ${cursor.year}`
    : null;

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
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: COLORS.ink, margin: "0 0 10px" }}>
              Бронирование почти готово
            </h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 14, color: COLORS.inkSoft, lineHeight: 1.7, fontWeight: 300 }}>
              Вы выбрали <strong style={{ color: COLORS.olive }}>{dateLabel}, {selectedTime}–{endTime}</strong>{" "}
              ({duration} {duration === 1 ? "час" : duration < 5 ? "часа" : "часов"}, €{totalPrice}).
              Письмо с подтверждением и деталями оплаты отправлено на <strong>{form.email}</strong>.
            </p>

            <div
              style={{
                marginTop: 26,
                textAlign: "left",
                background: COLORS.ivoryDeep,
                borderRadius: 14,
                padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Mail size={15} color={COLORS.gold} />
                <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: COLORS.oliveDark, letterSpacing: "0.04em" }}>
                  ПРЕДПРОСМОТР ПИСЬМА
                </span>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, color: COLORS.ink, margin: "0 0 6px" }}>
                Здравствуйте, {form.name}! Ваша бронь в ORO studio подтверждена.
              </p>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12.5, color: COLORS.inkSoft, margin: 0, fontWeight: 300 }}>
                {dateLabel} · {selectedTime}–{endTime} · {form.guests} · €{totalPrice}
              </p>
            </div>

            <button
              onClick={() => {
                setConfirmed(false);
                setSelectedDay(null);
                setSelectedTime(null);
                setDuration(1);
                setForm({ name: "", email: "", phone: "", guests: "1–2 человека" });
              }}
              style={{
                marginTop: 26,
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 13,
                color: COLORS.oliveDark,
                background: "none",
                border: `1px solid ${COLORS.oliveSoft}`,
                borderRadius: 30,
                padding: "12px 26px",
                cursor: "pointer",
              }}
            >
              Забронировать ещё раз
            </button>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" style={{ padding: "100px 28px", background: COLORS.olive, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -100, right: -100, pointerEvents: "none" }}>
        <FlowerOfLife size={380} opacity={0.1} color={COLORS.ivoryCard} />
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
        <Eyebrow>Бронирование</Eyebrow>
        <SectionTitle light>Выберите дату и время</SectionTitle>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13.5, color: "rgba(251,248,242,0.75)", marginTop: 10, fontWeight: 300 }}>
          Демонстрационный календарь — синхронизация с Google Calendar появится здесь после подключения.
        </p>

        <div style={{ marginTop: 40, display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }} className="oro-booking-grid">
          <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <button onClick={() => changeMonth(-1)} style={iconBtnStyle}>
                <ChevronLeft size={18} color={COLORS.oliveDark} />
              </button>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: COLORS.ink }}>
                {MONTH_NAMES[cursor.month]} {cursor.year}
              </span>
              <button onClick={() => changeMonth(1)} style={iconBtnStyle}>
                <ChevronRight size={18} color={COLORS.oliveDark} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6 }}>
              {WEEKDAYS.map((w) => (
                <div key={w} style={{ textAlign: "center", fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: COLORS.oliveSoft }}>
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
                    onClick={() => { setSelectedDay(d); setSelectedTime(null); setDuration(1); }}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 10,
                      border: "none",
                      background: active ? COLORS.oliveDark : d ? COLORS.ivoryDeep : "transparent",
                      color: active ? COLORS.ivoryCard : disabled ? "rgba(58,52,40,0.25)" : COLORS.ink,
                      fontFamily: "'Montserrat', sans-serif",
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
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: COLORS.oliveSoft, marginBottom: 10 }}>
                  Свободное время на {dateLabel}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setSelectedTime(t);
                        setDuration((d) => Math.min(d, maxDurationFrom(t)));
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 20,
                        border: `1px solid ${t === selectedTime ? COLORS.oliveDark : "rgba(111,122,86,0.3)"}`,
                        background: t === selectedTime ? COLORS.oliveDark : "transparent",
                        color: t === selectedTime ? COLORS.ivoryCard : COLORS.ink,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 12.5,
                        cursor: "pointer",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDay && selectedTime && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: COLORS.oliveSoft, marginBottom: 10 }}>
                  Сколько часов вам нужно?
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {DURATIONS.filter((h) => h <= maxDuration).map((h) => (
                    <button
                      key={h}
                      onClick={() => setDuration(h)}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        border: `1px solid ${h === duration ? COLORS.oliveDark : "rgba(111,122,86,0.3)"}`,
                        background: h === duration ? COLORS.oliveDark : "transparent",
                        color: h === duration ? COLORS.ivoryCard : COLORS.ink,
                        fontFamily: "'Montserrat', sans-serif",
                        fontSize: 13,
                        cursor: "pointer",
                      }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12.5, color: COLORS.inkSoft, marginTop: 10 }}>
                  {selectedTime}–{endTime} · {duration} {duration === 1 ? "час" : duration < 5 ? "часа" : "часов"}
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: COLORS.ink, margin: "0 0 18px" }}>
              Ваши данные
            </h3>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input
                placeholder="Имя"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle}
              />
              <input
                type="email"
                placeholder="Email для подтверждения"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle}
              />
              <input
                placeholder="Телефон (необязательно)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={inputStyle}
              />
              <select
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                style={inputStyle}
              >
                <option value="1–2 человека">1–2 человека — €20/час</option>
                <option value="3–10 человек">3–10 человек — €30/час</option>
                <option value="11–15 человек">11–15 человек — €40/час</option>
              </select>

              <div
                style={{
                  marginTop: 4,
                  padding: "12px 14px",
                  background: COLORS.ivoryDeep,
                  borderRadius: 10,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 12.5,
                  color: COLORS.oliveDark,
                }}
              >
                {selectedDay && selectedTime ? (
                  <>
                    Выбрано: {dateLabel}, {selectedTime}–{endTime} ({duration}{" "}
                    {duration === 1 ? "час" : duration < 5 ? "часа" : "часов"})
                    <br />
                    Итого: <strong>€{totalPrice}</strong> (€{pricePerHour}/час × {duration})
                  </>
                ) : (
                  "Выберите дату и время слева"
                )}
              </div>

              <button
                type="submit"
                disabled={!canSubmit || submitting}
                style={{
                  marginTop: 6,
                  padding: "14px 20px",
                  borderRadius: 30,
                  border: "none",
                  background: canSubmit ? COLORS.oliveDark : "rgba(111,122,86,0.35)",
                  color: COLORS.ivoryCard,
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 14,
                  cursor: canSubmit ? "pointer" : "default",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {submitting ? "Отправляем..." : "Подтвердить бронирование"}
              </button>
            </form>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          .oro-booking-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
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
  padding: "13px 16px",
  borderRadius: 10,
  border: "1px solid rgba(111,122,86,0.28)",
  background: COLORS.ivory,
  fontFamily: "'Montserrat', sans-serif",
  fontSize: 13.5,
  color: COLORS.ink,
  outline: "none",
};

/* ---------------------------------------------------------
   FOOTER
--------------------------------------------------------- */
function Footer() {
  const social = [
    { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/oro_studio_tln?igsh=MW5lNzJoM3lmYmd1Yg==" },
    { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/share/1DtTPKb5Eu/?mibextid=wwXIfr" },
    { icon: Send, label: "Telegram", href: "https://t.me/oro_studio_tallinn" },
  ];
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
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: "rgba(251,248,242,0.6)", lineHeight: 1.8, fontWeight: 300, maxWidth: 280 }}>
            Пространство состояния в центре Таллина. Про мягкость вместо напряжения.
          </p>
        </div>

        <div>
          <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: COLORS.goldLight, marginBottom: 16 }}>
            КОНТАКТЫ
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <MapPin size={15} color={COLORS.oliveSoft} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13.5, color: "rgba(251,248,242,0.8)", fontWeight: 300 }}>
              Narva mnt 4, Таллин, Эстония
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Mail size={15} color={COLORS.oliveSoft} />
            <a href="mailto:events@orostudiotallinn.com" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13.5, color: "rgba(251,248,242,0.8)", fontWeight: 300, textDecoration: "none" }}>
              events@orostudiotallinn.com
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <Phone size={15} color={COLORS.oliveSoft} />
            <a href="tel:+37253363795" style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13.5, color: "rgba(251,248,242,0.8)", fontWeight: 300, textDecoration: "none" }}>
              +372 5336 3795
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock size={15} color={COLORS.oliveSoft} />
            <span style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13.5, color: "rgba(251,248,242,0.8)", fontWeight: 300 }}>
              Ежедневно, по бронированию
            </span>
          </div>
        </div>

        <div>
          <h4 style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, letterSpacing: "0.1em", color: COLORS.goldLight, marginBottom: 16 }}>
            МЫ В СОЦСЕТЯХ
          </h4>
          <div style={{ display: "flex", gap: 12 }}>
            {social.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
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

      <p
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          color: "rgba(251,248,242,0.4)",
          textAlign: "center",
          marginTop: 26,
        }}
      >
        © {new Date().getFullYear()} ORO studio. Все права защищены.
      </p>

      <style>{`
        @media (max-width: 760px) {
          .oro-footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
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
        ${FONT_IMPORT}
        * { box-sizing: border-box; }
        body { margin: 0; }
        a:focus-visible, button:focus-visible, input:focus-visible, select:focus-visible {
          outline: 2px solid ${COLORS.gold};
          outline-offset: 2px;
        }
        @media (max-width: 860px) {
          .oro-hero-grid, .oro-about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <Nav />
      <Hero />
      <About />
      <UseCases />
      <Amenities />
      <Gallery />
      <Pricing />
      <Rules />
      <Booking />
      <Footer />
    </div>
  );
}
