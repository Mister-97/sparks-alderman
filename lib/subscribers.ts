import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail, eventAnnouncementEmail } from "@/lib/resend";

export async function notifySubscribersOfEvent(event: {
  title: string;
  eventDate: string;
  time: string;
  location: string;
  description: string | null;
}) {
  const supabase = getSupabaseAdmin();

  const [volunteers, movement] = await Promise.all([
    supabase.from("volunteers").select("email"),
    supabase.from("movement_signups").select("email"),
  ]);

  const emails = new Set<string>();
  for (const row of volunteers.data || []) emails.add(row.email);
  for (const row of movement.data || []) emails.add(row.email);

  const dateLabel = new Date(`${event.eventDate}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const html = eventAnnouncementEmail({
    title: event.title,
    dateLabel,
    time: event.time,
    location: event.location,
    description: event.description,
  });

  await Promise.all(
    Array.from(emails).map((email) =>
      sendEmail({
        to: email,
        subject: `New Event: ${event.title}`,
        html,
      })
    )
  );

  return emails.size;
}
