const RESEND_API_URL = "https://api.resend.com/emails";
const FROM = "Team Sparks <info@sparksforchicago.org>";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) return;

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error("resend send failed", await res.text());
  }
}

const wrap = (title: string, bodyHtml: string) => `
<div style="background:#f3f4f6;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
    <div style="background:#0e1c40;padding:24px 28px;">
      <div style="color:#ffffff;font-weight:800;font-size:18px;letter-spacing:0.02em;">
        SAMUEL <span style="color:#c8102e;">SPARKS</span>
      </div>
      <div style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700;letter-spacing:0.14em;margin-top:2px;">
        FOR 7TH WARD ALDERMAN
      </div>
    </div>
    <div style="padding:28px;">
      <h1 style="margin:0 0 16px;font-size:20px;color:#0e1c40;font-family:Georgia,'Times New Roman',serif;">
        ${title}
      </h1>
      ${bodyHtml}
    </div>
    <div style="background:#f9fafb;padding:16px 28px;border-top:1px solid #e5e7eb;">
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        Friends of Samuel Sparks &middot; sparksforchicago.org
      </p>
    </div>
  </div>
</div>
`;

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:6px 0;font-size:12px;font-weight:700;color:#6b7280;width:40%;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:13px;color:#0e1c40;vertical-align:top;">${value || "N/A"}</td>
  </tr>
`;

export function volunteerTeamEmail(v: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinAs: string;
  preferredContact: string;
  neighborhood: string;
  homeAddress: string;
  city: string;
  state: string;
  zipCode: string;
  availability: string[];
  availabilityOther?: string;
  roles: string[];
  rolesOther?: string;
  referralSource: string[];
  referralOther?: string;
}) {
  return wrap(
    "New Volunteer Sign-Up",
    `
    <table style="width:100%;border-collapse:collapse;">
      ${row("Name", `${v.firstName} ${v.lastName}`)}
      ${row("Join As", v.joinAs)}
      ${row("Email", v.email)}
      ${row("Phone", v.phone)}
      ${row("Preferred Contact", v.preferredContact)}
      ${row("Neighborhood", v.neighborhood)}
      ${row("Address", `${v.homeAddress}, ${v.city}, ${v.state} ${v.zipCode}`)}
      ${row("Availability", [...v.availability, v.availabilityOther].filter(Boolean).join(", "))}
      ${row("Roles/Interests", [...v.roles, v.rolesOther].filter(Boolean).join(", "))}
      ${row("Heard About Us Via", [...v.referralSource, v.referralOther].filter(Boolean).join(", "))}
    </table>
    `
  );
}

export function volunteerConfirmationEmail(firstName: string) {
  return wrap(
    "Thanks for joining Team Sparks!",
    `
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Hi ${firstName},
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Thank you for signing up to volunteer with the campaign. We're grateful
      to have you on the team as we work to bring real leadership to the 7th
      Ward in the February 2027 election.
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      A member of Team Sparks will be in touch soon with next steps.
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;margin-top:20px;">
      In the meantime, keep an eye on
      <a href="https://sparksforchicago.org" style="color:#c8102e;">sparksforchicago.org</a>
      for events and updates.
    </p>
    `
  );
}

export function movementTeamEmail(m: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinAs: string;
}) {
  return wrap(
    "New Join the Movement Sign-Up",
    `
    <table style="width:100%;border-collapse:collapse;">
      ${row("Name", `${m.firstName} ${m.lastName}`)}
      ${row("Join As", m.joinAs)}
      ${row("Email", m.email)}
      ${row("Phone", m.phone)}
    </table>
    `
  );
}

export function movementConfirmationEmail(firstName: string, joinAs: string) {
  return wrap(
    "Change Begins With Us.",
    `
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Hi ${firstName},
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Thanks for joining the movement as a <strong>${joinAs.toLowerCase()}</strong>.
      The future of South Shore is shaped by us, and we're glad to have you
      with us.
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Team Sparks will reach out soon with ways to get involved.
    </p>
    `
  );
}

export function donorTeamEmail(d: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  occupation: string;
  employer: string;
  frequency: string;
  amount: string;
}) {
  return wrap(
    "New Donation Pledge",
    `
    <table style="width:100%;border-collapse:collapse;">
      ${row("Name", `${d.firstName} ${d.lastName}`)}
      ${row("Amount", `${d.amount} (${d.frequency})`)}
      ${row("Email", d.email)}
      ${row("Phone", d.phone)}
      ${row("Address", `${d.streetAddress}, ${d.city}, ${d.state} ${d.zipCode}`)}
      ${row("Occupation", d.occupation)}
      ${row("Employer", d.employer)}
    </table>
    `
  );
}

export function donorConfirmationEmail(firstName: string, amount: string, frequency: string) {
  return wrap(
    "Thank You for Investing in the 7th Ward.",
    `
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Hi ${firstName},
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Thank you for pledging ${amount} (${frequency.toLowerCase()}) to Samuel
      Sparks for 7th Ward Alderman. A member of Team Sparks will follow up
      shortly to complete your contribution.
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Contributions to Samuel Sparks for 7th Ward Alderman are not tax
      deductible.
    </p>
    `
  );
}

export function donorPaymentReceivedTeamEmail(d: {
  firstName: string;
  lastName: string;
  email: string;
  amount: string;
  frequency: string;
  captureId: string;
}) {
  return wrap(
    "Donation Payment Received",
    `
    <table style="width:100%;border-collapse:collapse;">
      ${row("Name", `${d.firstName} ${d.lastName}`)}
      ${row("Amount Paid", `${d.amount} (${d.frequency})`)}
      ${row("Email", d.email)}
      ${row("PayPal Capture ID", d.captureId)}
    </table>
    `
  );
}

export function donorPaymentReceivedConfirmationEmail(
  firstName: string,
  amount: string,
  frequency: string
) {
  return wrap(
    "Thank You for Your Contribution!",
    `
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Hi ${firstName},
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Your contribution of ${amount} (${frequency.toLowerCase()}) to Samuel
      Sparks for 7th Ward Alderman has been received. Thank you for investing
      in the future of the 7th Ward.
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Contributions to Samuel Sparks for 7th Ward Alderman are not tax
      deductible.
    </p>
    `
  );
}

export function contactTeamEmail(c: {
  firstName?: string;
  lastName?: string;
  address: string;
  email: string;
  message?: string;
}) {
  return wrap(
    "New Feedback Message",
    `
    <table style="width:100%;border-collapse:collapse;">
      ${row("Name", `${c.firstName || ""} ${c.lastName || ""}`.trim())}
      ${row("Email", c.email)}
      ${row("Address", c.address)}
      ${row("Message", (c.message || "").replace(/\n/g, "<br>"))}
    </table>
    `
  );
}

export function contactConfirmationEmail(firstName?: string) {
  return wrap(
    "We Hear You.",
    `
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Hi${firstName ? ` ${firstName}` : ""},
    </p>
    <p style="font-size:14px;color:#374151;line-height:1.6;">
      Thanks for reaching out. We've received your message and someone from
      Team Sparks will follow up soon.
    </p>
    `
  );
}

export function eventAnnouncementEmail(event: {
  title: string;
  dateLabel: string;
  time: string;
  location: string;
  description: string | null;
}) {
  return wrap(
    event.title,
    `
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      ${row("Date", event.dateLabel)}
      ${row("Time", event.time)}
      ${row("Location", event.location)}
    </table>
    ${
      event.description
        ? `<p style="font-size:14px;color:#374151;line-height:1.6;">${event.description}</p>`
        : ""
    }
    <a
      href="https://sparksforchicago.org/events"
      style="display:block;margin-top:20px;padding:14px 0;background:#c8102e;color:#ffffff;text-align:center;font-size:14px;font-weight:700;letter-spacing:0.04em;text-decoration:none;border-radius:4px;"
    >
      SEE EVENT DETAILS
    </a>
    `
  );
}

export function broadcastEmail({
  subject,
  bodyHtml,
  imageUrl,
}: {
  subject: string;
  bodyHtml: string;
  imageUrl?: string;
}) {
  return wrap(
    subject,
    `
    ${
      imageUrl
        ? `<img src="${imageUrl}" alt="" style="width:100%;height:auto;border-radius:6px;margin-bottom:16px;display:block;" />`
        : ""
    }
    ${bodyHtml}
    `
  );
}
