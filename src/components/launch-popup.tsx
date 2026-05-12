"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "bam_launch_seen";

export default function LaunchPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), 900);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="launch-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-5"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: "rgba(10,10,10,0.55)" }}
        >
          <motion.div
            key="launch-card"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", damping: 24, stiffness: 260, mass: 0.9 }}
            className="relative w-full max-w-lg bg-cream overflow-hidden shadow-2xl"
          >
            {/* Siren bar top */}
            <div className="h-1.5 bg-siren w-full" />

            {/* Close */}
            <button
              onClick={dismiss}
              aria-label="Close"
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-ink/30 hover:text-ink transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <div className="px-8 pt-8 pb-10">
              {/* Label */}
              <p className="font-mono text-[10px] tracking-[4px] uppercase text-ink/35 mb-5">
                Athens · Coming soon
              </p>

              {/* Headline */}
              <h2
                className="font-display leading-[0.92] tracking-[-0.04em] text-ink mb-4"
                style={{ fontSize: "clamp(44px, 8vw, 64px)" }}
              >
                BAM<span className="text-siren">!</span> is launching.
              </h2>

              <p className="text-[15px] text-ink/55 leading-relaxed mb-9 max-w-sm">
                Athens' date night guide. Curated venues, zero tourists, one tap to book.
                Get in before we open.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth/signin"
                  onClick={dismiss}
                  className="group flex-1 flex items-center justify-between gap-3 px-5 py-4 bg-ink text-cream hover:bg-ink/85 active:scale-[0.98] transition-all"
                >
                  <div>
                    <p className="font-mono text-[9px] tracking-[2px] uppercase text-cream/40 mb-0.5">
                      I'm a user
                    </p>
                    <p className="font-display text-[16px] tracking-[-0.01em]">
                      Claim access
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-taxi group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                </Link>

                <Link
                  href="/apply"
                  onClick={dismiss}
                  className="group flex-1 flex items-center justify-between gap-3 px-5 py-4 bg-bone border border-border hover:bg-white hover:border-ink/20 active:scale-[0.98] transition-all"
                >
                  <div>
                    <p className="font-mono text-[9px] tracking-[2px] uppercase text-ink/35 mb-0.5">
                      I run a venue
                    </p>
                    <p className="font-display text-[16px] tracking-[-0.01em] text-ink">
                      Apply for listing
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 shrink-0 text-ink/30 group-hover:text-siren group-hover:translate-x-0.5 transition-all" strokeWidth={2.5} />
                </Link>
              </div>

              <button
                onClick={dismiss}
                className="mt-6 w-full text-center font-mono text-[10px] tracking-[2px] uppercase text-ink/25 hover:text-ink/50 transition-colors"
              >
                Just browsing →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
