"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/nav";
import VenueSheet from "@/components/venue-sheet";
import { VENUES, NEIGHBORHOOD_GR } from "@/lib/venues";
import type { Venue } from "@/lib/types";

// ─── BAM stamp with leading dot ───────────────────────────────────────────────
function Stamp({ children, color = "siren" }: { children: React.ReactNode; color?: "siren" | "taxi" }) {
  return (
    <span className={`inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase font-bold ${color === "taxi" ? "text-taxi" : "text-siren"}`}>
      <span className="w-[7px] h-[7px] rounded-full bg-current shrink-0" />
      {children}
    </span>
  );
}

// ─── Editorial number ─────────────────────────────────────────────────────────
function EditorialNo({ n }: { n: number }) {
  return (
    <span className="inline-flex items-baseline gap-1 font-mono text-[9px] tracking-[0.18em] uppercase font-bold">
      <span className="opacity-60">BAM</span>
      <span className="text-siren">№</span>
      <span>{String(n).padStart(2, "0")}</span>
    </span>
  );
}

// ─── Suggestion grid (empty state) ───────────────────────────────────────────
function EmptyState() {
  const suggestions = VENUES.slice(0, 4);
  return (
    <div className="px-[18px] py-8">
      <div className="bg-bone rounded-[10px] p-[22px] mb-6">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-ink/45 font-bold mb-2">WHY SAVE</p>
        <p className="text-[14px] text-ink/65 leading-[1.4] mb-4">
          You&apos;ll forget the wine bar&apos;s name by Saturday. We won&apos;t.
        </p>
        <Link
          href="/discover"
          className="inline-flex font-mono text-[11px] tracking-[0.15em] uppercase font-bold border-[1.5px] border-ink text-ink px-4 py-2.5 hover:bg-ink hover:text-cream transition-all"
        >
          OPEN DISCOVERY →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((v) => (
          <div key={v.id} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-bone">
            <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <p className="absolute bottom-2 left-2 right-2 font-display text-[13px] text-cream leading-tight">{v.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [beenIds, setBeenIds] = useState<string[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect to sign-in if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signin");
    }
  }, [status, router]);

  // Load saved venues
  useEffect(() => {
    if (!session) return;
    fetch("/api/venues/save")
      .then((r) => r.json())
      .then((d) => { setSavedIds(d.savedVenueIds ?? []); setLoading(false); })
      .catch(() => setLoading(false));

    // Load been-there from localStorage (server-side persistence is Phase 2)
    try {
      const stored = JSON.parse(localStorage.getItem("bam_been") ?? "[]");
      setBeenIds(Array.isArray(stored) ? stored : []);
    } catch { /* empty */ }
  }, [session]);

  async function handleRemove(venue: Venue) {
    const res = await fetch("/api/venues/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venueId: venue.id }),
    });
    const data = await res.json();
    if (!data.saved) setSavedIds((p) => p.filter((id) => id !== venue.id));
  }

  function toggleBeen(venue: Venue) {
    setBeenIds((prev) => {
      const next = prev.includes(venue.id)
        ? prev.filter((id) => id !== venue.id)
        : [...prev, venue.id];
      localStorage.setItem("bam_been", JSON.stringify(next));
      return next;
    });
  }

  function handleSaveToggle(venueId: string, saved: boolean) {
    setSavedIds((prev) => saved ? [...prev, venueId] : prev.filter((id) => id !== venueId));
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-dvh bg-cream">
        <Nav />
        <div className="flex items-center justify-center h-[60dvh]">
          <div className="w-5 h-5 rounded-full bg-siren animate-pulse" />
        </div>
      </div>
    );
  }

  const savedVenues = VENUES.filter((v) => savedIds.includes(v.id));

  return (
    <div className="min-h-dvh bg-cream">
      <Nav />

      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="px-[18px] pt-8 pb-4">
          <Stamp color="siren">Your roster</Stamp>
          <h1 className="font-display text-[46px] leading-[0.9] tracking-[-0.035em] text-ink mt-2.5 mb-2">
            {savedVenues.length === 0 ? "Empty. For now." : `${savedVenues.length} on deck.`}
          </h1>
          <p className="text-[14px] text-ink/45 leading-[1.4]">
            {savedVenues.length === 0
              ? "Sign in once and save a place from discovery — we'll keep it here, across devices."
              : "Saved across devices. Mark been-there to thin the list."}
          </p>
        </div>

        {savedVenues.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="pb-10">
            {/* Roster list */}
            <div className="border-t border-border">
              {savedVenues.map((v) => {
                const isBeen = beenIds.includes(v.id);
                const nhGr = NEIGHBORHOOD_GR[v.neighborhood] ?? v.neighborhood;
                return (
                  <article
                    key={v.id}
                    className={`grid items-center gap-3.5 px-[18px] py-3.5 border-b border-border cursor-pointer transition-opacity ${isBeen ? "opacity-55" : ""}`}
                    style={{ gridTemplateColumns: "80px 1fr auto" }}
                    onClick={() => setSelectedVenue(v)}
                  >
                    {/* Thumbnail */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-bone shrink-0">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                      </div>
                      {isBeen && (
                        <div className="absolute inset-0 rounded-lg bg-ink/65 flex items-center justify-center">
                          <span className="font-display text-[11px] text-taxi tracking-[0.1em]">BEEN</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0">
                      {v.no && <EditorialNo n={v.no} />}
                      <h3 className={`font-display text-[20px] leading-[1] tracking-[-0.02em] mt-1.5 mb-1 ${isBeen ? "line-through" : ""}`}>
                        {v.name}
                      </h3>
                      <p className="font-mono text-[12px] text-ink/45">
                        {nhGr} · {v.budget} · {v.walkMin}min
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleBeen(v); }}
                        title="Been there"
                        className={`w-8 h-8 rounded-full border-[1.5px] flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                          isBeen ? "bg-taxi border-taxi text-ink" : "border-ink text-ink hover:bg-bone"
                        }`}
                      >
                        ✓
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemove(v); }}
                        title="Remove"
                        className="w-8 h-8 rounded-full border-[1.5px] border-ink/35 flex items-center justify-center font-mono text-[12px] font-bold text-ink/45 hover:border-siren hover:text-siren transition-all"
                      >
                        ×
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Build a plan CTA — shown when 2+ saved */}
            {savedVenues.length >= 2 && (
              <div className="mx-[18px] mt-5 bg-ink text-cream rounded-xl p-5">
                <Stamp color="taxi">Send three to your person</Stamp>
                <p className="font-display text-[24px] leading-[0.98] tracking-[-0.02em] mt-2.5 mb-3.5">
                  Pick three from your roster.<br />Let them choose.
                </p>
                <button className="bg-siren text-cream font-display text-[15px] px-4 py-3 hover:bg-siren/90 transition-colors">
                  BUILD A PLAN →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <VenueSheet
        venue={selectedVenue}
        onClose={() => setSelectedVenue(null)}
        savedVenueIds={savedIds}
        onSaveToggle={handleSaveToggle}
      />
    </div>
  );
}
