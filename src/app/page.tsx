"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Zap } from "lucide-react";
import { VENUES } from "@/lib/venues";
import Nav from "@/components/nav";
import Marquee from "@/components/marquee";
import type { Vibe } from "@/lib/types";
import { useLang } from "@/contexts/lang-context";
import { t } from "@/lib/i18n";

// ─── Vibe colour map ──────────────────────────────────────────────────────────
const VIBE_STYLES: Record<Vibe, { bg: string; text: string }> = {
  "Wine Bar":     { bg: "#0A0A0A", text: "#FFD000" },
  "Cocktail Bar": { bg: "#FF2D2D", text: "#FFFCF2" },
  "Dinner":       { bg: "#FFFCF2", text: "#0A0A0A" },
  "Rooftop":      { bg: "#FFD000", text: "#0A0A0A" },
  "Jazz Club":    { bg: "#0A0A0A", text: "#FFFCF2" },
  "Activity":     { bg: "#F5F1E8", text: "#0A0A0A" },
  "Comedy":       { bg: "#FFD000", text: "#0A0A0A" },
  "Experience":   { bg: "#FF2D2D", text: "#FFD000" },
};

type Tr = typeof t["EN"] | typeof t["EL"];

// ─── Hero photo mosaic (desktop right column) ─────────────────────────────────
// Four real Athens venue images arranged in an asymmetric 2×2 editorial grid.
const MOSAIC = [
  { venueIdx: 1, aspect: "portrait"   }, // tall left-top
  { venueIdx: 3, aspect: "landscape"  }, // short right-top
  { venueIdx: 4, aspect: "landscape"  }, // short right-bottom
  { venueIdx: 0, aspect: "portrait"   }, // tall left-bottom — unused in 2-col layout
];

function HeroPhotoMosaic() {
  const venues = [VENUES[1], VENUES[3], VENUES[4], VENUES[0]];
  const delays = [0.15, 0.25, 0.35, 0.2];

  return (
    <div className="hidden lg:flex flex-1 items-center justify-end py-8 pr-12 xl:pr-20 pointer-events-none select-none">
      <div className="grid grid-cols-2 gap-2.5 w-full max-w-[440px] xl:max-w-[500px]">
        {/* Column A: two stacked portrait-ish cards */}
        <div className="flex flex-col gap-2.5">
          {[VENUES[1], VENUES[4]].map((venue, i) => {
            const style = VIBE_STYLES[venue.vibe] ?? { bg: "#0A0A0A", text: "#FFFCF2" };
            return (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delays[i], duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden group ${i === 0 ? "h-[220px] xl:h-[260px]" : "h-[160px] xl:h-[180px]"}`}
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-700"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase"
                  style={{ background: style.bg, color: style.text }}
                >
                  {venue.vibe}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-display text-cream text-[14px] leading-tight tracking-[-0.01em] truncate">
                    {venue.name}
                  </p>
                  <p className="font-mono text-cream/45 text-[9px] tracking-[1px] mt-0.5 uppercase">
                    {venue.neighborhood}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Column B: one tall card + one short card */}
        <div className="flex flex-col gap-2.5">
          {[VENUES[3], VENUES[0]].map((venue, i) => {
            const style = VIBE_STYLES[venue.vibe] ?? { bg: "#0A0A0A", text: "#FFFCF2" };
            return (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delays[i + 2], duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden group ${i === 0 ? "h-[260px] xl:h-[300px]" : "h-[120px] xl:h-[140px]"}`}
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover scale-[1.02] group-hover:scale-[1.06] transition-transform duration-700"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 font-mono text-[9px] font-bold tracking-widest uppercase"
                  style={{ background: style.bg, color: style.text }}
                >
                  {venue.vibe}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-display text-cream text-[14px] leading-tight tracking-[-0.01em] truncate">
                    {venue.name}
                  </p>
                  {i === 0 && (
                    <p className="font-mono text-cream/45 text-[9px] tracking-[1px] mt-0.5 uppercase">
                      {venue.neighborhood}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Desktop left column: brand + value prop + CTA + stats ───────────────────
function HeroDesktopText({ tr }: { tr: Tr }) {
  return (
    <div className="hidden lg:flex flex-1 flex-col justify-center px-14 xl:px-20 relative z-10 max-w-[620px]">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Eyebrow */}
        <p className="font-mono text-[10px] tracking-[5px] text-taxi/55 uppercase mb-7">
          {tr.heroLabel}
        </p>

        {/* Brand mark */}
        <h1
          className="font-display text-cream leading-[0.82] tracking-[-0.04em] mb-5"
          style={{ fontSize: "clamp(88px, 11vw, 160px)" }}
        >
          BAM<span className="text-siren">!</span>
        </h1>

        {/* Value proposition */}
        <p
          className="font-display text-cream/70 leading-[1.1] tracking-[-0.025em] mb-8"
          style={{ fontSize: "clamp(22px, 2.2vw, 30px)" }}
        >
          Date night in Athens,<br />sorted.
        </p>

        {/* Descriptor */}
        <p className="font-body text-cream/40 text-[14px] xl:text-[15px] leading-relaxed mb-10 max-w-[380px]">
          50 curated spots, zero tourist traps. Wine bars, rooftops, jazz clubs,
          hand-picked for couples in Athens.
        </p>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Link
            href="/discover"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-siren text-cream font-display text-[13px] tracking-widest uppercase hover:bg-siren/90 active:scale-[0.97] transition-all duration-150 shadow-lg"
          >
            {tr.findSpot}
            <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </Link>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-5 py-3.5 border border-cream/15 text-cream/55 font-body text-[13px] font-semibold hover:border-cream/30 hover:text-cream/80 transition-all duration-150"
          >
            {tr.seeMap}
          </Link>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex gap-10 mt-12 pt-8 border-t border-cream/10"
        >
          {[
            { n: "50+", l: tr.stat_venues },
            { n: "10",  l: tr.stat_areas  },
            { n: "0",   l: tr.stat_traps  },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-[28px] tracking-[-0.03em] text-taxi">{s.n}</div>
              <div className="font-mono text-[9px] text-cream/30 tracking-[2px] uppercase mt-0.5">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Mobile hero ──────────────────────────────────────────────────────────────
function HeroMobile({ tr }: { tr: Tr }) {
  return (
    <div className="lg:hidden flex-1 flex flex-col px-5 pt-20 pb-0">

      {/* Eyebrow */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.5 }}
        className="font-mono text-[10px] tracking-[4px] text-taxi/60 uppercase mb-6"
      >
        {tr.heroLabel}
      </motion.p>

      {/* Brand mark */}
      <div className="overflow-hidden mb-1">
        <motion.h1
          className="font-display text-cream tracking-[-0.04em] leading-[0.88]"
          style={{ fontSize: "clamp(80px, 22vw, 116px)" }}
          initial={{ y: "105%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          BAM<span className="text-siren">!</span>
        </motion.h1>
      </div>

      {/* Tagline */}
      <div className="overflow-hidden mb-7">
        <motion.p
          className="font-display text-cream/60 tracking-[-0.03em] leading-[1.05]"
          style={{ fontSize: "clamp(28px, 7.5vw, 42px)" }}
          initial={{ y: "105%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.72, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          Date night in Athens,<br />sorted.
        </motion.p>
      </div>

      {/* Descriptor */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.32, duration: 0.55 }}
        className="font-body text-cream/40 text-[14px] leading-relaxed mb-8 max-w-[300px]"
      >
        {tr.heroSub}
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.44, duration: 0.5 }}
        className="flex flex-col gap-2.5 mb-10"
      >
        <Link
          href="/discover"
          className="flex items-center justify-center gap-2 py-4 bg-siren text-cream font-display text-[13px] tracking-widest uppercase hover:bg-siren/90 active:scale-[0.98] transition-all"
        >
          {tr.findSpot}
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </Link>
        <Link
          href="/discover"
          className="flex items-center justify-center py-3.5 border border-cream/12 text-cream/45 font-body text-[13px] font-semibold hover:border-cream/25 hover:text-cream/65 transition-all"
        >
          {tr.seeMap}
        </Link>
      </motion.div>

      {/* Stats 2×2 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.58, duration: 0.5 }}
        className="grid grid-cols-2 gap-y-5 gap-x-8 pb-10 border-b border-cream/8"
      >
        {[
          { n: "50+", l: tr.stat_venues },
          { n: "10",  l: tr.stat_areas  },
          { n: "3",   l: tr.stat_taps   },
          { n: "0",   l: tr.stat_traps  },
        ].map((s) => (
          <div key={s.l}>
            <div className="font-display text-[30px] tracking-[-0.03em] text-taxi">{s.n}</div>
            <div className="font-mono text-[9px] text-cream/30 tracking-[2px] uppercase mt-0.5">{s.l}</div>
          </div>
        ))}
      </motion.div>

      {/* Venue photo strip — scrollable, bleeds to edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.72, duration: 0.55 }}
        className="-mx-5 relative mt-6"
      >
        <div
          className="flex gap-2 px-5 pb-0 overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {VENUES.slice(0, 6).map((venue, i) => {
            const style = VIBE_STYLES[venue.vibe] ?? { bg: "#0A0A0A", text: "#FFFCF2" };
            return (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.78 + i * 0.06, duration: 0.45 }}
                className="shrink-0 w-[108px] h-[140px] relative overflow-hidden"
              >
                <img
                  src={venue.image}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div
                  className="absolute top-2 left-2 px-1.5 py-0.5 font-mono text-[8px] font-bold tracking-wider uppercase"
                  style={{ background: style.bg, color: style.text }}
                >
                  {venue.vibe}
                </div>
                <p className="absolute bottom-2 left-2 right-2 font-mono text-[9px] text-cream/70 truncate">
                  {venue.neighborhood}
                </p>
              </motion.div>
            );
          })}
          {/* Spacer so last card isn't flush */}
          <div className="shrink-0 w-4" />
        </div>
        {/* Fade-out right edge */}
        <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-ink to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const bgY    = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const fadeOp = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const { lang } = useLang();
  const tr = t[lang];

  const [email, setEmail]       = useState("");
  const [submitted, setSubmitted] = useState(false);

  const marqueeItems = VENUES.map((v) => `${v.name} · ${v.neighborhood}`);

  return (
    <div className="bg-bone min-h-full">
      <Nav />

      {/* ═══ HERO ══════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative bg-ink overflow-hidden"
        style={{ minHeight: "100dvh" }}
      >
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 68% 6%, rgba(255,45,45,0.08) 0%, transparent 60%)," +
                "radial-gradient(ellipse 55% 45% at 18% 92%, rgba(255,208,0,0.05) 0%, transparent 55%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 38%, rgba(10,10,10,0.75) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,252,242,0.028) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(255,252,242,0.028) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
        </div>

        <motion.div
          style={{ y: bgY, opacity: fadeOp }}
          className="relative z-10 flex flex-col justify-between min-h-[100dvh]"
        >
          {/* ── Dual-column desktop ── */}
          <div className="hidden lg:flex flex-1" style={{ minHeight: "calc(100dvh - 52px)" }}>
            <HeroDesktopText tr={tr} />
            <HeroPhotoMosaic />
          </div>

          {/* ── Mobile ── */}
          <HeroMobile tr={tr} />

          {/* ── Marquee (always) ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="relative z-20 border-t border-cream/8 py-3 font-mono text-[11px] text-cream/30 tracking-widest uppercase"
          >
            <Marquee items={marqueeItems} speed="slow" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ HOW IT WORKS ══════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[3px] text-ink/35 uppercase mb-4">
                {tr.howLabel}
              </p>
              <h2 className="font-display text-[38px] md:text-[52px] leading-[0.95] tracking-[-0.03em] text-ink whitespace-pre-line">
                {tr.howTitle}
              </h2>
            </div>
            <Link
              href="/discover"
              className="group flex items-center gap-2 text-siren font-display text-base tracking-wide hover:gap-3 transition-all"
            >
              {tr.howCta}
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-border overflow-hidden">
            {[
              { num: "01", title: tr.step1_title, body: tr.step1_body, accent: "bg-siren" },
              { num: "02", title: tr.step2_title, body: tr.step2_body, accent: "bg-taxi"  },
              { num: "03", title: tr.step3_title, body: tr.step3_body, accent: "bg-ink"   },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-8 md:p-10 flex flex-col gap-6 hover:bg-bone transition-colors duration-200 border-b md:border-b-0 md:border-r border-border last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-0.5 ${step.accent}`} />
                  <span className="font-mono text-[11px] text-ink/25 tracking-widest">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-display text-[30px] md:text-[32px] tracking-[-0.02em] text-ink mb-3">{step.title}</h3>
                  <p className="font-body text-[14px] md:text-[15px] text-ink/55 leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VENUE GRID ════════════════════════════════════════════════════════ */}
      <section className="bg-ink py-16 md:py-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-5 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10 md:mb-12"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[3px] text-taxi/60 uppercase mb-3 md:mb-4">
                {tr.tonightLabel}
              </p>
              <h2 className="font-display text-[36px] md:text-[52px] leading-[0.95] tracking-[-0.03em] text-cream">
                {tr.tonightTitle}
              </h2>
            </div>
            <Link
              href="/discover"
              className="hidden md:flex items-center gap-2 text-cream/50 hover:text-cream font-body text-sm font-semibold transition-colors"
            >
              {tr.allVenues}
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {VENUES.slice(0, 8).map((venue, i) => {
              const style = VIBE_STYLES[venue.vibe] ?? { bg: "#0A0A0A", text: "#FFFCF2" };
              const isTall = i === 0 || i === 3;
              return (
                <motion.div
                  key={venue.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.45 }}
                  whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                  className={isTall ? "md:row-span-2" : ""}
                >
                  <Link href="/discover" className="block group h-full">
                    <div
                      className={`relative overflow-hidden bg-bone h-full ${
                        isTall ? "min-h-[260px] md:min-h-[400px]" : "min-h-[160px] md:min-h-[190px]"
                      }`}
                    >
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wide"
                        style={{ background: style.bg, color: style.text }}
                      >
                        {venue.vibe}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                        <p className="font-display text-cream text-[15px] md:text-[17px] leading-tight tracking-[-0.01em]">
                          {venue.name}
                        </p>
                        <p className="font-mono text-cream/50 text-[9px] md:text-[10px] tracking-wide mt-0.5">
                          {venue.neighborhood} · {venue.budget}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center mt-8 md:mt-10">
            <Link
              href="/discover"
              className="flex items-center gap-2 px-7 py-3 border border-cream/15 text-cream/70 font-display text-[13px] md:text-[14px] tracking-wide hover:bg-cream/5 hover:text-cream hover:border-cream/30 transition-all duration-200"
            >
              {tr.exploreAll}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ VIBE CATEGORIES ═══════════════════════════════════════════════════ */}
      <section className="py-16 md:py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-14"
          >
            <p className="font-mono text-[10px] tracking-[3px] text-ink/35 uppercase mb-4">
              {tr.vibeLabel}
            </p>
            <h2 className="font-display text-[36px] md:text-[52px] leading-[0.95] tracking-[-0.03em] text-ink">
              {tr.vibeTitle}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {(Object.entries(VIBE_STYLES) as [Vibe, { bg: string; text: string }][]).map(
              ([vibe, style], i) => {
                const count = VENUES.filter((v) => v.vibe === vibe).length;
                return (
                  <motion.div
                    key={vibe}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Link
                      href={`/discover?vibe=${encodeURIComponent(vibe)}`}
                      className="flex flex-col justify-between h-28 p-4 md:p-5 transition-all duration-200 group"
                      style={{ background: style.bg }}
                    >
                      <span
                        className="font-mono text-[10px] tracking-[2px] uppercase"
                        style={{ color: style.text, opacity: 0.5 }}
                      >
                        {count} spot{count !== 1 ? "s" : ""}
                      </span>
                      <div className="flex items-end justify-between">
                        <span
                          className="font-display text-[18px] md:text-[20px] leading-tight tracking-[-0.01em]"
                          style={{ color: style.text }}
                        >
                          {vibe}
                        </span>
                        <ArrowUpRight
                          className="w-4 h-4 opacity-0 group-hover:opacity-60 transition-opacity"
                          style={{ color: style.text }}
                          strokeWidth={2.5}
                        />
                      </div>
                    </Link>
                  </motion.div>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* ═══ EMAIL CTA ═════════════════════════════════════════════════════════ */}
      <section className="px-4 sm:px-6 pb-16 md:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1200px] mx-auto"
        >
          <div className="bg-siren px-6 py-14 sm:px-10 md:px-16 md:py-20 relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: "radial-gradient(circle, #FFFCF2 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
            <div className="relative z-10 max-w-xl">
              <p className="font-mono text-[10px] tracking-[3px] text-cream/50 uppercase mb-5">
                {tr.emailLabel}
              </p>
              <h2 className="font-display text-[38px] md:text-[60px] leading-[0.9] tracking-[-0.04em] text-cream mb-5">
                {tr.emailTitle}
              </h2>
              <p className="font-body text-cream/70 text-[14px] md:text-base leading-relaxed mb-9 max-w-sm">
                {tr.emailSub}
              </p>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    exit={{ opacity: 0, y: -8 }}
                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                    className="flex flex-col sm:flex-row gap-2 max-w-sm"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={tr.emailPlaceholder}
                      required
                      className="flex-1 min-w-0 px-5 py-3.5 bg-white/12 text-cream placeholder-cream/35 text-sm font-body border border-cream/15 focus:outline-none focus:bg-white/20 focus:border-cream/30 transition-all"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-6 py-3.5 bg-taxi text-ink font-display text-sm tracking-wide hover:bg-taxi/90 active:scale-[0.97] transition-all sm:w-auto w-full"
                    >
                      {tr.emailJoin}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="thanks"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2.5 py-3 px-5 bg-white/12 border border-cream/15 text-cream font-body font-semibold text-sm max-w-sm"
                  >
                    <Zap className="w-4 h-4 text-taxi fill-taxi shrink-0" strokeWidth={0} />
                    {tr.emailConfirm}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-border py-8 px-6 bg-bone">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-5 md:flex-row md:justify-between md:gap-4">
          <span className="font-display text-[24px] tracking-[-0.04em] text-ink">
            BAM<span className="text-siren">!</span>
          </span>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 font-mono text-[11px] text-ink/35 tracking-wide">
            <a href="https://getbam.fun" className="hover:text-ink/60 transition-colors">getbam.fun</a>
            <span>Athens, GR</span>
            <Link href="/apply" className="hover:text-ink/60 transition-colors">List your venue</Link>
          </div>
          <p className="font-mono text-[11px] text-ink/30 text-center">{tr.rights}</p>
        </div>
      </footer>
    </div>
  );
}
