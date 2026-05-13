"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

type Provider = "instagram" | "google" | "github";

export default function SignInPage() {
  const [loading, setLoading] = useState<Provider | null>(null);

  async function handleSignIn(provider: Provider) {
    setLoading(provider);
    await signIn(provider, { callbackUrl: "/discover" });
  }

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,252,242,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,252,242,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(255,45,45,0.22) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[360px]"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <span className="font-display text-[40px] leading-none text-cream tracking-[-0.04em]">
              BAM<span className="text-siren">!</span>
            </span>
          </Link>
          <p className="font-mono text-[11px] text-cream/35 tracking-[3px] uppercase mt-2">
            Athens After Dark
          </p>
        </div>

        {/* Card */}
        <div className="bg-cream/[0.06] border border-cream/10 backdrop-blur-sm p-7">
          <p className="font-mono text-[10px] tracking-[3px] text-cream/35 uppercase mb-1">Welcome</p>
          <h1 className="font-display text-[26px] text-cream tracking-[-0.02em] mb-1.5">Sign in to BAM!</h1>
          <p className="font-body text-[13px] text-cream/45 mb-7 leading-relaxed">
            Save spots, share favourites, unlock the full experience.
          </p>

          <div className="flex flex-col gap-2.5">
            {/* Instagram */}
            <button
              onClick={() => handleSignIn("instagram")}
              disabled={loading !== null}
              className="relative flex items-center justify-center gap-3 w-full h-12 px-5 font-body text-[14px] font-semibold text-white overflow-hidden disabled:opacity-60 transition-opacity"
              style={{
                background: "linear-gradient(135deg, #833AB4 0%, #FD1D1D 50%, #FCB045 100%)",
              }}
            >
              {loading === "instagram" ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <InstagramIcon />
              )}
              Continue with Instagram
            </button>

            {/* Google */}
            <button
              onClick={() => handleSignIn("google")}
              disabled={loading !== null}
              className="flex items-center justify-center gap-3 w-full h-11 px-5 bg-cream border border-cream/90 font-body text-[14px] font-semibold text-ink hover:bg-bone disabled:opacity-60 transition-colors"
            >
              {loading === "google" ? (
                <span className="w-4 h-4 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-0.5">
              <div className="flex-1 h-px bg-cream/10" />
              <span className="font-mono text-[10px] text-cream/25 tracking-widest uppercase">or</span>
              <div className="flex-1 h-px bg-cream/10" />
            </div>

            {/* GitHub */}
            <button
              onClick={() => handleSignIn("github")}
              disabled={loading !== null}
              className="flex items-center justify-center gap-3 w-full h-11 px-5 bg-cream/8 border border-cream/15 font-body text-[14px] font-semibold text-cream/70 hover:bg-cream/12 disabled:opacity-60 transition-colors"
            >
              {loading === "github" ? (
                <span className="w-4 h-4 border-2 border-cream/20 border-t-cream/70 rounded-full animate-spin" />
              ) : (
                <GitHubIcon />
              )}
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center justify-center mt-6">
            <Link
              href="/auth/signin/email"
              className="font-mono text-[11px] text-cream/40 hover:text-cream/70 underline underline-offset-4 decoration-cream/25 hover:decoration-cream/50 transition-colors tracking-wide"
            >
              Log in with Email
            </Link>
          </div>
        </div>

        <p className="text-center font-mono text-[10px] text-cream/20 mt-5 leading-relaxed px-4">
          By signing in you agree to our terms. We will never post without your permission.
        </p>

        <Link
          href="/"
          className="block text-center font-mono text-[11px] text-cream/30 hover:text-cream/60 mt-4 transition-colors tracking-wide"
        >
          ← Back to BAM!
        </Link>
      </motion.div>
    </div>
  );
}
