"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Venue } from "@/lib/types";
import { NEIGHBORHOOD_GR } from "@/lib/venues";

interface VenueSheetProps {
  venue: Venue | null;
  onClose: () => void;
  savedVenueIds?: string[];
  onSaveToggle?: (venueId: string, saved: boolean) => void;
}

// ─── BAM stamp with leading dot ───────────────────────────────────────────────
function Stamp({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase font-bold text-siren">
      <span className="w-[7px] h-[7px] rounded-full bg-siren shrink-0" />
      {children}
    </span>
  );
}

export default function VenueSheet({ venue, onClose, savedVenueIds = [], onSaveToggle }: VenueSheetProps) {
  return (
    <AnimatePresence>
      {venue && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 z-50 lg:hidden"
            style={{ backdropFilter: "blur(3px)" }}
          />

          {/* Mobile — slides up from bottom */}
          <motion.div
            key="sheet-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-cream rounded-t-[18px] shadow-2xl max-h-[92dvh] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-ink/15 rounded-full" />
            </div>
            <SheetBody venue={venue} onClose={onClose} savedVenueIds={savedVenueIds} onSaveToggle={onSaveToggle} />
          </motion.div>

          {/* Desktop — slides in from right */}
          <motion.div
            key="sheet-desktop"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260, mass: 0.9 }}
            className="hidden lg:flex fixed top-[56px] right-0 bottom-0 w-[400px] z-40 bg-cream border-l border-border shadow-2xl flex-col overflow-y-auto"
          >
            <SheetBody venue={venue} onClose={onClose} savedVenueIds={savedVenueIds} onSaveToggle={onSaveToggle} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SheetBody({
  venue,
  onClose,
  savedVenueIds,
  onSaveToggle,
}: {
  venue: Venue;
  onClose: () => void;
  savedVenueIds: string[];
  onSaveToggle?: (venueId: string, saved: boolean) => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const isSaved = savedVenueIds.includes(venue.id);
  const nhGr = NEIGHBORHOOD_GR[venue.neighborhood] ?? venue.neighborhood;

  // Photos array — use the single image repeated if no multi-photo set
  const photos = [venue.image];

  async function handleSave(e: React.MouseEvent) {
    e.stopPropagation();
    if (!session) { router.push("/auth/signin"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/venues/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ venueId: venue.id }),
      });
      const data = await res.json();
      onSaveToggle?.(venue.id, data.saved);
    } finally {
      setSaving(false);
    }
  }

  function handleBook(e: React.MouseEvent) {
    e.stopPropagation();
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    window.open(venue.bookingUrl, "_blank", "noopener,noreferrer");
  }

  function handleShare(e: React.MouseEvent) {
    e.stopPropagation();
    if (!session) { router.push("/auth/signin"); return; }
    if (navigator.share) {
      navigator.share({ title: venue.name, text: venue.tagline, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <div className="flex flex-col pb-6">
      {/* Hero image */}
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden bg-bone">
          <img
            src={photos[imgIdx]}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Floating action buttons */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-cream shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center font-display text-[18px] text-ink hover:bg-bone transition-colors"
          >
            ←
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-10 h-10 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center font-display text-[16px] transition-colors ${
                isSaved ? "bg-siren text-taxi" : "bg-cream text-ink hover:bg-bone"
              }`}
            >
              {isSaved ? "★" : "☆"}
            </button>
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-cream shadow-[0_2px_8px_rgba(0,0,0,0.18)] flex items-center justify-center font-mono text-[13px] font-bold text-ink hover:bg-bone transition-colors"
            >
              ↗
            </button>
          </div>
        </div>

        {/* BAM № stamp floating below hero */}
        {venue.no && (
          <div className="absolute bottom-[-22px] left-[18px] bg-cream px-3.5 py-2.5 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.12)]">
            <span className="inline-flex items-baseline gap-1 font-mono text-[10px] tracking-[0.18em] uppercase font-bold">
              <span className="opacity-60">BAM</span>
              <span className="text-siren">!</span>
              <span>{String(venue.no).padStart(2, "0")}</span>
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-[22px] pt-10 flex flex-col gap-5">
        {/* Vibe tags + open status */}
        <div className="flex flex-wrap gap-1.5">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase font-bold px-2.5 py-1.5 rounded-full bg-ink text-taxi">
            {venue.vibe}
          </span>
          {venue.openNow !== undefined && (
            <span className={`font-mono text-[10px] tracking-[0.15em] uppercase font-bold px-2.5 py-1.5 rounded-full border-[1.5px] ${
              venue.openNow ? "border-siren text-siren" : "border-border text-ink/45"
            }`}>
              {venue.openNow ? "● OPEN NOW" : "○ CLOSED"}
            </span>
          )}
        </div>

        {/* Name */}
        <h1 className="font-display text-[46px] leading-[0.95] tracking-[-0.03em] text-ink">
          {venue.name}
        </h1>

        {/* Why pull-quote */}
        <p className="text-[20px] leading-[1.3] font-medium text-ink border-l-[4px] border-siren pl-3.5">
          &ldquo;{venue.tagline}&rdquo;
        </p>

        {/* BAM Notes */}
        {venue.note && (
          <div className="bg-bone rounded-[10px] px-[18px] py-[18px]">
            <Stamp>BAM NOTES</Stamp>
            <p className="mt-2.5 text-[15px] leading-[1.5] text-ink/70">{venue.note}</p>
          </div>
        )}

        {/* Meta grid — 2×2 */}
        <div className="border border-border rounded-[10px] overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3.5 border-r border-b border-border">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/45 font-bold mb-1.5">HOOD</p>
              <p className="font-display text-[18px] leading-tight tracking-[-0.01em]">{nhGr}</p>
              <p className="text-[12px] text-ink/45">{venue.neighborhood}</p>
            </div>
            <div className="p-3.5 border-b border-border">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/45 font-bold mb-1.5">WALK</p>
              <p className="font-display text-[18px] leading-tight tracking-[-0.01em]">{venue.walkMin ?? "—"} min</p>
              <p className="text-[12px] text-ink/45">from you</p>
            </div>
            <div className="p-3.5 border-r border-border">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/45 font-bold mb-1.5">BUDGET</p>
              <p className="font-display text-[18px] leading-tight tracking-[-0.01em]">{venue.budget}</p>
              <p className="text-[12px] text-ink/45">per head</p>
            </div>
            <div className="p-3.5">
              <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/45 font-bold mb-1.5">HOURS</p>
              <p className="font-display text-[18px] leading-tight tracking-[-0.01em]">
                {venue.hours ? venue.hours.split(" ")[0] : "—"}
              </p>
              <p className="text-[12px] text-ink/45">
                {venue.hours ? `til ${venue.hours.split(" ").pop()}` : "check online"}
              </p>
            </div>
          </div>
        </div>

        {/* Partner + address */}
        <div className="flex items-center gap-2 text-[13px] text-ink/45 font-mono">
          <span className="tracking-[0.1em] uppercase font-bold text-ink/35">VIA</span>
          <span className="font-display text-[15px] text-ink">{venue.bookingPartner}</span>
          {venue.neighborhood && (
            <>
              <span>·</span>
              <span>{venue.neighborhood}</span>
            </>
          )}
        </div>

        {/* Occasions */}
        {venue.occasions.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {venue.occasions.map((o) => (
              <span key={o} className="font-mono text-[10px] tracking-[0.1em] uppercase font-bold px-3 py-1.5 bg-ink text-taxi">
                {o}
              </span>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-[13px] text-ink/35 italic">Look around, then make the call.</p>
      </div>

      {/* Sticky BOOK IT CTA */}
      <div className="sticky bottom-0 px-[18px] pt-3.5 pb-[22px] bg-cream border-t border-border shadow-[0_-6px_18px_rgba(0,0,0,0.05)] mt-6">
        <button
          onClick={handleBook}
          className="w-full bg-siren text-cream font-display text-[20px] py-[18px] px-6 flex items-center justify-center gap-2 hover:bg-siren/90 active:scale-[0.98] transition-all shadow-[0_10px_26px_rgba(255,45,45,0.22)]"
        >
          BOOK IT<span className="text-taxi">!</span>
          <span className="opacity-85 text-[18px]">→</span>
        </button>
        <p className="text-center mt-2 font-mono text-[9px] tracking-[0.15em] uppercase text-ink/35 font-bold">
          {session
            ? `You'll book on ${venue.bookingPartner}. Same price.`
            : "Sign in to book →"}
        </p>
      </div>
    </div>
  );
}
