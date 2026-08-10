"use client";

import { useEffect, useState } from "react";

import EventCalendar from "@/components/EventCalendar";

type EventRow = {
  id: string;
  event_date: string;
  title: string;
  location: string;
  time: string;
  description: string | null;
};

const emptyForm = {
  eventDate: "",
  title: "",
  location: "",
  time: "",
  description: "",
  notify: false,
};

export default function EventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/team/events");
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(e: EventRow) {
    setEditingId(e.id);
    setForm({
      eventDate: e.event_date,
      title: e.title,
      location: e.location,
      time: e.time,
      description: e.description || "",
      notify: false,
    });
    setShowForm(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setNotifyMessage("");

    const res = editingId
      ? await fetch(`/api/team/events/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
      : await fetch("/api/team/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

    const data = await res.json().catch(() => ({}));

    setSaving(false);
    cancelEdit();
    load();

    if (form.notify) {
      setNotifyMessage(
        data.notified
          ? `Notified ${data.notified} supporter${data.notified === 1 ? "" : "s"} about this event.`
          : "No supporters to notify yet."
      );
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    await fetch(`/api/team/events/${id}`, { method: "DELETE" });
    load();
  }

  function fmtDate(d: string) {
    return new Date(`${d}T00:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <h1 className="font-bold text-navy text-2xl sm:text-3xl">Events</h1>
        <button
          type="button"
          onClick={() => {
            if (showForm) cancelEdit();
            else setShowForm(true);
          }}
          className="px-4 py-2 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors"
        >
          {showForm ? "Close" : "+ Add Event"}
        </button>
      </div>
      <p className="text-neutral-500 text-sm mb-6">
        Shown in the &quot;Upcoming Events&quot; list on the homepage. Tap an
        event on the calendar to edit it.
      </p>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-md border border-neutral-200 p-4 sm:p-6 mb-8"
        >
          <h2 className="font-bold text-navy text-sm mb-4">
            {editingId ? "Edit Event" : "Add Event"}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">Date *</label>
              <input
                required
                type="date"
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                Time (e.g. 6:30 PM) *
              </label>
              <input
                required
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-500 mb-1">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-500 mb-1">Location *</label>
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                Description (internal notes, optional)
              </label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
          </div>
          <label className="mt-4 flex items-start gap-2.5 text-sm text-navy cursor-pointer">
            <input
              type="checkbox"
              checked={form.notify}
              onChange={(e) => setForm({ ...form, notify: e.target.checked })}
              className="accent-brand-red w-4 h-4 mt-0.5"
            />
            Email volunteers and supporters about this event
          </label>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {editingId ? "Save Changes" : "Add Event"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => handleDelete(editingId)}
                className="px-6 py-2.5 bg-neutral-100 text-brand-red text-xs font-bold tracking-wide rounded-sm hover:bg-neutral-200 transition-colors"
              >
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={cancelEdit}
              className="px-6 py-2.5 bg-neutral-100 text-navy text-xs font-bold tracking-wide rounded-sm hover:bg-neutral-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {notifyMessage && (
        <p className="mb-4 text-sm font-semibold text-brand-red">{notifyMessage}</p>
      )}

      {loading ? (
        <p className="text-neutral-400 text-sm">Loading…</p>
      ) : (
        <>
          <EventCalendar events={events} onSelectEvent={startEdit} />

          <div className="mt-8 bg-white rounded-md border border-neutral-200 overflow-hidden">
            {events.length === 0 ? (
              <p className="p-6 text-neutral-400 text-sm">No events yet.</p>
            ) : (
              <ul>
                {events.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-4 px-4 sm:px-5 py-4 border-t border-neutral-100 first:border-t-0"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-navy text-sm truncate">
                        {fmtDate(e.event_date)} &middot; {e.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5 truncate">
                        {e.location} &middot; {e.time}
                      </p>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button
                        onClick={() => startEdit(e)}
                        className="text-xs font-bold text-navy hover:text-brand-red"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-xs font-bold text-neutral-400 hover:text-brand-red"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
