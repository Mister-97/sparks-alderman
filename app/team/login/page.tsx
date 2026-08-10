"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function TeamLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/team/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/team");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-navy p-8 rounded-md shadow-xl"
      >
        <div className="text-center mb-8">
          <div className="relative w-44 aspect-[461/122] mx-auto">
            <Image
              src="/images/logo-lockup-white.png"
              alt="Samuel Sparks for 7th Ward Alderman"
              fill
              sizes="176px"
              className="object-contain"
            />
          </div>
          <p className="text-white/50 text-xs font-bold tracking-[0.14em] mt-2">
            TEAM PORTAL
          </p>
        </div>

        <label className="block text-xs font-bold tracking-wide text-white/70 mb-1.5">
          Email
        </label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/40 py-2 text-sm focus:outline-none focus:border-white mb-5"
        />

        <label className="block text-xs font-bold tracking-wide text-white/70 mb-1.5">
          Password
        </label>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-white/40 text-white placeholder-white/40 py-2 text-sm focus:outline-none focus:border-white"
        />

        {error && (
          <p className="mt-4 text-sm text-red-300 font-semibold">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-8 w-full py-3 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>
      </form>
    </main>
  );
}
