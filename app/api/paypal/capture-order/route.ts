import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { capturePayPalOrder } from "@/lib/paypal";
import {
  sendEmail,
  donorPaymentReceivedTeamEmail,
  donorPaymentReceivedConfirmationEmail,
} from "@/lib/resend";

const TEAM_EMAIL = (
  process.env.TEAM_NOTIFICATION_EMAIL || "info@sparksforchicago.org,97franchise@gmail.com"
)
  .split(",")
  .map((e) => e.trim());

export async function POST(req: NextRequest) {
  const { orderID } = await req.json();

  if (!orderID) {
    return NextResponse.json({ error: "Missing orderID" }, { status: 400 });
  }

  let capture;
  try {
    capture = await capturePayPalOrder(orderID);
  } catch (err) {
    console.error("paypal capture failed", err);
    return NextResponse.json(
      { error: "Could not complete PayPal payment." },
      { status: 500 }
    );
  }

  const purchaseUnit = capture.purchase_units?.[0];
  const captureData = purchaseUnit?.payments?.captures?.[0];
  const donorId = purchaseUnit?.custom_id || capture.purchase_units?.[0]?.custom_id;
  const status = capture.status;

  if (status !== "COMPLETED" || !donorId || !captureData) {
    return NextResponse.json(
      { error: "Payment was not completed." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: donor, error } = await supabase
    .from("donors")
    .update({
      payment_status: "paid",
      paypal_order_id: orderID,
      paypal_capture_id: captureData.id,
      paid_amount: `$${captureData.amount.value}`,
      paid_at: new Date().toISOString(),
    })
    .eq("id", donorId)
    .select()
    .single();

  if (error || !donor) {
    console.error("donor payment update failed", error);
    return NextResponse.json(
      { error: "Payment succeeded but we could not update our records." },
      { status: 500 }
    );
  }

  await Promise.all([
    sendEmail({
      to: TEAM_EMAIL,
      subject: `Donation Payment Received: ${donor.first_name} ${donor.last_name} (${donor.paid_amount})`,
      html: donorPaymentReceivedTeamEmail({
        firstName: donor.first_name,
        lastName: donor.last_name,
        email: donor.email,
        amount: donor.paid_amount,
        frequency: donor.frequency,
        captureId: captureData.id,
      }),
    }),
    sendEmail({
      to: donor.email,
      subject: "Thank You for Your Contribution!",
      html: donorPaymentReceivedConfirmationEmail(
        donor.first_name,
        donor.paid_amount,
        donor.frequency
      ),
    }),
  ]);

  return NextResponse.json({ ok: true, status });
}
