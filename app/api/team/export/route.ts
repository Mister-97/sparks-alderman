import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

const TABLES: Record<string, string> = {
  volunteers: "volunteers",
  movement: "movement_signups",
  feedback: "feedback_messages",
};

function toCsvValue(value: unknown) {
  if (value === null || value === undefined) return "";
  const str = Array.isArray(value) ? value.join("; ") : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function toCsv(rows: Record<string, unknown>[]) {
  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
  return [
    columns.join(","),
    ...rows.map((row) => columns.map((col) => toCsvValue(row[col])).join(",")),
  ].join("\n");
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("table") || "";
  const supabase = getSupabaseAdmin();

  let csv: string;

  if (key === "donors") {
    const [donorVolunteers, donorMovement] = await Promise.all([
      supabase
        .from("volunteers")
        .select("created_at, first_name, last_name, email, phone")
        .eq("join_as", "Donor"),
      supabase
        .from("movement_signups")
        .select("created_at, first_name, last_name, email, phone")
        .eq("join_as", "Donor"),
    ]);

    const rows = [
      ...(donorVolunteers.data || []).map((d) => ({ ...d, source: "Volunteer Form" })),
      ...(donorMovement.data || []).map((d) => ({ ...d, source: "Join the Movement" })),
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    csv = toCsv(rows);
  } else {
    const table = TABLES[key];
    if (!table) {
      return NextResponse.json({ error: "Unknown table." }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    csv = toCsv(data || []);
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${key}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
