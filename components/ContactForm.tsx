"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formKey: "contact" }),
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, address, email, message }),
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
      <div className="bg-neutral-100 p-6 sm:p-8 rounded-md text-center">
        <h3 className="font-display font-bold text-navy text-2xl mb-2">
          Thank you!
        </h3>
        <p className="text-neutral-600 text-sm">
          We&apos;ve received your message and will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-100 p-6 sm:p-8 rounded-md"
    >
      <h3 className="font-display font-bold text-navy text-2xl mb-6 text-center">
        Your Voice Matters.
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <input
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="bg-white border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
        />
        <input
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="bg-white border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
        />
        <input
          required
          placeholder="Address *"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="sm:col-span-2 bg-white border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
        />
        <input
          required
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="sm:col-span-2 bg-white border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
        />
        <textarea
          placeholder="Message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="sm:col-span-2 bg-white border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-brand-red font-semibold">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 w-full py-3 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
