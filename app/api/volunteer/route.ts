import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import {
  sendEmail,
  volunteerTeamEmail,
  volunteerConfirmationEmail,
} from "@/lib/resend";

const JOIN_AS_OPTIONS = ["Volunteer", "Supporter", "Donor"];
const TEAM_EMAIL = (
  process.env.TEAM_NOTIFICATION_EMAIL || "info@sparksforchicago.org,97franchise@gmail.com"
)
  .split(",")
  .map((e) => e.trim());

export async function POST(req: NextRequest) {
  const { allowed } = rateLimit(`volunteer:${getClientIp(req)}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const body = await req.json();

  const required = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "preferredContact",
    "neighborhood",
    "homeAddress",
    "city",
    "state",
    "zipCode",
  ];

  for (const field of required) {
    if (!body[field] || String(body[field]).trim() === "") {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  if (!Array.isArray(body.availability) || body.availability.length === 0) {
    return NextResponse.json(
      { error: "Select at least one availability option." },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.roles) || body.roles.length === 0) {
    return NextResponse.json(
      { error: "Select at least one volunteer role." },
      { status: 400 }
    );
  }

  if (!Array.isArray(body.referralSource) || body.referralSource.length === 0) {
    return NextResponse.json(
      { error: "Let us know how you heard about Team Sparks." },
      { status: 400 }
    );
  }

  if (!body.agreed) {
    return NextResponse.json(
      { error: "You must agree to the volunteer acknowledgment." },
      { status: 400 }
    );
  }

  if (body.joinAs && !JOIN_AS_OPTIONS.includes(body.joinAs)) {
    return NextResponse.json({ error: "Invalid join as option." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  const { error } = await supabase.from("volunteers").insert({
    first_name: body.firstName,
    last_name: body.lastName,
    email: body.email,
    phone: body.phone,
    join_as: body.joinAs || "Volunteer",
    preferred_contact: body.preferredContact,
    neighborhood: body.neighborhood,
    home_address: body.homeAddress,
    city: body.city,
    state: body.state,
    zip_code: body.zipCode,
    availability: body.availability,
    availability_other: body.availabilityOther || null,
    roles: body.roles,
    roles_other: body.rolesOther || null,
    referral_source: body.referralSource,
    referral_other: body.referralOther || null,
    send_copy: Boolean(body.sendCopy),
  });

  if (error) {
    console.error("volunteer insert failed", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  await Promise.all([
    sendEmail({
      to: TEAM_EMAIL,
      subject: `New Volunteer: ${body.firstName} ${body.lastName} (${body.joinAs || "Volunteer"})`,
      html: volunteerTeamEmail({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        joinAs: body.joinAs || "Volunteer",
        preferredContact: body.preferredContact,
        neighborhood: body.neighborhood,
        homeAddress: body.homeAddress,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        availability: body.availability,
        availabilityOther: body.availabilityOther,
        roles: body.roles,
        rolesOther: body.rolesOther,
        referralSource: body.referralSource,
        referralOther: body.referralOther,
      }),
    }),
    sendEmail({
      to: body.email,
      subject: "Thanks for joining Team Sparks!",
      html: volunteerConfirmationEmail(body.firstName),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
