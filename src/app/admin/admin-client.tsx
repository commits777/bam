"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Bookmark, TrendingUp, Shield, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  role: string;
  createdAt: string;
  _count: { savedVenues: number };
}

interface VenueStat {
  venueId: string;
  name: string;
  neighborhood: string;
  vibe: string;
  saveCount: number;
}

interface Props {
  users: UserRow[];
  venueStats: VenueStat[];
  totalUsers: number;
  totalSaves: number;
}

type Tab = "users" | "venues";

export default function AdminClient({ users, venueStats, totalUsers, totalSaves }: Props) {
  const [tab, setTab] = useState<Tab>("users");
  const [search, setSearch] = useState("");
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [localUsers, setLocalUsers] = useState(users);

  const filtered = localUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  async function toggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setUpdatingRole(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setLocalUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } finally {
      setUpdatingRole(null);
    }
  }

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "text-ink" },
    { label: "Total Saves", value: totalSaves, icon: Bookmark, color: "text-siren" },
    { label: "Venues Listed", value: venueStats.length, icon: TrendingUp, color: "text-ink" },
    {
      label: "Admins",
      value: localUsers.filter((u) => u.role === "admin").length,
      icon: Shield,
      color: "text-taxi",
    },
  ];

  return (
    <div className="min-h-screen bg-bone">
      {/* Header */}
      <div className="bg-cream border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-display text-2xl text-ink">
            BAM<span className="text-siren">!</span>
          </span>
          <span className="font-mono text-[11px] text-ink/35 tracking-[3px] uppercase border-l border-border pl-3">
            Admin
          </span>
        </div>
        <a
          href="/"
          className="font-mono text-[11px] text-ink/50 hover:text-ink transition-colors tracking-wide"
        >
          ← Back to site
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-cream border border-border rounded-sm p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] text-ink/40 tracking-[2px] uppercase">
                  {s.label}
                </span>
                <s.icon className={cn("w-4 h-4", s.color)} strokeWidth={1.5} />
              </div>
              <p className="font-display text-3xl text-ink">{s.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {(["users", "venues"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "px-4 py-2.5 font-mono text-[12px] font-bold tracking-wide capitalize border-b-2 -mb-px transition-colors",
                tab === t
                  ? "border-ink text-ink"
                  : "border-transparent text-ink/40 hover:text-ink"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "users" && (
          <div>
            {/* Search */}
            <div className="relative mb-4 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink/35" strokeWidth={2} />
              <input
                type="text"
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 h-9 bg-cream border border-border rounded-sm font-mono text-[12px] text-ink placeholder:text-ink/30 focus:outline-none focus:ring-1 focus:ring-ink/20"
              />
            </div>

            {/* Table */}
            <div className="bg-cream border border-border rounded-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 font-mono text-[10px] text-ink/40 tracking-[2px] uppercase">
                      User
                    </th>
                    <th className="text-left px-5 py-3 font-mono text-[10px] text-ink/40 tracking-[2px] uppercase hidden md:table-cell">
                      Joined
                    </th>
                    <th className="text-left px-5 py-3 font-mono text-[10px] text-ink/40 tracking-[2px] uppercase">
                      Saves
                    </th>
                    <th className="text-left px-5 py-3 font-mono text-[10px] text-ink/40 tracking-[2px] uppercase">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, i) => (
                    <tr
                      key={user.id}
                      className={cn(
                        "border-b border-border last:border-0",
                        i % 2 === 0 ? "bg-transparent" : "bg-bone/40"
                      )}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-sm bg-bone border border-border overflow-hidden shrink-0">
                            {user.image ? (
                              <img src={user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-display text-sm text-ink/40">
                                {(user.name?.[0] ?? user.email?.[0] ?? "?").toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-body text-[13px] font-semibold text-ink truncate">
                              {user.name ?? "—"}
                            </p>
                            <p className="font-mono text-[11px] text-ink/40 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="font-mono text-[11px] text-ink/50">
                          {new Date(user.createdAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[13px] text-ink/70">
                          {user._count.savedVenues}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleRole(user.id, user.role)}
                          disabled={updatingRole === user.id}
                          className={cn(
                            "px-2.5 py-1 rounded font-mono text-[10px] font-bold tracking-wide uppercase transition-colors",
                            user.role === "admin"
                              ? "bg-taxi text-ink hover:bg-taxi/80"
                              : "bg-bone text-ink/50 hover:bg-bone/70 border border-border"
                          )}
                        >
                          {updatingRole === user.id ? "…" : user.role}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center font-mono text-[12px] text-ink/30">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "venues" && (
          <div className="bg-cream border border-border rounded-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 font-mono text-[10px] text-ink/40 tracking-[2px] uppercase">
                    Venue
                  </th>
                  <th className="text-left px-5 py-3 font-mono text-[10px] text-ink/40 tracking-[2px] uppercase hidden md:table-cell">
                    Area
                  </th>
                  <th className="text-left px-5 py-3 font-mono text-[10px] text-ink/40 tracking-[2px] uppercase hidden md:table-cell">
                    Vibe
                  </th>
                  <th className="text-left px-5 py-3 font-mono text-[10px] text-ink/40 tracking-[2px] uppercase">
                    Saves
                  </th>
                </tr>
              </thead>
              <tbody>
                {venueStats.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center font-mono text-[12px] text-ink/30">
                      No saves yet
                    </td>
                  </tr>
                )}
                {venueStats.map((v, i) => (
                  <tr
                    key={v.venueId}
                    className={cn(
                      "border-b border-border last:border-0",
                      i % 2 === 0 ? "bg-transparent" : "bg-bone/40"
                    )}
                  >
                    <td className="px-5 py-3.5">
                      <span className="font-body text-[13px] font-semibold text-ink">{v.name}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="font-mono text-[11px] text-ink/50">{v.neighborhood}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="font-mono text-[11px] text-ink/50">{v.vibe}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[13px] font-bold text-siren">{v.saveCount}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
