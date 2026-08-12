"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import ChicagoStars, { ChicagoStar } from "@/components/ChicagoStars";

export type Priority = {
  title: string;
  body: string;
  full: string;
  priorities: string[];
  impact: string[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

function PriorityModal({
  item,
  index,
  onClose,
}: {
  item: Priority;
  index: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-navy/80"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: EASE }}
        className="relative z-10 w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-lg shadow-2xl p-6 sm:p-8 md:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 md:top-6 md:right-6 w-9 h-9 rounded-full border border-navy/15 flex items-center justify-center text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="w-4 h-4"
          >
            <path d="M5 5 19 19" />
            <path d="M19 5 5 19" />
          </svg>
        </button>

        <span className="font-mask text-4xl md:text-5xl text-brand-red/70 lining-figures">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-2 font-mask uppercase text-navy text-2xl md:text-3xl tracking-[0.04em] leading-tight pr-10">
          {item.title}
        </h3>
        <p className="mt-5 text-sm md:text-base text-neutral-600 leading-relaxed whitespace-pre-line">
          {item.full}
        </p>

        <h4 className="mt-8 font-display font-bold text-navy text-lg">
          Priorities
        </h4>
        <ul className="mt-3 space-y-2.5">
          {item.priorities.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm md:text-base text-neutral-600 leading-relaxed">
              <ChicagoStar className="w-3 h-3 mt-1.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>

        <h4 className="mt-8 font-display font-bold text-navy text-lg">
          Community Impact
        </h4>
        <ul className="mt-3 space-y-2.5">
          {item.impact.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm md:text-base text-neutral-600 leading-relaxed">
              <ChicagoStar className="w-3 h-3 mt-1.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default function Priorities({ items }: { items: readonly Priority[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="issues"
      className="relative bg-white overflow-hidden pt-14 md:pt-28 pb-10 md:pb-12"
    >
      {/* A slow drifting tint keeps the white section from feeling flat */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 -right-40 w-[44rem] h-[44rem] rounded-full opacity-60 blur-3xl animate-drift-slow"
        style={{
          background:
            "radial-gradient(circle, rgba(65,182,230,0.22) 0%, rgba(65,182,230,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl w-full px-6">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <ChicagoStars starClassName="w-3.5 h-3.5 md:w-4 md:h-4" />
          <h2 className="mt-4 font-display font-bold text-navy text-4xl md:text-5xl">
            The Heart of Our Priorities
          </h2>
          <p className="mt-4 text-sm md:text-base text-neutral-600 max-w-xl leading-relaxed">
            Three commitments driving the work across South Shore, Calumet
            Heights, South Chicago and South Deering.
          </p>
        </motion.div>

        {/* Numbered list on the left, ward map standing alongside it */}
        <div className="mt-12 md:mt-16 grid lg:grid-cols-[minmax(0,1fr)_16rem] xl:grid-cols-[minmax(0,1fr)_19rem] gap-10 lg:gap-14 items-start">
          <div className="border-t border-navy/12">
            {items.map((p, i) => (
              <motion.div
                key={p.title}
                className="priority-row group relative border-b border-navy/12"
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              >
                {/* red wash that wipes in from the left on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 bg-brand-red/8 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
                {/* solid red edge marking the active row */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-0 h-full w-[3px] bg-brand-red origin-top scale-y-0 transition-transform duration-500 ease-out group-hover:scale-y-100"
                />

                <button
                  type="button"
                  onClick={() => setOpen(i)}
                  className="w-full flex items-start gap-5 md:gap-7 py-6 md:py-7 px-4 md:px-6 text-left transition-transform duration-500 ease-out group-hover:translate-x-2"
                >
                  <span className="font-mask text-4xl md:text-5xl leading-none text-navy/15 transition-colors duration-300 group-hover:text-brand-red lining-figures shrink-0 w-12 md:w-16">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="flex-1">
                    <h3 className="font-mask uppercase text-navy text-xl md:text-2xl tracking-[0.04em] leading-tight">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-sm md:text-base text-neutral-600 leading-relaxed">
                      {p.body}
                    </p>
                  </div>

                  <span className="hidden sm:inline-flex mt-1 shrink-0 items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] text-brand-red uppercase">
                    Read More
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                      &rarr;
                    </span>
                  </span>
                </button>
              </motion.div>
            ))}
          </div>

          {/* Sticks alongside the list so the map stays in view while it scrolls */}
          <motion.div
            className="hidden lg:block lg:sticky lg:top-24"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
          >
            <div className="rounded-lg overflow-hidden border border-navy/10 shadow-xl shadow-navy/10">
              {/* Vote banner capping the map */}
              <div className="bg-navy px-6 py-7 text-center">
                {/* The checkmark stands in for the V, sized off the type itself */}
                <p className="font-mask uppercase text-white text-5xl md:text-6xl tracking-[0.03em] leading-none">
                  <span className="sr-only">Vote</span>
                  {/* The word centers on its own; the check hangs off to its left */}
                  <span aria-hidden="true" className="relative inline-block">
                    <svg
                      viewBox="0 0 100 100"
                      fill="none"
                      className="absolute right-full bottom-0 mr-[0.18em] h-[0.72em] w-[0.62em] text-brand-red"
                    >
                      <path
                        d="M12 46 L37 73 L88 10"
                        stroke="currentColor"
                        strokeWidth="23"
                        strokeLinecap="square"
                        strokeLinejoin="miter"
                      />
                    </svg>
                    vote
                  </span>
                </p>
                <span className="mt-4 block h-0.5 w-12 bg-brand-red mx-auto" />
                <p className="mt-4 font-mask uppercase text-white/75 text-[11px] md:text-xs tracking-[0.22em] leading-relaxed">
                  The future is in your hands
                </p>
              </div>

              <div className="relative w-full aspect-[1776/2720] bg-white">
                <Image
                  src="/images/ward-map-full.jpg"
                  alt="Chicago city ward map with the 7th Ward highlighted"
                  fill
                  sizes="(min-width: 1280px) 19rem, 16rem"
                  className="object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <PriorityModal item={items[open]} index={open} onClose={() => setOpen(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
