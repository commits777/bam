"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import Nav from "@/components/nav";
import { NEIGHBORHOODS, VIBES } from "@/lib/venues";

export default function ApplyPage() {
  const [form, setForm] = useState({
    venueName: "", contactName: "", email: "",
    instagram: "", phone: "", neighborhood: "",
    vibe: "", website: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  function set(k: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputCls = "w-full px-4 py-3 bg-white border border-border text-[14px] font-body text-ink placeholder:text-ink/30 focus:outline-none focus:border-ink/40 transition-colors";
  const labelCls = "block font-mono text-[10px] tracking-[2px] uppercase text-ink/40 mb-1.5";

  return (
    <div className="min-h-screen bg-bone">
      <Nav />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-[10px] tracking-[4px] uppercase text-ink/35 mb-4">
            Venue Partnership
          </p>
          <h1 className="font-display text-[52px] leading-[0.92] tracking-[-0.04em] text-ink mb-4">
            List your<br />venue on BAM<span className="text-siren">!</span>
          </h1>
          <p className="text-[16px] text-ink/55 leading-relaxed mb-12 max-w-md">
            We hand-pick every venue. If you think you belong on Athens' best date-night
            guide, tell us about your spot.
          </p>

          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-ink p-10 text-center"
              >
                <div className="w-12 h-12 bg-taxi flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-6 h-6 text-ink fill-ink" strokeWidth={0} />
                </div>
                <h2 className="font-display text-[32px] tracking-[-0.03em] text-cream mb-3">
                  Application received.
                </h2>
                <p className="text-[15px] text-cream/55 max-w-xs mx-auto leading-relaxed">
                  We review every application personally. We'll be in touch within 5 days.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                {/* Venue info */}
                <div className="bg-cream border border-border p-6 flex flex-col gap-5">
                  <p className="font-display text-[18px] tracking-[-0.01em] text-ink border-b border-border pb-4">
                    About the venue
                  </p>

                  <div>
                    <label className={labelCls}>Venue name *</label>
                    <input required value={form.venueName} onChange={set("venueName")} placeholder="e.g. Heteroclito" className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Neighborhood *</label>
                      <select required value={form.neighborhood} onChange={set("neighborhood")} className={inputCls}>
                        <option value="">Select…</option>
                        {NEIGHBORHOODS.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Type *</label>
                      <select required value={form.vibe} onChange={set("vibe")} className={inputCls}>
                        <option value="">Select…</option>
                        {VIBES.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Website</label>
                    <input value={form.website} onChange={set("website")} placeholder="https://…" className={inputCls} />
                  </div>
                </div>

                {/* Contact info */}
                <div className="bg-cream border border-border p-6 flex flex-col gap-5">
                  <p className="font-display text-[18px] tracking-[-0.01em] text-ink border-b border-border pb-4">
                    Your contact details
                  </p>

                  <div>
                    <label className={labelCls}>Your name *</label>
                    <input required value={form.contactName} onChange={set("contactName")} placeholder="Name or alias" className={inputCls} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Email *</label>
                      <input required type="email" value={form.email} onChange={set("email")} placeholder="you@venue.com" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Phone</label>
                      <input value={form.phone} onChange={set("phone")} placeholder="+30 69…" className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Instagram</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[13px] text-ink/35">@</span>
                      <input value={form.instagram} onChange={set("instagram")} placeholder="venue_handle" className={`${inputCls} pl-8`} />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="bg-cream border border-border p-6">
                  <label className={labelCls}>Why does your venue belong on BAM!?</label>
                  <textarea
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us what makes your spot date-worthy…"
                    rows={4}
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {status === "error" && (
                  <p className="font-mono text-[11px] text-siren">Something went wrong. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group flex items-center justify-center gap-2 w-full py-4 bg-siren text-cream font-display text-[17px] tracking-wide hover:bg-siren/90 active:scale-[0.99] transition-all disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : (
                    <>
                      Submit application
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
