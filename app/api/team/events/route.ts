import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { notifySubscribersOfEvent } from "@/lib/subscribers";

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("events")
    .insert({
      event_date: body.eventDate,
      title: body.title,
      location: body.location,
      time: body.time,
      description: body.description || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let notified = 0;
  if (body.notify) {
    notified = await notifySubscribersOfEvent({
      title: data.title,
      eventDate: data.event_date,
      time: data.time,
      location: data.location,
      description: data.description,
    });
  }

  return NextResponse.json({ event: data, notified });
}
