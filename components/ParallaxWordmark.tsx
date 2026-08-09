"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Background wordmark that visibly drifts as it crosses the viewport, the
 * classic parallax cue. The scroll range is scoped to this element's own
 * transit through the viewport (not raw page scrollY), so it works no
 * matter where on the page it sits, and never scrolls itself out of its
 * clipped container.
 */
export default function ParallaxWordmark({
  word,
  position = "top-16 -left-6 md:-left-10",
  align = "left",
  range = 70,
}: {
  word: string;
  position?: string;
  align?: "left" | "right";
  range?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <motion.span
      ref={ref}
      aria-hidden="true"
      style={{ y }}
      className={`pointer-events-none select-none absolute ${position} block font-display font-bold text-navy/[0.04] text-[9rem] sm:text-[13rem] md:text-[19rem] leading-none whitespace-nowrap ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {word}
    </motion.span>
  );
}
