"use client";

import { useMemo, useState } from "react";

type EventRow = {
  id: string;
  event_date: string;
  title: string;
  location: string;
  time: string;
  description: string | null;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function EventCalendar({
  events,
  onSelectEvent,
}: {
  events: EventRow[];
  onSelectEvent: (e: EventRow) => void;
}) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const eventsByDate = useMemo(() => {
    const map: Record<string, EventRow[]> = {};
    for (const e of events) {
      const key = e.event_date;
      if (!map[key]) map[key] = [];
      map[key].push(e);
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
    <div className="bg-white rounded-md border border-neutral-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-navy text-sm sm:text-base">
          {MONTH_NAMES[month]} {year}
        </h2>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Previous month"
            className="w-8 h-8 rounded-sm border border-neutral-200 text-navy hover:bg-neutral-100 flex items-center justify-center"
          >
            &larr;
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="px-3 h-8 rounded-sm border border-neutral-200 text-xs font-bold text-navy hover:bg-neutral-100"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Next month"
            className="w-8 h-8 rounded-sm border border-neutral-200 text-navy hover:bg-neutral-100 flex items-center justify-center"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] sm:text-xs font-bold text-neutral-400 uppercase py-1"
          >
            {d}
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
              className={`min-h-[52px] sm:min-h-[76px] rounded-sm border p-1 sm:p-1.5 ${
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
                    key={e.id}
                    type="button"
                    onClick={() => onSelectEvent(e)}
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
  );
}
