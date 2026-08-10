"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import PhotoMarquee from "@/components/PhotoMarquee";

type Photo = { src: string; alt: string };

function Lightbox({ photo, onClose }: { photo: Photo; onClose: () => void }) {
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-navy/95"
      />

      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[110] w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white flex items-center justify-center text-navy shadow-lg hover:bg-neutral-100 transition-colors"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="w-5 h-5"
        >
          <path d="M5 5 19 19" />
          <path d="M19 5 5 19" />
        </svg>
      </button>

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={photo.alt}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative z-10"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.alt}
          className="block max-w-[92vw] max-h-[85vh] w-auto h-auto object-contain rounded-md shadow-2xl"
        />
      </motion.div>
    </motion.div>
  );
}

export default function PhotoGallery({ gallery }: { gallery: Photo[] }) {
  const [selected, setSelected] = useState<Photo | null>(null);

  return (
    <>
      {/* Desktop: bento grid */}
      <div className="hidden md:block mx-auto max-w-6xl px-6">
        <div className="mt-10 grid grid-cols-4 auto-rows-[12rem] grid-flow-dense gap-4">
          {gallery.map((g, i) => (
            <button
              key={g.src}
              type="button"
              onClick={() => setSelected(g)}
              className={`group relative overflow-hidden rounded-sm text-left ${
                i === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
              }`}
            >
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile: autoscrolling marquee that becomes a swipeable carousel
          on the first touch, instead of freezing there. */}
      <div className="md:hidden mt-10 px-6">
        <PhotoMarquee photos={gallery} onPhotoClick={setSelected} />
      </div>

      <AnimatePresence>
        {selected && (
          <Lightbox photo={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
