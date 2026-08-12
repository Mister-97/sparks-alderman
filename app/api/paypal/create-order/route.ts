import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(req: NextRequest) {
  const { donorId } = await req.json();

  if (!donorId) {
    return NextResponse.json({ error: "Missing donorId" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: donor, error } = await supabase
    .from("donors")
    .select("amount")
    .eq("id", donorId)
    .single();

  if (error || !donor) {
    return NextResponse.json({ error: "Donor not found" }, { status: 404 });
  }

  const numericAmount = String(donor.amount).replace(/[^0-9.]/g, "");

  try {
    const order = await createPayPalOrder(numericAmount, donorId);
    return NextResponse.json({ id: order.id });
  } catch (err) {
    console.error("paypal create order failed", err);
    return NextResponse.json(
      { error: "Could not start PayPal checkout." },
      { status: 500 }
    );
  }
}
