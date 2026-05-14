"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { VENUES, NEIGHBORHOOD_GR } from "@/lib/venues";
import Nav from "@/components/nav";
import { useLang } from "@/contexts/lang-context";

// ─── Marquee ─────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "NOT A BOOKING APP",
  "NOT A DATING APP",
  "NOT A REVIEW SITE",
  "A FRIEND WHO PICKED THE PLACE",
  "ATHENS FIRST",
  "ΗΔΗ ΔΙΑΛΕΞΑΜΕ",
];

// ─── Rotating headlines ───────────────────────────────────────────────────────
const HEADLINES_EN = ["DATE NIGHT,", "FRIDAY NIGHT,", "PLOT TWIST,", "PLAN B,"] as const;
const SUBS_EN      = ["handled", "sorted", "incoming", "handled"] as const;
const HEADLINES_EL = ["DATE NIGHT,", "ΠΑΡΑΣΚΕΥΗ,", "ΣΑΒΒΑΤΟ,", "ΤΡΙΤΗ,"] as const;
const SUBS_EL      = ["τσεκάρε", "τσεκάρε", "τσεκάρε", "τσεκάρε"] as const;

// ─── BAM stamp with leading dot ───────────────────────────────────────────────
function Stamp({ children, color = "siren" }: { children: React.ReactNode; color?: "siren" | "taxi" | "cream" }) {
  const c = { siren: "text-siren", taxi: "text-taxi", cream: "text-cream" }[color];
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase font-bold ${c}`}>
      <span className="w-[7px] h-[7px] rounded-full bg-current shrink-0" />
      {children}
    </span>
  );
}

// ─── Editorial number badge ───────────────────────────────────────────────────
function EditorialNo({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex items-baseline gap-1 font-mono text-[10px] tracking-[0.18em] uppercase font-bold ${className}`}>
      <span className="opacity-60">BAM</span>
      <span className="text-siren">!</span>
      <span>{String(n).padStart(2, "0")}</span>
    </span>
  );
}

// ─── Tonight's pick card ──────────────────────────────────────────────────────
function TonightPick({ venue, onEnter }: { venue: typeof VENUES[0]; onEnter: string }) {
  const nhGr = NEIGHBORHOOD_GR[venue.neighborhood] ?? venue.neighborhood;
  return (
    <div
      className="mx-3.5 mb-4 rounded-[14px] bg-cream text-ink p-[18px] shadow-[0_14px_36px_rgba(0,0,0,0.25)] cursor-pointer"
      onClick={() => {}}
    >
      <div className="flex items-baseline justify-between mb-2.5">
        <Stamp color="siren">Tonight&apos;s pick</Stamp>
        {venue.no && <EditorialNo n={venue.no} />}
      </div>

      <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-3">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover"
          draggable={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      <h3 className="font-display text-[28px] leading-[0.95] tracking-[-0.025em] mb-2">
        {venue.name}
      </h3>
      <p className="text-[14px] text-ink/65 leading-[1.4] mb-3.5">
        &ldquo;{venue.tagline}&rdquo;
      </p>
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em] uppercase text-ink/50 font-bold">
        <span>{nhGr} · {venue.walkMin}min</span>
        <Link href="/discover" className="text-siren hover:opacity-80 transition-opacity">
          SEE {VENUES.length - 1} MORE →
        </Link>
      </div>
    </div>
  );
}

// ─── How it works — 3 numbered ink cards ─────────────────────────────────────
function HowItWorks({ isEL }: { isEL: boolean }) {
  const steps = isEL
    ? [
        { n: "1.", title: "Διάλεξε ένα.", body: "Φιλτράρισε κατά vibe, γειτονιά ή budget. Ή άσε μας να επιλέξουμε για σένα." },
        { n: "2.", title: "Μάθε το γιατί.", body: "Κάθε μέρος έχει μία γραμμή που εξηγεί γιατί αξίζει απόψε — όχι κριτικές, γνώμες." },
        { n: "3.", title: "Κλείσε κατευθείαν.", body: "Ένα tap σε πηγαίνει στο partner. Ίδια τιμή, ίδια θέση." },
      ]
    : [
        { n: "1.", title: "Pick one.", body: "Filter by vibe, hood, or budget. Or let us pick for you." },
        { n: "2.", title: "Read the why.", body: "Every spot has one line explaining why it's date-worthy — no reviews, just opinions." },
        { n: "3.", title: "Book direct.", body: "One tap takes you to the partner. Same price, same table." },
      ];

  return (
    <section className="bg-cream py-14 px-5">
      <div className="mb-10">
        <Stamp color="siren">{isEL ? "Πώς λειτουργεί" : "How it works"}</Stamp>
        <h2 className="font-display text-[38px] leading-[0.9] tracking-[-0.03em] text-ink mt-3">
          {isEL ? "Τρία taps.\nΜία βραδιά." : "Three taps.\nOne night."}
        </h2>
      </div>

      <div className="bg-ink text-cream rounded-xl p-5 flex flex-col gap-5">
        {steps.map((s) => (
          <div key={s.n} className="grid grid-cols-[30px_1fr] gap-3.5 items-baseline">
            <span className="font-display text-[22px] text-taxi leading-none">{s.n}</span>
            <div>
              <p className="font-display text-[17px] leading-tight tracking-[-0.01em] mb-1">{s.title}</p>
              <p className="text-[13px] text-cream/65 leading-[1.4]">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Desktop landing layout ───────────────────────────────────────────────────
function DesktopLanding({
  headlines, subs, headlineIdx, isEL,
}: {
  headlines: readonly string[];
  subs: readonly string[];
  headlineIdx: number;
  isEL: boolean;
}) {
  const tonightPick = VENUES[0];
  const nhGr = NEIGHBORHOOD_GR[tonightPick.neighborhood] ?? tonightPick.neighborhood;

  return (
    <div className="hidden lg:grid grid-cols-[1fr_420px] min-h-dvh bg-siren text-cream pt-14">
      {/* Left: hero copy */}
      <div className="flex flex-col justify-center px-14 xl:px-20">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-taxi font-bold mb-5">
          ● TONIGHT, IN ATHENS
        </p>

        <h1
          className="font-display leading-[0.85] tracking-[-0.045em] mb-4 min-h-[160px]"
          style={{ fontSize: "clamp(64px, 6.5vw, 96px)" }}
        >
          <span className="block">{headlines[headlineIdx]}</span>
          <span className="block text-taxi">
            {subs[headlineIdx]}<span className="text-cream">.</span>
          </span>
        </h1>

        <p className="text-[16px] leading-[1.45] text-cream/80 max-w-[360px] mb-8">
          {isEL
            ? "Σταμάτα να σκρολάρεις στο Google Maps. Έχουμε ήδη διαλέξει."
            : "Stop scrolling Google Maps. We've already picked."}
        </p>

        <div className="flex items-center gap-3 mb-12">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2.5 bg-cream text-ink font-display text-[18px] px-6 py-4 shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-bone transition-colors"
          >
            OPEN THE MAP <span className="text-siren">→</span>
          </Link>
        </div>

        {/* Stats 2×2 */}
        <div className="grid grid-cols-2 gap-y-5 gap-x-8 pt-8 border-t border-cream/18 max-w-[360px]">
          {[
            { label: "VENUES",       val: "50 +" },
            { label: "HAND-PICKED",  val: "BY HUMANS" },
            { label: "BOOKING",      val: "VIA PARTNERS" },
            { label: "BROWSE",       val: "FREE" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-cream/50 font-bold mb-1">{s.label}</div>
              <div className="font-display text-[22px] leading-tight tracking-[-0.02em]">{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: tonight's pick card */}
      <div className="flex flex-col justify-center pr-10 xl:pr-16 py-12">
        <div className="bg-cream text-ink rounded-[14px] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="flex items-baseline justify-between mb-3">
            <Stamp color="siren">Tonight&apos;s pick</Stamp>
            {tonightPick.no && <EditorialNo n={tonightPick.no} />}
          </div>
          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden mb-4">
            <img src={tonightPick.image} alt={tonightPick.name} className="w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
          <h3 className="font-display text-[26px] leading-[0.95] tracking-[-0.025em] mb-2">{tonightPick.name}</h3>
          <p className="text-[14px] text-ink/65 leading-[1.4] mb-4">&ldquo;{tonightPick.tagline}&rdquo;</p>
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.12em] uppercase text-ink/50 font-bold">
            <span>{nhGr} · {tonightPick.walkMin}min</span>
            <Link href="/discover" className="text-siren hover:opacity-80 transition-opacity">
              SEE {VENUES.length - 1} MORE →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { lang } = useLang();
  const isEL = lang === "EL";
  const headlines = isEL ? HEADLINES_EL : HEADLINES_EN;
  const subs      = isEL ? SUBS_EL : SUBS_EN;
  const [headlineIdx, setHeadlineIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHeadlineIdx((i) => (i + 1) % headlines.length), 2400);
    return () => clearInterval(id);
  }, [headlines.length]);

  const tonightPick = VENUES[0];

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-cream)" }}>
      <Nav />

      {/* ═══ DESKTOP ══════════════════════════════════════════════════════════ */}
      <DesktopLanding headlines={headlines} subs={subs} headlineIdx={headlineIdx} isEL={isEL} />

      {/* ═══ MOBILE HERO ══════════════════════════════════════════════════════ */}
      <section className="lg:hidden min-h-dvh flex flex-col bg-siren text-cream pt-14 overflow-hidden">
        {/* Top strip */}
        <div className="flex items-center justify-between px-5 pt-4 pb-0">
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-cream/65">
            ATHENS · BAM! 2026
          </span>
        </div>

        {/* Hero block */}
        <div className="flex-shrink-0 px-[22px] pt-11 pb-7">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-taxi font-bold mb-4">
            ● TONIGHT, IN ATHENS
          </p>

          <h1
            className="font-display leading-[0.85] tracking-[-0.045em] mb-3.5 min-h-[120px]"
            style={{ fontSize: "clamp(62px, 18vw, 80px)" }}
          >
            <span className="block">{headlines[headlineIdx]}</span>
            <span className="block text-taxi">
              {subs[headlineIdx]}<span className="text-cream">.</span>
            </span>
          </h1>

          <p className="text-[16px] leading-[1.45] text-cream/85 max-w-[320px] mb-6">
            {isEL
              ? "Σταμάτα να σκρολάρεις στο Google Maps. Έχουμε ήδη διαλέξει."
              : "Stop scrolling Google Maps. We've already picked."}
          </p>

          <Link
            href="/discover"
            className="inline-flex items-center gap-2.5 bg-cream text-ink font-display text-[18px] px-[22px] py-[15px] shadow-[0_8px_24px_rgba(0,0,0,0.18)] hover:bg-bone transition-colors"
          >
            OPEN THE MAP <span className="text-siren">→</span>
          </Link>
        </div>

        {/* Tonight's pick card */}
        <TonightPick venue={tonightPick} onEnter="/discover" />

        {/* Stats 2×2 */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-[22px] py-5 border-t border-cream/18 mt-auto">
          {[
            { label: "VENUES",      val: "50 +" },
            { label: "HAND-PICKED", val: "BY HUMANS" },
            { label: "BOOKING",     val: "VIA PARTNERS" },
            { label: "BROWSE",      val: "FREE" },
          ].map((s) => (
            <div key={s.label}>
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-cream/50 font-bold mb-1">{s.label}</div>
              <div className="font-display text-[22px] leading-tight tracking-[-0.02em]">{s.val}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ MARQUEE STRIP ════════════════════════════════════════════════════ */}
      <div
        className="overflow-hidden py-[10px] border-t border-b"
        style={{
          background: "var(--color-siren)",
          borderColor: "rgba(0,0,0,0.15)",
          color: "var(--color-cream)",
        }}
      >
        <div className="flex whitespace-nowrap animate-marquee">
          {[0, 1, 2].map((loop) => (
            <div key={loop} className="inline-flex gap-8 pl-8">
              {MARQUEE_ITEMS.map((item, i) => (
                <span key={i} className="font-display text-[20px] tracking-[-0.02em] inline-flex items-center gap-8">
                  {item}
                  <span className="text-taxi">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══ HOW IT WORKS ═════════════════════════════════════════════════════ */}
      <HowItWorks isEL={isEL} />

      {/* ═══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-ink py-10 px-5">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
          <span className="font-display text-[32px] tracking-[-0.04em] text-cream">
            BAM<span className="text-siren">!</span>
          </span>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 font-mono text-[10px] text-cream/35 tracking-wide">
            <a href="https://getbam.fun" className="hover:text-cream/60 transition-colors">getbam.fun</a>
            <span className="text-cream/15">·</span>
            <span>Athens, GR</span>
            <span className="text-cream/15">·</span>
            <a href="https://www.instagram.com/bam.athens/" target="_blank" rel="noopener noreferrer" className="hover:text-cream/60 transition-colors">@bam.athens</a>
            <span className="text-cream/15">·</span>
            <Link href="/apply" className="hover:text-cream/60 transition-colors">List your venue</Link>
          </div>
          <p className="font-mono text-[10px] text-cream/20">© {new Date().getFullYear()} BAM!</p>
        </div>
      </footer>
    </div>
  );
}
