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

  // Load saved count when signed in
  useEffect(() => {
    if (!session) { setSavedCount(0); return; }
    fetch("/api/venues/save")
      .then((r) => r.json())
      .then((d) => setSavedCount((d.savedVenueIds ?? []).length))
      .catch(() => {});
  }, [session]);

  const onLanding = pathname === "/";
  const onDiscover = pathname === "/discover";
  const onSaved = pathname === "/saved";

  // On the landing page (siren hero), nav should start dark (transparent over siren = cream text)
  // On scroll it becomes cream bg with ink text
  const onDarkHero = onLanding && !scrolled;

  const navBg = scrolled || !onLanding
    ? "bg-cream/95 backdrop-blur-md border-b border-border shadow-sm"
    : "bg-transparent";

  const textColor = onDarkHero ? "text-cream" : "text-ink";
  const borderColor = onDarkHero ? "border-cream/25" : "border-border";

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", navBg)}
    >
      <div className="max-w-[1400px] mx-auto px-5 h-14 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <span className={cn("font-display text-[26px] leading-none tracking-[-0.04em] transition-colors duration-200", textColor)}>
            BAM<span className={onDarkHero ? "text-taxi" : "text-siren"}>!</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            { href: "/discover", label: "Discover" },
            { href: "/saved",    label: "Saved"    },
          ].map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-mono text-[11px] tracking-[0.12em] uppercase font-bold px-3.5 py-2 transition-colors duration-150",
                  active
                    ? "text-siren"
                    : onDarkHero
                    ? "text-cream/65 hover:text-cream"
                    : "text-ink/55 hover:text-ink"
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

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Instagram link */}
          <a
            href="https://www.instagram.com/bam.athens/"
            target="_blank"
            rel="noopener noreferrer"
            className={cn("p-1.5 transition-colors", onDarkHero ? "text-cream/50 hover:text-cream" : "text-ink/40 hover:text-ink")}
            aria-label="BAM! on Instagram"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={cn("p-1.5 transition-colors", onDarkHero ? "text-cream/50 hover:text-cream" : "text-ink/40 hover:text-ink")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" strokeWidth={2} /> : <Moon className="w-4 h-4" strokeWidth={2} />}
          </button>

          {/* Language toggle */}
          <div className={cn("flex items-center border overflow-hidden text-[10px] font-mono font-bold tracking-widest", borderColor)}>
            {(["EN", "EL"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "px-3 py-1.5 transition-all duration-150",
                  lang === l
                    ? "bg-ink text-taxi"
                    : onDarkHero
                    ? "text-cream/55 hover:text-cream"
                    : "text-ink/45 hover:text-ink"
                )}
              >
                {l}
              </button>
            ))}
          </div>

          {session?.user ? (
            <>
              {/* Saved count (mobile visible) */}
              <Link
                href="/saved"
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[11px] font-bold tracking-wide transition-colors lg:hidden",
                  onSaved
                    ? "bg-siren text-cream"
                    : onDarkHero
                    ? "bg-cream/10 text-cream"
                    : "bg-bone text-ink"
                )}
              >
                ★ <span>{savedCount}</span>
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    "flex items-center gap-2 pl-1 pr-3 py-1 border transition-colors",
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
                  <span className={cn("font-mono text-[11px] max-w-[80px] truncate hidden sm:block", onDarkHero ? "text-cream/70" : "text-ink/70")}>
                    {session.user.name ?? session.user.email}
                  </span>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 z-50 bg-cream border border-border shadow-xl py-1.5 min-w-[160px]">
                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 font-body text-[13px] text-ink/70 hover:bg-bone hover:text-ink transition-colors"
                      >
                        <User className="w-3.5 h-3.5" strokeWidth={2} />
                        Profile
                      </Link>
                      <Link
                        href="/saved"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 font-body text-[13px] text-ink/70 hover:bg-bone hover:text-ink transition-colors"
                      >
                        ★ Saved {savedCount > 0 && `(${savedCount})`}
                      </Link>
                      {session.user.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 font-body text-[13px] text-ink/70 hover:bg-bone hover:text-ink transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5" strokeWidth={2} />
                          Admin
                        </Link>
                      )}
                      <div className="my-1 border-t border-border" />
                      <button
                        onClick={() => { setProfileOpen(false); signOut(); }}
                        className="flex items-center gap-2.5 w-full px-4 py-2 font-body text-[13px] text-siren hover:bg-siren/8 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            /* Sign in link when logged out */
            <Link
              href="/auth/signin"
              className={cn(
                "font-mono text-[11px] tracking-[0.12em] uppercase font-bold px-3.5 py-2 border transition-all duration-150",
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
