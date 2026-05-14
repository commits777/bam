"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, LogOut, User, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useLang } from "@/contexts/lang-context";
import { useTheme } from "@/contexts/theme-context";

// Nav links — Plan/Singles link to /discover until those pages exist
const NAV_LINKS = [
  { href: "/discover", label: "Discover", activePath: "/discover" },
  { href: "/discover", label: "Plan",     activePath: "/plan"     },
  { href: "/discover", label: "Singles",  activePath: "/singles"  },
  { href: "/saved",    label: "Saved",    activePath: "/saved"    },
] as const;

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const { scrollY } = useScroll();
  const { data: session } = useSession();
  const { lang, setLang } = useLang();
  const { theme, toggle: toggleTheme } = useTheme();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

  useEffect(() => {
    if (!session) { setSavedCount(0); return; }
    fetch("/api/venues/save")
      .then((r) => r.json())
      .then((d) => setSavedCount((d.savedVenueIds ?? []).length))
      .catch(() => {});
  }, [session]);

  const onLanding = pathname === "/";
  const onDarkHero = onLanding && !scrolled;

  const navBg = scrolled || !onLanding
    ? "bg-cream/95 backdrop-blur-md"
    : "bg-transparent";

  const textColor   = onDarkHero ? "text-cream"       : "text-ink";
  const borderColor = onDarkHero ? "border-cream/20"  : "border-ink/15";
  const mutedColor  = onDarkHero ? "text-cream/65"    : "text-ink/55";

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b", navBg, borderColor)}
    >
      <div className="max-w-[1400px] mx-auto px-9 py-4 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <span className={cn("font-display text-[26px] leading-none tracking-[-0.04em] transition-colors duration-200", textColor)}>
            BAM<span className={onDarkHero ? "text-taxi" : "text-siren"}>!</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label, activePath }) => {
            const active = pathname === activePath;
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "font-mono text-[11px] tracking-[0.15em] uppercase font-bold px-3.5 py-1.5 transition-all duration-150",
                  active
                    ? "bg-ink text-taxi"
                    : cn(mutedColor, "hover:" + (onDarkHero ? "text-cream" : "text-ink"))
                )}
              >
                {label}
                {label === "Saved" && savedCount > 0 && (
                  <span className="ml-1.5 text-taxi">({savedCount})</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">

          {/* Language toggle */}
          <div className={cn("hidden sm:flex items-center border overflow-hidden text-[10px] font-mono font-bold tracking-widest", borderColor)}>
            {(["EN", "ΕΛ"] as const).map((l) => {
              const val = l === "ΕΛ" ? "EL" : "EN";
              return (
                <button
                  key={l}
                  onClick={() => setLang(val as "EN" | "EL")}
                  className={cn(
                    "px-3 py-1.5 transition-all duration-150",
                    lang === val
                      ? "bg-ink text-taxi"
                      : cn(mutedColor, "hover:" + (onDarkHero ? "text-cream" : "text-ink"))
                  )}
                >
                  {l}
                </button>
              );
            })}
          </div>

          {/* Saved count pill — desktop only, when signed in */}
          {session && (
            <Link
              href="/saved"
              className={cn(
                "hidden lg:flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] font-bold tracking-wide transition-colors",
                "bg-bone text-ink hover:bg-border"
              )}
            >
              ★ <span>{savedCount} SAVED</span>
            </Link>
          )}

          {/* OPEN THE MAP — always visible on desktop */}
          <Link
            href="/discover"
            className="hidden lg:inline-flex items-center gap-1.5 bg-siren text-cream font-display text-[14px] tracking-[-0.01em] px-4 py-2 hover:opacity-90 transition-opacity"
            style={{ borderRadius: 6 }}
          >
            OPEN THE MAP →
          </Link>

          {/* Theme toggle — small, after main cluster */}
          <button
            onClick={toggleTheme}
            className={cn("p-1.5 transition-colors hidden lg:block", mutedColor, "hover:" + (onDarkHero ? "text-cream" : "text-ink"))}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-3.5 h-3.5" strokeWidth={2} /> : <Moon className="w-3.5 h-3.5" strokeWidth={2} />}
          </button>

          {/* Auth */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={cn(
                  "flex items-center gap-2 pl-1 pr-2 py-1 border transition-colors",
                  onDarkHero ? "border-cream/25 hover:bg-cream/8" : "border-border bg-cream hover:bg-bone"
                )}
              >
                <div className="w-6 h-6 overflow-hidden bg-bone shrink-0">
                  {session.user.image ? (
                    <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display text-[11px] text-ink/50">
                      {session.user.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 z-50 bg-cream border border-border shadow-xl py-1.5 min-w-[160px]">
                    <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 font-body text-[13px] text-ink/70 hover:bg-bone hover:text-ink transition-colors">
                      <User className="w-3.5 h-3.5" strokeWidth={2} /> Profile
                    </Link>
                    <Link href="/saved" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 font-body text-[13px] text-ink/70 hover:bg-bone hover:text-ink transition-colors">
                      ★ Saved {savedCount > 0 && `(${savedCount})`}
                    </Link>
                    {session.user.role === "admin" && (
                      <Link href="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2 font-body text-[13px] text-ink/70 hover:bg-bone hover:text-ink transition-colors">
                        <Shield className="w-3.5 h-3.5" strokeWidth={2} /> Admin
                      </Link>
                    )}
                    <div className="my-1 border-t border-border" />
                    <button onClick={() => { setProfileOpen(false); signOut(); }} className="flex items-center gap-2.5 w-full px-4 py-2 font-body text-[13px] text-siren hover:bg-siren/8 transition-colors">
                      <LogOut className="w-3.5 h-3.5" strokeWidth={2} /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className={cn(
                "font-mono text-[11px] tracking-[0.12em] uppercase font-bold px-3 py-1.5 border transition-all duration-150 hidden sm:inline-flex",
                onDarkHero
                  ? "border-cream/30 text-cream/70 hover:border-cream/60 hover:text-cream"
                  : "border-border text-ink/55 hover:border-ink/30 hover:text-ink"
              )}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
}
