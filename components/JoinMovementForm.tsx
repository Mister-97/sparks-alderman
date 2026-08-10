"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function JoinMovementForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [joinAs, setJoinAs] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formKey: "join" }),
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, joinAs }),
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
      <div className="bg-navy-dark/40 p-6 sm:p-8 rounded-md text-center">
        <h3 className="text-white font-bold tracking-wide text-sm mb-2">
          THANKS, {firstName.toUpperCase()}!
        </h3>
        <p className="text-white/70 text-sm">
          We&apos;ve got your info as a {joinAs.toLowerCase()}. Team Sparks
          will be in touch.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-navy-dark/40 p-6 sm:p-8 rounded-md"
    >
      <h3 className="text-white font-bold tracking-wide text-sm mb-6">
        JOIN THE MOVEMENT
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          required
          placeholder="First name *"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="bg-transparent border-b border-white/40 text-white placeholder-white/50 py-2 text-sm focus:outline-none focus:border-white"
        />
        <input
          required
          placeholder="Last name *"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="bg-transparent border-b border-white/40 text-white placeholder-white/50 py-2 text-sm focus:outline-none focus:border-white"
        />
        <input
          required
          type="email"
          placeholder="E-mail *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border-b border-white/40 text-white placeholder-white/50 py-2 text-sm focus:outline-none focus:border-white"
        />
        <input
          required
          type="tel"
          placeholder="Phone *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-transparent border-b border-white/40 text-white placeholder-white/50 py-2 text-sm focus:outline-none focus:border-white"
        />
        <select
          required
          value={joinAs}
          onChange={(e) => setJoinAs(e.target.value)}
          className="sm:col-span-2 bg-transparent border-b border-white/40 text-white/70 py-2 text-sm focus:outline-none focus:border-white"
        >
          <option value="" disabled className="text-black">
            Join as
          </option>
          <option value="Volunteer" className="text-black">
            Volunteer
          </option>
          <option value="Supporter" className="text-black">
            Supporter
          </option>
          <option value="Donor" className="text-black">
            Donor
          </option>
        </select>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-300 font-semibold">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-8 px-8 py-3 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "SUBMITTING..." : "SUBMIT"}
      </button>
    </form>
  );
}
