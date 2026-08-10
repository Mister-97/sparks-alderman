"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";

export default function MediaUpload({
  label,
  accept,
  value,
  onChange,
  kind,
}: {
  label: string;
  accept: string;
  value: string;
  onChange: (url: string) => void;
  kind: "image" | "video";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/team/upload",
      });
      onChange(blob.url);
    } catch {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-xs font-bold text-neutral-500 mb-1">{label}</label>

      {value && (
        <div className="mb-2">
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-24 rounded-sm border border-neutral-200 object-cover" />
          ) : (
            <video src={value} controls className="h-24 rounded-sm border border-neutral-200" />
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFile}
          disabled={uploading}
          className="text-xs text-neutral-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-sm file:border-0 file:bg-neutral-100 file:text-navy file:text-xs file:font-bold hover:file:bg-neutral-200 file:cursor-pointer"
        />
        {uploading && <span className="text-xs text-neutral-400">Uploading…</span>}
        {value && !uploading && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-xs font-bold text-neutral-400 hover:text-brand-red"
          >
            Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  );
}
