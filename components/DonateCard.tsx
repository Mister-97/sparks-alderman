"use client";

import { useState } from "react";

const donationTiers = ["$15", "$50", "$100", "$150", "$250"];

export default function DonateCard() {
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-navy/10 bg-white shadow-2xl shadow-navy/20 p-6 sm:p-8 md:p-10">
      <h2 className="font-display font-bold text-navy text-2xl md:text-3xl leading-tight text-center">
        Invest in The Future
        <br />
        of the 7th Ward.
      </h2>

      <div className="mt-8">
        <p className="text-[11px] font-bold tracking-[0.14em] text-neutral-500 uppercase">
          Frequency
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          {(["once", "monthly"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFrequency(f)}
              aria-pressed={frequency === f}
              className={`rounded-md py-3 text-sm font-bold transition-colors duration-300 ${
                frequency === f
                  ? "bg-navy text-white"
                  : "bg-neutral-100 text-navy hover:bg-neutral-200"
              }`}
            >
              {f === "once" ? "One Time" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[11px] font-bold tracking-[0.14em] text-neutral-500 uppercase">
          Amount
        </p>
        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          {donationTiers.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setAmount(t)}
              aria-pressed={amount === t}
              className={`rounded-md py-3.5 font-bold text-sm lining-figures transition-colors duration-300 ${
                amount === t
                  ? "bg-brand-red text-white"
                  : "bg-neutral-100 text-navy hover:bg-brand-red hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setAmount("other")}
            aria-pressed={amount === "other"}
            className={`rounded-md py-3.5 font-bold text-sm transition-colors duration-300 ${
              amount === "other"
                ? "bg-brand-red text-white"
                : "bg-neutral-100 text-navy hover:bg-brand-red hover:text-white"
            }`}
          >
            Other
          </button>
        </div>
      </div>

      <button
        type="button"
        className="mt-6 w-full rounded-md bg-brand-red py-3.5 text-white text-sm font-bold transition-colors duration-300 hover:bg-red-700"
      >
        Donate {frequency === "monthly" ? "Monthly" : "Now"}
      </button>

      <p className="mt-5 text-center text-[11px] text-neutral-400 leading-relaxed">
        Contributions to Samuel Sparks for 7th Ward Alderman are not tax
        deductible.
      </p>
    </div>
  );
}
