"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, ArrowRight } from "lucide-react";
import type { Venue } from "@/lib/types";

interface WaitlistModalProps {
  venue: Venue;
  onClose: () => void;
}

export default function WaitlistModal({ venue, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const launchDate = process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "soon";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");

    const params = new URLSearchParams(window.location.search);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          instagram: instagram || null,
          venue_id: venue.id,
          venue_name: venue.name,
          neighborhood: venue.neighborhood,
          utm_source: params.get("utm_source"),
          utm_medium: params.get("utm_medium"),
          utm_campaign: params.get("utm_campaign"),
        }),
      });
      if (res.ok) setState("success");
      else setState("error");
    } catch {
      setState("error");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 bg-ink/50 backdrop-blur-[4px] z-[60] flex items-end sm:items-center justify-center p-4"
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-cream border border-border shadow-2xl relative"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-ink/40 hover:text-ink transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Top bar */}
          <div className="h-1 bg-siren w-full" />

          <div className="p-7">
            {state !== "success" ? (
              <>
                <p className="font-mono text-[10px] tracking-[3px] text-ink/35 uppercase mb-3">
                  Coming {launchDate}
                </p>
                <h2 className="font-display text-[28px] leading-[1.05] tracking-[-0.02em] text-ink mb-2">
                  {venue.name} is on the list.
                </h2>
                <p className="text-[14px] text-ink/55 leading-relaxed mb-6">
                  BAM! isn't open to everyone yet. Leave your email and you'll be
                  first to book {venue.neighborhood}'s best date spots.
                </p>

                {/* Venue context pill */}
                <div className="flex items-center gap-2 mb-6 px-3 py-2 bg-bone border border-border w-fit">
                  <span className="font-mono text-[10px] tracking-[1.5px] uppercase text-ink/40">
                    Saving your spot at
                  </span>
                  <span className="font-display text-[13px] text-ink">{venue.name}</span>
                  <span className="font-mono text-[10px] text-ink/35">· {venue.neighborhood}</span>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    autoFocus
                    className="w-full px-4 py-3 bg-white border border-border text-[14px] font-body text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/40 transition-colors"
                  />
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[13px] text-ink/35">@</span>
                    <input
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="instagram_handle"
                      className="w-full pl-8 pr-4 py-3 bg-white border border-border text-[14px] font-body text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/40 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="w-full py-3 bg-siren text-cream font-display text-[13px] tracking-wide hover:bg-siren/90 active:scale-[0.97] transition-all disabled:opacity-60 flex items-center justify-center gap-1.5"
                  >
                    {state === "loading" ? (
                      "..."
                    ) : (
                      <>
                        I'm in
                        <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </form>

                {state === "error" && (
                  <p className="mt-3 font-mono text-[11px] text-siren">
                    Something went wrong — try again.
                  </p>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4 text-center"
              >
                <div className="w-10 h-10 bg-taxi flex items-center justify-center mx-auto mb-5">
                  <Zap className="w-5 h-5 text-ink fill-ink" strokeWidth={0} />
                </div>
                <h2 className="font-display text-[26px] tracking-[-0.02em] text-ink mb-2">
                  You're in.
                </h2>
                <p className="text-[14px] text-ink/55 leading-relaxed max-w-xs mx-auto">
                  We'll email you when BAM! launches. {venue.name} will be ready for you.
                </p>
                <button
                  onClick={onClose}
                  className="mt-7 font-mono text-[11px] tracking-[2px] text-ink/40 hover:text-ink uppercase transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
