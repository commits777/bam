"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Nav from "@/components/nav";
import VenueCard from "@/components/venue-card";
import VenueSheet from "@/components/venue-sheet";
import { VENUES, NEIGHBORHOOD_GR, VIBES, BUDGETS, OCCASIONS_DATA } from "@/lib/venues";
import type { Venue, FilterState, Vibe, Budget, Occasion } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useLang } from "@/contexts/lang-context";

const MapView = dynamic(() => import("@/components/map-view"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-bone flex items-center justify-center">
      <div className="w-5 h-5 rounded-full bg-siren animate-pulse" />
    </div>
  ),
});

// ─── FilterChip ───────────────────────────────────────────────────────────────
function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "font-mono text-[11px] tracking-[0.12em] uppercase font-bold px-3.5 py-2.5 rounded-full whitespace-nowrap shrink-0 transition-all duration-[120ms]",
        active
          ? "bg-siren text-cream border-[1.5px] border-siren"
          : "bg-transparent text-ink border-[1.5px] border-ink hover:bg-ink/5"
      )}
    >
      {children}
    </button>
  );
}

// ─── Sidebar filter group ─────────────────────────────────────────────────────
function SidebarGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/50 font-bold mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

// ─── Desktop sidebar filters ──────────────────────────────────────────────────
function Sidebar({
  filters,
  setFilters,
  activeCount,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  activeCount: number;
}) {
  const { lang } = useLang();
  const isEL = lang === "EL";
  return (
    <aside className="hidden lg:flex flex-col gap-5 w-[260px] shrink-0 border-r border-border bg-cream px-5 py-5 overflow-y-auto">
      <div className="flex items-baseline justify-between">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase font-bold text-ink">Filters</p>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters({ neighborhood: null, vibe: null, budget: null, occasion: null, openNow: false, walk: null })}
            className="font-mono text-[10px] tracking-[0.1em] uppercase font-bold text-siren hover:opacity-70 transition-opacity"
          >
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <SidebarGroup label="Vibe">
        {VIBES.map((v) => (
          <FilterChip
            key={v}
            active={filters.vibe === v}
            onClick={() => setFilters({ ...filters, vibe: filters.vibe === v ? null : v as Vibe })}
          >
            {v}
          </FilterChip>
        ))}
      </SidebarGroup>

      <SidebarGroup label="Neighborhood">
        {Object.entries(NEIGHBORHOOD_GR).map(([en, gr]) => (
          <FilterChip
            key={en}
            active={filters.neighborhood === en}
            onClick={() => setFilters({ ...filters, neighborhood: filters.neighborhood === en ? null : en as FilterState["neighborhood"] })}
          >
            {isEL ? gr : en}
          </FilterChip>
        ))}
      </SidebarGroup>

      <SidebarGroup label="Budget">
        {BUDGETS.map((b) => (
          <FilterChip
            key={b}
            active={filters.budget === b}
            onClick={() => setFilters({ ...filters, budget: filters.budget === b ? null : b as Budget })}
          >
            {b}
          </FilterChip>
        ))}
      </SidebarGroup>

      <SidebarGroup label="Occasion">
        {OCCASIONS_DATA.map((o) => (
          <FilterChip
            key={o.id}
            active={filters.occasion === o.id}
            onClick={() => setFilters({ ...filters, occasion: filters.occasion === o.id ? null : o.id as Occasion })}
          >
            {o.id}
          </FilterChip>
        ))}
      </SidebarGroup>

      <SidebarGroup label="Right now">
        <FilterChip
          active={filters.openNow}
          onClick={() => setFilters({ ...filters, openNow: !filters.openNow })}
        >
          Open now
        </FilterChip>
        <FilterChip
          active={filters.walk === 10}
          onClick={() => setFilters({ ...filters, walk: filters.walk === 10 ? null : 10 })}
        >
          ≤ 10 min walk
        </FilterChip>
      </SidebarGroup>
    </aside>
  );
}

// ─── Full-screen filter drawer (mobile) ──────────────────────────────────────
function FilterDrawer({
  filters,
  setFilters,
  filteredCount,
  onClose,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  filteredCount: number;
  onClose: () => void;
}) {
  const { lang } = useLang();
  const isEL = lang === "EL";
  const activeCount = [filters.neighborhood, filters.vibe, filters.budget, filters.occasion].filter(Boolean).length
    + (filters.openNow ? 1 : 0) + (filters.walk ? 1 : 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-end" onClick={onClose}>
      <div
        className="absolute inset-0 bg-ink/40"
        style={{ backdropFilter: "blur(3px)" }}
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full bg-cream rounded-t-[18px] px-5 pt-5 pb-6 max-h-[82dvh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase font-bold text-siren">
            <span className="w-[7px] h-[7px] rounded-full bg-siren" />
            All filters
          </span>
          <button onClick={onClose} className="font-display text-[24px] text-ink leading-none">×</button>
        </div>

        <div className="flex flex-col gap-5 mb-5">
          <SidebarGroup label="Vibe">
            {VIBES.map((v) => (
              <FilterChip key={v} active={filters.vibe === v} onClick={() => setFilters({ ...filters, vibe: filters.vibe === v ? null : v as Vibe })}>
                {v}
              </FilterChip>
            ))}
          </SidebarGroup>
          <SidebarGroup label="Neighborhood">
            {Object.entries(NEIGHBORHOOD_GR).map(([en, gr]) => (
              <FilterChip key={en} active={filters.neighborhood === en} onClick={() => setFilters({ ...filters, neighborhood: filters.neighborhood === en ? null : en as FilterState["neighborhood"] })}>
                {isEL ? gr : en}
              </FilterChip>
            ))}
          </SidebarGroup>
          <SidebarGroup label="Budget">
            {BUDGETS.map((b) => (
              <FilterChip key={b} active={filters.budget === b} onClick={() => setFilters({ ...filters, budget: filters.budget === b ? null : b as Budget })}>
                {b}
              </FilterChip>
            ))}
          </SidebarGroup>
          <SidebarGroup label="Occasion">
            {OCCASIONS_DATA.map((o) => (
              <FilterChip key={o.id} active={filters.occasion === o.id} onClick={() => setFilters({ ...filters, occasion: filters.occasion === o.id ? null : o.id as Occasion })}>
                {o.id}
              </FilterChip>
            ))}
          </SidebarGroup>
          <SidebarGroup label="Right now">
            <FilterChip active={filters.openNow} onClick={() => setFilters({ ...filters, openNow: !filters.openNow })}>Open now</FilterChip>
            <FilterChip active={filters.walk === 10} onClick={() => setFilters({ ...filters, walk: filters.walk === 10 ? null : 10 })}>≤ 10 min walk</FilterChip>
          </SidebarGroup>
        </div>

        {activeCount > 0 && (
          <button
            onClick={() => setFilters({ neighborhood: null, vibe: null, budget: null, occasion: null, openNow: false, walk: null })}
            className="w-full border-[1.5px] border-ink text-ink font-mono text-[11px] tracking-[0.15em] uppercase font-bold py-2.5 rounded mb-3 hover:bg-ink hover:text-cream transition-all"
          >
            Clear all ({activeCount})
          </button>
        )}

        <button
          onClick={onClose}
          className="w-full bg-siren text-cream font-display text-[18px] py-[15px] rounded"
        >
          SHOW {filteredCount} VENUES →
        </button>
      </motion.div>
    </div>
  );
}

// ─── Main inner component ─────────────────────────────────────────────────────
function DiscoverInner() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { lang } = useLang();
  const isEL = lang === "EL";

  const [filters, setFilters] = useState<FilterState>({
    neighborhood: null,
    vibe: (searchParams.get("vibe") as Vibe) ?? null,
    budget: null,
    occasion: null,
    openNow: false,
    walk: null,
  });
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [mobileView, setMobileView] = useState<"map" | "list">("map");
  const [listExpanded, setListExpanded] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [savedVenueIds, setSavedVenueIds] = useState<string[]>([]);

  useEffect(() => {
    if (!session) { setSavedVenueIds([]); return; }
    fetch("/api/venues/save")
      .then((r) => r.json())
      .then((d) => setSavedVenueIds(d.savedVenueIds ?? []))
      .catch(() => {});
  }, [session]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedVenue(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSaveToggle = useCallback((venueId: string, saved: boolean) => {
    setSavedVenueIds((prev) => saved ? [...prev, venueId] : prev.filter((id) => id !== venueId));
  }, []);

  const filtered = useMemo(() => {
    return VENUES.filter((v) => {
      if (filters.neighborhood && v.neighborhood !== filters.neighborhood) return false;
      if (filters.vibe && v.vibe !== filters.vibe) return false;
      if (filters.budget && v.budget !== filters.budget) return false;
      if (filters.occasion && !v.occasions.includes(filters.occasion as Occasion)) return false;
      if (filters.openNow && !v.openNow) return false;
      if (filters.walk && (v.walkMin ?? 999) > filters.walk) return false;
      return true;
    });
  }, [filters]);

  const clearFilters = () => setFilters({ neighborhood: null, vibe: null, budget: null, occasion: null, openNow: false, walk: null });
  const activeFilterCount = [filters.neighborhood, filters.vibe, filters.budget, filters.occasion].filter(Boolean).length
    + (filters.openNow ? 1 : 0) + (filters.walk ? 1 : 0);
  const hasFilters = activeFilterCount > 0;

  const headingText = filtered.length === 0
    ? "Nothing fits. Try less."
    : activeFilterCount > 0 ? "Pick one." : "Pick one, anywhere.";

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-cream">
      <Nav />

      {/* ═══ DESKTOP: 3-pane (sidebar | map | list) ══════════════════════════ */}
      <div className="hidden lg:flex flex-col flex-1 overflow-hidden">
        {/* Header bar */}
        <div className="px-6 pt-4 pb-3 bg-cream border-b border-border shrink-0 flex items-end justify-between">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase font-bold text-siren">
              <span className="w-[7px] h-[7px] rounded-full bg-siren" />
              {filtered.length} places · {filters.neighborhood ? (NEIGHBORHOOD_GR[filters.neighborhood] ?? filters.neighborhood) : "all of Athens"} · tonight
            </span>
            <h1 className="font-display text-[42px] leading-[0.9] tracking-[-0.03em] text-ink mt-2">
              {headingText}
            </h1>
          </div>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase font-bold text-ink border-[1.5px] border-ink px-3.5 py-2.5 hover:bg-ink hover:text-cream transition-all mb-1"
            >
              <X className="w-3 h-3" strokeWidth={2.5} />
              CLEAR ALL ({activeFilterCount})
            </button>
          )}
        </div>

        {/* 3-pane body */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar filters={filters} setFilters={setFilters} activeCount={activeFilterCount} />

          {/* Map pane */}
          <div className="relative flex-1 overflow-hidden">
            <MapView
              venues={filtered}
              selectedVenue={selectedVenue}
              onVenueSelect={(v) => setSelectedVenue(v)}
            />
          </div>

          {/* Venue list pane */}
          <div className="w-[460px] shrink-0 border-l border-border bg-cream flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 pb-8">
              {filtered.length === 0 ? (
                <EmptyState onClear={clearFilters} />
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map((venue, i) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      index={i}
                      onSelect={setSelectedVenue}
                      selected={selectedVenue?.id === venue.id}
                      savedVenueIds={savedVenueIds}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MOBILE ═══════════════════════════════════════════════════════════ */}
      <div className="flex lg:hidden flex-col flex-1 overflow-hidden">

        {/* Mobile header section */}
        <div className="bg-cream border-b border-border shrink-0">
          {/* Occasion presets */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pt-3 pb-2">
            {OCCASIONS_DATA.map((o) => {
              const active = filters.occasion === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => setFilters({ ...filters, occasion: filters.occasion === o.id ? null : o.id as Occasion })}
                  className={cn(
                    "flex flex-col items-start shrink-0 px-3.5 py-2.5 rounded-lg border-none min-w-[140px] transition-all",
                    active ? "bg-ink text-cream" : "bg-bone text-ink"
                  )}
                >
                  <span className="font-mono text-[9px] tracking-[0.15em] uppercase opacity-65 font-bold mb-0.5">{o.gr}</span>
                  <span className="font-display text-[15px] leading-tight tracking-[-0.01em]">{o.id}</span>
                </button>
              );
            })}
          </div>

          {/* Eyebrow + heading */}
          <div className="px-4 pt-2 pb-1">
            <span className="font-mono text-[10px] tracking-[0.18em] uppercase font-bold text-siren flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-siren" />
              {filtered.length} places · {filters.neighborhood ? (NEIGHBORHOOD_GR[filters.neighborhood] ?? filters.neighborhood) : isEL ? "όλη η Αθήνα" : "all of Athens"}
            </span>
            <h2 className="font-display text-[30px] leading-[0.95] tracking-[-0.03em] text-ink mt-1.5 mb-2">
              {headingText}
            </h2>
          </div>

          {/* Chip row: Open now + Vibe chips + More */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 pb-3">
            <FilterChip active={filters.openNow} onClick={() => setFilters({ ...filters, openNow: !filters.openNow })}>
              ● Open now
            </FilterChip>
            {VIBES.map((v) => (
              <FilterChip
                key={v}
                active={filters.vibe === v}
                onClick={() => setFilters({ ...filters, vibe: filters.vibe === v ? null : v as Vibe })}
              >
                {v}
              </FilterChip>
            ))}
            <button
              onClick={() => setDrawerOpen(true)}
              className="font-mono text-[11px] tracking-[0.12em] uppercase font-bold px-3.5 py-2.5 rounded-full shrink-0 bg-transparent text-ink border-[1.5px] border-ink hover:bg-ink/5 transition-all"
            >
              More ⌥
            </button>
          </div>
        </div>

        {/* Map + bottom sheet */}
        <div className="flex-1 relative overflow-hidden bg-bone">
          {/* Map */}
          <div className={cn("absolute inset-0 transition-all duration-250", listExpanded ? "bottom-[70%]" : "bottom-[200px]")}>
            <MapView
              venues={filtered}
              selectedVenue={selectedVenue}
              onVenueSelect={(v) => { setSelectedVenue(v); setListExpanded(false); }}
            />
          </div>

          {/* Bottom sheet */}
          <div
            className={cn(
              "absolute left-0 right-0 bottom-0 bg-cream rounded-t-[18px] z-10 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] flex flex-col transition-all duration-250 overflow-hidden",
              listExpanded ? "top-0 rounded-none" : "h-[216px]"
            )}
          >
            {/* Drag handle */}
            <button
              onClick={() => setListExpanded(!listExpanded)}
              className="flex flex-col items-center gap-1.5 pt-2.5 pb-2 bg-transparent border-none shrink-0"
            >
              <span className="w-9 h-1 rounded-full bg-ink/20" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/45 font-bold">
                {listExpanded ? "SHOW MAP" : `${filtered.length} venues · drag up`}
              </span>
            </button>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-3.5 pb-4">
              {filtered.length === 0 ? (
                <EmptyState onClear={clearFilters} />
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map((venue, i) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      index={i}
                      onSelect={(v) => { setSelectedVenue(v); setListExpanded(false); }}
                      selected={selectedVenue?.id === venue.id}
                      savedVenueIds={savedVenueIds}
                      onSaveToggle={handleSaveToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter drawer (mobile) */}
      <AnimatePresence>
        {drawerOpen && (
          <FilterDrawer
            filters={filters}
            setFilters={setFilters}
            filteredCount={filtered.length}
            onClose={() => setDrawerOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Venue sheet */}
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
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase font-bold text-siren mb-3">
        <span className="w-1.5 h-1.5 rounded-full bg-siren" />
        No matches
      </span>
      <h3 className="font-display text-[28px] tracking-[-0.02em] leading-[1] text-ink mb-2">
        Nothing fits.<br />Try less.
      </h3>
      <button
        onClick={onClear}
        className="mt-4 bg-ink text-cream font-display text-[14px] px-5 py-3 hover:bg-ink/85 transition-colors"
      >
        CLEAR FILTERS
      </button>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense>
      <DiscoverInner />
    </Suspense>
  );
}
