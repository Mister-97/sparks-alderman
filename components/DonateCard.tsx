"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const donationTiers = ["$5", "$20", "$50", "$100", "$250"];

const PAYPAL_DONATE_URL =
  "https://www.paypal.com/donate/?hosted_button_id=Q52DNDGAFYFPW";

type Status = "idle" | "submitting" | "success" | "error";

export default function DonateCard() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"amount" | "details">("amount");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [amount, setAmount] = useState<string | null>(null);
  const [customAmount, setCustomAmount] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [occupation, setOccupation] = useState("");
  const [employer, setEmployer] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const param = searchParams.get("amount");
    if (!param) return;
    if (param === "other") {
      setAmount("other");
      return;
    }
    const match = donationTiers.find((t) => t === `$${param}`);
    if (match) setAmount(match);
  }, [searchParams]);

  const resolvedAmount = amount === "other" ? customAmount.trim() : amount;

  function handleContinue() {
    if (!resolvedAmount) return;
    setStep("details");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("submitting");

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          streetAddress,
          city,
          state,
          zipCode,
          occupation,
          employer,
          frequency: frequency === "monthly" ? "Monthly" : "One Time",
          amount: resolvedAmount?.startsWith("$") ? resolvedAmount : `$${resolvedAmount}`,
        }),
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
    const numericAmount = (resolvedAmount || "").replace(/[^0-9.]/g, "");
    const paypalHref = `${PAYPAL_DONATE_URL}${
      numericAmount ? `&amount=${encodeURIComponent(numericAmount)}` : ""
    }`;

    return (
      <div className="rounded-xl border border-navy/10 bg-white shadow-2xl shadow-navy/20 p-6 sm:p-8 md:p-10 text-center">
        <h2 className="font-display font-bold text-navy text-2xl md:text-3xl leading-tight">
          THANK YOU, {firstName.toUpperCase()}!
        </h2>
        <p className="mt-4 text-sm text-neutral-600 leading-relaxed">
          We&apos;ve got your pledge of {resolvedAmount?.startsWith("$") ? resolvedAmount : `$${resolvedAmount}`}
          {" "}({frequency === "monthly" ? "monthly" : "one time"}). One last
          step, complete your contribution securely through PayPal below
          (you&apos;ll enter the amount again on PayPal&apos;s page).
        </p>
        <a
          href={paypalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block w-full rounded-md bg-brand-red py-3.5 text-white text-sm font-bold transition-colors duration-300 hover:bg-red-700"
        >
          Complete Donation via PayPal
        </a>
        {frequency === "monthly" && (
          <p className="mt-3 text-[11px] text-neutral-400 leading-relaxed">
            For monthly gifts, choose the recurring option on the PayPal
            page.
          </p>
        )}
      </div>
    );
  }

  if (step === "details") {
    return (
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-navy/10 bg-white shadow-2xl shadow-navy/20 p-6 sm:p-8 md:p-10"
      >
        <button
          type="button"
          onClick={() => setStep("amount")}
          className="text-xs font-bold tracking-wide text-neutral-500 hover:text-navy"
        >
          &larr; BACK
        </button>

        <h2 className="mt-4 font-display font-bold text-navy text-2xl md:text-3xl leading-tight text-center">
          Your Information
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-500">
          {resolvedAmount?.startsWith("$") ? resolvedAmount : `$${resolvedAmount}`}
          {" "}&middot;{" "}
          {frequency === "monthly" ? "Monthly" : "One Time"}
        </p>

        <div className="mt-6 grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="First name *"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
          />
          <input
            required
            placeholder="Last name *"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
          />
          <input
            required
            type="email"
            placeholder="E-mail *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
          />
          <input
            required
            type="tel"
            placeholder="Phone *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
          />
          <input
            required
            placeholder="Street address *"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            className="sm:col-span-2 border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
          />
          <input
            required
            placeholder="City *"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              placeholder="State *"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
            />
            <input
              required
              placeholder="ZIP *"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
            />
          </div>
          <input
            required
            placeholder="Occupation *"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
          />
          <input
            required
            placeholder="Employer *"
            value={employer}
            onChange={(e) => setEmployer(e.target.value)}
            className="border-b border-navy/20 text-navy placeholder-neutral-400 py-2 text-sm focus:outline-none focus:border-navy"
          />
        </div>

        <p className="mt-4 text-[11px] text-neutral-400 leading-relaxed">
          Federal and state law require political committees to use best
          efforts to collect and report the occupation and employer of
          individual contributors.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-600 font-semibold">{error}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-6 w-full rounded-md bg-brand-red py-3.5 text-white text-sm font-bold transition-colors duration-300 hover:bg-red-700 disabled:opacity-60"
        >
          {status === "submitting" ? "SUBMITTING..." : "Submit Pledge"}
        </button>

        <p className="mt-5 text-center text-[11px] text-neutral-400 leading-relaxed">
          After submitting, you&apos;ll be sent to PayPal to complete your
          contribution securely. Contributions to Samuel Sparks for 7th Ward
          Alderman are not tax deductible.
        </p>
      </form>
    );
  }

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

        {amount === "other" && (
          <div className="mt-2.5 relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-bold">
              $
            </span>
            <input
              type="number"
              min="1"
              inputMode="decimal"
              placeholder="Enter amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="w-full rounded-md bg-neutral-100 py-3 pl-7 pr-3 text-sm font-bold text-navy placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-red"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!resolvedAmount}
        className="mt-6 w-full rounded-md bg-brand-red py-3.5 text-white text-sm font-bold transition-colors duration-300 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed"
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
