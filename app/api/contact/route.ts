import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  sendEmail,
  contactTeamEmail,
  contactConfirmationEmail,
} from "@/lib/resend";

const TEAM_EMAIL = (
  process.env.TEAM_NOTIFICATION_EMAIL || "info@sparksforchicago.org,97franchise@gmail.com"
)
  .split(",")
  .map((e) => e.trim());

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.address || String(body.address).trim() === "") {
    return NextResponse.json(
      { error: "Missing required field: address" },
      { status: 400 }
    );
  }

  if (!body.email || String(body.email).trim() === "") {
    return NextResponse.json(
      { error: "Missing required field: email" },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("feedback_messages").insert({
    first_name: body.firstName || null,
    last_name: body.lastName || null,
    address: body.address,
    email: body.email,
    message: body.message || null,
  });

  if (error) {
    console.error("contact message insert failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  await Promise.all([
    sendEmail({
      to: TEAM_EMAIL,
      subject: `New Feedback Message${body.firstName ? ` from ${body.firstName} ${body.lastName || ""}` : ""}`,
      html: contactTeamEmail({
        firstName: body.firstName,
        lastName: body.lastName,
        address: body.address,
        email: body.email,
        message: body.message,
      }),
    }),
    sendEmail({
      to: body.email,
      subject: "We Hear You.",
      html: contactConfirmationEmail(body.firstName),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
