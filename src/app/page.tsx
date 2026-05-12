"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, Zap } from "lucide-react";
import { VENUES } from "@/lib/venues";
import Nav from "@/components/nav";
import Marquee from "@/components/marquee";
import Floating, { FloatingElement } from "@/components/ui/parallax-floating";
import type { Vibe } from "@/lib/types";
import { useLang } from "@/contexts/lang-context";
import { t } from "@/lib/i18n";

const FLOATING_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&auto=format&q=80",
    alt: "Cocktails at bar",
    className: "top-[10%] left-[4%] w-36 h-48",
    depth: 2,
    delay: 0.2,
  },
  {
    src: "https://images.unsplash.com/photo-1528823872057-9c018a7a7553?w=400&auto=format&q=80",
    alt: "Rooftop at night",
    className: "top-[6%] right-[5%] w-44 h-56",
    depth: 1.5,
    delay: 0.35,
  },
  {
    src: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&q=80",
    alt: "Wine glasses",
    className: "top-[40%] left-[7%] w-32 h-40",
    depth: 3,
    delay: 0.15,
  },
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&auto=format&q=80",
    alt: "Fine dining restaurant",
    className: "top-[32%] right-[4%] w-40 h-52",
    depth: 2.5,
    delay: 0.45,
  },
  {
    src: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&auto=format&q=80",
    alt: "Jazz club",
    className: "bottom-[22%] left-[10%] w-36 h-44",
    depth: 1.8,
    delay: 0.3,
  },
  {
    src: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&auto=format&q=80",
    alt: "Candlelit dinner",
    className: "bottom-[18%] right-[8%] w-32 h-40",
    depth: 2.2,
    delay: 0.5,
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&auto=format&q=80",
    alt: "Romantic dinner",
    className: "top-[20%] left-[20%] w-28 h-36",
    depth: 1.2,
    delay: 0.4,
  },
  {
    src: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&q=80",
    alt: "Cocktail close-up",
    className: "top-[15%] right-[19%] w-[120px] h-[152px]",
    depth: 2.8,
    delay: 0.25,
  },
];

type Tr = typeof t["EN"] | typeof t["EL"];

function HeroFloating({ tr }: { tr: Tr }) {
  return (
    <div className="hidden lg:block flex-1 relative" style={{ minHeight: "calc(100dvh - 60px)" }}>
      <Floating sensitivity={0.7} easingFactor={0.055}>
        {FLOATING_IMAGES.map((img, i) => (
          <FloatingElement key={i} depth={img.depth} className={img.className}>
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: img.delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.55)] w-full h-full"
              style={{ borderRadius: "2px" }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </FloatingElement>
        ))}
      </Floating>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-8"
        >
          <div className="text-center">
            <p className="font-mono text-[10px] tracking-[5px] text-taxi/60 uppercase mb-5">
              {tr.heroLabel}
            </p>
            <h1
              className="font-display text-cream leading-[0.85] tracking-[-0.04em] drop-shadow-2xl"
              style={{ fontSize: "clamp(100px, 16vw, 220px)" }}
            >
              BAM<span className="text-siren">!</span>
            </h1>
          </div>

          <Link
            href="/discover"
            className="pointer-events-auto group flex items-center gap-2.5 px-8 py-4 bg-siren text-cream font-display text-[15px] tracking-widest uppercase hover:bg-siren/90 active:scale-[0.97] transition-all duration-150 shadow-lg"
            style={{ borderRadius: "2px" }}
          >
            {tr.experience ?? "Experience"}
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
          </Link>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex gap-10"
          >
            {[
              { n: "50+", l: tr.stat_venues },
              { n: "10",  l: tr.stat_areas },
              { n: "0",   l: tr.stat_traps },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="font-display text-[26px] tracking-[-0.03em] text-taxi">{s.n}</div>
                <div className="font-mono text-[9px] text-cream/30 tracking-[2px] uppercase mt-0.5">{s.l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

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

function WordReveal() {
  const words = ["DATE", "NIGHT."] as const;
  return (
    <div>
      {words.map((word, i) => (
        <div key={word} className="overflow-hidden block">
          <motion.span
            className="block font-display text-cream leading-[0.9] tracking-[-0.04em]"
            style={{ fontSize: "clamp(80px, 14vw, 200px)" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            {word === "NIGHT." ? <>NIGHT<span className="text-siren">.</span></> : word}
          </motion.span>
        </div>
      ))}
      <div className="overflow-hidden block">
        <motion.span
          className="block font-display leading-[0.9] tracking-[-0.04em] text-taxi"
          style={{ fontSize: "clamp(80px, 14vw, 200px)" }}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          HANDLED<span className="text-siren">.</span>
        </motion.span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const { lang } = useLang();
  const tr = t[lang];

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const marqueeItems = VENUES.map((v) => `${v.name} — ${v.neighborhood}`);

  return (
    <div className="bg-bone min-h-full">
      <Nav />

      {/* ═══ HERO ════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative bg-ink overflow-hidden" style={{ minHeight: "100dvh" }}>
        {/* CSS background — no photo, brand-consistent depth */}
        <div className="absolute inset-0">
          {/* Warm radial depth — top-right anchor */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 72% 8%, rgba(255,45,45,0.07) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 20% 90%, rgba(255,208,0,0.04) 0%, transparent 55%)",
            }}
          />
          {/* Vignette edges */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(10,10,10,0.7) 100%)",
            }}
          />
        </div>

        {/* Grid texture on top */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,252,242,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,252,242,0.035) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        {/* Siren glow — stronger against photo */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,45,45,0.28) 0%, transparent 65%)" }}
        />

        <motion.div style={{ y: bgY, opacity }} className="relative z-10 flex flex-col justify-between min-h-[100dvh]">

          {/* ── Desktop: parallax floating overlay ── */}
          <HeroFloating tr={tr} />

          {/* ── Mobile: word reveal + CTAs ── */}
          <div className="lg:hidden flex-1 flex flex-col justify-center px-6 max-w-[1400px] mx-auto w-full pt-20">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.6 }}
              className="font-mono text-[11px] tracking-[4px] text-taxi/70 uppercase mb-8"
            >
              {tr.heroLabel}
            </motion.p>

            <WordReveal />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="mt-12 flex flex-col sm:flex-row sm:items-center gap-6"
            >
              <p className="text-cream/60 text-base max-w-xs leading-relaxed font-body">
                {tr.heroSub}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/discover"
                  className="group flex items-center gap-2 px-6 py-3 rounded-sm bg-siren text-cream font-display text-[14px] tracking-wide hover:bg-siren/90 active:scale-[0.97] transition-all duration-150"
                >
                  {tr.findSpot}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                </Link>
                <Link
                  href="/discover"
                  className="flex items-center gap-2 px-6 py-3 rounded-sm border border-cream/15 text-cream/70 font-body font-semibold text-[14px] hover:border-cream/30 hover:text-cream transition-all duration-150"
                >
                  {tr.seeMap}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex gap-10 mt-16 pt-8 border-t border-cream/8"
            >
              {[
                { n: "50+", l: tr.stat_venues },
                { n: "10",  l: tr.stat_areas },
                { n: "3",   l: tr.stat_taps },
                { n: "0",   l: tr.stat_traps },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-[28px] tracking-[-0.03em] text-taxi">{s.n}</div>
                  <div className="font-mono text-[10px] text-cream/35 tracking-[2px] uppercase mt-0.5">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Marquee — always visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="relative z-20 border-t border-cream/8 py-3.5 font-mono text-[12px] text-cream/35 tracking-widest uppercase"
          >
            <Marquee items={marqueeItems} speed="slow" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ HOW IT WORKS ════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[3px] text-ink/35 uppercase mb-4">
                {tr.howLabel}
              </p>
              <h2 className="font-display text-[52px] leading-[0.95] tracking-[-0.03em] text-ink whitespace-pre-line">
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

          {/* Steps — flush grid, no individual card rounding */}
          <div className="grid grid-cols-1 md:grid-cols-3 border border-border overflow-hidden">
            {[
              { num: "01", title: tr.step1_title, body: tr.step1_body, accent: "bg-siren" },
              { num: "02", title: tr.step2_title, body: tr.step2_body, accent: "bg-taxi" },
              { num: "03", title: tr.step3_title, body: tr.step3_body, accent: "bg-ink" },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-white p-10 flex flex-col gap-6 hover:bg-bone transition-colors duration-200 border-b md:border-b-0 md:border-r border-border last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-8 h-0.5 ${step.accent}`} />
                  <span className="font-mono text-[11px] text-ink/25 tracking-widest">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-display text-[32px] tracking-[-0.02em] text-ink mb-3">{step.title}</h3>
                  <p className="text-[15px] text-ink/55 leading-relaxed">{step.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VENUE GRID ══════════════════════════════════════ */}
      <section className="bg-ink py-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="font-mono text-[10px] tracking-[3px] text-taxi/60 uppercase mb-4">
                {tr.tonightLabel}
              </p>
              <h2 className="font-display text-[52px] leading-[0.95] tracking-[-0.03em] text-cream">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                        isTall ? "min-h-[400px]" : "min-h-[190px]"
                      }`}
                    >
                      <img
                        src={venue.image}
                        alt={venue.name}
                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-[1.06]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                      {/* Vibe tag — consistent with card component */}
                      <div
                        className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wide"
                        style={{ background: style.bg, color: style.text }}
                      >
                        {venue.vibe}
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="font-display text-cream text-[17px] leading-tight tracking-[-0.01em]">
                          {venue.name}
                        </p>
                        <p className="font-mono text-cream/50 text-[10px] tracking-wide mt-0.5">
                          {venue.neighborhood} · {venue.budget}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/discover"
              className="flex items-center gap-2 px-7 py-3 rounded-sm border border-cream/15 text-cream/70 font-display text-[14px] tracking-wide hover:bg-cream/5 hover:text-cream hover:border-cream/30 transition-all duration-200"
            >
              {tr.exploreAll}
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ VIBE CATEGORIES ═════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <p className="font-mono text-[10px] tracking-[3px] text-ink/35 uppercase mb-4">
              {tr.vibeLabel}
            </p>
            <h2 className="font-display text-[52px] leading-[0.95] tracking-[-0.03em] text-ink">
              {tr.vibeTitle}
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                      className="flex flex-col justify-between h-28 p-5 transition-all duration-200 group"
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
                          className="font-display text-[20px] leading-tight tracking-[-0.01em]"
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

      {/* ═══ EMAIL ════════════════════════════════════════════ */}
      <section className="px-6 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-[1200px] mx-auto"
        >
          <div className="bg-siren px-8 py-16 md:px-16 md:py-20 relative overflow-hidden">
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
              <h2 className="font-display text-[48px] md:text-[60px] leading-[0.9] tracking-[-0.04em] text-cream mb-5">
                {tr.emailTitle}
              </h2>
              <p className="text-cream/70 text-base leading-relaxed mb-9 max-w-sm">
                {tr.emailSub}
              </p>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    exit={{ opacity: 0, y: -8 }}
                    onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                    className="flex gap-2 max-w-sm"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={tr.emailPlaceholder}
                      required
                      className="flex-1 min-w-0 px-5 py-3 bg-white/12 text-cream placeholder-cream/35 text-sm font-body border border-cream/15 focus:outline-none focus:bg-white/20 focus:border-cream/30 transition-all"
                    />
                    <button
                      type="submit"
                      className="shrink-0 px-6 py-3 bg-taxi text-ink font-display text-sm tracking-wide hover:bg-taxi/90 active:scale-[0.97] transition-all"
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

      {/* ═══ FOOTER ══════════════════════════════════════════ */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-[22px] tracking-[-0.04em] text-ink">
            BAM<span className="text-siren">!</span>
          </span>
          <div className="flex gap-6 font-mono text-[11px] text-ink/35 tracking-wide">
            <span>getbam.fun</span>
            <span>Athens, GR</span>
            <span>v1.0</span>
          </div>
          <p className="font-mono text-[11px] text-ink/30">{tr.rights}</p>
        </div>
      </footer>
    </div>
  );
}
