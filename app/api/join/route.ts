import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  sendEmail,
  movementTeamEmail,
  movementConfirmationEmail,
} from "@/lib/resend";

const JOIN_AS_OPTIONS = ["Volunteer", "Supporter", "Donor"];
const TEAM_EMAIL = (
  process.env.TEAM_NOTIFICATION_EMAIL || "info@sparksforchicago.org,97franchise@gmail.com"
)
  .split(",")
  .map((e) => e.trim());

export async function POST(req: NextRequest) {
  const body = await req.json();

  const required = ["firstName", "lastName", "email", "phone", "joinAs"];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  if (!JOIN_AS_OPTIONS.includes(body.joinAs)) {
    return NextResponse.json({ error: "Invalid join as option." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("movement_signups").insert({
    first_name: body.firstName,
    last_name: body.lastName,
    email: body.email,
    phone: body.phone,
    join_as: body.joinAs,
  });

  if (error) {
    console.error("movement signup insert failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  await Promise.all([
    sendEmail({
      to: TEAM_EMAIL,
      subject: `New Movement Sign-Up: ${body.firstName} ${body.lastName} (${body.joinAs})`,
      html: movementTeamEmail({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        joinAs: body.joinAs,
      }),
    }),
    sendEmail({
      to: body.email,
      subject: "Change Begins With Us.",
      html: movementConfirmationEmail(body.firstName, body.joinAs),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
