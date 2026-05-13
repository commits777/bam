"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Venue } from "@/lib/types";
import { NEIGHBORHOOD_GR } from "@/lib/venues";

interface VenueCardProps {
  venue: Venue;
  onSelect?: (venue: Venue) => void;
  selected?: boolean;
  index?: number;
  savedVenueIds?: string[];
  onSaveToggle?: (venueId: string, saved: boolean) => void;
}

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
  const isSaved = savedVenueIds.includes(venue.id);
  const nhGr = NEIGHBORHOOD_GR[venue.neighborhood] ?? venue.neighborhood;

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
    if (!session) { router.push("/auth/signin"); return; }
    window.open(venue.bookingUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => onSelect?.(venue)}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = ""; }}
      className={cn(
        "group relative bg-cream overflow-hidden cursor-pointer border transition-shadow duration-[180ms]",
        selected
          ? "border-siren shadow-[0_0_0_2px_rgba(255,45,45,0.15)]"
          : "border-border hover:shadow-xl hover:shadow-black/8"
      )}
      style={{ borderRadius: "var(--r-card, 10px)", transition: "transform 180ms ease, box-shadow 180ms ease" }}
    >
      {/* Image 4:3 */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />

        {/* Vibe tag — top left */}
        <div className="absolute top-3 left-3">
          <span className="font-mono text-[10px] tracking-[0.15em] uppercase font-bold px-2.5 py-1.5 bg-ink text-taxi">
            {venue.vibe}
          </span>
        </div>

        {/* BAM № — top right */}
        {venue.no && (
          <div className="absolute top-2.5 right-3 bg-cream px-2 py-1 rounded">
            <span className="inline-flex items-baseline gap-1 font-mono text-[9px] tracking-[0.18em] uppercase font-bold">
              <span className="opacity-60">BAM</span>
              <span className="text-siren">!</span>
              <span>{String(venue.no).padStart(2, "0")}</span>
            </span>
          </div>
        )}

        {/* SAVE — bottom left */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "absolute bottom-3 left-3 font-mono text-[10px] tracking-[0.15em] uppercase font-bold px-2.5 py-1.5 rounded-full transition-all duration-[150ms]",
            isSaved
              ? "bg-ink text-taxi"
              : "bg-ink text-cream hover:text-taxi"
          )}
        >
          {isSaved ? "★ SAVED" : "☆ SAVE"}
        </button>

        {venue.sponsored && (
          <div className="absolute top-3 left-3 mt-7 px-2 py-0.5 bg-taxi text-[9px] font-mono font-bold text-ink tracking-wider uppercase">
            Featured
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-[18px] pt-[18px] pb-4">
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <h3 className="font-display text-[24px] leading-[0.95] tracking-[-0.02em] text-ink">
            {venue.name}
          </h3>
          <span className="font-mono text-[10px] text-ink/45 shrink-0">{venue.budget}</span>
        </div>

        {/* Why pull-quote with siren left border */}
        <p className="text-[14px] text-ink/65 leading-[1.4] mb-3.5 border-l-[3px] border-siren pl-3">
          &ldquo;{venue.tagline}&rdquo;
        </p>

        {/* Meta row */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink/45">
            {nhGr} · {venue.neighborhood} · {venue.walkMin}min
          </span>
          {venue.openNow !== undefined && (
            <span className={cn(
              "font-mono text-[10px] tracking-[0.1em] uppercase font-bold",
              venue.openNow ? "text-green-700" : "text-ink/40"
            )}>
              {venue.openNow ? "● OPEN NOW" : "○ CLOSED"}
            </span>
          )}
        </div>

        {/* BOOK IT CTA */}
        <button
          onClick={handleBook}
          className="w-full bg-siren text-cream font-display text-[16px] py-3 flex items-center justify-center gap-1.5 hover:bg-siren/90 active:scale-[0.98] transition-all"
        >
          BOOK IT<span className="text-taxi">!</span>
          <span className="opacity-85 ml-1">→</span>
        </button>
      </div>
    </motion.article>
  );
}
