"use client";

import { useEffect, useState } from "react";

const NEIGHBORHOODS = [
  "South Shore",
  "Calumet Heights",
  "South Chicago",
  "South Deering",
  "Other",
];

const AVAILABILITY = [
  "Weekday Mornings (8AM-11AM)",
  "Weekday Afternoons (12PM-5PM)",
  "Weekday Evenings (5PM-9PM)",
  "Saturday Mornings (8AM-11AM)",
  "Saturday Afternoons (12PM-5PM)",
  "Saturday Evenings (5PM-9PM)",
  "Sunday Mornings (8AM-11AM)",
  "Sunday Afternoons (12PM-5PM)",
];

const ROLES = [
  "Canvassing",
  "Phone Banking",
  "Event Support",
  "Event Hosting",
  "Fundraising",
  "Display a Yard Sign",
  "Voter Registration",
  "Election Day Volunteer",
  "Receive Campaign Updates",
  "Newsletters and Updates",
  "Data Entry/Office Support",
];

const REFERRAL_SOURCES = [
  "Friend or Family",
  "Community Event",
  "Social Media",
  "Website",
  "Volunteer",
  "Candidate",
];

const inputClass =
  "w-full bg-white border border-neutral-300 rounded-sm px-3 py-2.5 text-sm text-navy placeholder-neutral-400 focus:outline-none focus:border-navy transition-colors";

const labelClass = "block text-xs font-bold tracking-wide text-navy mb-1.5";

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

type Status = "idle" | "submitting" | "success" | "error";

export default function VolunteerForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [joinAs, setJoinAs] = useState("Volunteer");
  const [preferredContact, setPreferredContact] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [city, setCity] = useState("Chicago");
  const [state, setState] = useState("IL");
  const [zipCode, setZipCode] = useState("");
  const [availability, setAvailability] = useState<string[]>([]);
  const [availabilityOther, setAvailabilityOther] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesOther, setRolesOther] = useState("");
  const [referralSource, setReferralSource] = useState<string[]>([]);
  const [referralOther, setReferralOther] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sendCopy, setSendCopy] = useState(false);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formKey: "volunteer" }),
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          joinAs,
          preferredContact,
          neighborhood,
          homeAddress,
          city,
          state,
          zipCode,
          availability,
          availabilityOther,
          roles,
          rolesOther,
          referralSource,
          referralOther,
          agreed,
          sendCopy,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-md p-10 md:p-14 text-center shadow-lg shadow-navy/10">
        <h3 className="font-display font-bold text-navy text-2xl md:text-3xl">
          Thanks for signing up, {firstName}!
        </h3>
        <p className="mt-4 text-neutral-600 max-w-md mx-auto">
          Team Sparks will be in touch soon. We&apos;re grateful to have you
          with us for the 7th Ward.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-md p-6 md:p-10 shadow-lg shadow-navy/10 space-y-8"
    >
      {/* Contact info */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>First Name *</label>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Last Name *</label>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Email *</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone Number *</label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Join as *</label>
          <select
            required
            value={joinAs}
            onChange={(e) => setJoinAs(e.target.value)}
            className={inputClass}
          >
            <option value="Volunteer">Volunteer</option>
            <option value="Supporter">Supporter</option>
            <option value="Donor">Donor</option>
          </select>
        </div>
      </div>

      {/* Preferred contact */}
      <div>
        <label className={labelClass}>Preferred method of contact *</label>
        <div className="flex gap-6 mt-2">
          {["Email", "Phone"].map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm text-navy cursor-pointer"
            >
              <input
                type="radio"
                name="preferredContact"
                required
                checked={preferredContact === opt}
                onChange={() => setPreferredContact(opt)}
                className="accent-brand-red w-4 h-4"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Which neighborhood do you live in? *</label>
          <select
            required
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            className={inputClass}
          >
            <option value="" disabled>
              Choose
            </option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Home Address *</label>
          <input
            required
            value={homeAddress}
            onChange={(e) => setHomeAddress(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>City *</label>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>State *</label>
            <input
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Zip Code *</label>
            <input
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className={labelClass}>General Availability *</label>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-2">
          {AVAILABILITY.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={availability.includes(opt)}
                onChange={() => setAvailability(toggle(availability, opt))}
                className="accent-brand-red w-4 h-4"
              />
              {opt}
            </label>
          ))}
        </div>
        <input
          placeholder="Other"
          value={availabilityOther}
          onChange={(e) => setAvailabilityOther(e.target.value)}
          className={`${inputClass} mt-3`}
        />
      </div>

      {/* Roles */}
      <div>
        <label className={labelClass}>
          Volunteer Roles and Interests * <span className="font-normal text-neutral-500">(select all that apply)</span>
        </label>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-2">
          {ROLES.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={roles.includes(opt)}
                onChange={() => setRoles(toggle(roles, opt))}
                className="accent-brand-red w-4 h-4"
              />
              {opt}
            </label>
          ))}
        </div>
        <input
          placeholder="Other"
          value={rolesOther}
          onChange={(e) => setRolesOther(e.target.value)}
          className={`${inputClass} mt-3`}
        />
      </div>

      {/* Referral */}
      <div>
        <label className={labelClass}>How did you hear about Team Sparks? *</label>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-2">
          {REFERRAL_SOURCES.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={referralSource.includes(opt)}
                onChange={() => setReferralSource(toggle(referralSource, opt))}
                className="accent-brand-red w-4 h-4"
              />
              {opt}
            </label>
          ))}
        </div>
        <input
          placeholder="Other"
          value={referralOther}
          onChange={(e) => setReferralOther(e.target.value)}
          className={`${inputClass} mt-3`}
        />
      </div>

      {/* Acknowledgment */}
      <div className="border-t border-neutral-200 pt-6">
        <p className="text-xs text-neutral-500 leading-relaxed">
          By submitting this form, you are volunteering with the Friends of
          Samuel campaign. The information you provide will be used only for
          campaign volunteer coordination and communications. By providing
          your contact information, you agree to receive campaign updates by
          phone, text, and email. Message and data rates may apply, and you
          may opt out at any time.
        </p>
        <label className="mt-4 flex items-start gap-2.5 text-sm text-navy cursor-pointer">
          <input
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="accent-brand-red w-4 h-4 mt-0.5"
          />
          I have read and understand the Volunteer Acknowledgment and Privacy
          Notice above and voluntarily agree to participate as a campaign
          volunteer. *
        </label>
        <label className="mt-3 flex items-center gap-2.5 text-sm text-neutral-600 cursor-pointer">
          <input
            type="checkbox"
            checked={sendCopy}
            onChange={(e) => setSendCopy(e.target.checked)}
            className="accent-brand-red w-4 h-4"
          />
          Send me a copy of my responses.
        </label>
      </div>

      {error && (
        <p className="text-sm text-brand-red font-semibold">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="px-10 py-3.5 bg-brand-red text-white text-sm font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "SUBMITTING..." : "SUBMIT"}
      </button>
    </form>
  );
}
