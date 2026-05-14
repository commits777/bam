"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { VENUES, NEIGHBORHOOD_GR } from "@/lib/venues";
import Nav from "@/components/nav";
import { useSession } from "next-auth/react";

// ─── Rotating headline pairs (4th is Greek) ───────────────────────────────────
const HEADLINE_PAIRS = [
  { top: "DATE NIGHT,",    sub: "HANDLED"  },
  { top: "FRIDAY NIGHT,",  sub: "SORTED"   },
  { top: "PLOT TWIST",     sub: "INCOMING" },
  { top: "ΠΕΜΠΤΗ ΒΡΑΔΥ,", sub: "ΕΤΟΙΜΟ"  },
] as const;

// ─── Marquee items ────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "NOT A BOOKING APP",
  "NOT A DATING APP",
  "NOT A REVIEW SITE",
  "A FRIEND WHO PICKED THE PLACE",
  "ATHENS · FIRST",
  "ΗΔΗ ΔΙΑΛΕΞΑΜΕ",
];

// ─── Occasion tiles (6) ───────────────────────────────────────────────────────
const BAM_OCCASIONS = [
  { id: "first-date",          label: "First Date",    spice: "Bar seating, plausible escape route, cocktail menu.",  no: "01", day: "Παρασκευή"   },
  { id: "anniversary",         label: "Anniversary",   spice: "Worth the cab fare. Order the second bottle.",          no: "02", day: "Σάββατο"     },
  { id: "friday-night",        label: "Friday Night",  spice: "Most likely to make Saturday confusing.",               no: "03", day: "Παρασκευή"   },
  { id: "plot-twist",          label: "Plot Twist",    spice: "Skip dinner. Try the comedy night or shooting range.",  no: "04", day: "Οποτεδήποτε" },
  { id: "late-night",          label: "Late Night",    spice: "After midnight, best decisions of your week.",          no: "05", day: "Παρασκευή"   },
  { id: "sunday-vibe",         label: "Sunday Vibe",   spice: "Brunch done right. No alarm tomorrow.",                 no: "06", day: "Κυριακή"     },
] as const;

// ─── Stamp ────────────────────────────────────────────────────────────────────
function Stamp({ children, color = "siren" }: { children: React.ReactNode; color?: "siren" | "taxi" | "cream" | "ink" }) {
  const cls = { siren: "text-siren", taxi: "text-taxi", cream: "text-cream", ink: "text-ink" }[color];
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase font-bold ${cls}`}>
      <span className="w-[7px] h-[7px] rounded-full bg-current shrink-0" />
      {children}
    </span>
  );
}

// ─── Striped placeholder image ────────────────────────────────────────────────
function BamImg({ variant = 0 }: { variant?: number }) {
  const patterns = [
    "repeating-linear-gradient(45deg,var(--color-bone) 0,var(--color-bone) 12px,#E8E3D9 12px,#E8E3D9 24px)",
    "repeating-linear-gradient(45deg,#EAE5DC 0,#EAE5DC 10px,var(--color-bone) 10px,var(--color-bone) 20px)",
    "repeating-linear-gradient(-45deg,var(--color-bone) 0,var(--color-bone) 8px,#E3DED5 8px,#E3DED5 16px)",
  ];
  return (
    <div className="absolute inset-0" style={{ background: patterns[variant % 3] }}>
      <span className="absolute top-2 left-2 font-mono text-[9px] tracking-[0.12em] uppercase text-ink/35 font-bold bg-cream/80 px-1.5 py-0.5 leading-none">
        venue photo
      </span>
    </div>
  );
}

// ─── Editorial venue card ─────────────────────────────────────────────────────
function VenueCard({ venue, idx }: { venue: typeof VENUES[0]; idx: number }) {
  const [saved, setSaved] = useState(false);
  const { data: session } = useSession();
  const nhGr = NEIGHBORHOOD_GR[venue.neighborhood] ?? venue.neighborhood;

  const handleSave = () => {
    if (!session) { window.location.href = "/auth/signin"; return; }
    setSaved((s) => !s);
  };

  return (
    <article className="bg-cream text-ink rounded-xl overflow-hidden border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      {/* Image */}
      <div className="relative aspect-[4/3] w-full">
        <BamImg variant={idx} />
        <span className="absolute top-3 left-3 bg-ink text-cream font-mono text-[9px] tracking-[0.12em] uppercase font-bold px-2 py-1 leading-none">
          {venue.vibe}
        </span>
        {venue.no != null && (
          <span className="absolute top-3 right-3 bg-cream text-ink font-mono text-[9px] tracking-[0.12em] uppercase font-bold px-2 py-1 leading-none">
            BAM <span className="text-siren">№</span> {String(venue.no).padStart(2, "0")}
          </span>
        )}
        <button
          onClick={handleSave}
          className="absolute bottom-3 left-3 bg-ink text-cream font-mono text-[9px] tracking-[0.12em] uppercase font-bold px-2.5 py-1.5 leading-none hover:bg-siren transition-colors"
        >
          {saved ? "★ SAVED" : "☆ SAVE"}
        </button>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h3 className="font-display text-[24px] leading-[0.95] tracking-[-0.025em]">{venue.name}</h3>
          <span className="font-mono text-[11px] tracking-[0.08em] text-ink/45 font-bold shrink-0 mt-1">{venue.budget}</span>
        </div>

        <p className="text-[14px] text-ink/70 leading-[1.4] mb-3.5 border-l-[3px] border-siren pl-3">
          {venue.tagline}
        </p>

        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.12em] uppercase text-ink/45 font-bold mb-4 flex-wrap">
          <span>{nhGr}</span>
          <span>·</span>
          <span>{venue.walkMin}min</span>
          <span>·</span>
          <span className={venue.openNow ? "text-siren" : "text-ink/35"}>{venue.openNow ? "OPEN" : "CLOSED"}</span>
        </div>

        <a
          href={venue.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-siren text-cream font-display text-[16px] tracking-[-0.01em] py-3.5 hover:opacity-90 transition-opacity"
        >
          BOOK IT<span className="text-taxi">!</span>
        </a>
      </div>
    </article>
  );
}

// ─── Marquee strip ────────────────────────────────────────────────────────────
function MarqueeStrip() {
  return (
    <div className="overflow-hidden py-[10px] bg-ink">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 30s linear infinite" }}>
        {[0, 1, 2].map((loop) => (
          <div key={loop} className="inline-flex gap-8 pl-8">
            {MARQUEE_ITEMS.map((item, i) => (
              <span key={i} className="font-display text-[18px] tracking-[-0.02em] text-cream inline-flex items-center gap-8">
                {item}<span className="text-taxi">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tonight's three picks ────────────────────────────────────────────────────
function TonightsPicks() {
  const picks = VENUES.slice(0, 3);
  return (
    <section className="py-16 px-5 bg-cream">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <Stamp color="siren">Tonight&apos;s three</Stamp>
            <h2 className="font-display leading-[0.92] tracking-[-0.04em] text-ink mt-2" style={{ fontSize: "clamp(40px,5vw,60px)" }}>
              Three picks.<br />
              <span className="text-taxi">One</span>{" "}<span className="text-siren">night.</span>
            </h2>
          </div>
          <Link
            href="/discover"
            className="font-mono text-[11px] tracking-[0.15em] uppercase font-bold border-2 border-ink text-ink px-4 py-2.5 hover:bg-ink hover:text-cream transition-colors shrink-0 whitespace-nowrap"
          >
            SEE ALL 50+ →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          {picks.map((v, i) => <VenueCard key={v.id} venue={v} idx={i} />)}
        </div>
      </div>
    </section>
  );
}

// ─── By occasion grid ─────────────────────────────────────────────────────────
function OccasionGrid() {
  return (
    <section className="py-16 px-5 bg-bone">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10">
          <Stamp color="siren">By occasion</Stamp>
          <h2 className="font-display leading-[0.92] tracking-[-0.04em] text-ink mt-2" style={{ fontSize: "clamp(36px,4.5vw,52px)" }}>
            Pick a <span className="text-siren">reason.</span><br />We&apos;ll pick the night.
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BAM_OCCASIONS.map((occ, i) => {
            const isSiren = i === 0;
            const isInk   = i === 3;
            const isDark   = isSiren || isInk;
            const bg       = isSiren ? "bg-siren" : isInk ? "bg-ink" : "bg-cream border border-black/[0.1]";
            const textMain = isDark ? "text-cream" : "text-ink";
            const accent   = isDark ? "text-taxi"  : "text-siren";
            const muted    = isDark ? "text-cream/55" : "text-ink/50";
            return (
              <div key={occ.id} className={`${bg} rounded-xl flex flex-col gap-4`} style={{ padding: "32px 28px" }}>
                <p className={`font-mono text-[10px] tracking-[0.15em] uppercase font-bold ${muted}`}>
                  № {occ.no} · {occ.day}
                </p>
                <h3 className={`font-display text-[36px] leading-[0.92] tracking-[-0.03em] ${textMain}`}>
                  {occ.label}<span className={accent}>.</span>
                </h3>
                <p className={`text-[15px] leading-[1.45] ${muted}`}>{occ.spice}</p>
                <Link
                  href="/discover"
                  className={`font-mono text-[10px] tracking-[0.15em] uppercase font-bold mt-auto hover:opacity-100 transition-opacity ${isDark ? "text-cream/70" : "text-ink/60"}`}
                >
                  SEE THE LIST →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: "01", title: "OPEN THE MAP", body: "Pins are venues. Numbers are how we ranked them. You see Athens, but only the date-worthy parts." },
    { n: "02", title: "PICK ONE",     body: "Each card has a why-it's-date-worthy line. Written by a human. Read once, decide once." },
    { n: "03", title: "TAP TO BOOK",  body: "Single CTA. We deep-link to the venue's real booking partner. You book in their app. Done." },
  ];
  return (
    <section className="py-16 px-5 bg-ink text-cream">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
        <div>
          <Stamp color="taxi">How it goes</Stamp>
          <h2 className="font-display leading-[0.92] tracking-[-0.04em] mt-3 mb-5" style={{ fontSize: "clamp(44px,5vw,60px)" }}>
            Three taps.<br />One night<span className="text-taxi">.</span>
          </h2>
          <p className="text-[16px] text-cream/65 leading-[1.5] max-w-[340px]">
            From map to booking partner in under a minute. No filters wall. No 14 emails. Sign up only when you save or book.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s) => (
            <div key={s.n} className="border-t-2 border-taxi pt-5">
              <div className="font-display text-[32px] leading-none text-taxi mb-3">{s.n}</div>
              <h3 className="font-display text-[18px] leading-tight tracking-[-0.01em] mb-2">{s.title}</h3>
              <p className="text-[14px] text-cream/60 leading-[1.45]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Founder note ─────────────────────────────────────────────────────────────
function FounderNote() {
  return (
    <section className="bg-cream">
      <div className="max-w-[1100px] mx-auto px-5 md:px-14 py-20">
        <Stamp color="siren">A note</Stamp>
        <h2 className="font-display leading-[0.92] tracking-[-0.04em] text-ink mt-3 mb-8" style={{ fontSize: "clamp(32px,4vw,48px)" }}>
          We don&apos;t list every venue.<br />
          <span className="text-ink">That&apos;s the point</span><span className="text-siren">.</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[18px] text-ink/70 leading-[1.6]">
          <p>BAM! is curated by humans who live in Athens. Every venue is hand-picked, tagged by vibe, written about in one sentence. We don&apos;t take reservations — we send you to e-table, TheList, OpenTable. We just decided where.</p>
          <p>Curation is the moat. The day we add a venue because they paid us to be there, BAM! dies. So we don&apos;t.</p>
        </div>
      </div>
    </section>
  );
}

// ─── Closing CTA ──────────────────────────────────────────────────────────────
function ClosingCTA() {
  return (
    <section className="bg-siren text-cream text-center px-5 py-[72px]">
      <h2
        className="font-display leading-[0.88] tracking-[-0.045em] mb-6"
        style={{ fontSize: "clamp(60px,9vw,128px)" }}
      >
        Friday&apos;s<br /><span className="text-taxi">tomorrow.</span>
      </h2>
      <p className="text-[20px] text-cream/80 max-w-[540px] mx-auto mb-10 leading-[1.5]">
        Open the map, pick the place, tap to book. Four minutes from this page to a reservation confirmation in your inbox.
      </p>
      <Link
        href="/discover"
        className="inline-flex items-center gap-3 bg-cream text-ink font-display text-[24px] tracking-[-0.02em] px-8 py-5 shadow-[0_14px_30px_rgba(0,0,0,0.18)] hover:bg-bone transition-colors"
        style={{ borderRadius: 8 }}
      >
        OPEN GETBAM.FUN <span className="text-siren">→</span>
      </Link>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-ink px-5 pt-14 pb-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Col 1 */}
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-[32px] tracking-[-0.04em] text-cream mb-3">
              BAM<span className="text-taxi">!</span>
            </div>
            <p className="text-[14px] max-w-[280px] leading-[1.55]" style={{ color: "rgba(255,252,242,0.65)" }}>
              Athens&apos; loudest date-night brand. Curated by humans, booked via partners.
            </p>
          </div>
          {/* Col 2 */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase font-bold text-taxi mb-4">Product</p>
            <ul className="flex flex-col gap-2.5">
              {["Discover", "Plan a date", "Open dates", "Saved"].map((l) => (
                <li key={l}>
                  <Link href="/discover" className="text-[14px] hover:text-cream transition-colors" style={{ color: "rgba(255,252,242,0.65)" }}>{l}</Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Col 3 */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase font-bold text-taxi mb-4">BAM!</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "For venues", href: "/apply" },
                { label: "Newsletter", href: "#" },
                { label: "Manifesto",  href: "#" },
                { label: "Instagram",  href: "https://www.instagram.com/bam.athens/" },
              ].map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="text-[14px] hover:text-cream transition-colors"
                    style={{ color: "rgba(255,252,242,0.65)" }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* Col 4 */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase font-bold text-taxi mb-4">Athens</p>
            <ul className="flex flex-col gap-2.5">
              {["Κουκάκι · Petralona", "Παγκράτι · Exarcheia", "Κολωνάκι · Kypseli", "+ 6 more soon"].map((l) => (
                <li key={l} className="text-[14px]" style={{ color: "rgba(255,252,242,0.65)" }}>{l}</li>
              ))}
            </ul>
          </div>
        </div>
        {/* Bottom bar */}
        <div
          className="border-t pt-5 flex flex-col sm:flex-row justify-between gap-2 font-mono text-[10px] tracking-[0.15em] uppercase"
          style={{ borderColor: "rgba(255,252,242,0.1)", color: "rgba(255,252,242,0.35)" }}
        >
          <span>© BAM! 2026 · ATHENS</span>
          <span>getbam.fun · v2026.05</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Desktop hero ─────────────────────────────────────────────────────────────
function DesktopHero({ pairIdx }: { pairIdx: number }) {
  const { top, sub } = HEADLINE_PAIRS[pairIdx];
  return (
    <div
      className="hidden lg:grid min-h-dvh bg-siren text-cream pt-14"
      style={{ gridTemplateColumns: "1.5fr 1fr" }}
    >
      {/* Left: eyebrow + headline + subtitle */}
      <div className="flex flex-col justify-center px-14 xl:px-20 py-16">
        <p className="font-mono text-[12px] tracking-[0.2em] uppercase text-taxi font-bold mb-6">
          ● TONIGHT, IN ATHENS · BAM № 2026
        </p>
        <h1
          className="font-display leading-[0.82] tracking-[-0.045em] mb-8"
          style={{ fontSize: "clamp(80px,11vw,168px)", minHeight: "clamp(160px,24vw,300px)" }}
        >
          <span className="block">{top}</span>
          <span className="block text-taxi">{sub}<span className="text-cream">.</span></span>
        </h1>
        <p className="text-[22px] leading-[1.4] text-cream/85 max-w-[560px]">
          Stop scrolling Google Maps. We&apos;ve already picked. Curated date-night venues across Athens — browse the whole map free, book with one tap.
        </p>
      </div>

      {/* Right: CTAs + caption */}
      <div className="flex flex-col justify-center items-start pl-10 xl:pl-16 pr-14 xl:pr-20 py-16">
        <div className="flex flex-col gap-4 w-full max-w-[360px]">
          <Link
            href="/discover"
            className="flex items-center justify-between font-display text-[22px] tracking-[-0.02em] text-ink bg-cream px-5 py-5 shadow-[0_14px_30px_rgba(0,0,0,0.18)] hover:bg-bone transition-colors"
            style={{ borderRadius: 8 }}
          >
            OPEN THE MAP <span className="text-siren">→</span>
          </Link>
          <Link
            href="/discover"
            className="flex items-center justify-between font-display text-[18px] tracking-[-0.02em] text-cream border-2 border-cream px-5 py-4 hover:bg-cream/10 transition-colors"
            style={{ borderRadius: 8 }}
          >
            PLAN A DATE <span>→</span>
          </Link>
        </div>
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-cream/55 font-bold mt-6">
          50+ HAND-PICKED VENUES · 6 NEIGHBORHOODS · FREE TO BROWSE
        </p>
      </div>
    </div>
  );
}

// ─── Mobile hero ──────────────────────────────────────────────────────────────
function MobileHero({ pairIdx }: { pairIdx: number }) {
  const { top, sub } = HEADLINE_PAIRS[pairIdx];
  return (
    <section className="lg:hidden min-h-dvh flex flex-col bg-siren text-cream pt-14 overflow-hidden">
      <div className="flex-shrink-0 px-[22px] pt-11 pb-7">
        <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-taxi font-bold mb-4">
          ● TONIGHT, IN ATHENS
        </p>
        <h1
          className="font-display leading-[0.85] tracking-[-0.045em] mb-3.5"
          style={{ fontSize: "clamp(56px,17vw,80px)", minHeight: "115px" }}
        >
          <span className="block">{top}</span>
          <span className="block text-taxi">{sub}<span className="text-cream">.</span></span>
        </h1>
        <p className="text-[16px] leading-[1.45] text-cream/85 max-w-[320px] mb-6">
          Stop scrolling Google Maps. We&apos;ve already picked.
        </p>
        <Link
          href="/discover"
          className="inline-flex items-center gap-2.5 bg-cream text-ink font-display text-[18px] px-[22px] py-[15px] shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-bone transition-colors"
        >
          OPEN THE MAP <span className="text-siren">→</span>
        </Link>
      </div>
      <div className="px-[22px] pt-4 pb-8 border-t border-cream/18 mt-auto">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-cream/50 font-bold">
          50+ HAND-PICKED VENUES · 6 NEIGHBORHOODS · FREE TO BROWSE
        </p>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [pairIdx, setPairIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPairIdx((i) => (i + 1) % HEADLINE_PAIRS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-dvh">
      <Nav />
      <DesktopHero pairIdx={pairIdx} />
      <MobileHero pairIdx={pairIdx} />
      <MarqueeStrip />
      <TonightsPicks />
      <OccasionGrid />
      <HowItWorks />
      <FounderNote />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
