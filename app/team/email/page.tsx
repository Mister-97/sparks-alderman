"use client";

import { useState } from "react";

import MediaUpload from "@/components/team/MediaUpload";

const LISTS = [
  { value: "volunteers", label: "Volunteers" },
  { value: "movement", label: "Join the Movement" },
  { value: "feedback", label: "Feedback / Contact Messages" },
];

export default function EmailPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [lists, setLists] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  function toggleList(value: string) {
    setLists((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  const allSelected = lists.length === LISTS.length;

  function toggleAll() {
    setLists(allSelected ? [] : LISTS.map((l) => l.value));
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult("");

    if (!confirm(`Send this email to ${lists.length ? "the selected list(s)" : "no one selected"}?`)) {
      return;
    }

    setSending(true);
    const res = await fetch("/api/team/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, message, imageUrl, lists }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    setResult(`Sent to ${data.sent} recipient${data.sent === 1 ? "" : "s"}.`);
    setSubject("");
    setMessage("");
    setImageUrl("");
    setLists([]);
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl">
      <h1 className="font-bold text-navy text-2xl sm:text-3xl mb-1">Email</h1>
      <p className="text-neutral-500 text-sm mb-6">
        Send a one-off branded email to any of your sign-up lists.
      </p>

      <form
        onSubmit={handleSend}
        className="bg-white rounded-md border border-neutral-200 p-4 sm:p-6"
      >
        <div className="grid gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1">
              Send To *
            </label>
            <div className="flex flex-wrap gap-4">
              {LISTS.map((l) => (
                <label
                  key={l.value}
                  className="flex items-center gap-2 text-sm text-navy cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={lists.includes(l.value)}
                    onChange={() => toggleList(l.value)}
                    className="accent-brand-red w-4 h-4"
                  />
                  {l.label}
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm font-bold text-brand-red cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="accent-brand-red w-4 h-4"
                />
                All
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1">
              Subject *
            </label>
            <input
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 mb-1">
              Message * (one paragraph per line)
            </label>
            <textarea
              required
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
            />
          </div>

          <MediaUpload
            label="Image (optional, shown at the top of the email)"
            accept="image/*"
            value={imageUrl}
            onChange={setImageUrl}
            kind="image"
          />
        </div>

        {error && <p className="mt-4 text-sm font-semibold text-brand-red">{error}</p>}
        {result && <p className="mt-4 text-sm font-semibold text-green-700">{result}</p>}

        <button
          type="submit"
          disabled={sending}
          className="mt-6 px-8 py-3 bg-brand-red text-white text-sm font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          {sending ? "SENDING..." : "SEND EMAIL"}
        </button>
      </form>
    </div>
  );
}
