import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  sendEmail,
  donorTeamEmail,
  donorConfirmationEmail,
} from "@/lib/resend";

const TEAM_EMAIL = (
  process.env.TEAM_NOTIFICATION_EMAIL || "info@sparksforchicago.org,97franchise@gmail.com"
)
  .split(",")
  .map((e) => e.trim());

export async function POST(req: NextRequest) {
  const body = await req.json();

  const required = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "streetAddress",
    "city",
    "state",
    "zipCode",
    "occupation",
    "employer",
    "frequency",
    "amount",
  ];

  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("donors").insert({
    first_name: body.firstName,
    last_name: body.lastName,
    email: body.email,
    phone: body.phone,
    street_address: body.streetAddress,
    city: body.city,
    state: body.state,
    zip_code: body.zipCode,
    occupation: body.occupation,
    employer: body.employer,
    frequency: body.frequency,
    amount: body.amount,
  });

  if (error) {
    console.error("donor insert failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  await Promise.all([
    sendEmail({
      to: TEAM_EMAIL,
      subject: `New Donation Pledge: ${body.firstName} ${body.lastName} (${body.amount})`,
      html: donorTeamEmail({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        streetAddress: body.streetAddress,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        occupation: body.occupation,
        employer: body.employer,
        frequency: body.frequency,
        amount: body.amount,
      }),
    }),
    sendEmail({
      to: body.email,
      subject: "Thank You for Investing in the 7th Ward.",
      html: donorConfirmationEmail(body.firstName, body.amount, body.frequency),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
