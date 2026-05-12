"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AtSign, User, FileText } from "lucide-react";

const STORAGE_KEY = "bam_profile_setup_done";

export default function ProfileSetupModal() {
  const { data: session, update } = useSession();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [instagram, setInstagram] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    if (!session?.user) return;
    if (shown.current) return;
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) return;

    // Show if profile is incomplete (no bio and no instagram)
    const needsSetup = !session.user.bio && !(session.user as { instagram?: string }).instagram;
    if (needsSetup) {
      shown.current = true;
      setName(session.user.name ?? "");
      setInstagram((session.user as { instagram?: string }).instagram ?? "");
      setBio(session.user.bio ?? "");
      setOpen(true);
    }
  }, [session]);

  function dismiss() {
    if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          bio: bio.trim() || undefined,
          instagram: instagram.replace(/^@/, "").trim() || undefined,
        }),
      });
      await update();
      setDone(true);
      if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
      setTimeout(() => setOpen(false), 1200);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-ink/70 backdrop-blur-sm"
            onClick={dismiss}
          />
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[201] max-w-[400px] mx-auto"
          >
            <div className="bg-ink border border-cream/12 shadow-2xl">
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[3px] text-cream/35 uppercase mb-1">
                    Welcome to
                  </p>
                  <h2 className="font-display text-[24px] text-cream tracking-[-0.02em]">
                    BAM<span className="text-siren">!</span>
                  </h2>
                </div>
                <button
                  onClick={dismiss}
                  className="mt-0.5 text-cream/30 hover:text-cream/60 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 pb-2">
                <p className="font-body text-[13px] text-cream/50 leading-relaxed">
                  Tell us a bit about yourself. It only takes a second.
                </p>
              </div>

              {done ? (
                <div className="px-6 py-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-siren/20 flex items-center justify-center mx-auto mb-3">
                    <span className="text-siren text-lg">✓</span>
                  </div>
                  <p className="font-display text-[18px] text-cream tracking-[-0.02em]">Saved!</p>
                </div>
              ) : (
                <div className="px-6 py-4 flex flex-col gap-3">
                  {/* Display name */}
                  <div>
                    <label className="flex items-center gap-1.5 font-mono text-[10px] text-cream/40 tracking-[2px] uppercase mb-1.5">
                      <User className="w-3 h-3" />
                      Display Name
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full h-10 px-3 bg-cream/[0.06] border border-cream/12 text-cream font-body text-[14px] placeholder:text-cream/25 focus:outline-none focus:border-cream/25 transition-colors"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="flex items-center gap-1.5 font-mono text-[10px] text-cream/40 tracking-[2px] uppercase mb-1.5">
                      <AtSign className="w-3 h-3" />
                      Instagram <span className="text-cream/20 normal-case tracking-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-[14px] text-cream/30">@</span>
                      <input
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value.replace(/^@/, ""))}
                        placeholder="yourhandle"
                        className="w-full h-10 pl-7 pr-3 bg-cream/[0.06] border border-cream/12 text-cream font-body text-[14px] placeholder:text-cream/25 focus:outline-none focus:border-cream/25 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="flex items-center gap-1.5 font-mono text-[10px] text-cream/40 tracking-[2px] uppercase mb-1.5">
                      <FileText className="w-3 h-3" />
                      Bio <span className="text-cream/20 normal-case tracking-normal">(optional)</span>
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="What's your vibe?"
                      rows={2}
                      className="w-full px-3 py-2.5 bg-cream/[0.06] border border-cream/12 text-cream font-body text-[14px] placeholder:text-cream/25 focus:outline-none focus:border-cream/25 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}

              {!done && (
                <div className="px-6 pb-6 pt-2 flex gap-2">
                  <button
                    onClick={dismiss}
                    className="flex-1 h-10 border border-cream/12 font-body text-[13px] text-cream/40 hover:text-cream/60 transition-colors"
                  >
                    Skip for now
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 h-10 bg-siren text-cream font-body text-[13px] font-semibold hover:bg-siren/90 disabled:opacity-60 transition-colors"
                  >
                    {saving ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Save profile"
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
