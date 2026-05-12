"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { MapPin, LogOut, User, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import { useLang } from "@/contexts/lang-context";
import { t } from "@/lib/i18n";

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { scrollY } = useScroll();
  const { data: session } = useSession();
  const { lang, setLang } = useLang();
  const tr = t[lang];

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

  const isDiscover = pathname === "/discover";
  const onDark = !scrolled && !isDiscover;

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || isDiscover
          ? "bg-cream/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-[1400px] mx-auto px-5 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span
            className={cn(
              "font-display text-[26px] leading-none tracking-[-0.04em] transition-colors duration-200",
              onDark ? "text-cream" : "text-ink"
            )}
          >
            BAM<span className="text-siren">!</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <div
            className={cn(
              "flex items-center border overflow-hidden text-[10px] font-mono font-bold tracking-widest",
              onDark ? "border-cream/25" : "border-border"
            )}
          >
            {(["EN", "EL"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={cn(
                  "px-3 py-1.5 transition-all duration-150",
                  lang === l
                    ? "bg-ink text-taxi"
                    : onDark
                    ? "text-cream/55 hover:text-cream"
                    : "text-ink/45 hover:text-ink"
                )}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Discover CTA */}
          {!isDiscover && (
            <Link
              href="/discover"
              className="flex items-center gap-1.5 px-4 py-2 bg-siren text-cream font-display text-[13px] tracking-wide hover:bg-siren/90 active:scale-[0.97] transition-all duration-150"
            >
              <MapPin className="w-3 h-3" strokeWidth={2.5} />
              {tr.discover}
            </Link>
          )}

          {/* User menu — only shown when signed in */}
          {session?.user && (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={cn(
                  "flex items-center gap-2 pl-1 pr-3 py-1 rounded-sm border transition-colors",
                  onDark
                    ? "border-cream/25 hover:bg-cream/8"
                    : "border-border bg-cream hover:bg-bone"
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
                <span
                  className={cn(
                    "font-mono text-[11px] max-w-[80px] truncate hidden sm:block",
                    onDark ? "text-cream/70" : "text-ink/70"
                  )}
                >
                  {session.user.name ?? session.user.email}
                </span>
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 z-50 bg-cream rounded-sm border border-border shadow-xl py-1.5 min-w-[160px]">
                    <Link
                      href="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 font-body text-[13px] text-ink/70 hover:bg-bone hover:text-ink transition-colors"
                    >
                      <User className="w-3.5 h-3.5" strokeWidth={2} />
                      {tr.profile}
                    </Link>
                    {session.user.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 font-body text-[13px] text-ink/70 hover:bg-bone hover:text-ink transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" strokeWidth={2} />
                        {tr.admin}
                      </Link>
                    )}
                    <div className="my-1 border-t border-border" />
                    <button
                      onClick={() => { setProfileOpen(false); signOut(); }}
                      className="flex items-center gap-2.5 w-full px-4 py-2 font-body text-[13px] text-siren hover:bg-siren/8 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                      {tr.signOut}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
