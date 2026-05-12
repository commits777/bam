import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const { venueName, contactName, email, instagram, phone, neighborhood, vibe, website, message } = body;

  if (!venueName || !contactName || !email || !neighborhood || !vibe) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  await prisma.venueApplication.create({
    data: {
      venueName,
      contactName,
      email,
      instagram: instagram || null,
      phone: phone || null,
      neighborhood,
      vibe,
      website: website || null,
      message: message || null,
    },
  });

  return NextResponse.json({ ok: true });
}
