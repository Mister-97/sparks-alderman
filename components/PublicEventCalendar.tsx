"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import { EventModal, type SparkEvent } from "@/components/EventsList";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function PublicEventCalendar({ events }: { events: SparkEvent[] }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<SparkEvent | null>(null);

  const eventsByDate = useMemo(() => {
    const map: Record<string, SparkEvent[]> = {};
    for (const e of events) {
      if (!e.eventDate) continue;
      if (!map[e.eventDate]) map[e.eventDate] = [];
      map[e.eventDate].push(e);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];

  return (
    <div>
      <div className="bg-white rounded-lg border border-navy/12 shadow-xl shadow-navy/5 p-4 sm:p-8">
        <div className="flex items-center justify-between mb-5 sm:mb-7">
          <h2 className="font-display font-bold text-navy text-xl sm:text-2xl">
            {MONTH_NAMES[month]} {year}
          </h2>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
              aria-label="Previous month"
              className="w-9 h-9 rounded-sm border border-navy/15 text-navy hover:bg-neutral-100 flex items-center justify-center"
            >
              &larr;
            </button>
            <button
              type="button"
              onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
              className="px-3 h-9 rounded-sm border border-navy/15 text-xs font-bold text-navy hover:bg-neutral-100"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
              aria-label="Next month"
              className="w-9 h-9 rounded-sm border border-navy/15 text-navy hover:bg-neutral-100 flex items-center justify-center"
            >
              &rarr;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[9px] sm:text-xs font-bold text-neutral-400 uppercase py-1"
            >
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d[0]}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((date, i) => {
            if (!date) return <div key={i} />;
            const key = ymd(date);
            const dayEvents = eventsByDate[key] || [];
            const isToday = key === ymd(today);

            return (
              <div
                key={i}
                className={`min-h-[56px] sm:min-h-[92px] rounded-sm border p-1 sm:p-1.5 ${
                  isToday ? "border-brand-red bg-brand-red/5" : "border-neutral-100"
                }`}
              >
                <p
                  className={`text-[10px] sm:text-xs font-bold lining-figures ${
                    isToday ? "text-brand-red" : "text-neutral-400"
                  }`}
                >
                  {date.getDate()}
                </p>
                <div className="mt-0.5 space-y-0.5">
                  {dayEvents.map((e) => (
                    <button
                      key={e.title}
                      type="button"
                      onClick={() => setSelected(e)}
                      title={e.title}
                      className="w-full text-left text-[9px] sm:text-[11px] font-semibold text-white bg-navy hover:bg-brand-red transition-colors rounded-sm px-1 py-0.5 truncate"
                    >
                      {e.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg border border-navy/12 shadow-xl shadow-navy/5 overflow-hidden">
        {events.length === 0 ? (
          <p className="p-6 text-center text-neutral-400 text-sm">
            No upcoming events right now. Check back soon.
          </p>
        ) : (
          <ul className="divide-y divide-navy/10">
            {events.map((e) => (
              <li key={e.title}>
                <button
                  type="button"
                  onClick={() => setSelected(e)}
                  className="w-full flex items-center gap-4 sm:gap-5 px-4 sm:px-7 py-4 text-left hover:bg-neutral-50 transition-colors"
                >
                  <div className="w-16 shrink-0 text-center border border-navy/15 rounded-sm overflow-hidden">
                    <p className="bg-navy text-white text-[10px] font-mask tracking-[0.14em] py-0.5">
                      {e.day}
                    </p>
                    <p className="py-1.5 font-display font-bold text-navy text-sm lining-figures">
                      {e.date}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display font-bold text-navy text-lg leading-tight">
                      {e.title}
                    </h3>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      {e.where} &middot; {e.time}
                    </p>
                  </div>
                  <span className="ml-auto hidden sm:inline-block text-[11px] font-bold tracking-[0.12em] text-brand-red">
                    JOIN EVENT
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <EventModal event={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
