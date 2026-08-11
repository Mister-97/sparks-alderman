"use client";

import { useState } from "react";

const donationTiers = ["$5", "$20", "$50", "$100", "$250"];

export default function HomeDonateWidget() {
  const [amount, setAmount] = useState<string | null>(null);

  const href = amount
    ? `/donate?amount=${encodeURIComponent(amount === "Other" ? "other" : amount.replace("$", ""))}`
    : "/donate";

  return (
    <div>
      <div className="grid grid-cols-3 gap-2.5">
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
          onClick={() => setAmount("Other")}
          aria-pressed={amount === "Other"}
          className={`rounded-md py-3.5 font-bold text-sm transition-colors duration-300 ${
            amount === "Other"
              ? "bg-brand-red text-white"
              : "bg-neutral-100 text-navy hover:bg-brand-red hover:text-white"
          }`}
        >
          Other
        </button>
      </div>
      <a
        href={href}
        className="mt-2.5 block w-full text-center rounded-md bg-brand-red py-3.5 text-white text-sm font-bold transition-colors duration-300 hover:bg-red-700"
      >
        Donate Now
      </a>
    </div>
  );
}
