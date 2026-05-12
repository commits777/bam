import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminClient from "./admin-client";
import { VENUES } from "@/lib/venues";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/");

  const [users, savedVenues] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        createdAt: true,
        _count: { select: { savedVenues: true } },
      },
    }),
    prisma.savedVenue.groupBy({
      by: ["venueId"],
      _count: { venueId: true },
      orderBy: { _count: { venueId: "desc" } },
    }),
  ]);

  const venueStats = savedVenues.map((sv) => {
    const venue = VENUES.find((v) => v.id === sv.venueId);
    return {
      venueId: sv.venueId,
      name: venue?.name ?? sv.venueId,
      neighborhood: venue?.neighborhood ?? "–",
      vibe: venue?.vibe ?? "–",
      saveCount: sv._count.venueId,
    };
  });

  return (
    <AdminClient
      users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
      venueStats={venueStats}
      totalUsers={users.length}
      totalSaves={savedVenues.reduce((acc, sv) => acc + sv._count.venueId, 0)}
    />
  );
}
