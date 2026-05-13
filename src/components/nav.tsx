"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { Shield, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useLang } from "@/contexts/lang-context";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const { scrollY } = useScroll();
  const { data: session } = useSession();
  const { lang, setLang } = useLang();

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
