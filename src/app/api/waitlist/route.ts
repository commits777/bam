import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const LAUNCH_DATE = process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "soon";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key || key.startsWith("REPLACE")) return null;
  return new Resend(key);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const { email, instagram, venue_id, venue_name, neighborhood, utm_source, utm_medium, utm_campaign } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!venue_id || !venue_name) {
    return NextResponse.json({ error: "Venue required" }, { status: 400 });
  }

  const existing = await prisma.waitlistSignup.findUnique({
    where: { email_venueId: { email, venueId: venue_id } },
  });

  if (existing) {
    return NextResponse.json({ ok: true, duplicate: true });
  }

  await prisma.waitlistSignup.create({
    data: {
      email,
      venueId: venue_id,
      venueName: venue_name,
      instagram: instagram ?? null,
      neighborhood: neighborhood ?? "",
      utmSource: utm_source ?? null,
      utmMedium: utm_medium ?? null,
      utmCampaign: utm_campaign ?? null,
    },
  });

  const resend = getResend();
  if (resend) {
    await resend.emails.send({
      from: "BAM! <hello@getbam.fun>",
      to: email,
      subject: `You're on the list. BAM! launches ${LAUNCH_DATE}.`,
      html: `
        <div style="font-family:'Helvetica Neue',sans-serif;max-width:520px;margin:0 auto;background:#FFFCF2;padding:48px 40px;">
          <div style="font-size:48px;font-weight:900;letter-spacing:-0.04em;line-height:1;margin-bottom:32px;color:#0A0A0A;">
            BAM<span style="color:#FF2D2D;">!</span>
          </div>
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#888;font-family:monospace;margin-bottom:16px;">
            You're in.
          </p>
          <h1 style="font-size:28px;font-weight:900;letter-spacing:-0.02em;line-height:1.1;color:#0A0A0A;margin:0 0 16px;">
            ${venue_name} will be waiting for you.
          </h1>
          <p style="font-size:15px;color:#555;line-height:1.6;margin:0 0 32px;">
            We launch <strong>${LAUNCH_DATE}</strong>. When we do, you'll be first to book
            <strong>${venue_name}</strong> in <strong>${neighborhood}</strong> and every other
            date-worthy spot in Athens.
          </p>
          <div style="border-top:1px solid #E5E0D5;padding-top:24px;font-size:12px;color:#aaa;font-family:monospace;letter-spacing:1px;">
            getbam.fun · Athens, GR
          </div>
        </div>
      `,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
