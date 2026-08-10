export const dynamic = "force-dynamic";

import Link from "next/link";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

const RANGE_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "all", label: "All time" },
];

async function getTotals() {
  const supabase = getSupabaseAdmin();

  const [volunteers, movement, contact, events, news, donorVolunteers, donorMovement] =
    await Promise.all([
      supabase.from("volunteers").select("id", { count: "exact", head: true }),
      supabase.from("movement_signups").select("id", { count: "exact", head: true }),
      supabase.from("feedback_messages").select("id", { count: "exact", head: true }),
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("news_posts").select("id", { count: "exact", head: true }),
      supabase
        .from("volunteers")
        .select("id", { count: "exact", head: true })
        .eq("join_as", "Donor"),
      supabase
        .from("movement_signups")
        .select("id", { count: "exact", head: true })
        .eq("join_as", "Donor"),
    ]);

  return {
    volunteers: volunteers.count || 0,
    movement: movement.count || 0,
    contact: contact.count || 0,
    events: events.count || 0,
    news: news.count || 0,
    donors: (donorVolunteers.count || 0) + (donorMovement.count || 0),
  };
}

async function getConversion(range: string) {
  const supabase = getSupabaseAdmin();
  const cutoff =
    range === "all"
      ? null
      : new Date(Date.now() - Number(range) * 24 * 60 * 60 * 1000).toISOString();

  const withCutoff = <T extends { gte: (col: string, val: string) => T }>(q: T): T =>
    cutoff ? q.gte("created_at", cutoff) : q;

  const [volunteers, movement, contact, views] = await Promise.all([
    withCutoff(supabase.from("volunteers").select("id", { count: "exact", head: true })),
    withCutoff(supabase.from("movement_signups").select("id", { count: "exact", head: true })),
    withCutoff(supabase.from("feedback_messages").select("id", { count: "exact", head: true })),
    withCutoff(supabase.from("form_views").select("form_key")),
  ]);

  const viewCounts: Record<string, number> = { volunteer: 0, join: 0, contact: 0 };
  for (const row of views.data || []) {
    viewCounts[row.form_key] = (viewCounts[row.form_key] || 0) + 1;
  }

  return [
    { label: "Volunteer Form", views: viewCounts.volunteer, submits: volunteers.count || 0 },
    { label: "Join the Movement", views: viewCounts.join, submits: movement.count || 0 },
    { label: "Contact Form", views: viewCounts.contact, submits: contact.count || 0 },
  ];
}

function conversionRate(submits: number, views: number) {
  if (views === 0) return submits > 0 ? "N/A" : "0%";
  return `${Math.round((submits / views) * 100)}%`;
}

export default async function TeamDashboard({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rawRange } = await searchParams;
  const range = RANGE_OPTIONS.some((o) => o.value === rawRange) ? rawRange! : "30";

  const [totals, conversion] = await Promise.all([getTotals(), getConversion(range)]);
  const totalSignups = totals.volunteers + totals.movement;

  const stats = [
    { label: "Volunteer Sign-Ups", value: totals.volunteers },
    { label: "Join the Movement", value: totals.movement },
    { label: "Donors", value: totals.donors },
    { label: "Feedback Messages", value: totals.contact },
    { label: "Total Sign-Ups", value: totalSignups },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-5xl">
      <h1 className="font-bold text-navy text-2xl sm:text-3xl mb-1">Dashboard</h1>
      <p className="text-neutral-500 text-sm mb-8">
        Overview of campaign sign-ups and content. Totals below are all time.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col justify-between min-h-[104px] bg-white rounded-md border border-neutral-200 p-5"
          >
            <p className="text-3xl font-bold text-navy lining-figures">
              {s.value}
            </p>
            <p className="mt-2 text-[11px] font-bold tracking-wide text-neutral-500 uppercase leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h2 className="font-bold text-navy text-xl">Form Conversion</h2>
        <div className="flex gap-1 bg-neutral-100 rounded-sm p-1">
          {RANGE_OPTIONS.map((o) => (
            <Link
              key={o.value}
              href={`/team?range=${o.value}`}
              className={`px-3 py-1.5 rounded-sm text-xs font-bold transition-colors ${
                range === o.value
                  ? "bg-brand-red text-white"
                  : "text-navy hover:bg-white"
              }`}
            >
              {o.label}
            </Link>
          ))}
        </div>
      </div>
      <p className="text-neutral-500 text-xs mb-4 max-w-lg">
        Views and submissions counted in the selected period. Conversion
        = submissions &divide; views.
      </p>
      <div className="bg-white rounded-md border border-neutral-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="bg-neutral-50 text-left text-xs font-bold tracking-wide text-neutral-500 uppercase">
              <th className="px-5 py-3">Form</th>
              <th className="px-5 py-3">Views</th>
              <th className="px-5 py-3">Submissions</th>
              <th className="px-5 py-3">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {conversion.map((row) => (
              <tr key={row.label} className="border-t border-neutral-100">
                <td className="px-5 py-3 font-semibold text-navy">{row.label}</td>
                <td className="px-5 py-3 text-neutral-600 lining-figures">{row.views}</td>
                <td className="px-5 py-3 text-neutral-600 lining-figures">{row.submits}</td>
                <td className="px-5 py-3 font-bold text-brand-red">
                  {conversionRate(row.submits, row.views)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-md border border-neutral-200 p-5">
          <p className="text-2xl font-bold text-navy lining-figures">
            {totals.events}
          </p>
          <p className="mt-1 text-xs font-bold tracking-wide text-neutral-500 uppercase">
            Upcoming Events
          </p>
        </div>
        <div className="bg-white rounded-md border border-neutral-200 p-5">
          <p className="text-2xl font-bold text-navy lining-figures">
            {totals.news}
          </p>
          <p className="mt-1 text-xs font-bold tracking-wide text-neutral-500 uppercase">
            News Posts
          </p>
        </div>
      </div>
    </div>
  );
}
