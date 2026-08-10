"use client";

import { useEffect, useState } from "react";

type ContentItem = {
  key: string;
  label: string;
  content: string;
  updated_at: string;
};

export default function LegalPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    const res = await fetch("/api/team/content");
    const data = await res.json();
    const list: ContentItem[] = data.items || [];
    setItems(list);
    setDrafts(Object.fromEntries(list.map((i) => [i.key, i.content])));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(key: string) {
    setSavingKey(key);
    setMessages((m) => ({ ...m, [key]: "" }));

    const res = await fetch(`/api/team/content/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: drafts[key] }),
    });

    setSavingKey(null);

    if (!res.ok) {
      setMessages((m) => ({ ...m, [key]: "Something went wrong." }));
      return;
    }

    setMessages((m) => ({ ...m, [key]: "Saved." }));
    load();
  }

  return (
    <div className="p-4 sm:p-8 max-w-3xl space-y-8">
      <div>
        <h1 className="font-bold text-navy text-2xl sm:text-3xl mb-1">
          Legal &amp; Disclosures
        </h1>
        <p className="text-neutral-500 text-sm max-w-xl">
          Edit the campaign disclosure, contribution rules, privacy policy,
          and terms of use shown on the live site. Use{" "}
          <code className="bg-neutral-100 px-1 py-0.5 rounded-sm text-xs">
            ## Heading
          </code>{" "}
          for section headings and numbered lines (
          <code className="bg-neutral-100 px-1 py-0.5 rounded-sm text-xs">
            1.
          </code>
          ,{" "}
          <code className="bg-neutral-100 px-1 py-0.5 rounded-sm text-xs">
            2.
          </code>
          ) for numbered lists. Leave a blank line between paragraphs.
        </p>
      </div>

      {loading ? (
        <p className="text-neutral-400 text-sm">Loading…</p>
      ) : (
        items.map((item) => (
          <section
            key={item.key}
            className="bg-white rounded-md border border-neutral-200 p-4 sm:p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <h2 className="font-bold text-navy text-sm">{item.label}</h2>
              <p className="text-[11px] text-neutral-400">
                Updated {new Date(item.updated_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <textarea
              rows={item.key.includes("policy") || item.key.includes("terms") ? 16 : 8}
              value={drafts[item.key] ?? ""}
              onChange={(e) =>
                setDrafts((d) => ({ ...d, [item.key]: e.target.value }))
              }
              className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm font-mono focus:outline-none focus:border-navy"
            />
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={() => handleSave(item.key)}
                disabled={savingKey === item.key}
                className="px-6 py-2.5 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
              >
                {savingKey === item.key ? "SAVING..." : "SAVE"}
              </button>
              {messages[item.key] && (
                <p className="text-sm font-semibold text-green-700">
                  {messages[item.key]}
                </p>
              )}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
