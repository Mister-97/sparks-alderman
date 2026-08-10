"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import MediaUpload from "@/components/team/MediaUpload";

type NewsRow = {
  id: string;
  slug: string;
  published_date: string;
  title: string;
  excerpt: string;
  body: string | null;
  image_url: string | null;
  video_url: string | null;
  link_url: string | null;
  link_label: string | null;
  featured: boolean;
  show_on_homepage: boolean;
  sort_order: number;
};

const emptyForm = {
  publishedDate: "",
  title: "",
  excerpt: "",
  body: "",
  imageUrl: "",
  videoUrl: "",
  linkUrl: "",
  linkLabel: "",
  featured: false,
  showOnHomepage: true,
};

function slugPreview(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/team/news");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function startEdit(p: NewsRow) {
    setEditingId(p.id);
    setEditingSlug(p.slug);
    setForm({
      publishedDate: p.published_date,
      title: p.title,
      excerpt: p.excerpt,
      body: p.body || "",
      imageUrl: p.image_url || "",
      videoUrl: p.video_url || "",
      linkUrl: p.link_url || "",
      linkLabel: p.link_label || "",
      featured: p.featured,
      showOnHomepage: p.show_on_homepage,
    });
    setShowForm(true);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingSlug(null);
    setForm(emptyForm);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editingId) {
      await fetch(`/api/team/news/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sortOrder: posts.length }),
      });
    } else {
      await fetch("/api/team/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sortOrder: posts.length }),
      });
    }

    setSaving(false);
    cancelEdit();
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/team/news/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <h1 className="font-bold text-navy text-2xl sm:text-3xl">News</h1>
        <button
          type="button"
          onClick={() => {
            if (showForm) cancelEdit();
            else setShowForm(true);
          }}
          className="px-4 py-2 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors"
        >
          {showForm ? "Close" : "+ Add Post"}
        </button>
      </div>
      <p className="text-neutral-500 text-sm mb-6">
        Only one post can be featured at a time, adding a new featured post
        automatically un-features the old one. Every post gets its own page
        at /news/[slug], whether or not it shows on the homepage.
      </p>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-md border border-neutral-200 p-4 sm:p-6 mb-8"
        >
          <h2 className="font-bold text-navy text-sm mb-4">
            {editingId ? "Edit Post" : "Add Post"}
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                Date (e.g. Aug 6 or August 6, 2026) *
              </label>
              <input
                required
                value={form.publishedDate}
                onChange={(e) => setForm({ ...form, publishedDate: e.target.value })}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">Title *</label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
              <p className="mt-1 text-[11px] text-neutral-400">
                Page URL: /news/
                {editingId ? editingSlug : slugPreview(form.title) || "..."}
                {!editingId && (
                  <span> (auto-generated from the title, saved once you create the post)</span>
                )}
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                Excerpt (short teaser shown in lists) *
              </label>
              <textarea
                required
                rows={2}
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-neutral-500 mb-1">
                Full Article (shown on the article page, one paragraph per line)
              </label>
              <textarea
                rows={5}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
              />
            </div>

            <MediaUpload
              label="Image / Thumbnail"
              accept="image/*"
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
              kind="image"
            />

            <MediaUpload
              label="Video (mp4 or mov, optional, shown on the article page instead of the image)"
              accept="video/mp4,video/quicktime"
              value={form.videoUrl}
              onChange={(url) => setForm({ ...form, videoUrl: url })}
              kind="video"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1">
                  External Link (Instagram, article, etc.)
                </label>
                <input
                  value={form.linkUrl}
                  onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                  placeholder="https://instagram.com/..."
                  className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-500 mb-1">
                  Link Button Label
                </label>
                <input
                  value={form.linkLabel}
                  onChange={(e) => setForm({ ...form, linkLabel: e.target.value })}
                  placeholder="Watch on Instagram"
                  className="w-full border border-neutral-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-navy"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
              <input
                type="checkbox"
                checked={form.showOnHomepage}
                onChange={(e) => setForm({ ...form, showOnHomepage: e.target.checked })}
                className="accent-brand-red w-4 h-4"
              />
              Show on homepage (otherwise it only lives on the /news articles page)
            </label>
            <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="accent-brand-red w-4 h-4"
              />
              Feature this post (shows as the homepage&apos;s main headline)
            </label>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-brand-red text-white text-xs font-bold tracking-wide rounded-sm hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {editingId ? "Save Changes" : "Add Post"}
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

      <div className="bg-white rounded-md border border-neutral-200 overflow-hidden">
        {loading ? (
          <p className="p-6 text-neutral-400 text-sm">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="p-6 text-neutral-400 text-sm">No posts yet.</p>
        ) : (
          <ul>
            {posts.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 px-5 py-4 border-t border-neutral-100 first:border-t-0"
              >
                <div>
                  <p className="font-semibold text-navy text-sm">
                    {p.featured && (
                      <span className="text-brand-red mr-1.5">&#9733;</span>
                    )}
                    {p.title}
                    {!p.show_on_homepage && (
                      <span className="ml-2 text-[10px] font-bold text-neutral-400 uppercase">
                        Articles page only
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{p.published_date}</p>
                </div>
                <div className="flex gap-3 shrink-0">
                  <Link
                    href={`/news/${p.slug}`}
                    target="_blank"
                    className="text-xs font-bold text-neutral-400 hover:text-brand-red"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => startEdit(p)}
                    className="text-xs font-bold text-navy hover:text-brand-red"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
    </div>
  );
}
