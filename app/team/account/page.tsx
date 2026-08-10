"use client";

import { useEffect, useState } from "react";

type Admin = { email: string; created_at: string };

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [adminSaving, setAdminSaving] = useState(false);
  const [adminError, setAdminError] = useState("");

  async function loadAdmins() {
    setLoadingAdmins(true);
    const res = await fetch("/api/team/admins");
    const data = await res.json();
    setAdmins(data.admins || []);
    setLoadingAdmins(false);
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwMessage("");
    setPwSaving(true);

    const res = await fetch("/api/team/account", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setPwSaving(false);

    if (!res.ok) {
      setPwError(data.error || "Something went wrong.");
      return;
    }

    setPwMessage("Password updated.");
    setCurrentPassword("");
    setNewPassword("");
  }

  async function handleAddAdmin(e: React.FormEvent) {
    e.preventDefault();
    setAdminError("");
    setAdminSaving(true);

    const res = await fetch("/api/team/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, password: newAdminPassword }),
    });
    const data = await res.json().catch(() => ({}));
    setAdminSaving(false);

    if (!res.ok) {
      setAdminError(data.error || "Something went wrong.");
      return;
    }

    setNewEmail("");
    setNewAdminPassword("");
    loadAdmins();
  }

  async function handleRemoveAdmin(email: string) {
    if (!confirm(`Remove ${email} as an admin?`)) return;
    const res = await fetch(`/api/team/admins/${encodeURIComponent(email)}`, {
      method: "DELETE",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data.error || "Something went wrong.");
      return;
    }
    loadAdmins();
  }

  return (
    <div className="p-4 sm:p-8 max-w-2xl space-y-10">
      <div>
        <h1 className="font-bold text-navy text-2xl sm:text-3xl mb-1">Account</h1>
        <p className="text-neutral-500 text-sm">
          Manage your password and who has access to the team portal.
        </p>
      </div>

      <section>
        <h2 className="font-bold text-navy text-sm mb-4">Change My Password</h2>
        <form
          onSubmit={handleChangePassword}
          className="bg-white rounded-md border border-neutral-200 p-4 sm:p-6"
        >
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                Current Password *
              </label>
              <input
                required
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                New Password * (min 8 characters)
              </label>
              <input
                required
                type="password"
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          {pwError && <p className="mt-4 text-sm font-semibold text-brand-red">{pwError}</p>}
          {pwMessage && (
            <p className="mt-4 text-sm font-semibold text-green-700">{pwMessage}</p>
          )}

          <button
            type="submit"
            disabled={pwSaving}
            className="mt-5 px-6 py-2.5 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {pwSaving ? "SAVING..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-bold text-navy text-sm mb-4">Team Access</h2>

        <form
          onSubmit={handleAddAdmin}
          className="bg-white rounded-md border border-neutral-200 p-4 sm:p-6 mb-6"
        >
          <h3 className="font-bold text-navy text-xs uppercase tracking-wide mb-4">
            Add Admin
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">Email *</label>
              <input
                required
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                Password * (min 8 characters)
              </label>
              <input
                required
                type="password"
                minLength={8}
                value={newAdminPassword}
                onChange={(e) => setNewAdminPassword(e.target.value)}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
          </div>

          {adminError && (
            <p className="mt-4 text-sm font-semibold text-brand-red">{adminError}</p>
          )}

          <button
            type="submit"
            disabled={adminSaving}
            className="mt-5 px-6 py-2.5 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {adminSaving ? "ADDING..." : "ADD ADMIN"}
          </button>
        </form>

        <div className="bg-white rounded-md border border-neutral-200 overflow-hidden">
          {loadingAdmins ? (
            <p className="p-6 text-neutral-400 text-sm">Loading…</p>
          ) : (
            <ul>
              {admins.map((a) => (
                <li
                  key={a.email}
                  className="flex items-center justify-between gap-4 px-5 py-4 border-t border-neutral-100 first:border-t-0"
                >
                  <p className="text-sm font-semibold text-navy">{a.email}</p>
                  <button
                    onClick={() => handleRemoveAdmin(a.email)}
                    className="text-xs font-bold text-neutral-400 hover:text-brand-red"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
