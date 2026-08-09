"use client";

import { useState } from "react";
import Image from "next/image";

type Photo = { src: string; alt: string };

/**
 * Auto-scrolls on its own, but the first touch/click switches it to a
 * normal swipeable carousel instead of freezing (the CSS animation
 * pauses on hover/focus, and on touch devices a tap can stick that
 * paused state with no way to keep browsing).
 */
export default function PhotoMarquee({ photos }: { photos: Photo[] }) {
  const [interacted, setInteracted] = useState(false);

  if (interacted) {
    return (
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {photos.map((p) => (
          <div
            key={p.src}
            className="relative shrink-0 snap-start w-[70vw] sm:w-[40vw] aspect-[4/5] rounded-lg overflow-hidden shadow-sm"
          >
            <Image src={p.src} alt={p.alt} fill sizes="70vw" className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-hidden" onPointerDown={() => setInteracted(true)}>
      <div className="photo-marquee flex w-max">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1 ? "true" : undefined}
            className="flex shrink-0 gap-4 pr-4"
          >
            {photos.map((p) => (
              <div
                key={p.src}
                className="relative shrink-0 w-[70vw] sm:w-[40vw] aspect-[4/5] rounded-lg overflow-hidden shadow-sm"
              >
                <Image src={p.src} alt={p.alt} fill sizes="70vw" className="object-cover" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
