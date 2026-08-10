"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ChicagoStar } from "@/components/ChicagoStars";

const links = [
  { label: "MEET SAM", href: "/#meet-sam" },
  { label: "OUR MISSION", href: "/#mission" },
  { label: "PRIORITIES", href: "/#issues" },
  { label: "NEWS", href: "/#news" },
  { label: "VOLUNTEER", href: "/volunteer" },
  { label: "JOIN THE MOVEMENT", href: "/#join" },
];

export default function Nav({ dark = false }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const textColor = dark || open ? "text-white" : "text-navy";
  const underlineColor = dark ? "bg-white" : "bg-navy";

  useEffect(() => {
    if (!open) return;
    // Lock the page underneath so the fixed full-screen menu doesn't fight
    // with body scroll, which on iOS Safari can leave the layout viewport
    // visually shifted after the menu closes.
    const scrollY = window.scrollY;
    const { body } = document;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <header
      className={`${
        open
          ? "fixed inset-0 z-[60] overflow-y-auto bg-navy"
          : "absolute top-0 left-0 right-0 z-40"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
        <Link
          href="/#top"
          className={`font-sans font-extrabold tracking-tight ${textColor} text-base md:text-xl lg:text-2xl`}
        >
          LET&apos;S <span className="italic text-brand-red">SPARK</span> A CHANGE!
        </Link>

        {/* Tabs float directly on the hero, no bar behind them. Only DONATE
            keeps a solid block. */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l, i) => (
            <div key={l.label} className="flex items-center">
              {i > 0 && <ChicagoStar className="w-3 h-3 mx-2 shrink-0" />}
              <a
                href={l.href}
                className={`group relative px-3 py-2 text-xs font-bold tracking-wide ${textColor}`}
              >
                {l.label}
                <span className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 ${underlineColor} origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100`} />
              </a>
            </div>
          ))}
          <a
            href="/donate"
            className="ml-5 px-8 py-3 rounded-sm bg-brand-red hover:bg-red-700 text-sm font-bold tracking-wide text-white shadow-md transition-colors"
          >
            DONATE
          </a>
        </nav>

        <button
          className={`lg:hidden -mr-2 p-2 ${textColor}`}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-7 h-7"
          >
            {open ? (
              <>
                <path d="M5 5 19 19" />
                <path d="M19 5 5 19" />
              </>
            ) : (
              <>
                <path d="M3.5 7h17" />
                <path d="M3.5 12h17" />
                <path d="M3.5 17h17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="lg:hidden text-white px-6 pb-10 flex flex-col gap-1">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 border-b border-white/10 text-sm font-semibold tracking-wide"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/donate"
            onClick={() => setOpen(false)}
            className="mt-5 py-3.5 bg-brand-red text-white text-sm font-bold tracking-wide text-center rounded-md"
          >
            DONATE
          </a>
        </div>
      )}
    </header>
  );
}
