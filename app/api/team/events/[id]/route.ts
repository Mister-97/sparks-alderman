import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { notifySubscribersOfEvent } from "@/lib/subscribers";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("events")
    .update({
      event_date: body.eventDate,
      title: body.title,
      location: body.location,
      time: body.time,
      description: body.description || null,
    })
    .eq("id", id)
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
