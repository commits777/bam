"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function EmailSignInPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Magic link via NextAuth email provider — requires SMTP config in .env.local
    // AUTH_EMAIL_SERVER="smtp://user:pass@smtp.example.com:587"
    // AUTH_EMAIL_FROM="BAM! <noreply@getbam.fun>"
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,252,242,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,252,242,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[360px]"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="font-display text-[40px] leading-none text-cream tracking-[-0.04em]">
              BAM<span className="text-siren">!</span>
            </span>
          </Link>
        </div>

        <div className="bg-cream/[0.06] border border-cream/10 backdrop-blur-sm p-7">
          {!sent ? (
            <>
              <p className="font-mono text-[10px] tracking-[3px] text-cream/35 uppercase mb-1">Email</p>
              <h1 className="font-display text-[24px] text-cream tracking-[-0.02em] mb-1.5">Log in with email</h1>
              <p className="font-body text-[13px] text-cream/45 mb-7 leading-relaxed">
                We'll send a magic link. No password needed.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full h-11 px-4 bg-cream/8 border border-cream/15 text-cream placeholder:text-cream/30 font-body text-[14px] focus:outline-none focus:border-cream/30 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full h-11 bg-siren text-cream font-display text-[14px] tracking-wide hover:bg-siren/90 transition-colors"
                >
                  Send magic link
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-10 h-10 bg-siren/20 flex items-center justify-center mx-auto mb-4">
                <span className="font-display text-xl text-siren">!</span>
              </div>
              <h2 className="font-display text-[20px] text-cream mb-2">Check your inbox</h2>
              <p className="font-body text-[13px] text-cream/45 leading-relaxed">
                We sent a link to <span className="text-cream/70">{email}</span>. Click it to sign in.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 mt-5">
          <Link
            href="/auth/signin"
            className="font-mono text-[11px] text-cream/30 hover:text-cream/60 transition-colors tracking-wide"
          >
            ← Other sign in options
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
