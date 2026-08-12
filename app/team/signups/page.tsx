export const dynamic = "force-dynamic";

import { getSupabaseAdmin } from "@/lib/supabase-admin";

function fmt(d: string) {
  return new Date(d).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function SignupsPage() {
  const supabase = getSupabaseAdmin();

  const [volunteers, movement, contact, pledges] = await Promise.all([
    supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("movement_signups")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("feedback_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("donors")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  return (
    <div className="p-4 sm:p-8 max-w-6xl space-y-10 sm:space-y-12">
      <div>
        <h1 className="font-bold text-navy text-2xl sm:text-3xl mb-1">Signups</h1>
        <p className="text-neutral-500 text-sm">
          Most recent 100 per form, newest first.
        </p>
      </div>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="font-bold text-navy text-xl">
            Donation Pledges ({pledges.data?.length || 0})
          </h2>
          <a
            href="/api/team/export?table=pledges"
            className="text-xs font-bold tracking-wide text-brand-red hover:underline"
          >
            EXPORT CSV
          </a>
        </div>
        <p className="text-neutral-500 text-xs mb-3 max-w-lg">
          Submitted via the /donate form. Includes the compliance fields
          (occupation, employer) required for individual contributions.
          &quot;Status&quot; shows Paid once PayPal confirms the payment
          completed, otherwise Pledged.
        </p>
        <div className="bg-white rounded-md border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-neutral-50 text-left text-xs font-bold tracking-wide text-neutral-500 uppercase">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Frequency</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Occupation</th>
                <th className="px-4 py-3">Employer</th>
              </tr>
            </thead>
            <tbody>
              {(pledges.data || []).map((p) => (
                <tr key={p.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{fmt(p.created_at)}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                        p.payment_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-100 text-neutral-500"
                      }`}
                    >
                      {p.payment_status === "paid" ? "Paid" : "Pledged"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-navy whitespace-nowrap">
                    {p.first_name} {p.last_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.payment_status === "paid" ? p.paid_amount : p.amount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.frequency}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {p.street_address}, {p.city}, {p.state} {p.zip_code}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.occupation}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{p.employer}</td>
                </tr>
              ))}
              {!pledges.data?.length && (
                <tr>
                  <td colSpan={10} className="px-4 py-6 text-center text-neutral-400">
                    No pledges yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="font-bold text-navy text-xl">
            Volunteers ({volunteers.data?.length || 0})
          </h2>
          <a
            href="/api/team/export?table=volunteers"
            className="text-xs font-bold tracking-wide text-brand-red hover:underline"
          >
            EXPORT CSV
          </a>
        </div>
        <div className="bg-white rounded-md border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-neutral-50 text-left text-xs font-bold tracking-wide text-neutral-500 uppercase">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Join As</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Neighborhood</th>
                <th className="px-4 py-3">Roles</th>
              </tr>
            </thead>
            <tbody>
              {(volunteers.data || []).map((v) => (
                <tr key={v.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{fmt(v.created_at)}</td>
                  <td className="px-4 py-3 font-semibold text-navy whitespace-nowrap">
                    {v.first_name} {v.last_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{v.join_as}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{v.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{v.phone}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{v.neighborhood}</td>
                  <td className="px-4 py-3">{(v.roles || []).join(", ")}</td>
                </tr>
              ))}
              {!volunteers.data?.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-neutral-400">
                    No volunteer sign-ups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="font-bold text-navy text-xl">
            Join the Movement ({movement.data?.length || 0})
          </h2>
          <a
            href="/api/team/export?table=movement"
            className="text-xs font-bold tracking-wide text-brand-red hover:underline"
          >
            EXPORT CSV
          </a>
        </div>
        <div className="bg-white rounded-md border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-neutral-50 text-left text-xs font-bold tracking-wide text-neutral-500 uppercase">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Join As</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
              </tr>
            </thead>
            <tbody>
              {(movement.data || []).map((m) => (
                <tr key={m.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{fmt(m.created_at)}</td>
                  <td className="px-4 py-3 font-semibold text-navy whitespace-nowrap">
                    {m.first_name} {m.last_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{m.join_as}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{m.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{m.phone}</td>
                </tr>
              ))}
              {!movement.data?.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                    No movement sign-ups yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="font-bold text-navy text-xl">
            Feedback Messages ({contact.data?.length || 0})
          </h2>
          <a
            href="/api/team/export?table=feedback"
            className="text-xs font-bold tracking-wide text-brand-red hover:underline"
          >
            EXPORT CSV
          </a>
        </div>
        <div className="bg-white rounded-md border border-neutral-200 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="bg-neutral-50 text-left text-xs font-bold tracking-wide text-neutral-500 uppercase">
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody>
              {(contact.data || []).map((m) => (
                <tr key={m.id} className="border-t border-neutral-100">
                  <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{fmt(m.created_at)}</td>
                  <td className="px-4 py-3 font-semibold text-navy whitespace-nowrap">
                    {m.first_name} {m.last_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{m.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{m.address}</td>
                  <td className="px-4 py-3 max-w-xs">{m.message}</td>
                </tr>
              ))}
              {!contact.data?.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                    No messages yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
