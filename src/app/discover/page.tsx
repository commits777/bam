"use client";

import { useState, useMemo, useEffect, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Map as MapIcon, X, ArrowUpRight } from "lucide-react";
import Nav from "@/components/nav";
import FilterBar from "@/components/filter-bar";
import VenueCard from "@/components/venue-card";
import VenueSheet from "@/components/venue-sheet";
import { VENUES } from "@/lib/venues";
import type { Venue, FilterState, Vibe } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useLang } from "@/contexts/lang-context";
import { t } from "@/lib/i18n";

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-bone flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-12 h-12 rounded-full bg-siren/15 flex items-center justify-center"
        >
          <div className="w-5 h-5 rounded-full bg-siren" />
        </motion.div>
        <span className="font-mono text-[11px] text-ink/40 tracking-[3px] uppercase">
          Loading map
        </span>
      </div>
    </div>
  ),
});

type MobileView = "list" | "map";

function DiscoverInner() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { lang } = useLang();
  const tr = t[lang];
  const [filters, setFilters] = useState<FilterState>({
    neighborhood: null,
    vibe: (searchParams.get("vibe") as Vibe) ?? null,
    budget: null,
    occasion: null,
  });
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("list");
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>([]);

  // Load saved venues on session change
  useEffect(() => {
    if (!session) { setSavedVenueIds([]); return; }
    fetch("/api/venues/save")
      .then((r) => r.json())
      .then((d) => setSavedVenueIds(d.savedVenueIds ?? []))
      .catch(() => {});
  }, [session]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedVenue(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSaveToggle = useCallback((venueId: string, saved: boolean) => {
    setSavedVenueIds((prev) =>
      saved ? [...prev, venueId] : prev.filter((id) => id !== venueId)
    );
  }, []);

  const filtered = useMemo(() => {
    return VENUES.filter((v) => {
      if (filters.neighborhood && v.neighborhood !== filters.neighborhood) return false;
      if (filters.vibe && v.vibe !== filters.vibe) return false;
      if (filters.budget && v.budget !== filters.budget) return false;
      if (filters.occasion && !v.occasions.includes(filters.occasion)) return false;
      return true;
    });
  }, [filters]);

  const clearFilters = () =>
    setFilters({ neighborhood: null, vibe: null, budget: null, occasion: null });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-cream">
      <Nav />
      <FilterBar filters={filters} onChange={setFilters} resultCount={filtered.length} />

      {/* Mobile view toggle */}
      <div className="lg:hidden flex items-center gap-1.5 px-4 py-2.5 bg-cream border-b border-border">
        <button
          onClick={() => setMobileView("list")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-[11px] font-mono font-bold tracking-wide transition-all duration-150",
            mobileView === "list"
              ? "bg-ink text-taxi"
              : "text-ink/50 hover:text-ink border border-border"
          )}
        >
          <LayoutGrid className="w-3 h-3" />
          List
        </button>
        <button
          onClick={() => setMobileView("map")}
          className={cn(
            "flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm text-[11px] font-mono font-bold tracking-wide transition-all duration-150",
            mobileView === "map"
              ? "bg-ink text-taxi"
              : "text-ink/50 hover:text-ink border border-border"
          )}
        >
          <MapIcon className="w-3 h-3" />
          Map
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Venue list panel */}
        <div
          className={cn(
            "flex flex-col bg-cream border-r border-border overflow-hidden",
            "lg:flex lg:w-[400px] xl:w-[460px] shrink-0",
            mobileView === "list" ? "flex w-full" : "hidden"
          )}
        >
          <div className="px-5 py-3 flex items-center justify-between border-b border-border shrink-0">
            <span className="font-mono text-[11px] text-ink/40 tracking-[2px] uppercase">
              {filtered.length} {filtered.length === 1 ? tr.spot : tr.spots}
              {hasFilters ? ` · ${tr.filtered}` : ` · ${tr.inAthens}`}
            </span>
            <AnimatePresence>
              {hasFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-[11px] font-mono text-siren hover:text-siren/70 transition-colors"
                >
                  <X className="w-2.5 h-2.5" strokeWidth={3} />
                  {tr.clearAll}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <EmptyState onClear={clearFilters} />
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 p-4 pb-8"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((venue, i) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      index={i}
                      onSelect={(v) => {
                        setSelectedVenue(v);
                        setMobileView("list");
                      }}
                      selected={selectedVenue?.id === venue.id}
                      savedVenueIds={savedVenueIds}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>

        {/* Map panel */}
        <div
          className={cn(
            "relative flex-1 overflow-hidden",
            mobileView === "map" ? "flex flex-col w-full" : "hidden lg:block"
          )}
        >
          <MapView
            venues={filtered}
            selectedVenue={selectedVenue}
            onVenueSelect={(v) => {
              setSelectedVenue(v);
              setMobileView("list");
            }}
          />

          {/* Floating mini-card on desktop */}
          <AnimatePresence>
            {selectedVenue && (
              <motion.div
                key={selectedVenue.id}
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.96 }}
                transition={{ type: "spring", damping: 28, stiffness: 320, mass: 0.7 }}
                className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-[340px]"
              >
                <div className="bg-cream rounded-sm shadow-2xl border border-border overflow-hidden">
                  <div className="flex">
                    <div className="relative w-28 shrink-0">
                      <img
                        src={selectedVenue.image}
                        alt={selectedVenue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3.5 flex flex-col justify-between flex-1 min-w-0">
                      <div>
                        <p className="font-display text-[15px] leading-tight text-ink truncate">
                          {selectedVenue.name}
                        </p>
                        <p className="font-mono text-[10px] text-ink/45 mt-0.5 tracking-wide">
                          {selectedVenue.neighborhood} · {selectedVenue.budget}
                        </p>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-2">
                        <p className="font-mono text-[10px] text-ink/40 truncate leading-snug">
                          {selectedVenue.tagline.length > 38
                            ? selectedVenue.tagline.slice(0, 38) + "…"
                            : selectedVenue.tagline}
                        </p>
                        <a
                          href={selectedVenue.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 flex items-center gap-0.5 px-2.5 py-1.5 bg-siren text-cream rounded text-[10px] font-display tracking-wide hover:bg-siren/90 transition-colors"
                        >
                          BOOK
                          <ArrowUpRight className="w-2.5 h-2.5" strokeWidth={2.5} />
                        </a>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVenue(null)}
                    className="absolute top-2.5 right-2.5 w-5 h-5 rounded bg-ink/10 flex items-center justify-center hover:bg-ink/20 transition-colors"
                  >
                    <X className="w-2.5 h-2.5 text-ink" strokeWidth={2.5} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <VenueSheet
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
        savedVenueIds={savedVenueIds}
        onSaveToggle={handleSaveToggle}
      />
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  const { lang } = useLang();
  const tr = t[lang];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-24 px-8 text-center"
    >
      <div className="w-14 h-14 bg-siren/10 flex items-center justify-center mb-5">
        <span className="font-display text-[28px] text-siren leading-none">!</span>
      </div>
      <h3 className="font-display text-xl text-ink mb-2">{tr.noSpotsTitle}</h3>
      <p className="font-body text-[14px] text-ink/45 max-w-[220px] mb-6 leading-relaxed">
        {tr.noSpotsBody}
      </p>
      <button
        onClick={onClear}
        className="px-5 py-2.5 bg-ink text-taxi font-display text-[13px] tracking-wide hover:bg-ink/85 transition-colors"
      >
        {tr.clearFilters}
      </button>
    </motion.div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverInner />
    </Suspense>
  );
}
