import React, { useState, useMemo, useEffect } from "react";
import { LangContext, useT, langHref } from "./i18n/index.js";
import { CONTACT, BOOKING_API_URL } from "../site.config.js";
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
const { phoneDisplay: PHONE_DISPLAY, phoneRaw: PHONE_RAW, email: EMAIL } = CONTACT;
const whatsapp = (text) => `https://wa.me/${PHONE_RAW}?text=${encodeURIComponent(text)}`;

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
  // Rounded so the pre-rendered HTML matches the browser exactly (Math.sin/cos
  // can differ in the last digits between Node and browsers).
  const round = (v) => Math.round(v * 1000) / 1000;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ opacity }} aria-hidden="true">
      <circle cx={cx} cy={cy} r={round(size * 0.47)} fill="none" stroke={color} strokeWidth={strokeWidth} />
      {centers.map(([x, y], i) => (
        <circle key={i} cx={round(cx + x)} cy={round(cy + y)} r={round(r)} fill="none" stroke={color} strokeWidth={strokeWidth} />
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
  const t = useT();
  return (
    <p className="oro-swipe-hint" style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.08em", color: COLORS.oliveSoft, margin: "0 0 10px" }}>
      {t.common.swipe}
    </p>
  );
}

function PhotoPlaceholder({ label, height = 260, ratio, style = {} }) {
  const t = useT();
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
      <span style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.05em" }}>{label || t.common.photoSoon}</span>
    </div>
  );
}

// Photos live in /public/images as the original JPG (fallback + og:image)
// plus optimized WebP copies in /public/images/w at 640 and 1280 px wide.
const photo = (name) => asset(`images/${name}.jpg`);
const webpSet = (name) => `${asset(`images/w/${name}-640.webp`)} 640w, ${asset(`images/w/${name}-1280.webp`)} 1280w`;
const webpLarge = (name) => asset(`images/w/${name}-1280.webp`);

// Real photo with graceful fallback to the placeholder above if the file is missing.
// `name` is the file name without extension, e.g. "hero-consulting".
// Pass `ratio` (e.g. "4 / 5") for a fixed-aspect crop instead of a fixed pixel height.
// `sizes` tells the browser how wide the photo is shown, so it picks the right WebP.
function Photo({ name, alt, label, height = 260, ratio, eager = false, sizes = "(max-width: 640px) 80vw, 400px", style = {} }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <PhotoPlaceholder label={label} height={height} ratio={ratio} style={style} />;
  return (
    <picture style={{ display: "block" }}>
      <source type="image/webp" srcSet={webpSet(name)} sizes={sizes} />
      <img
        src={photo(name)}
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
    </picture>
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
function LangSwitch({ mobile }) {
  const t = useT();
  const other = t.nav.switchTo;
  return (
    <a
      href={langHref(other.code.toLowerCase())}
      hrefLang={other.code.toLowerCase()}
      lang={other.code.toLowerCase()}
      aria-label={other.label}
      title={other.label}
      className={mobile ? undefined : "oro-nav-link"}
      style={{
        fontFamily: SANS,
        fontSize: mobile ? 15 : 12.5,
        fontWeight: 500,
        letterSpacing: "0.12em",
        color: COLORS.oliveDark,
        textDecoration: "none",
        ...(mobile ? { display: "block", padding: "12px 0" } : {}),
      }}
    >
      {mobile ? `${other.code} · ${other.label}` : other.code}
    </a>
  );
}

function Nav() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = t.nav.links;

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
        <a href="#top" aria-label={t.nav.toTop} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
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

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span className="oro-nav-links">
          <LangSwitch />
        </span>
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
          {t.common.book}
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="oro-burger"
          aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={open}
          style={{ display: "none", background: "none", border: "none", color: COLORS.ink, cursor: "pointer" }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        </div>
      </div>

      {open && (
        <div className="oro-mobile-menu" style={{ background: COLORS.ivory, padding: "10px 28px 24px", display: "none" }}>
          {[...links, [t.common.book, "#booking"]].map(([label, href], i) => (
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
          <LangSwitch mobile />
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
  const t = useT();
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
          <Eyebrow>{t.hero.eyebrow}</Eyebrow>
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
            {t.hero.titleA}<span style={{ color: COLORS.olive, fontStyle: "italic" }}>{t.hero.titleB}</span>
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
            {t.hero.text}
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Button href="#booking">{t.common.bookStudio}</Button>
            <Button href="#booking" variant="secondary">
              {t.common.seeCalendar}
            </Button>
          </div>
        </div>

        <Photo
          name="hero-consulting"
          alt={t.hero.photoAlt}
          label={t.hero.photoLabel}
          height={420}
          sizes="(max-width: 860px) 100vw, 520px"
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
  const t = useT();
  const a = t.about;
  return (
    <Section id="about">
      <div
        style={{ display: "grid", gridTemplateColumns: "0.85fr 1.15fr", gap: 60, alignItems: "center" }}
        className="oro-about-grid"
      >
        <Photo name="natalia" alt={a.photoAlt} label={a.photoLabel} ratio="4 / 5" sizes="(max-width: 860px) 420px, 480px" />
        <div>
          <Eyebrow>{a.eyebrow}</Eyebrow>
          <SectionTitle>{a.title}</SectionTitle>
          <Divider />
          {a.paragraphs.map((p) => (
            <Lead key={p}>{p}</Lead>
          ))}
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 24, lineHeight: 1.35, color: COLORS.olive, margin: "26px 0 0" }}>
            {a.quote}
          </p>
          <p style={{ fontFamily: SANS, fontSize: 14.5, color: COLORS.ink, fontWeight: 500, margin: "22px 0 0" }}>
            {a.closing}
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
  const t = useT();
  const f = t.formats;

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
      <Eyebrow light>{f.eyebrow}</Eyebrow>
      <SectionTitle light>{f.title}</SectionTitle>
      <Divider color={COLORS.ivoryCard} />
      <Lead light>{f.lead}</Lead>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 36 }} className="oro-two-col">
        {[
          { icon: Briefcase, title: f.expertsTitle, items: f.experts },
          { icon: Heart, title: f.privateTitle, items: f.private },
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
  const t = useT();
  const icons = [MapPin, Users, Camera, Coffee];
  const items = t.why.items.map((it, i) => ({ ...it, icon: icons[i] }));
  return (
    <Section id="why">
      <Eyebrow>{t.why.eyebrow}</Eyebrow>
      <SectionTitle>{t.why.title}</SectionTitle>
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
function Turnkey() {
  const t = useT();
  const k = t.turnkey;
  const timeline = k.timeline;
  return (
    <Section id="turnkey" bg={COLORS.ivoryDeep}>
      <div style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 50, alignItems: "start" }} className="oro-two-col">
        <div>
          <Eyebrow>{k.eyebrow}</Eyebrow>
          <SectionTitle>{k.title}</SectionTitle>
          <Divider />
          <Lead>{k.lead}</Lead>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "22px 0 30px" }}>
            {k.chips.map((chip) => (
              <span
                key={chip}
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
                {chip}
              </span>
            ))}
          </div>
          <Button href={whatsapp(t.wa.turnkey)} external>
            {k.cta}
          </Button>
          <p style={{ fontFamily: SANS, fontSize: 12.5, color: COLORS.inkSoft, fontWeight: 300, margin: "14px 0 0" }}>
            {k.priceNote}
          </p>
        </div>

        <Card>
          <CardTitle>{k.cardTitle}</CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 8 }}>
            {timeline.map((step, i) => (
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
                  {step.hours}
                </div>
                <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.65, color: COLORS.ink, fontWeight: 300, margin: "6px 0 0" }}>
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Programs */}
      <div style={{ marginTop: 80 }}>
        <Eyebrow>{k.programsEyebrow}</Eyebrow>
        <SectionTitle>{k.programsTitle}</SectionTitle>
        <Divider />
        <div style={{ marginTop: 28 }}>
          <SwipeHint />
        </div>
        <div
          className="oro-swipe oro-programs"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, marginTop: 8 }}
        >
          {t.programs.map((p, i) => (
            <Card key={p.slug} style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <Photo
                name={`program-${p.slug}`}
                alt={p.title}
                label={k.photoLabel(p.title)}
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
            <CardTitle size={21}>{k.cateringTitle}</CardTitle>
            <p style={{ fontFamily: SANS, fontSize: 13.5, color: COLORS.inkSoft, fontWeight: 300, margin: 0 }}>
              {k.cateringText}
            </p>
          </div>
        </Card>
        <Card style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <Cake size={22} color={COLORS.gold} strokeWidth={1.5} style={{ flex: "0 0 auto", marginTop: 4 }} />
          <div>
            <CardTitle size={21}>{k.cakeTitle}</CardTitle>
            <p style={{ fontFamily: SANS, fontSize: 13.5, color: COLORS.inkSoft, fontWeight: 300, margin: 0 }}>{k.cakeText}</p>
          </div>
        </Card>
        <div style={{ alignSelf: "center", padding: "0 6px" }}>
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 21, color: COLORS.olive, margin: "0 0 6px", lineHeight: 1.35 }}>
            {k.addonsNote}
          </p>
          <p style={{ fontFamily: SANS, fontSize: 12.5, color: COLORS.inkSoft, fontWeight: 300, margin: 0 }}>
            {k.addonsSmall}
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
  const t = useT();
  const extras = [
    { icon: Gift, href: "#booking" },
    { icon: Sparkles, href: "#booking" },
    { icon: Briefcase, href: whatsapp(t.wa.regular), external: true },
  ];
  const items = t.occasions.map((o, i) => ({ ...o, ...extras[i], cta: [o.cta, extras[i].href, extras[i].external] }));
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
  const t = useT();
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
        src={webpLarge(p.name)}
        alt={p.alt}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 12, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)" }}
      />
      <button aria-label={t.gallery.close} className="oro-icon-btn" onClick={onClose} style={{ ...navBtn("right"), top: 30, transform: "none" }}>
        <X size={20} />
      </button>
      <button
        aria-label={t.gallery.prev}
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
        aria-label={t.gallery.next}
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
  const t = useT();
  const names = [
    "gallery-birthday-group",
    "gallery-meditation-circle",
    "gallery-workshop-scrub",
    "gallery-macarons",
    "gallery-birthday-toast",
    "gallery-workshop-wide",
    "gallery-meditation-alt",
    "gallery-birthday-portrait",
    "gallery-workshop-alt",
  ];
  const photos = names.map((name, i) => ({ name, ...t.gallery.photos[i] }));
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
      <Eyebrow>{t.gallery.eyebrow}</Eyebrow>
      <SectionTitle>{t.gallery.title}</SectionTitle>
      <Divider />
      <Lead>{t.gallery.lead}</Lead>
      <div style={{ marginTop: 28 }}>
        <SwipeHint />
      </div>
      <div
        style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 34 }}
        className="oro-gallery-grid oro-swipe"
      >
        {photos.map((p, i) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setOpen(i)}
            aria-label={t.gallery.open(p.label)}
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
            <Photo name={p.name} alt={p.alt} label={p.label} ratio="4 / 5" sizes="(max-width: 640px) 62vw, (max-width: 860px) 45vw, 360px" />
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
  const t = useT();
  const pr = t.pricing;
  const prices = ["20", "30", "40"];
  const tiers = pr.tiers.map((tier, i) => ({ ...tier, price: prices[i], featured: i === 1 }));
  const included = pr.included;
  const equipmentIcons = [Wifi, Tv, Sparkles, Coffee, Refrigerator, Users, Sparkles];
  const equipment = pr.equipment.map((text, i) => ({ icon: equipmentIcons[i] || Sparkles, text }));
  const floor = pr.floor;

  return (
    <Section id="pricing">
      <Eyebrow>{pr.eyebrow}</Eyebrow>
      <SectionTitle>{pr.title}</SectionTitle>
      <Divider />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 40 }} className="oro-three-col">
        {tiers.map((tier) => (
          <Card key={tier.sub} style={tier.featured ? { background: COLORS.oliveDark, border: "none" } : {}}>
            <p
              style={{
                fontFamily: SANS,
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: tier.featured ? COLORS.goldLight : COLORS.oliveSoft,
                margin: "0 0 6px",
              }}
            >
              {tier.sub}
            </p>
            <h3 style={{ fontFamily: SERIF, fontSize: 24, color: tier.featured ? COLORS.ivoryCard : COLORS.ink, margin: "0 0 18px", fontWeight: 500 }}>
              {tier.title}
            </h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <span style={{ fontFamily: SERIF, fontSize: 52, color: tier.featured ? COLORS.goldLight : COLORS.olive, fontWeight: 600 }}>
                €{tier.price}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: tier.featured ? "rgba(251,248,242,0.7)" : COLORS.inkSoft }}>{t.common.perHour}</span>
            </div>
            {tier.note && (
              <p style={{ fontFamily: SANS, fontSize: 13, color: COLORS.inkSoft, fontWeight: 300, margin: "8px 0 0" }}>{tier.note}</p>
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
        <span>{pr.cleaning}</span>
        <span>
          {pr.regularA}
          <a href={whatsapp(t.wa.regular)} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.oliveDark, fontWeight: 500 }}>
            {pr.regularLink}
          </a>
          {pr.regularB}
        </span>
      </div>

      {/* Что вы получаете */}
      <div style={{ marginTop: 70, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }} className="oro-two-col">
        <Card>
          <CardTitle>{pr.includedTitle}</CardTitle>
          <BulletList items={included} />
          <p style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 20, color: COLORS.olive, margin: "24px 0 0", lineHeight: 1.4 }}>
            {pr.includedQuote}
          </p>
        </Card>

        <Card>
          <details className="oro-details">
            <summary>
              <span style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 500, color: COLORS.olive }}>{pr.equipmentTitle}</span>
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
              {pr.floorNote}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {floor.map((item) => (
                <span
                  key={item}
                  style={{ fontFamily: SANS, fontSize: 12.5, color: COLORS.oliveDark, background: COLORS.ivoryDeep, padding: "8px 14px", borderRadius: 20 }}
                >
                  {item}
                </span>
              ))}
            </div>
          </details>
        </Card>
      </div>

      <div style={{ marginTop: 40 }}>
        <Button href="#booking">{t.common.seeCalendar}</Button>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------
   BOOKING — календарь.
   Если в site.config.js задан BOOKING_API_URL (Google Apps Script, см.
   google-apps-script/), занятые часы берутся из Google Календаря, а заявка
   сразу ставится в календарь. Без него (или если скрипт не ответил) заявка
   уходит в WhatsApp готовым сообщением.
--------------------------------------------------------- */
const TIME_SLOTS = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
const STUDIO_CLOSE_HOUR = 20; // last booking must end by this hour
const DURATIONS = [1, 2, 3, 4, 5, 6, 7, 8];
const EVENT_TYPES = ["individual", "group", "workshop", "birthday", "bachelorette", "game", "other"];
const TURNKEY_TYPES = ["birthday", "bachelorette"];

const pricePerHourFor = (guests) => (guests <= 2 ? 20 : guests <= 10 ? 30 : 40);

function addHours(time, hours) {
  const [h, m] = time.split(":").map(Number);
  return `${String(h + hours).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const hourOf = (time) => Number(time.split(":")[0]);
const ymd = (y, m, d) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

// Longest booking from `time`: until closing or until the next busy hour.
function maxDurationFrom(time, busyHours = []) {
  const start = hourOf(time);
  let h = start;
  while (h < STUDIO_CLOSE_HOUR && !busyHours.includes(h)) h++;
  return Math.max(1, h - start);
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
  const t = useT();
  const b = t.booking;
  // "Today" is only known in the visitor's browser. The page is pre-rendered at
  // build time, so the calendar grid is filled in after the page loads.
  const [today, setToday] = useState(null);
  const [cursor, setCursor] = useState(null);
  useEffect(() => {
    const now = new Date();
    setToday(now);
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
  }, []);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [duration, setDuration] = useState(1);
  const [form, setForm] = useState(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [doneVia, setDoneVia] = useState("whatsapp"); // "calendar" | "whatsapp"
  const [sendState, setSendState] = useState("idle"); // idle | sending | taken | error

  // Busy hours from Google Calendar, per month: { "2026-10": { "2026-10-29": [14, 15] } }
  const [busyByMonth, setBusyByMonth] = useState({});
  const [busyState, setBusyState] = useState(BOOKING_API_URL ? "loading" : "off"); // off | loading | ok | error
  const [reloadKey, setReloadKey] = useState(0);
  const monthKey = cursor ? `${cursor.year}-${cursor.month}` : null;

  useEffect(() => {
    if (!BOOKING_API_URL || !cursor) return;
    let cancelled = false;
    const last = new Date(cursor.year, cursor.month + 1, 0).getDate();
    const url = `${BOOKING_API_URL}?action=busy&from=${ymd(cursor.year, cursor.month, 1)}&to=${ymd(cursor.year, cursor.month, last)}`;
    setBusyState("loading");
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (!data || !data.ok) throw new Error("busy failed");
        setBusyByMonth((prev) => ({ ...prev, [`${cursor.year}-${cursor.month}`]: data.busy || {} }));
        setBusyState("ok");
      })
      .catch(() => !cancelled && setBusyState("error"));
    return () => {
      cancelled = true;
    };
  }, [monthKey, reloadKey]);

  const busyHoursFor = (d) => (cursor && d ? ((busyByMonth[monthKey] || {})[ymd(cursor.year, cursor.month, d)] || []) : []);
  const busyHours = busyHoursFor(selectedDay);
  const slotsLocked = busyState === "loading";

  const isToday =
    !!today && !!cursor && selectedDay === today.getDate() && cursor.month === today.getMonth() && cursor.year === today.getFullYear();
  const slotPassed = (slot) => isToday && hourOf(slot) <= today.getHours();
  const slotBusy = (slot) => busyHours.includes(hourOf(slot));

  const maxDuration = selectedTime ? maxDurationFrom(selectedTime, busyHours) : DURATIONS.length;
  const endTime = selectedTime ? addHours(selectedTime, duration) : null;
  const guests = Math.min(15, Math.max(1, Number(form.guests) || 1));
  const pricePerHour = pricePerHourFor(guests);
  const totalPrice = pricePerHour * duration;

  const cells = useMemo(() => (cursor ? buildCalendar(cursor.year, cursor.month) : []), [cursor]);
  const atCurrentMonth = !cursor || (cursor.year === today.getFullYear() && cursor.month === today.getMonth());

  const isPast = (d) => {
    if (!d || !cursor) return false;
    const date = new Date(cursor.year, cursor.month, d);
    const cmp = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < cmp;
  };
  // A day is closed when every slot is taken (or already over today).
  const isFull = (d) => {
    const hours = busyHoursFor(d);
    if (!hours.length) return false;
    const isTodayCell = cursor.year === today.getFullYear() && cursor.month === today.getMonth() && d === today.getDate();
    return TIME_SLOTS.every((slot) => hours.includes(hourOf(slot)) || (isTodayCell && hourOf(slot) <= today.getHours()));
  };

  const changeMonth = (delta) => {
    if (!cursor) return;
    let m = cursor.month + delta;
    let y = cursor.year;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setCursor({ year: y, month: m });
    setSelectedDay(null);
    setSelectedTime(null);
    setDuration(1);
  };

  const canSubmit = selectedDay && selectedTime && form.name.trim() && form.contact.trim() && sendState !== "sending";

  const dateLabel = selectedDay && cursor ? b.dateLabel(selectedDay, cursor.month, cursor.year) : null;
  const typeLabel = b.eventTypes[form.type];

  const bookingUrl = () =>
    whatsapp(
      t.wa.booking({
        type: typeLabel,
        date: dateLabel,
        time: `${selectedTime}–${endTime}`,
        hours: b.hours(duration),
        guests,
        name: form.name.trim(),
        contact: form.contact.trim(),
        comment: form.comment.trim(),
        price: totalPrice,
      })
    );

  const sendViaWhatsapp = () => {
    window.open(bookingUrl(), "_blank", "noopener,noreferrer");
    setDoneVia("whatsapp");
    setConfirmed(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!BOOKING_API_URL || busyState === "error") return sendViaWhatsapp();

    setSendState("sending");
    // text/plain keeps this a "simple" request, which Google Apps Script accepts cross-origin.
    fetch(BOOKING_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        date: ymd(cursor.year, cursor.month, selectedDay),
        start: hourOf(selectedTime),
        hours: duration,
        type: typeLabel,
        guests,
        name: form.name.trim(),
        contact: form.contact.trim(),
        comment: form.comment.trim(),
        lang: t.lang,
        price: totalPrice,
        website: honeypot,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data && data.ok) {
          setSendState("idle");
          setDoneVia("calendar");
          setConfirmed(true);
          setReloadKey((k) => k + 1);
        } else if (data && (data.error === "busy" || data.error === "past")) {
          setSendState("taken");
          setSelectedTime(null);
          setDuration(1);
          setReloadKey((k) => k + 1);
        } else {
          throw new Error("booking failed");
        }
      })
      .catch(() => setSendState("error"));
  };

  const reset = () => {
    setConfirmed(false);
    setSendState("idle");
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
              {doneVia === "calendar" ? b.doneTitleCal(form.name.trim()) : b.doneTitle(form.name.trim())}
            </h3>
            <p style={{ fontFamily: SANS, fontSize: 14, color: COLORS.inkSoft, lineHeight: 1.7, fontWeight: 300 }}>
              <strong style={{ color: COLORS.olive }}>
                {typeLabel} · {dateLabel}, {selectedTime}–{endTime}
              </strong>
              <br />
              {b.guests(guests)} · {b.hours(duration)}
              <br />
              {doneVia === "calendar" ? b.doneTextCal : b.doneText}
            </p>
            {doneVia === "whatsapp" && (
              <div style={{ marginTop: 18 }}>
                <Button href={bookingUrl()} external>
                  {b.reopen}
                </Button>
              </div>
            )}
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
              {b.again}
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
      <Eyebrow light>{b.eyebrow}</Eyebrow>
      <SectionTitle light>{b.title}</SectionTitle>
      <Lead light style={{ marginTop: 12 }}>
        {b.lead}
      </Lead>

      <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "1.05fr 1fr", gap: 24 }} className="oro-booking-grid">
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <button
              onClick={() => changeMonth(-1)}
              disabled={atCurrentMonth}
              aria-label={b.prevMonth}
              style={{ ...iconBtnStyle, opacity: atCurrentMonth ? 0.35 : 1, cursor: atCurrentMonth ? "default" : "pointer" }}
            >
              <ChevronLeft size={18} color={COLORS.oliveDark} />
            </button>
            <span style={{ fontFamily: SERIF, fontSize: 20, color: COLORS.ink }}>
              {cursor ? `${b.months[cursor.month]} ${cursor.year}` : "\u00a0"}
            </span>
            <button onClick={() => changeMonth(1)} aria-label={b.nextMonth} className="oro-icon-btn" style={iconBtnStyle}>
              <ChevronRight size={18} color={COLORS.oliveDark} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6 }}>
            {b.weekdays.map((w) => (
              <div key={w} style={{ textAlign: "center", fontFamily: SANS, fontSize: 11, color: COLORS.oliveSoft }}>
                {w}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, minHeight: cursor ? undefined : 260 }}>
            {cells.map((d, i) => {
              const full = !!d && !isPast(d) && isFull(d);
              const disabled = !d || isPast(d) || full;
              const active = d === selectedDay;
              return (
                <button
                  key={i}
                  disabled={disabled}
                  className="oro-pick"
                  title={full ? b.dayFull : undefined}
                  onClick={() => {
                    setSelectedDay(d);
                    setSelectedTime(null);
                    setDuration(1);
                    setSendState("idle");
                  }}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 10,
                    border: "none",
                    background: active ? COLORS.oliveDark : d ? COLORS.ivoryDeep : "transparent",
                    color: active ? COLORS.ivoryCard : disabled ? "rgba(58,52,40,0.25)" : COLORS.ink,
                    textDecoration: full ? "line-through" : "none",
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

          {busyState === "loading" && (
            <p style={{ fontFamily: SANS, fontSize: 12, color: COLORS.oliveSoft, margin: "14px 0 0" }}>{b.loadingSlots}</p>
          )}
          {busyState === "error" && (
            <p style={{ fontFamily: SANS, fontSize: 12, color: COLORS.inkSoft, margin: "14px 0 0" }}>{b.slotsError}</p>
          )}

          {selectedDay && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontFamily: SANS, fontSize: 12, color: COLORS.oliveSoft, marginBottom: 10 }}>{b.freeTime(dateLabel)}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {TIME_SLOTS.map((slot) => {
                  const taken = slotBusy(slot);
                  const passed = slotPassed(slot) || taken || slotsLocked;
                  const active = slot === selectedTime;
                  return (
                    <button
                      key={slot}
                      disabled={passed}
                      className="oro-pick"
                      title={taken ? b.slotBusy : undefined}
                      onClick={() => {
                        setSelectedTime(slot);
                        setDuration((d) => Math.min(d, maxDurationFrom(slot, busyHours)));
                        setSendState("idle");
                      }}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 20,
                        border: `1px solid ${active ? COLORS.oliveDark : "rgba(111,122,86,0.3)"}`,
                        background: active ? COLORS.oliveDark : "transparent",
                        color: active ? COLORS.ivoryCard : passed ? "rgba(58,52,40,0.25)" : COLORS.ink,
                        textDecoration: taken ? "line-through" : "none",
                        fontFamily: SANS,
                        fontSize: 12.5,
                        cursor: passed ? "default" : "pointer",
                      }}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedDay && selectedTime && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontFamily: SANS, fontSize: 12, color: COLORS.oliveSoft, marginBottom: 10 }}>{b.duration}</p>
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
                {selectedTime}–{endTime} · {b.hours(duration)}
              </p>
            </div>
          )}
        </Card>

        <Card>
          <CardTitle color={COLORS.ink} size={22}>
            {b.formTitle}
          </CardTitle>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <label>
              {label(b.typeLabel)}
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={inputStyle}>
                {EVENT_TYPES.map((key) => (
                  <option key={key} value={key}>
                    {b.eventTypes[key]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {label(b.guestsLabel)}
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
              placeholder={b.name}
              aria-label={b.name}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder={b.contact}
              aria-label={b.contactAria}
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              style={inputStyle}
            />
            <textarea
              placeholder={b.comment}
              aria-label={b.comment}
              rows={3}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              style={{ ...inputStyle, resize: "vertical", fontFamily: SANS }}
            />
            {/* Ловушка для спам-ботов: скрыта от людей и скринридеров */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: "absolute", left: -9999, width: 1, height: 1, opacity: 0 }}
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
                  {b.desired} {dateLabel}, {selectedTime}–{endTime}
                  <br />
                  {b.rent} <strong>€{totalPrice}</strong> (€{pricePerHour}{b.perHourShort} × {duration})
                  {TURNKEY_TYPES.includes(form.type) && (
                    <>
                      <br />
                      {b.turnkeyNote}
                    </>
                  )}
                </>
              ) : (
                b.chooseHint
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
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
              {sendState === "sending" ? b.sending : BOOKING_API_URL && busyState !== "error" ? b.submitCal : b.submit}
            </button>
            {sendState === "taken" && (
              <p role="alert" style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.6, color: COLORS.oliveDark, fontWeight: 500, margin: 0, textAlign: "center" }}>
                {b.taken}
              </p>
            )}
            {sendState === "error" && (
              <div role="alert" style={{ textAlign: "center" }}>
                <p style={{ fontFamily: SANS, fontSize: 12.5, lineHeight: 1.6, color: COLORS.oliveDark, fontWeight: 500, margin: "0 0 10px" }}>
                  {b.sendError}
                </p>
                <button
                  type="button"
                  onClick={sendViaWhatsapp}
                  className="oro-btn oro-btn-secondary"
                  style={{ fontFamily: SANS, fontSize: 13, color: COLORS.oliveDark, background: "none", border: `1px solid ${COLORS.oliveSoft}`, borderRadius: 30, padding: "10px 22px", cursor: "pointer" }}
                >
                  {b.sendErrorCta}
                </button>
              </div>
            )}
            <p style={{ fontFamily: SANS, fontSize: 12, lineHeight: 1.6, color: COLORS.inkSoft, fontWeight: 300, margin: 0, textAlign: "center" }}>
              {BOOKING_API_URL && busyState !== "error" ? b.submitNoteCal : b.submitNote}
            </p>
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
  const t = useT();
  const f = t.faq;
  const items = f.items;
  return (
    <Section id="faq" bg={COLORS.ivoryDeep}>
      <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: 40, alignItems: "start" }} className="oro-two-col">
        <div>
          <Eyebrow>{f.eyebrow}</Eyebrow>
          <SectionTitle>{f.title}</SectionTitle>
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
            {f.helpTitle}
          </CardTitle>
          <p style={{ fontFamily: SANS, fontSize: 14, lineHeight: 1.75, color: "rgba(251,248,242,0.82)", fontWeight: 300, margin: "0 0 24px" }}>
            {f.helpText}
          </p>
          <Button href={whatsapp(t.wa.format)} light external>
            {f.helpCta}
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
  const t = useT();
  const f = t.final;
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
        <Eyebrow>{f.eyebrow}</Eyebrow>
        <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.8, color: COLORS.inkSoft, fontWeight: 300, margin: "0 auto 26px", maxWidth: 560 }}>
          {f.text}
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
          {f.titleA}<span style={{ color: COLORS.olive, fontStyle: "italic" }}>{f.titleB}</span>
        </h2>
        <p style={{ fontFamily: SANS, fontSize: 15, lineHeight: 1.7, color: COLORS.inkSoft, fontWeight: 300, margin: "0 auto 34px", maxWidth: 520 }}>
          {f.sub}
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Button href="#booking">{t.common.bookStudio}</Button>
          <Button href="#booking" variant="secondary">
            {t.common.seeCalendar}
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
  const t = useT();
  const f = t.footer;
  const [year, setYear] = useState(2026);
  useEffect(() => setYear(new Date().getFullYear()), []);
  const social = [
    { icon: Instagram, label: "Instagram", href: CONTACT.instagram },
    { icon: Phone, label: "WhatsApp", href: `https://wa.me/${PHONE_RAW}` },
    { icon: Send, label: "Telegram", href: CONTACT.telegram },
    { icon: Facebook, label: "Facebook", href: CONTACT.facebook },
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
            {f.tagline}
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
            {t.common.book}
          </a>
        </div>

        <div>
          <h4 style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.1em", color: COLORS.goldLight, margin: "0 0 16px", fontWeight: 500 }}>{f.contacts}</h4>
          <div style={row}>
            <MapPin size={15} color={COLORS.oliveSoft} />
            <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" style={text}>
              {f.address}
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
            <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" style={text}>
              @oro_studio_tln
            </a>
          </div>
          <div style={{ ...row, marginBottom: 0 }}>
            <Clock size={15} color={COLORS.oliveSoft} />
            <span style={text}>{f.hours}</span>
          </div>
        </div>

        <div>
          <h4 style={{ fontFamily: SANS, fontSize: 12, letterSpacing: "0.1em", color: COLORS.goldLight, margin: "0 0 16px", fontWeight: 500 }}>{f.social}</h4>
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
        © {year} ORO Studio. {f.rights}
      </p>
    </footer>
  );
}

/* ---------------------------------------------------------
   APP
--------------------------------------------------------- */
export default function App({ dict }) {
  return (
    <LangContext.Provider value={dict}>
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
    </LangContext.Provider>
  );
}
