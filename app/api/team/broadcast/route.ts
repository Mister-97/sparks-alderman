import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail, broadcastEmail } from "@/lib/resend";

const LIST_TABLES: Record<string, string> = {
  volunteers: "volunteers",
  movement: "movement_signups",
  feedback: "feedback_messages",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { subject, message, imageUrl, lists } = body;

  if (!subject || !message) {
    return NextResponse.json(
      { error: "Subject and message are required." },
      { status: 400 }
    );
  }

  if (!Array.isArray(lists) || lists.length === 0) {
    return NextResponse.json(
      { error: "Select at least one recipient list." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const emails = new Set<string>();

  for (const key of lists) {
    const table = LIST_TABLES[key];
    if (!table) continue;
    const { data } = await supabase.from(table).select("email");
    for (const row of data || []) {
      if (row.email) emails.add(row.email);
    }
  }

  const bodyHtml = String(message)
    .split("\n")
    .filter(Boolean)
    .map(
      (para: string) =>
        `<p style="font-size:14px;color:#374151;line-height:1.6;margin:0 0 14px;">${para}</p>`
    )
    .join("");

  const html = broadcastEmail({ subject, bodyHtml, imageUrl });

  await Promise.all(
    Array.from(emails).map((email) => sendEmail({ to: email, subject, html }))
  );

  return NextResponse.json({ sent: emails.size });
}
