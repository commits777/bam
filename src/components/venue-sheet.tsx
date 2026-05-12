"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Tag, Bookmark, Share2, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Venue, Vibe } from "@/lib/types";
import { useLang } from "@/contexts/lang-context";
import { t } from "@/lib/i18n";
import WaitlistModal from "@/components/waitlist-modal";

interface VenueSheetProps {
  venue: Venue | null;
  onClose: () => void;
  savedVenueIds?: string[];
  onSaveToggle?: (venueId: string, saved: boolean) => void;
}

const VIBE_STYLES: Record<Vibe, { bg: string; text: string }> = {
  "Wine Bar":     { bg: "#0A0A0A", text: "#FFD000" },
  "Cocktail Bar": { bg: "#FF2D2D", text: "#FFFCF2" },
  "Dinner":       { bg: "#FFFCF2", text: "#0A0A0A" },
  "Rooftop":      { bg: "#FFD000", text: "#0A0A0A" },
  "Jazz Club":    { bg: "#0A0A0A", text: "#FFFCF2" },
  "Activity":     { bg: "#F5F1E8", text: "#0A0A0A" },
  "Comedy":       { bg: "#FFD000", text: "#0A0A0A" },
  "Experience":   { bg: "#FF2D2D", text: "#FFD000" },
};

export default function VenueSheet({ venue, onClose, savedVenueIds = [], onSaveToggle }: VenueSheetProps) {
  return (
    <AnimatePresence>
      {venue && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/40 backdrop-blur-[3px] z-50 lg:hidden"
          />

          {/* Mobile — slides up from bottom */}
          <motion.div
            key="sheet-mobile"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-cream rounded-t-sm shadow-2xl max-h-[92dvh] overflow-y-auto"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-ink/15" />
            </div>
            <SheetBody venue={venue} onClose={onClose} savedVenueIds={savedVenueIds} onSaveToggle={onSaveToggle} />
          </motion.div>

          {/* Desktop — slides in from right */}
          <motion.div
            key="sheet-desktop"
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 260, mass: 0.9 }}
            className="hidden lg:flex fixed top-[104px] right-0 bottom-0 w-[360px] z-40 bg-cream border-l border-border shadow-2xl flex-col overflow-y-auto"
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
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const { lang } = useLang();
  const tr = t[lang];
  const isSaved = savedVenueIds.includes(venue.id);
  const style = VIBE_STYLES[venue.vibe] ?? { bg: "#0A0A0A", text: "#FFFCF2" };

  async function handleSave() {
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

  function handleShare() {
    if (!session) { router.push("/auth/signin"); return; }
    if (navigator.share) {
      navigator.share({ title: venue.name, text: venue.tagline, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <>
    {waitlistOpen && <WaitlistModal venue={venue} onClose={() => setWaitlistOpen(false)} />}
    <div className="flex flex-col pb-8">
      {/* Hero image — no radius, flush to edges */}
      <div className="relative h-64 mx-4 mt-2 overflow-hidden bg-bone shrink-0">
        <img src={venue.image} alt={venue.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-sm bg-ink/50 backdrop-blur-sm flex items-center justify-center hover:bg-ink/70 transition-colors"
        >
          <X className="w-4 h-4 text-cream" strokeWidth={2.5} />
        </button>

        {/* Vibe tag — consistent with card */}
        <div
          className="absolute bottom-3 left-3 px-2.5 py-1 text-[10px] font-mono font-bold tracking-wide"
          style={{ background: style.bg, color: style.text }}
        >
          {venue.vibe}
        </div>

        {venue.sponsored && (
          <div className="absolute top-3 left-3 px-2 py-0.5 bg-taxi text-[9px] font-mono font-bold text-ink tracking-wider uppercase">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-5 flex flex-col gap-5">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-display text-[26px] leading-[1.05] tracking-[-0.02em] text-ink">
              {venue.name}
            </h2>
            <span className="font-mono text-xl text-ink/35 mt-1 shrink-0">{venue.budget}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-ink/40" strokeWidth={2} />
            <span className="font-mono text-[12px] text-ink/50">
              {venue.neighborhood}
              {venue.walkMin && ` · ${venue.walkMin} ${tr.walkMin}`}
            </span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[15px] text-ink/65 leading-relaxed border-l-2 border-siren pl-3">
          {venue.tagline}
        </p>

        {/* Tags */}
        {venue.tags && (
          <div className="flex flex-wrap gap-1.5">
            {venue.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1 bg-bone text-[11px] font-mono text-ink/55 border border-border"
              >
                <Tag className="w-2.5 h-2.5" strokeWidth={2} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Occasions */}
        <div>
          <p className="text-[10px] font-mono text-ink/35 tracking-[2px] uppercase mb-2.5">
            {tr.perfectFor}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {venue.occasions.map((o) => (
              <span
                key={o}
                className="px-3 py-1.5 bg-ink text-taxi text-[10px] font-mono font-bold tracking-wide"
              >
                {o}
              </span>
            ))}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 py-4 border-t border-b border-border">
          <div>
            <p className="text-[10px] font-mono text-ink/35 tracking-[2px] uppercase mb-1">{tr.via}</p>
            <p className="font-mono text-[13px] text-ink/70">{venue.bookingPartner}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-[10px] font-mono text-ink/35 tracking-[2px] uppercase mb-1">{tr.vibe}</p>
            <p className="font-display text-[15px] text-ink">{venue.vibe}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-[10px] font-mono text-ink/35 tracking-[2px] uppercase mb-1">{tr.price}</p>
            <p className="font-mono text-[15px] text-ink">{venue.budget}</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setWaitlistOpen(true)}
            className="group flex items-center justify-center gap-2 w-full py-4 rounded-sm bg-siren text-cream font-display text-lg tracking-wide hover:bg-siren/90 active:scale-[0.98] transition-all duration-150"
          >
            {tr.bookIt}
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-sm border border-border text-[13px] font-body font-semibold text-ink/60 hover:bg-bone hover:text-ink transition-all"
            >
              <Bookmark
                className={isSaved ? "w-4 h-4 fill-siren text-siren" : "w-4 h-4"}
                strokeWidth={2}
              />
              {isSaved ? tr.saved : tr.save}
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-sm border border-border text-[13px] font-body font-semibold text-ink/60 hover:bg-bone hover:text-ink transition-all"
            >
              <Share2 className="w-4 h-4" strokeWidth={2} />
              {tr.share}
            </button>
          </div>

        </div>
      </div>
    </div>
    </>
  );
}
