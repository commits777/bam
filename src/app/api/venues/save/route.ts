import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { venueId } = await req.json();
  if (!venueId) {
    return NextResponse.json({ error: "venueId required" }, { status: 400 });
  }

  const existing = await prisma.savedVenue.findUnique({
    where: { userId_venueId: { userId: session.user.id, venueId } },
  });

  if (existing) {
    await prisma.savedVenue.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedVenue.create({
    data: { userId: session.user.id, venueId },
  });
  return NextResponse.json({ saved: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ savedVenueIds: [] });
  }

  const saved = await prisma.savedVenue.findMany({
    where: { userId: session.user.id },
    select: { venueId: true },
  });

  return NextResponse.json({ savedVenueIds: saved.map((s) => s.venueId) });
}
