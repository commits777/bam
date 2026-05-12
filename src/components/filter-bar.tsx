"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import type { FilterState, Neighborhood, Vibe, Budget, Occasion } from "@/lib/types";
import { NEIGHBORHOODS, VIBES, BUDGETS, OCCASIONS } from "@/lib/venues";
import { useLang } from "@/contexts/lang-context";
import { t } from "@/lib/i18n";

interface FilterBarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  resultCount: number;
}

type Category = "vibe" | "neighborhood" | "budget" | "occasion";

export default function FilterBar({ filters, onChange, resultCount }: FilterBarProps) {
  const [open, setOpen] = useState<Category | null>(null);
  const { lang } = useLang();
  const tr = t[lang];
  const activeCount = Object.values(filters).filter(Boolean).length;

  const CATEGORY_LABELS: Record<Category, string> = {
    vibe: tr.vibeFilter,
    neighborhood: tr.areaFilter,
    budget: tr.budgetFilter,
    occasion: tr.occasionFilter,
  };

  const CATEGORY_OPTIONS: Record<Category, readonly string[]> = {
    vibe: VIBES,
    neighborhood: NEIGHBORHOODS,
    budget: BUDGETS,
    occasion: OCCASIONS,
  };

  function toggle(cat: Category, value: string) {
    onChange({ ...filters, [cat]: filters[cat] === value ? null : value });
    setOpen(null);
  }

  function clearAll() {
    onChange({ neighborhood: null, vibe: null, budget: null, occasion: null });
  }

  function getLabel(cat: Category): string {
    return filters[cat] ?? CATEGORY_LABELS[cat];
  }

  return (
    <div className="relative bg-cream border-b border-border sticky top-14 z-40">
      <div className="max-w-[1400px] mx-auto px-4 h-12 flex items-center gap-2">
        {/* Filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1">
          {(["vibe", "neighborhood", "budget", "occasion"] as Category[]).map((cat) => {
            const isActive = Boolean(filters[cat]);
            const isOpen = open === cat;
            return (
              <div key={cat} className="relative shrink-0">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setOpen(isOpen ? null : cat)}
                  className={cn(
                    "flex items-center gap-1.5 h-8 px-3.5 rounded-sm border text-[12px] font-mono font-bold tracking-wide whitespace-nowrap transition-all duration-150",
                    isActive
                      ? "bg-ink border-ink text-taxi"
                      : isOpen
                      ? "bg-bone border-ink text-ink"
                      : "bg-white border-border text-ink/60 hover:border-ink/30 hover:text-ink"
                  )}
                >
                  {getLabel(cat)}
                  <ChevronDown
                    className={cn("w-3 h-3 transition-transform duration-150", isOpen && "rotate-180")}
                    strokeWidth={2.5}
                  />
                </motion.button>

                {/* Dropdown */}
                <AnimatePresence>
                  {isOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setOpen(null)} />
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.97 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-1.5 z-40 bg-white rounded-sm border border-border shadow-xl p-1.5 min-w-[180px]"
                      >
                        {CATEGORY_OPTIONS[cat].map((opt) => {
                          const isSelected = filters[cat] === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => toggle(cat, opt)}
                              className={cn(
                                "w-full flex items-center justify-between gap-3 px-3 py-2 text-[13px] font-body font-semibold transition-all duration-100",
                                isSelected
                                  ? "bg-ink text-taxi"
                                  : "text-ink/70 hover:bg-bone hover:text-ink"
                              )}
                            >
                              {opt}
                              {isSelected && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-1.5 h-1.5 bg-taxi shrink-0"
                                />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Right side — count + clear */}
        <div className="flex items-center gap-3 shrink-0 pl-2 border-l border-border">
          <span className="font-mono text-[11px] text-ink/40 tracking-widest uppercase whitespace-nowrap">
            {resultCount} {resultCount === 1 ? tr.spot : tr.spots}
          </span>
          <AnimatePresence>
            {activeCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={clearAll}
                className="flex items-center gap-1 px-2.5 py-1 rounded-sm bg-siren/8 text-siren text-[11px] font-mono font-bold hover:bg-siren/15 transition-colors"
              >
                <X className="w-2.5 h-2.5" strokeWidth={3} />
                {tr.clearAll}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
