"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { redirect } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";
import { VENUES } from "@/lib/venues";
import type { Venue } from "@/lib/types";
import {
  LogOut,
  AtSign,
  FileText,
  User,
  MapPin,
  Edit3,
  X,
  Check,
} from "lucide-react";

function Avatar({ src, name, size = 80 }: { src?: string | null; name?: string | null; size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden bg-cream/10 shrink-0 flex items-center justify-center border border-cream/15"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={name ?? ""} className="w-full h-full object-cover" />
      ) : (
        <span className="font-display text-cream/60" style={{ fontSize: size * 0.38 }}>
          {name?.[0]?.toUpperCase() ?? "?"}
        </span>
      )}
    </div>
  );
}

function EditProfileModal({
  user,
  onClose,
  onSaved,
}: {
  user: { name?: string | null; bio?: string | null; instagram?: string | null };
  onClose: () => void;
  onSaved: (u: { name: string; bio: string; instagram: string }) => void;
}) {
  const { update } = useSession();
  const [name, setName] = useState(user.name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [instagram, setInstagram] = useState(user.instagram ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || undefined,
          bio: bio.trim() || undefined,
          instagram: instagram.replace(/^@/, "").trim() || undefined,
        }),
      });
      if (res.ok) {
        await update();
        onSaved({ name: name.trim(), bio: bio.trim(), instagram: instagram.replace(/^@/, "").trim() });
        onClose();
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[201] max-w-[400px] mx-auto"
      >
        <div className="bg-ink border border-cream/12 shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-cream/8">
            <h2 className="font-display text-[18px] text-cream tracking-[-0.02em]">Edit profile</h2>
            <button onClick={onClose} className="text-cream/30 hover:text-cream/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 py-5 flex flex-col gap-3.5">
            <div>
              <label className="flex items-center gap-1.5 font-mono text-[10px] text-cream/40 tracking-[2px] uppercase mb-1.5">
                <User className="w-3 h-3" />
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full h-10 px-3 bg-cream/[0.06] border border-cream/12 text-cream font-body text-[14px] placeholder:text-cream/25 focus:outline-none focus:border-cream/25 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 font-mono text-[10px] text-cream/40 tracking-[2px] uppercase mb-1.5">
                <AtSign className="w-3 h-3" />
                Instagram
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

            <div>
              <label className="flex items-center gap-1.5 font-mono text-[10px] text-cream/40 tracking-[2px] uppercase mb-1.5">
                <FileText className="w-3 h-3" />
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="What's your vibe?"
                rows={3}
                className="w-full px-3 py-2.5 bg-cream/[0.06] border border-cream/12 text-cream font-body text-[14px] placeholder:text-cream/25 focus:outline-none focus:border-cream/25 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="px-6 pb-6 flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 border border-cream/12 font-body text-[13px] text-cream/40 hover:text-cream/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 h-10 bg-siren text-cream font-body text-[13px] font-semibold hover:bg-siren/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [savedVenues, setSavedVenues] = useState<Venue[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [localUser, setLocalUser] = useState<{
    name?: string | null;
    bio?: string | null;
    instagram?: string | null;
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      window.location.href = "/auth/signin?callbackUrl=/profile";
    }
  }, [status]);

  useEffect(() => {
    if (session?.user) {
      setLocalUser({
        name: session.user.name,
        bio: session.user.bio,
        instagram: (session.user as { instagram?: string }).instagram,
      });
    }
  }, [session]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/venues/save")
      .then((r) => r.json())
      .then((d) => {
        const ids: string[] = d.savedVenueIds ?? [];
        setSavedVenues(VENUES.filter((v) => ids.includes(v.id)));
      })
      .catch(() => {});
  }, [session]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-ink/20 border-t-ink rounded-full animate-spin" />
      </div>
    );
  }

  const user = session.user;
  const display = localUser;

  return (
    <div className="min-h-screen bg-bone">
      <Nav />

      <div className="max-w-[640px] mx-auto px-4 pt-24 pb-16">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-ink p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <Avatar src={user.image} name={display?.name ?? user.name} size={72} />

            <div className="flex-1 min-w-0">
              <h1 className="font-display text-[22px] text-cream tracking-[-0.02em] leading-tight truncate">
                {display?.name ?? user.name ?? "Anonymous"}
              </h1>

              {display?.instagram && (
                <a
                  href={`https://instagram.com/${display.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-cream/40 hover:text-cream/70 transition-colors mt-0.5"
                >
                  <AtSign className="w-3 h-3" />
                  {display.instagram}
                </a>
              )}

              {display?.bio && (
                <p className="font-body text-[13px] text-cream/55 mt-2 leading-relaxed">
                  {display.bio}
                </p>
              )}

              {!display?.bio && !display?.instagram && (
                <p className="font-body text-[13px] text-cream/30 mt-1.5 italic">
                  No bio yet. Add one below.
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2 border border-cream/15 font-body text-[12px] text-cream/60 hover:text-cream hover:border-cream/30 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit profile
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-4 py-2 border border-siren/20 font-body text-[12px] text-siren/70 hover:text-siren hover:border-siren/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </motion.div>

        {/* Saved venues */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-[16px] text-ink tracking-[-0.01em]">
              Saved spots
              {savedVenues.length > 0 && (
                <span className="ml-2 font-mono text-[11px] text-ink/35">{savedVenues.length}</span>
              )}
            </h2>
            <Link
              href="/discover"
              className="font-mono text-[10px] text-ink/40 hover:text-ink/70 tracking-[2px] uppercase transition-colors"
            >
              Discover more →
            </Link>
          </div>

          {savedVenues.length === 0 ? (
            <div className="bg-cream border border-border py-12 text-center">
              <MapPin className="w-8 h-8 text-ink/20 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-body text-[14px] text-ink/40 mb-4">
                No saved spots yet.
              </p>
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-siren text-cream font-body text-[13px] font-semibold hover:bg-siren/90 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Find a spot
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {savedVenues.map((venue) => (
                <Link
                  key={venue.id}
                  href={`/discover?venue=${venue.id}`}
                  className="flex items-center gap-4 bg-cream border border-border p-4 hover:border-ink/20 transition-colors group"
                >
                  {venue.image && (
                    <div className="w-14 h-14 shrink-0 overflow-hidden bg-bone">
                      <img src={venue.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-[15px] text-ink tracking-[-0.01em] truncate">
                      {venue.name}
                    </p>
                    <p className="font-mono text-[10px] text-ink/40 tracking-[1px] mt-0.5">
                      {venue.neighborhood} · {venue.vibe}
                    </p>
                  </div>
                  <span className="font-mono text-[13px] text-ink/30 shrink-0">{venue.budget}</span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {editOpen && display && (
          <EditProfileModal
            user={display}
            onClose={() => setEditOpen(false)}
            onSaved={(u) => setLocalUser(u)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
