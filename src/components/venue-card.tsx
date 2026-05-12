"use client";

import { motion } from "framer-motion";
import { MapPin, Bookmark } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LaunchPopup from "@/components/launch-popup";
import { cn } from "@/lib/utils";
import type { Venue, Vibe } from "@/lib/types";
import { useLang } from "@/contexts/lang-context";
import { t } from "@/lib/i18n";

interface VenueCardProps {
  venue: Venue;
  onSelect?: (venue: Venue) => void;
  selected?: boolean;
  index?: number;
  savedVenueIds?: string[];
  onSaveToggle?: (venueId: string, saved: boolean) => void;
}

const VIBE_STYLES: Record<Vibe, { bg: string; text: string }> = {
  "Wine Bar":      { bg: "#0A0A0A", text: "#FFD000" },
  "Cocktail Bar":  { bg: "#FF2D2D", text: "#FFFCF2" },
  "Dinner":        { bg: "#FFFCF2", text: "#0A0A0A" },
  "Rooftop":       { bg: "#FFD000", text: "#0A0A0A" },
  "Jazz Club":     { bg: "#0A0A0A", text: "#FFFCF2" },
  "Activity":      { bg: "#F5F1E8", text: "#0A0A0A" },
  "Comedy":        { bg: "#FFD000", text: "#0A0A0A" },
  "Experience":    { bg: "#FF2D2D", text: "#FFD000" },
};

export default function VenueCard({
  venue,
  onSelect,
  selected = false,
  index = 0,
  savedVenueIds = [],
  onSaveToggle,
}: VenueCardProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const { lang } = useLang();
  const tr = t[lang];
  const isSaved = savedVenueIds.includes(venue.id);
  const style = VIBE_STYLES[venue.vibe] ?? { bg: "#0A0A0A", text: "#FFFCF2" };

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

  return (
    <>
    {waitlistOpen && <LaunchPopup open={waitlistOpen} onClose={() => setWaitlistOpen(false)} />}
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => onSelect?.(venue)}
      className={cn(
        "group relative bg-cream rounded-sm overflow-hidden cursor-pointer border transition-all duration-200",
        selected
          ? "border-siren ring-2 ring-siren/20 shadow-lg shadow-siren/10"
          : "border-border hover:border-ink/20 hover:shadow-xl hover:shadow-black/8 shadow-sm"
      )}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

        {/* Save button */}
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={handleSave}
          disabled={saving}
          className="absolute top-3 right-3 w-8 h-8 rounded-sm bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Bookmark
            className={cn("w-3.5 h-3.5 transition-colors", isSaved ? "fill-siren text-siren" : "text-ink/60")}
            strokeWidth={2}
          />
        </motion.button>

        {/* Vibe tag */}
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

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-display text-[17px] leading-tight tracking-[-0.01em] text-ink">
            {venue.name}
          </h3>
          <span className="font-mono text-[13px] text-ink/40 shrink-0 mt-0.5">{venue.budget}</span>
        </div>

        <p className="text-[13px] text-ink/55 leading-snug mb-4 line-clamp-2">
          {venue.tagline}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-ink/35 min-w-0">
            <MapPin className="w-3 h-3 shrink-0" strokeWidth={2} />
            <span className="text-[11px] font-mono truncate">
              {venue.neighborhood}
              {venue.walkMin ? ` · ${venue.walkMin}m` : ""}
            </span>
          </div>

          <motion.button
            onClick={(e) => { e.stopPropagation(); setWaitlistOpen(true); }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-sm bg-siren text-cream text-[11px] font-display tracking-wide hover:bg-siren/90 transition-colors"
          >
            {tr.bookIt}
          </motion.button>
        </div>
      </div>
    </motion.article>
    </>
  );
}
