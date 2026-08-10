import { NextRequest, NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

const TABLES: Record<string, string> = {
  volunteers: "volunteers",
  movement: "movement_signups",
  feedback: "feedback_messages",
  pledges: "donors",
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

  const table = TABLES[key];
  if (!table) {
    return NextResponse.json({ error: "Unknown table." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const csv = toCsv(data || []);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${key}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
